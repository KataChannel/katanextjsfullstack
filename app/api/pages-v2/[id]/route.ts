/**
 * API: GET /api/pages-v2/[id]
 * Get single page by ID from CURRENT DOMAIN database only
 * 
 * PUT /api/pages-v2/[id]
 * Update page in CURRENT DOMAIN database only
 * 
 * DELETE /api/pages-v2/[id]
 * Delete page from CURRENT DOMAIN database only
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPrisma } from '@/lib/prisma';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get Prisma client for CURRENT DOMAIN only
    const prisma = await getPrisma();

    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!page) {
      return NextResponse.json({ error: 'Page not found' }, { status: 404 });
    }

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { error: 'Failed to fetch page' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { title, slug, blocksV2, published, metaTitle, metaDescription } = body;

    // Get Prisma client for CURRENT DOMAIN only
    const prisma = await getPrisma();

    const page = await prisma.page.update({
      where: { id },
      data: {
        title,
        slug,
        blocksV2,
        published,
        publishedAt: published ? new Date() : null,
        metaTitle,
        metaDescription,
      },
    });

    return NextResponse.json(page);
  } catch (error) {
    console.error('Error updating page:', error);
    return NextResponse.json(
      { error: 'Failed to update page' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get Prisma client for CURRENT DOMAIN only
    const prisma = await getPrisma();

    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { error: 'Failed to delete page' },
      { status: 500 }
    );
  }
}
