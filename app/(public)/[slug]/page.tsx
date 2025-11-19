import { notFound, redirect } from 'next/navigation';
import { getPrisma } from '@/lib/prisma';
import { generateSEOMetadata, generateArticleSchema } from '@/lib/seo';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { PageLayoutWrapper } from '@/components/page-layout-wrapper';
import { auth } from '@/lib/auth';
import { CarouselBlock } from '@/components/carousel-block';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    preview?: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const prisma = await getPrisma();
  
  // Try to find as page first
  const page = await prisma.page.findUnique({
    where: { slug },
  });

  if (page) {
    return generateSEOMetadata({
      title: page.metaTitle || page.title,
      description: page.metaDescription || page.content?.substring(0, 160) || '',
      keywords: page.metaKeywords || undefined,
      ogImage: page.ogImage || undefined,
      ogType: page.ogType || 'website',
      canonicalUrl: page.canonicalUrl || undefined,
    });
  }

  // Try to find as post
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (post) {
    return generateSEOMetadata({
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt || post.content?.substring(0, 160) || '',
      keywords: post.metaKeywords || undefined,
      ogImage: post.ogImage || undefined,
      ogType: post.ogType || 'article',
      canonicalUrl: post.canonicalUrl || undefined,
    });
  }

  return {
    title: 'Không tìm thấy trang',
  };
}

