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

export function CustomHomePage({ content, type }: CustomHomePageProps) {
  const hasBlocks = content.blocks && Array.isArray(content.blocks) && content.blocks.length > 0;

  return (
    <div className="min-h-screen">
      {/* Header Section */}
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

      {/* Content Section */}
      <section className="py-12 sm:py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            {hasBlocks ? (
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
