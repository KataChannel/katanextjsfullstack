import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { getPrisma } from '@/lib/prisma';
import { headers } from 'next/headers';

// GET /api/menus?position=HEADER - Lấy menu published, filter theo position và permissions
export async function GET(request: Request) {
  try {
    const headersList = await headers();
    const domain = headersList.get('x-domain') || 'tazagroup.vn';
    const prisma = await getPrisma(domain);
    
    // Lấy position từ query parameter
    const { searchParams } = new URL(request.url);
    const position = searchParams.get('position'); // HEADER, FOOTER, ADMIN, SIDEBAR
    
    const session = await auth();

    // Build where clause
    const whereClause: any = { published: true };
    if (position) {
      whereClause.position = position;
    }

    // Lấy menu published với position filter
    const allMenus = await prisma.menu.findMany({
      where: whereClause,
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
