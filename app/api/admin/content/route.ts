/**
 * API: GET /api/admin/content
 * List all pages (all versions) and posts for admin content management
 * Only returns content from CURRENT DOMAIN database
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPrisma } from '@/lib/prisma';

export async function GET() {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get Prisma client for CURRENT DOMAIN only
    const prisma = await getPrisma();

    // Fetch all pages (V1 and V2) from CURRENT DOMAIN database
    const pages = await prisma.page.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        publishedAt: true,
        content: true,
        blocks: true,
        blocksV2: true,
        version: true,
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

    // Fetch all posts
    const posts = await prisma.post.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        content: true,
        blocks: true,
        excerpt: true,
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
        authorId: true,
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      pages,
      posts,
    });
  } catch (error) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content' },
      { status: 500 }
    );
  }
}
