import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP, resendOTP } from '@/lib/auth-helpers';
import { sendOTPEmail, sendWelcomeEmail } from '@/lib/email';
import { z } from 'zod';

const verifySchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  otp: z.string().length(6, 'Mã OTP phải có 6 số'),
});

const resendSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
});

// Verify OTP
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = verifySchema.parse(body);

    const user = await verifyOTP(validatedData.email, validatedData.otp);

    // Send welcome email
    await sendWelcomeEmail(user.email, user.name || undefined);

    return NextResponse.json({
      success: true,
      message: 'Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ.',
      data: {
        email: user.email,
        name: user.name,
      },
    });
  } catch (error: any) {
    console.error('Verify OTP error:', error);

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
        error: error.message || 'Lỗi khi xác thực OTP',
      },
      { status: 400 }
    );
  }
}

// Resend OTP
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resendSchema.parse(body);

    const { user, otp } = await resendOTP(validatedData.email);

    // Send OTP email
    await sendOTPEmail(user.email, otp, user.name || undefined);

    return NextResponse.json({
      success: true,
      message: 'Đã gửi lại mã OTP. Vui lòng kiểm tra email của bạn.',
    });
  } catch (error: any) {
    console.error('Resend OTP error:', error);

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
        error: error.message || 'Lỗi khi gửi lại OTP',
      },
      { status: 400 }
    );
  }
}
