import { NextRequest, NextResponse } from 'next/server';
import { createUser } from '@/lib/auth-helpers';
import { sendOTPEmail } from '@/lib/email';
import { z } from 'zod';

const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(8, 'Mật khẩu phải có ít nhất 8 ký tự'),
  name: z.string().min(2, 'Tên phải có ít nhất 2 ký tự').optional(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    const { user, otp } = await createUser(validatedData);

    // Send OTP email
    await sendOTPEmail(user.email, otp, user.name || undefined);

    return NextResponse.json(
      {
        success: true,
        message: 'Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.',
        data: {
          email: user.email,
          name: user.name,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Register error:', error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          error: 'Dữ liệu không hợp lệ',
          details: error.issues,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Lỗi khi đăng ký tài khoản',
      },
      { status: 400 }
    );
  }
}
