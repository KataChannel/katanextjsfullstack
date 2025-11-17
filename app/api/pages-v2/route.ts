/**
 * API: GET /api/pages-v2
 * List all pages (V2) from CURRENT DOMAIN database only
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

    // Fetch ALL pages (both V1 and V2) from CURRENT DOMAIN database
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

    return NextResponse.json(pages);
  } catch (error) {
    console.error('Error fetching pages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch pages' },
      { status: 500 }
    );
  }
}

/**
 * API: POST /api/pages-v2
 * Create a new page (V2) in CURRENT DOMAIN database
 */
export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { title, slug, blocksV2, published, authorId } = body;

    // Get Prisma client for CURRENT DOMAIN only
    const prisma = await getPrisma();

    // Check slug uniqueness in CURRENT DOMAIN database
    const existing = await prisma.page.findUnique({
      where: { slug },
    });

    if (existing) {
      return NextResponse.json(
        { error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Get or validate authorId
    let validAuthorId = authorId || session.user.id;

    // Verify author exists in CURRENT DOMAIN database
    const authorExists = await prisma.user.findUnique({
      where: { id: validAuthorId },
    });

    if (!authorExists) {
      // Try to find any admin user
      const adminUser = await prisma.user.findFirst({
        where: { role: 'admin' },
      });

      if (adminUser) {
        validAuthorId = adminUser.id;
      } else {
        // Create default admin user if none exists
        const newAdmin = await prisma.user.create({
          data: {
            email: session.user.email || 'admin@example.com',
            name: session.user.name || 'Admin',
            role: 'admin',
          },
        });
        validAuthorId = newAdmin.id;
      }
    }

    const page = await prisma.page.create({
      data: {
        title,
        slug,
        blocksV2,
        version: 2,
        published: published || false,
        publishedAt: published ? new Date() : null,
        authorId: validAuthorId,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error creating page:', error);
    return NextResponse.json(
      { error: 'Failed to create page' },
      { status: 500 }
    );
  }
}
