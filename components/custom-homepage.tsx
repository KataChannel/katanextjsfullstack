import { CarouselComponent } from '@/components/CarouselComponent';
import { CarouselBlock } from '@/components/carousel-block';

interface PageContent {
  id: string;
  title: string;
  slug: string;
  content?: string | null;
  blocks?: any;
  published: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    name: string | null;
    email: string;
  };
}

interface PostContent {
  id: string;
  title: string;
  slug: string;
  content?: string | null;
  excerpt?: string | null;
  blocks?: any;
  published: boolean;
  metaTitle?: string | null;
  metaDescription?: string | null;
  createdAt: Date;
  updatedAt: Date;
  author: {
    name: string | null;
    email: string;
  };
}

interface CustomHomePageProps {
  content: PageContent | PostContent;
  type: "page" | "post";
}

// Component to render page builder blocks
function PageBlocksRenderer({ blocks }: { blocks: any[] }) {
  if (!Array.isArray(blocks) || blocks.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {blocks.map((block: any) => {
        switch (block.type) {
          case 'carousel':
            // V2 carousel block
            const slides = block.content?.slides || [];
            const autoplay = block.content?.autoplay ?? true;
            const interval = block.content?.interval || 5000;
            
            return (
              <CarouselBlock
                key={block.id}
                slides={slides}
                autoplay={autoplay}
                interval={interval}
              />
            );

          case 'heading':
            // V2 heading block - content can be string or object {text, level}
            const headingText = typeof block.content === 'string'
              ? block.content
              : block.content?.text || 'Heading';
            const headingLevel = block.content?.level || 2;
            
            // Render based on level
            if (headingLevel === 1) {
              return <h1 key={block.id} className="text-4xl font-bold my-4">{headingText}</h1>;
            } else if (headingLevel === 3) {
              return <h3 key={block.id} className="text-2xl font-bold my-4">{headingText}</h3>;
            } else if (headingLevel === 4) {
              return <h4 key={block.id} className="text-xl font-bold my-4">{headingText}</h4>;
            } else if (headingLevel === 5) {
              return <h5 key={block.id} className="text-lg font-bold my-4">{headingText}</h5>;
            } else if (headingLevel === 6) {
              return <h6 key={block.id} className="text-base font-bold my-4">{headingText}</h6>;
            }
            return <h2 key={block.id} className="text-3xl font-bold my-4">{headingText}</h2>;

          case 'text':
            // V2 text block - content can be string or object {tag, text}
            const textContent = typeof block.content === 'string'
              ? block.content
              : block.content?.text || '';
            const textStyles = block.styles?.element || '';
            
            return (
              <div
                key={block.id}
                className={textStyles || 'prose prose-lg max-w-none'}
                dangerouslySetInnerHTML={{ __html: textContent }}
              />
            );

          case 'image':
            // V2 image block - content can be string (URL) or object {url, alt}
            const imageSrc = typeof block.content === 'string' 
              ? block.content 
              : block.content?.url || '';
            const imageAlt = block.content?.alt || block.alt || '';
            const imageStyles = block.styles?.element || 'w-full h-auto rounded-lg';
            
            return (
              <figure key={block.id} className="my-8">
                <img
                  src={imageSrc}
                  alt={imageAlt}
                  className={imageStyles}
                />
                {block.caption && (
                  <figcaption className="text-center text-sm text-muted-foreground mt-2">
                    {block.caption}
                  </figcaption>
                )}
              </figure>
            );

          case 'video':
            return (
              <div key={block.id} className="my-8">
                <div className="aspect-video">
                  <iframe
                    src={block.content}
                    className="w-full h-full rounded-lg"
                    allowFullScreen
                  />
                </div>
                {block.caption && (
                  <p className="text-center text-sm text-muted-foreground mt-2">
                    {block.caption}
                  </p>
                )}
              </div>
            );

          case 'code':
            return (
              <pre key={block.id} className="my-4 p-4 bg-muted rounded-lg overflow-x-auto">
                <code>{block.content}</code>
              </pre>
            );

          case 'button':
            // V2 block editor button format
            const buttonContent = block.content?.text || block.content || 'Button';
            const buttonLink = block.content?.link || '#';
            const buttonVariant = block.content?.variant || 'primary';
            
            return (
              <div key={block.id} className="my-6">
                <a
                  href={buttonLink}
                  className={`inline-block px-6 py-3 rounded-lg font-semibold transition-colors ${
                    buttonVariant === 'primary'
                      ? 'bg-blue-600 text-white hover:bg-blue-700'
                      : 'bg-gray-200 text-gray-900 hover:bg-gray-300'
                  }`}
                >
                  {buttonContent}
                </a>
              </div>
            );

          case 'container':
            // V2 container block - render with styles and nested children
            const containerStyles = block.styles?.container || '';
            const elementStyles = block.styles?.element || '';
            const children = block.children || [];
            
            return (
              <div key={block.id} className={containerStyles}>
                {elementStyles && (
                  <div className={elementStyles}>
                    {children.length > 0 && (
                      <PageBlocksRenderer blocks={children} />
                    )}
                  </div>
                )}
                {!elementStyles && children.length > 0 && (
                  <PageBlocksRenderer blocks={children} />
                )}
              </div>
            );

          case 'html':
            // V2 HTML custom block
            const htmlContent = block.content?.html || '';
            const htmlContainerStyles = block.styles?.container || '';
            
            return (
              <div 
                key={block.id} 
                className={htmlContainerStyles}
                dangerouslySetInnerHTML={{ __html: htmlContent }}
              />
            );

          default:
            // Unknown block type - try to render basic content
            if (block.content) {
              return (
                <div key={block.id} className="my-4">
                  {typeof block.content === 'string' ? (
                    <div dangerouslySetInnerHTML={{ __html: block.content }} />
                  ) : (
                    <pre className="text-xs">{JSON.stringify(block.content, null, 2)}</pre>
                  )}
                </div>
              );
            }
            return null;
        }
      })}
    </div>
  );
}

