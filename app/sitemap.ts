import { MetadataRoute } from 'next';
import { getPrisma } from '@/lib/prisma';
import { headers } from 'next/headers';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const headersList = await headers();
  const domain = headersList.get('x-hostname') || 'tazagroup.vn';
  const baseUrl = `https://${domain}`;

  try {
    const prisma = await getPrisma();

    // Get all published posts
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    // Get all published pages
    const pages = await prisma.page.findMany({
      where: { published: true },
      select: {
        slug: true,
        updatedAt: true,
      },
    });

    // Static routes
    const routes: MetadataRoute.Sitemap = [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
      {
        url: `${baseUrl}/posts`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      },
    ];

    // Dynamic post routes
    const postRoutes: MetadataRoute.Sitemap = posts.map((post) => ({
      url: `${baseUrl}/posts/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }));

    // Dynamic page routes
    const pageRoutes: MetadataRoute.Sitemap = pages.map((page) => ({
      url: `${baseUrl}/${page.slug}`,
      lastModified: page.updatedAt,
      changeFrequency: 'monthly' as const,
      priority: 0.6,
    }));

    return [...routes, ...postRoutes, ...pageRoutes];
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Fallback sitemap if database is unavailable
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 1,
      },
    ];
  }
}
