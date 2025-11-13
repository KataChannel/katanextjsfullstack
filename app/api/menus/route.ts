import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/menus - Lấy menu published, filter theo permissions
export async function GET() {
  try {
    const session = await auth();

    // Lấy tất cả menu published
    const allMenus = await prisma.menu.findMany({
      where: { published: true },
      orderBy: { order: 'asc' },
    });

    // Nếu chưa login, trả về tất cả menu
    if (!session?.user) {
      return NextResponse.json(allMenus);
    }

    // Admin thấy tất cả
    if (session.user.role === 'admin') {
      return NextResponse.json(allMenus);
    }

    // User thường: filter theo permissions
    const menuPermission = await prisma.menuPermission.findUnique({
      where: { userId: session.user.id },
    });

    if (!menuPermission) {
      // Không có permissions => không thấy menu nào
      return NextResponse.json([]);
    }

    const allowedMenus = menuPermission.allowedMenus as string[];
    const filteredMenus = allMenus.filter(menu => 
      allowedMenus.includes(menu.url)
    );

    return NextResponse.json(filteredMenus);
  } catch (error) {
    console.error('Error fetching menus:', error);
    return NextResponse.json(
      { error: 'Failed to fetch menus' },
      { status: 500 }
    );
  }
}