// Component to render Page Builder elements
function PageBuilderRenderer({ blocks }: { blocks: any }) {
  if (!blocks || typeof blocks !== 'object') {
    return null;
  }

  // Get elements from blocks (support both formats)
  const elements = blocks.elements || blocks.canvas?.elements || {};
  
  // Convert to array if object format
  const elementsArray = Array.isArray(elements)
    ? elements
    : Object.values(elements);

  if (elementsArray.length === 0) {
    return null;
  }

  // Sort by y position (top to bottom)
  const sortedElements = [...elementsArray].sort((a: any, b: any) => a.y - b.y);

  return (
    <div className="relative">
      {sortedElements.map((element: any) => {
        // Common styles
        const elementStyle: React.CSSProperties = {
          marginBottom: '1.5rem',
        };

        switch (element.type) {
          case 'heading':
            return (
              <h2
                key={element.id}
                style={{
                  ...elementStyle,
                  fontSize: element.style?.fontSize || 32,
                  fontWeight: element.style?.fontWeight || 700,
                  color: element.style?.color || '#111827',
                }}
                className="leading-tight"
              >
                {element.content}
              </h2>
            );

          case 'text':
            return (
              <div
                key={element.id}
                style={{
                  ...elementStyle,
                  fontSize: element.style?.fontSize || 16,
                  fontWeight: element.style?.fontWeight || 400,
                  color: element.style?.color || '#374151',
                }}
                className="leading-relaxed"
              >
                {element.content}
              </div>
            );

          case 'button':
            return (
              <button
                key={element.id}
                style={{
                  ...elementStyle,
                  backgroundColor: element.style?.backgroundColor || '#2563eb',
                  color: element.style?.color || '#ffffff',
                  fontSize: element.style?.fontSize || 14,
                  fontWeight: element.style?.fontWeight || 600,
                  borderRadius: element.style?.borderRadius || 6,
                  padding: '12px 24px',
                }}
                className="cursor-pointer border-0 hover:opacity-90 transition-opacity"
              >
                {element.content}
              </button>
            );

          case 'image':
            return (
              <figure key={element.id} style={elementStyle}>
                <img
                  src={element.src || '/placeholder.jpg'}
                  alt={element.name || ''}
                  style={{
                    width: '100%',
                    height: 'auto',
                    borderRadius: element.style?.borderRadius || 8,
                  }}
                  className="object-cover"
                />
              </figure>
            );

          case 'container':
            return (
              <div
                key={element.id}
                style={{
                  ...elementStyle,
                  backgroundColor: element.style?.backgroundColor || 'transparent',
                  borderRadius: element.style?.borderRadius || 0,
                  padding: element.layout?.padding || 16,
                }}
              >
                {element.content}
              </div>
            );

          case 'carousel':
            if (!element.carousel?.slides) return null;
            
            return (
              <div key={element.id} style={{ marginBottom: '2rem' }}>
                <CarouselComponent
                  slides={element.carousel.slides}
                  autoPlay={element.carousel.autoPlay}
                  interval={element.carousel.interval}
                  showDots={element.carousel.showDots}
                  showArrows={element.carousel.showArrows}
                  height={element.carousel.height || element.height}
                />
              </div>
            );

          default:
            return null;
        }
      })}
    </div>
  );
}

