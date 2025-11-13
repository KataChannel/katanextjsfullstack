import { NextRequest, NextResponse } from 'next/server';
import { getPrisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

// GET - Lấy danh sách tất cả users và permissions (Admin only)
export async function GET(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      );
    }

    const prisma = await getPrisma();
    
    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
        menuPermissions: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}

// POST - Cập nhật menu permissions cho user (Admin only)
export async function POST(request: NextRequest) {
  try {
    const session = await auth();
    
    if (!session?.user || session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden - Admin only' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, allowedMenus } = body;

    if (!userId || !Array.isArray(allowedMenus)) {
      return NextResponse.json(
        { error: 'userId and allowedMenus array are required' },
        { status: 400 }
      );
    }

    const prisma = await getPrisma();

    const permission = await prisma.menuPermission.upsert({
      where: { userId },
      update: { allowedMenus },
      create: {
        userId,
        allowedMenus,
      },
    });

    return NextResponse.json({ 
      success: true,
      permission 
    });
  } catch (error) {
    console.error('Error updating permissions:', error);
    return NextResponse.json(
      { error: 'Failed to update permissions' },
      { status: 500 }
    );
  }
}
