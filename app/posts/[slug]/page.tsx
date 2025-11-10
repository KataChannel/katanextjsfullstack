import { notFound } from 'next/navigation';
import { getPrisma } from '@/lib/prisma';
import { generateSEOMetadata, generateArticleSchema } from '@/lib/seo';
import type { Metadata } from 'next';
import { headers } from 'next/headers';

interface PostProps {
  params: {
    slug: string;
  };
}

// Generate metadata for SEO
export async function generateMetadata({ params }: PostProps): Promise<Metadata> {
  const prisma = await getPrisma();
  
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
  });

  if (!post) {
    return {
      title: 'Không tìm thấy bài viết',
    };
  }

  return generateSEOMetadata({
    title: post.metaTitle || post.title,
    description: post.metaDescription || post.excerpt || post.content?.substring(0, 160) || '',
    keywords: post.metaKeywords || undefined,
    ogImage: post.ogImage || undefined,
    ogType: post.ogType || 'article',
    canonicalUrl: post.canonicalUrl || undefined,
  });
}

// Generate static params
export async function generateStaticParams() {
  try {
    const prisma = await getPrisma();
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true },
    });

    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

export default async function PostDetail({ params }: PostProps) {
  const prisma = await getPrisma();
  const headersList = await headers();
  const hostname = headersList.get('x-hostname') || 'tazagroup.vn';

  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });

  if (!post || !post.published) {
    notFound();
  }

  // Generate structured data
  const articleSchema = generateArticleSchema({
    headline: post.title,
    description: post.excerpt || post.content?.substring(0, 200) || '',
    image: post.ogImage || `https://${hostname}/og-default.jpg`,
    datePublished: post.createdAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    author: {
      name: post.author.name || 'Admin',
    },
    publisher: {
      name: 'Taza Group',
      logo: `https://${hostname}/logo.png`,
    },
    url: `https://${hostname}/posts/${post.slug}`,
  });

  return (
    <>
      {/* JSON-LD Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <div className="container mx-auto px-4 py-8">
        <article className="max-w-4xl mx-auto">
          {/* Header */}
          <header className="mb-8">
            {/* Featured Image */}
            {post.ogImage && (
              <div className="mb-6 -mx-4 md:mx-0">
                <img
                  src={post.ogImage}
                  alt={post.title}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            )}

            <h1 className="text-4xl md:text-5xl font-bold mb-4">{post.title}</h1>

            {/* Excerpt */}
            {post.excerpt && (
              <p className="text-xl text-muted-foreground mb-4">{post.excerpt}</p>
            )}

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-t border-b py-4">
              <time dateTime={post.createdAt.toISOString()}>
                {new Date(post.createdAt).toLocaleDateString('vi-VN', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </time>
              {post.author.name && (
                <>
                  <span>•</span>
                  <span>Bởi {post.author.name}</span>
                </>
              )}
              {post.updatedAt > post.createdAt && (
                <>
                  <span>•</span>
                  <span>
                    Cập nhật:{' '}
                    {new Date(post.updatedAt).toLocaleDateString('vi-VN', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </span>
                </>
              )}
            </div>
          </header>

          {/* Content */}
          <div
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: post.content || '' }}
          />
        </article>
      </div>
    </>
  );
}