export function CustomHomePage({ content, type }: CustomHomePageProps) {
  // Determine content format - PRIORITY: blocksV2 > blocks (V1)
  // Check blocksV2 first (new format)
  const hasBlocksV2 = 'blocksV2' in content && content.blocksV2 && typeof content.blocksV2 === 'object';
  const isV2Format = hasBlocksV2 && (content.blocksV2 as any)?.blocks;
  
  // Fallback to V1 blocks
  const hasBlocks = content.blocks && typeof content.blocks === 'object';
  const isPageBuilder = hasBlocks && (content.blocks.elements || content.blocks.canvas);
  const isLegacyBlocks = hasBlocks && Array.isArray(content.blocks);

  // Don't show header if using V2 blocks or PageBuilder (they render their own layout)
  const showHeader = !isV2Format && !isPageBuilder;

  return (
    <div className="min-h-screen">
      {/* Header Section - Only show if not using custom blocks */}
      {showHeader && (
        <section className="bg-linear-to-b from-primary/5 to-background py-12 sm:py-16 border-b">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center space-y-4">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight">
                {content.title}
              </h1>
              {"excerpt" in content && content.excerpt && (
                <p className="text-lg text-muted-foreground">
                  {content.excerpt}
                </p>
              )}
              <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground pt-4">
                <span>Bởi {content.author.name || content.author.email}</span>
                <span>•</span>
                <span>{new Date(content.updatedAt).toLocaleDateString("vi-VN")}</span>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Content Section */}
      <section className={showHeader ? "py-12 sm:py-16" : ""}>
        <div className={isV2Format || isPageBuilder ? "container mx-auto px-4 sm:px-6 lg:px-8 py-8" : (showHeader ? "container mx-auto px-4 sm:px-6 lg:px-8" : "")}>
          <div className={isV2Format || isPageBuilder ? "max-w-4xl mx-auto" : (showHeader ? "max-w-4xl mx-auto" : "")}>
            {/* Priority rendering: V2 blocks > Page Builder > Legacy blocks > Content */}
            {isV2Format ? (
              <div className="prose prose-lg max-w-none dark:prose-invert">
                <PageBlocksRenderer blocks={(content.blocksV2 as any).blocks} />
              </div>
            ) : isPageBuilder ? (
              <PageBuilderRenderer blocks={content.blocks} />
            ) : isLegacyBlocks ? (
              <PageBlocksRenderer blocks={content.blocks} />
            ) : (
              <div 
                className="prose prose-lg max-w-none dark:prose-invert"
                dangerouslySetInnerHTML={{ __html: content.content || "" }}
              />
            )}
          </div>
        </div>
      </section>
    </div>
  );
}
