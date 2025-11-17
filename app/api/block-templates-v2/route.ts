/**
 * API: Block Templates V2
 * GET - List all templates from CURRENT DOMAIN database
 * POST - Create new template in CURRENT DOMAIN database
 */

import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPrisma } from '@/lib/prisma';

export async function GET(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const published = searchParams.get('published');

    // Get Prisma client for CURRENT DOMAIN only
    const prisma = await getPrisma();

    const templates = await prisma.blockTemplateV2.findMany({
      where: {
        ...(category && { category }),
        ...(published !== null && { published: published === 'true' }),
      },
      orderBy: [
        { downloads: 'desc' },
        { createdAt: 'desc' },
      ],
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching block templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { name, description, category, tags, block, thumbnail, published } = body;

    if (!name || !category || !block) {
      return NextResponse.json(
        { error: 'Name, category, and block are required' },
        { status: 400 }
      );
    }

    // Get Prisma client for CURRENT DOMAIN only
    const prisma = await getPrisma();

    const template = await prisma.blockTemplateV2.create({
      data: {
        name,
        description,
        category,
        tags: tags || [],
        block,
        thumbnail,
        published: published !== false,
        downloads: 0,
        authorId: session.user.id,
      },
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error creating block template:', error);
    return NextResponse.json(
      { error: 'Failed to create template' },
      { status: 500 }
    );
  }
}
