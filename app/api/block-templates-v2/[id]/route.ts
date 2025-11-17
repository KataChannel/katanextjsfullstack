/**
 * API: Block Templates V2 - Single template
 * GET - Get template by ID from CURRENT DOMAIN database
 * PUT - Update template in CURRENT DOMAIN database
 * DELETE - Delete template from CURRENT DOMAIN database
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

    const template = await prisma.blockTemplateV2.findUnique({
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

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    // Increment downloads count
    await prisma.blockTemplateV2.update({
      where: { id },
      data: { downloads: { increment: 1 } },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error fetching template:', error);
    return NextResponse.json(
      { error: 'Failed to fetch template' },
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
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();
    const { name, description, category, tags, block, thumbnail, published } = body;

    // Get Prisma client for CURRENT DOMAIN only
    const prisma = await getPrisma();

    // Check ownership
    const existing = await prisma.blockTemplateV2.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    if (existing.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only edit your own templates' },
        { status: 403 }
      );
    }

    const template = await prisma.blockTemplateV2.update({
      where: { id },
      data: {
        name,
        description,
        category,
        tags,
        block,
        thumbnail,
        published,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json(
      { error: 'Failed to update template' },
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
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await params;

    // Get Prisma client for CURRENT DOMAIN only
    const prisma = await getPrisma();

    // Check ownership
    const existing = await prisma.blockTemplateV2.findUnique({
      where: { id },
    });

    if (!existing) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    if (existing.authorId !== session.user.id) {
      return NextResponse.json(
        { error: 'You can only delete your own templates' },
        { status: 403 }
      );
    }

    await prisma.blockTemplateV2.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json(
      { error: 'Failed to delete template' },
      { status: 500 }
    );
  }
}
