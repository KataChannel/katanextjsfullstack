import { notFound } from 'next/navigation';
import { getPrisma } from '@/lib/prisma';
import { generateSEOMetadata } from '@/lib/seo';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const prisma = await getPrisma();
  
  const page = await prisma.page.findUnique({
    where: { slug },
  });

  if (!page) {
    return {
      title: 'Không tìm thấy trang',
    };
  }

  return generateSEOMetadata({
    title: page.metaTitle || page.title,
    description: page.metaDescription || page.content?.substring(0, 160) || '',
    keywords: page.metaKeywords || undefined,
    ogImage: page.ogImage || undefined,
    ogType: page.ogType || 'website',
    canonicalUrl: page.canonicalUrl || undefined,
  });
}

// Generate static params for static generation
export async function generateStaticParams() {
  try {
    // Sử dụng domain mặc định cho build time
    const prisma = await getPrisma('tazagroup.vn');
    const pages = await prisma.page.findMany({
      where: { published: true },
      select: { slug: true },
    });

    return pages.map((page) => ({
      slug: page.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function PageDetail({ params }: PageProps) {
  const { slug } = await params;
  const prisma = await getPrisma();

  const page = await prisma.page.findUnique({
    where: { slug },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!page || !page.published) {
    notFound();
  }

  // Parse blocks if exists and ensure it's an array
  let blocks: any[] | null = null;
  if (page.blocks) {
    try {
      const parsed = typeof page.blocks === 'string' ? JSON.parse(page.blocks) : page.blocks;
      blocks = Array.isArray(parsed) ? parsed : null;
    } catch (error) {
      console.error('Error parsing blocks:', error);
      blocks = null;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <article className="max-w-4xl mx-auto">
        {/* Header */}
        <header className="mb-8">
          <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.title}</h1>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <time dateTime={page.createdAt.toISOString()}>
              {new Date(page.createdAt).toLocaleDateString('vi-VN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {page.author.name && (
              <>
                <span>•</span>
                <span>Bởi {page.author.name}</span>
              </>
            )}
          </div>
        </header>

        {/* Content */}
        <div className="prose prose-lg max-w-none">
          {blocks && blocks.length > 0 ? (
            <PageBlocksRenderer blocks={blocks} />
          ) : (
            <div dangerouslySetInnerHTML={{ __html: page.content || '' }} />
          )}
        </div>
      </article>
    </div>
  );
}

// Component to render page builder blocks
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
