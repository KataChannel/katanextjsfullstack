import { NextRequest, NextResponse } from 'next/server';
import { createPasswordResetToken } from '@/lib/auth-helpers';
import { sendPasswordResetEmail } from '@/lib/email';
import { z } from 'zod';

const forgotPasswordSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = forgotPasswordSchema.parse(body);

    const { user, token } = await createPasswordResetToken(validatedData.email);

    // Send reset password email
    await sendPasswordResetEmail(user.email, token, user.name || undefined);

    return NextResponse.json({
      success: true,
      message: 'Email đặt lại mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.',
    });
  } catch (error: any) {
    console.error('Forgot password error:', error);

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
        error: error.message || 'Lỗi khi xử lý yêu cầu',
      },
      { status: 400 }
    );
  }
}
