import { CarouselComponent } from '@/components/page-builder/CarouselComponent';

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
                  alt={block.alt || ''}
                  className="w-full h-auto rounded-lg"
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

          default:
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
  // Determine content format
  const hasBlocks = content.blocks && typeof content.blocks === 'object';
  const isPageBuilder = hasBlocks && (content.blocks.elements || content.blocks.canvas);
  const isLegacyBlocks = hasBlocks && Array.isArray(content.blocks);

  return (
    <div className="min-h-screen">
      {/* Header Section - Only show if not Page Builder (Page Builder renders its own layout) */}
      {!isPageBuilder && (
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
      <section className={isPageBuilder ? "" : "py-12 sm:py-16"}>
        <div className={isPageBuilder ? "" : "container mx-auto px-4 sm:px-6 lg:px-8"}>
          <div className={isPageBuilder ? "" : "max-w-4xl mx-auto"}>
            {isPageBuilder ? (
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
