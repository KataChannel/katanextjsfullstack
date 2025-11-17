import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPrisma } from '@/lib/prisma';
import { headers } from 'next/headers';

// GET /api/admin/menus?domain=xxx - Lấy tất cả menu items (Admin only)
export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      );
    }

    // Lấy domain và position từ query parameter
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain') || undefined;
    const position = searchParams.get('position');
    const prisma = await getPrisma(domain);

    const menus = await prisma.menu.findMany({
      where: position ? { position: position as any } : undefined,
      orderBy: { order: 'asc' },
      include: {
        parent: true,
        children: true,
      },
    });

    return NextResponse.json(menus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menus' },
      { status: 500 }
    );
  }
}

// POST /api/admin/menus?domain=xxx - Tạo menu mới
export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      );
    }

    // Lấy domain từ query parameter
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain') || 'innerbright.vn';
    const prisma = await getPrisma(domain);

    const body = await request.json();
    const { label, url, icon, order, published, position, parentId } = body;

    if (!label || !url) {
      return NextResponse.json(
        { error: 'Label and URL are required' },
        { status: 400 }
      );
    }

    const menu = await prisma.menu.create({
      data: {
        label,
        url,
        icon: icon || null,
        order: order || 0,
        published: published !== undefined ? published : true,
        position: position || 'HEADER',
        parentId: parentId || null,
      },
    });

    return NextResponse.json(menu, { status: 201 });
  } catch (error) {
    console.error('Error creating menu:', error);
    return NextResponse.json(
      { error: 'Failed to create menu' },
      { status: 500 }
    );
  }
}

// PUT /api/admin/menus?domain=xxx - Cập nhật menu
export async function PUT(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      );
    }

    // Lấy domain từ query parameter
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain') || 'innerbright.vn';
    const prisma = await getPrisma(domain);

    const body = await request.json();
    const { id, label, url, icon, order, published, position, parentId } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Menu ID is required' },
        { status: 400 }
      );
    }

    const menu = await prisma.menu.update({
      where: { id },
      data: {
        label,
        url,
        icon: icon || null,
        order,
        published,
        position: position || 'HEADER',
        parentId: parentId || null,
      },
    });

    return NextResponse.json(menu);
  } catch (error) {
    console.error('Error updating menu:', error);
    return NextResponse.json(
      { error: 'Failed to update menu' },
      { status: 500 }
    );
  }
}

// DELETE /api/admin/menus?domain=xxx&id=xxx - Xóa menu
export async function DELETE(request: Request) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      );
    }

    // Lấy domain và id từ query parameters
    const { searchParams } = new URL(request.url);
    const domain = searchParams.get('domain') || 'innerbright.vn';
    const id = searchParams.get('id');
    const prisma = await getPrisma(domain);

    if (!id) {
      return NextResponse.json(
        { error: 'Menu ID is required' },
        { status: 400 }
      );
    }

    await prisma.menu.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting menu:', error);
    return NextResponse.json(
      { error: 'Failed to delete menu' },
      { status: 500 }
    );
  }
}