// Generate static params for static generation
export async function generateStaticParams() {
  try {
    // Sử dụng domain mặc định cho build time
    const prisma = await getPrisma('tazagroup.vn');
    
    // Get all published pages (exclude slug "/" - handled by homepage route)
    const pages = await prisma.page.findMany({
      where: { 
        published: true,
        slug: { not: '/' }  // Exclude homepage slug
      },
      select: { slug: true },
    });

    // Get all published posts (will redirect to /posts/[slug])
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true },
    });

    // Combine both
    const allSlugs = [
      ...pages.map((page: { slug: string }) => ({ slug: page.slug })),
      ...posts.map((post: { slug: string }) => ({ slug: post.slug })),
    ];

    return allSlugs;
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function PageDetail({ params, searchParams }: PageProps) {
  const { slug } = await params;
  
  // Redirect slug "/" to homepage (handled by app/(public)/page.tsx)
  if (slug === '/') {
    redirect('/');
  }
  
  const { preview } = await searchParams;
  const prisma = await getPrisma();

  // Check if preview mode and user is authenticated
  const isPreview = preview === 'true';
  let canPreview = false;
  
  if (isPreview) {
    const session = await auth();
    canPreview = !!session?.user;
  }

  // Try to find as page first
  const page = await prisma.page.findUnique({
    where: { slug },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      published: true,
      blocks: true,
      blocksV2: true,
      version: true,
      metaTitle: true,
      metaDescription: true,
      metaKeywords: true,
      ogImage: true,
      ogType: true,
      canonicalUrl: true,
      showHeader: true,
      showFooter: true,
      createdAt: true,
      updatedAt: true,
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  // If page found and (published OR preview mode with auth), use page data
  if (page && (page.published || (isPreview && canPreview))) {
    // Continue with page render logic below
  } else {
    // Try to find as post
    const post = await prisma.post.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        content: true,
        excerpt: true,
        published: true,
        blocks: true,
        metaTitle: true,
        metaDescription: true,
        metaKeywords: true,
        ogImage: true,
        ogType: true,
        canonicalUrl: true,
        showHeader: true,
        showFooter: true,
        createdAt: true,
        updatedAt: true,
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // If post found and (published OR preview mode with auth), render it directly (no redirect)
    if (post && (post.published || (isPreview && canPreview))) {
      return renderContent(post, 'post', post.showHeader, post.showFooter, isPreview && !post.published);
    }

    // Neither page nor post found
    notFound();
  }

  // At this point, page is guaranteed to exist and (published OR preview)
  return renderContent(page, 'page', page.showHeader, page.showFooter, isPreview && !page.published);
}

// Helper function to render page or post content
async function renderContent(content: any, type: 'page' | 'post', showHeader = true, showFooter = true, isPreviewMode = false) {
  // Parse blocks - Handle both V1 (blocks) and V2 (blocksV2) formats
  let blocks: any[] | null = null;
  let isPageBuilder = false;
  let blocksV2: any[] | null = null;
  
  // Check for V2 blocks first (newer format)
  if (content.blocksV2) {
    try {
      const parsed = typeof content.blocksV2 === 'string' ? JSON.parse(content.blocksV2) : content.blocksV2;
      
      // V2 format: { blocks: [...], version: 2 }
      if (parsed && parsed.blocks && Array.isArray(parsed.blocks)) {
        blocksV2 = parsed.blocks;
      }
    } catch (error) {
      console.error('Error parsing blocksV2:', error);
      blocksV2 = null;
    }
  }
  
  // Check for V1 blocks (legacy format)
  if (!blocksV2 && content.blocks) {
    try {
      const parsed = typeof content.blocks === 'string' ? JSON.parse(content.blocks) : content.blocks;
      
      // Check if it's PageBuilder format (has canvas.elements)
      if (parsed && typeof parsed === 'object' && parsed.canvas && Array.isArray(parsed.canvas.elements)) {
        blocks = parsed.canvas.elements;
        isPageBuilder = true;
      } 
      // Check if it's old format (direct array)
      else if (Array.isArray(parsed)) {
        blocks = parsed;
        isPageBuilder = false;
      }
      // Check if parsed.elements exists (alternative format)
      else if (parsed && Array.isArray(parsed.elements)) {
        blocks = parsed.elements;
        isPageBuilder = true;
      }
    } catch (error) {
      console.error('Error parsing blocks:', error);
      blocks = null;
    }
  }

  // Generate structured data for posts
  let articleSchema = null;
  if (type === 'post') {
    const headersList = await headers();
    const hostname = headersList.get('x-hostname') || 'tazagroup.vn';
    
    articleSchema = generateArticleSchema({
      headline: content.title,
      description: content.excerpt || content.content?.substring(0, 200) || '',
      image: content.ogImage || `https://${hostname}/og-default.jpg`,
      datePublished: content.createdAt.toISOString(),
      dateModified: content.updatedAt.toISOString(),
      author: {
        name: content.author?.name || 'Admin',
      },
      publisher: {
        name: 'Taza Group',
        logo: `https://${hostname}/logo.png`,
      },
      url: `https://${hostname}/${content.slug}`,
    });
  }

  return (
    <>
      {/* JSON-LD Structured Data for posts */}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}

      <PageLayoutWrapper showHeader={showHeader} showFooter={showFooter}>
        {/* Preview Banner */}
        {isPreviewMode && (
          <div className="bg-yellow-500 text-yellow-900 px-4 py-2 text-center text-sm font-medium">
            ⚠️ Preview Mode - This draft is only visible to authenticated users
          </div>
        )}
        
        <div className="container mx-auto px-4 py-8">
        <article className="mx-auto">
        {/* Header - Only show for posts or pages without V2 blocks/Page Builder */}
        {(type === 'post' || (!blocksV2 && !isPageBuilder)) && (
          <header className="mb-8">
            {/* Featured Image (for posts) */}
            {type === 'post' && content.ogImage && (
              <div className="mb-6 -mx-4 md:mx-0">
                <img
                  src={content.ogImage}
                  alt={content.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{content.title}</h1>

            {/* Excerpt (for posts) */}
            {type === 'post' && content.excerpt && (
              <p className="text-xl text-muted-foreground mb-4">{content.excerpt}</p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-b py-4">
              <time dateTime={content.createdAt.toISOString()}>
                {new Date(content.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {content.author?.name && (
                <>
                  <span>•</span>
                  <span>Bởi {content.author.name}</span>
                </>
              )}
              {content.updatedAt > content.createdAt && (
                <>
                  <span>•</span>
                  <span>
                    Cập nhật:{' '}
                    {new Date(content.updatedAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </>
              )}
            </div>
          </header>
        )}

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {blocksV2 && blocksV2.length > 0 ? (
            <BlocksV2Renderer blocks={blocksV2} />
          ) : blocks && blocks.length > 0 ? (
            isPageBuilder ? (
              <PageBuilderRenderer elements={blocks} />
            ) : (
              <PageBlocksRenderer blocks={blocks} />
            )
          ) : (
            <div dangerouslySetInnerHTML={{ __html: content.content || '' }} />
          )}
        </div>
      </article>
      </div>
      </PageLayoutWrapper>
    </>
  );
}

// Component to render PageBuilder elements
function PageBuilderRenderer({ elements }: { elements: any[] }) {
  if (!Array.isArray(elements) || elements.length === 0) {
    return null;
  }

  return (
    <div className="relative w-full">
      {elements.map((element: any) => {
        const { id, type, content, styles = {}, props = {} } = element;
        
        // Build inline styles from element.styles
        const inlineStyles: React.CSSProperties = {
          position: styles.position || 'relative',
          left: styles.left,
          top: styles.top,
          width: styles.width,
          height: styles.height,
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight,
          textAlign: styles.textAlign as any,
          padding: styles.padding,
          margin: styles.margin,
          borderRadius: styles.borderRadius,
          border: styles.border,
          boxShadow: styles.boxShadow,
          zIndex: styles.zIndex,
          opacity: styles.opacity,
        };

        // Remove undefined values
        Object.keys(inlineStyles).forEach(key => {
          if (inlineStyles[key as keyof React.CSSProperties] === undefined) {
            delete inlineStyles[key as keyof React.CSSProperties];
          }
        });

        switch (type) {
          case 'text':
            return (
              <div key={id} style={inlineStyles} className="text-element">
                {content || 'Text'}
              </div>
            );

          case 'heading':
            const level = props.level || 2;
            if (level === 1) return <h1 key={id} style={inlineStyles} className="heading-element">{content || 'Heading'}</h1>;
            if (level === 3) return <h3 key={id} style={inlineStyles} className="heading-element">{content || 'Heading'}</h3>;
            if (level === 4) return <h4 key={id} style={inlineStyles} className="heading-element">{content || 'Heading'}</h4>;
            if (level === 5) return <h5 key={id} style={inlineStyles} className="heading-element">{content || 'Heading'}</h5>;
            if (level === 6) return <h6 key={id} style={inlineStyles} className="heading-element">{content || 'Heading'}</h6>;
            return <h2 key={id} style={inlineStyles} className="heading-element">{content || 'Heading'}</h2>;

          case 'button':
            return (
              <button key={id} style={inlineStyles} className="button-element" type="button">
                {content || 'Button'}
              </button>
            );

          case 'image':
            return (
              <div key={id} style={inlineStyles} className="image-element">
                {content ? (
                  <img 
                    src={content} 
                    alt={props.alt || ''} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    Image
                  </div>
                )}
              </div>
            );

          case 'container':
            return (
              <div key={id} style={inlineStyles} className="container-element">
                {props.children || content || ''}
              </div>
            );

          case 'video':
            return (
              <div key={id} style={inlineStyles} className="video-element">
                {content ? (
                  <iframe
                    src={content}
                    className="w-full h-full"
                    allowFullScreen
                  />
                ) : (
                  <div className="w-full h-full bg-muted flex items-center justify-center">
                    Video
                  </div>
                )}
              </div>
            );

          case 'divider':
            return (
              <hr key={id} style={inlineStyles} className="divider-element" />
            );

          case 'spacer':
            return (
              <div key={id} style={inlineStyles} className="spacer-element" />
            );

          default:
            return (
              <div key={id} style={inlineStyles} className="unknown-element">
                {content || type}
              </div>
            );
        }
      })}
    </div>
  );
}

// Component to render V2 blocks (new format from block editor)
function BlocksV2Renderer({ blocks }: { blocks: any[] }) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {blocks.map((block: any, index: number) => {
        const blockId = block.id || `block-${index}`;
        
        switch (block.type) {
          case 'carousel':
            // V2 carousel block
            const slides = block.content?.slides || [];
            const autoplay = block.content?.autoplay ?? true;
            const interval = block.content?.interval || 5000;
            
            return (
              <CarouselBlock
                key={blockId}
                slides={slides}
                autoplay={autoplay}
                interval={interval}
              />
            );

          
          case 'text':
            // V2 text block with rich content
            const textContent = block.content?.text || block.content || '';
            const textStyles = block.styles?.element || '';
            return (
              <div
                key={blockId}
                className={textStyles || 'prose prose-lg max-w-none'}
                dangerouslySetInnerHTML={{ __html: textContent }}
              />
            );

          case 'image':
            // V2 image block
            const imageUrl = block.content?.url || block.content || '';
            const imageAlt = block.content?.alt || block.name || '';
            const imageStyles = block.styles?.element || 'w-full h-auto rounded-lg';
            return (
              <figure key={blockId} className="my-8">
                <img
                  src={imageUrl}
                  alt={imageAlt}
                  className={imageStyles}
                />
              </figure>
            );

          case 'button':
            // V2 button block
            const buttonText = block.content?.text || block.content || 'Button';
            const buttonLink = block.content?.link || '#';
            const buttonVariant = block.content?.variant || 'primary';
            
            return (
              <div key={blockId} className="my-6">
                <a
                  href={buttonLink}
                  className={`inline-block px-6 py-3 rounded-lg font-semibold transition-colors ${
                    buttonVariant === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {buttonText}
                </a>
              </div>
            );

          case 'container':
            // V2 container block - render with styles and nested children
            const containerStyles = block.styles?.container || '';
            const elementStyles = block.styles?.element || '';
            const children = block.children || [];
            
            return (
              <div key={blockId} className={containerStyles}>
                {elementStyles && (
                  <div className={elementStyles}>
                    {children.length > 0 && (
                      <BlocksV2Renderer blocks={children} />
                    )}
                  </div>
                )}
                {!elementStyles && children.length > 0 && (
                  <BlocksV2Renderer blocks={children} />
                )}
              </div>
            );

          case 'heading':
            // V2 heading block
            const headingText = block.content?.text || block.content || 'Heading';
            const headingLevel = block.content?.level || 2;
            
            // Render heading based on level
            if (headingLevel === 1) {
              return <h1 key={blockId} className="text-4xl font-bold my-4">{headingText}</h1>;
            } else if (headingLevel === 2) {
              return <h2 key={blockId} className="text-3xl font-bold my-4">{headingText}</h2>;
            } else if (headingLevel === 3) {
              return <h3 key={blockId} className="text-2xl font-bold my-4">{headingText}</h3>;
            } else if (headingLevel === 4) {
              return <h4 key={blockId} className="text-xl font-bold my-4">{headingText}</h4>;
            } else if (headingLevel === 5) {
              return <h5 key={blockId} className="text-lg font-bold my-4">{headingText}</h5>;
            } else {
              return <h6 key={blockId} className="text-base font-bold my-4">{headingText}</h6>;
            }

          case 'html':
            // V2 HTML custom block
            const htmlContent = block.content?.html || '';
            const htmlContainerStyles = block.styles?.container || 'w-full';
            
            // Container có Tailwind classes, content HTML bên trong
            return (
              <div key={blockId} className={htmlContainerStyles}>
                <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
              </div>
            );

          default:
            // Unknown block type - try to render content
            if (block.content) {
              const content = typeof block.content === 'string' 
                ? block.content 
                : block.content?.text || JSON.stringify(block.content);
              
              return (
                <div key={blockId} className="my-4">
                  <div dangerouslySetInnerHTML={{ __html: content }} />
                </div>
              );
            }
            return null;
        }
      })}
    </div>
  );
}

// Component to render old format page builder blocks (V1)
function PageBlocksRenderer({ blocks }: { blocks: any[] }) {
  // Safety check
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {blocks.map((block: any) => {
        switch (block.type) {
          case 'heading':
            return (
              <h2 key={block.id} className="text-3xl font-bold">
                {block.content}
              </h2>
            );

          case 'text':
            return (
              <div
                key={block.id}
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: block.content }}
              />
            );

          case 'image':
            return (
              <figure key={block.id} className="my-8">
                <img
                  src={block.content}
                  alt={block.config?.alt || ''}
                  className="w-full h-auto rounded-lg"
                />
                {block.config?.caption && (
                  <figcaption className="text-center text-sm text-muted-foreground mt-2">
                    {block.config.caption}
                  </figcaption>
                )}
              </figure>
            );

          case 'video':
            return (
              <div key={block.id} className="my-8 aspect-video">
                <iframe
                  src={block.content}
                  className="w-full h-full rounded-lg"
                  allowFullScreen
                />
              </div>
            );

          case 'code':
            return (
              <pre key={block.id} className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{block.content}</code>
              </pre>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
