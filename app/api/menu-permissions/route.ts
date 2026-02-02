import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - Lấy menu permissions của user hiện tại
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const prisma = await getPrisma();
    
    const permission = await prisma.menuPermission.findUnique({
      where: { userId: session.user.id },
    });

    // Admin có full quyền
    if (session.user.role === 'admin') {
      const websiteSettings = await prisma.websiteSettings.findUnique({
        where: { domain: 'innerbright.vn' },
      });

      let allMenuUrls: string[] = [];
      if (websiteSettings?.navigationMenu) {
        const menus = websiteSettings.navigationMenu as any[];
        allMenuUrls = menus.map((menu: any) => menu.url);
      }

      return NextResponse.json({
        userId: session.user.id,
        role: session.user.role,
        allowedMenus: allMenuUrls,
        isAdmin: true,
      });
    }

    // User thường
    return NextResponse.json({
      userId: session.user.id,
      role: session.user.role,
      allowedMenus: permission?.allowedMenus || [],
      isAdmin: false,
    });
  } catch (error) {
    console.error('Error fetching menu permissions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch permissions' },
      { status: 500 }
    );
  }
}
