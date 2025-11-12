import { NextResponse } from "next/server";
import { getPrisma } from "@/lib/prisma";
import { hash } from "bcryptjs";

/**
 * POST /api/users/ensure-admin
 * Đảm bảo có ít nhất 1 admin user trong hệ thống
 * Nếu chưa có, tự động tạo admin mặc định
 */
export async function POST() {
  try {
    const prisma = await getPrisma();
    
    // Check if any admin user exists
    const adminUser = await prisma.user.findFirst({
      where: { role: "admin" },
      select: { id: true, email: true, name: true },
    });
    
    if (adminUser) {
      return NextResponse.json({
        success: true,
        userId: adminUser.id,
        message: "Admin user already exists",
        user: adminUser,
      });
    }
    
    // No admin found, create default admin
    const hashedPassword = await hash("admin123", 10);
    
    const newAdmin = await prisma.user.create({
      data: {
        email: "admin@example.com",
        name: "Admin",
        password: hashedPassword,
        role: "admin",
        emailVerified: new Date(),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });
    
    return NextResponse.json({
      success: true,
      userId: newAdmin.id,
      message: "Default admin user created",
      user: newAdmin,
      credentials: {
        email: "admin@example.com",
        password: "admin123",
        note: "Please change password after first login",
      },
    });
    
  } catch (error) {
    console.error("Error ensuring admin user:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to ensure admin user",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
