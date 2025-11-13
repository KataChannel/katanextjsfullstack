import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// GET /api/block-templates - Lấy published templates (public)
export async function GET() {
  try {
    const templates = await prisma.blockTemplate.findMany({
      where: { published: true },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        description: true,
        thumbnail: true,
        elements: true,
        category: true,
        createdAt: true,
        author: {
          select: {
            name: true,
          },
        },
      },
    });

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch templates' },
      { status: 500 }
    );
  }
}
