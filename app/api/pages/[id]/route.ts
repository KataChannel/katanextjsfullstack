import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { z } from 'zod';

const pageUpdateSchema = z.object({
  title: z.string().optional(),
  slug: z.string().regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, 'Slug không hợp lệ').optional(),
  content: z.string().optional(),
  blocks: z.any().optional(),
  published: z.boolean().optional(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  metaKeywords: z.string().optional(),
  ogImage: z.string().optional(),
  canonicalUrl: z.string().optional(),
});

// GET /api/pages/[id] - Get single page
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prisma = await getPrisma();
    const page = await prisma.page.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!page) {
      return NextResponse.json(
        { success: false, error: 'Không tìm thấy trang' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: page,
    });
  } catch (error) {
    console.error('Error fetching page:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể tải trang' },
      { status: 500 }
    );
  }
}

// PUT /api/pages/[id] - Update page (alias for PATCH)
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  return PATCH(request, { params });
}

// PATCH /api/pages/[id] - Update page
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const validatedData = pageUpdateSchema.parse(body);

    const prisma = await getPrisma();

    // Check if slug is being changed and if it conflicts
    if (validatedData.slug) {
      const existingPage = await prisma.page.findUnique({
        where: { slug: validatedData.slug },
      });

      if (existingPage && existingPage.id !== id) {
        return NextResponse.json(
          { success: false, error: 'Slug đã tồn tại' },
          { status: 400 }
        );
      }
    }

    const page = await prisma.page.update({
      where: { id },
      data: {
        ...validatedData,
        blocks: validatedData.blocks ? validatedData.blocks : undefined,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: page,
      message: 'Trang đã được cập nhật',
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { success: false, error: 'Dữ liệu không hợp lệ', details: error.issues },
        { status: 400 }
      );
    }

    console.error('Error updating page:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể cập nhật trang' },
      { status: 500 }
    );
  }
}

// DELETE /api/pages/[id] - Delete page
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const prisma = await getPrisma();

    await prisma.page.delete({
      where: { id },
    });

    return NextResponse.json({
      success: true,
      message: 'Trang đã được xóa',
    });
  } catch (error) {
    console.error('Error deleting page:', error);
    return NextResponse.json(
      { success: false, error: 'Không thể xóa trang' },
      { status: 500 }
    );
  }
}
