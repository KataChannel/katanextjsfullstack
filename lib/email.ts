import nodemailer from 'nodemailer';
import { render } from '@react-email/render';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: process.env.SMTP_SECURE === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

interface SendEmailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: SendEmailOptions) {
  try {
    const info = await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME || 'Taza Group'}" <${process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER}>`,
      to,
      subject,
      html,
    });

    console.log('Email sent:', info.messageId);
    return info;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

/**
 * Send OTP email
 */
export async function sendOTPEmail(email: string, otp: string, name?: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(to right, #3b82f6, #6366f1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp-code { background: white; border: 2px dashed #3b82f6; padding: 20px; text-align: center; margin: 20px 0; border-radius: 10px; }
          .otp-number { font-size: 32px; font-weight: bold; letter-spacing: 8px; color: #3b82f6; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Xác Thực Email</h1>
          </div>
          <div class="content">
            <p>Xin chào ${name || 'bạn'},</p>
            <p>Cảm ơn bạn đã đăng ký tài khoản. Vui lòng sử dụng mã OTP dưới đây để xác thực email của bạn:</p>
            <div class="otp-code">
              <div class="otp-number">${otp}</div>
            </div>
            <p><strong>Lưu ý:</strong> Mã OTP này sẽ hết hạn sau 10 phút.</p>
            <p>Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email này.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Taza Group. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Xác thực email - Taza Group',
    html,
  });
}

/**
 * Send password reset email
 */
export async function sendPasswordResetEmail(email: string, token: string, name?: string) {
  const resetUrl = `${process.env.NEXTAUTH_URL}/auth/reset-password?token=${token}`;
  
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(to right, #3b82f6, #6366f1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Đặt Lại Mật Khẩu</h1>
          </div>
          <div class="content">
            <p>Xin chào ${name || 'bạn'},</p>
            <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
            <p>Nhấn vào nút bên dưới để tạo mật khẩu mới:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Đặt Lại Mật Khẩu</a>
            </div>
            <p>Hoặc copy link sau vào trình duyệt:</p>
            <p style="word-break: break-all; color: #6b7280;">${resetUrl}</p>
            <p><strong>Lưu ý:</strong> Link này sẽ hết hạn sau 1 giờ.</p>
            <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Taza Group. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Đặt lại mật khẩu - Taza Group',
    html,
  });
}

/**
 * Send welcome email
 */
export async function sendWelcomeEmail(email: string, name?: string) {
  const html = `
    <!DOCTYPE html>
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(to right, #3b82f6, #6366f1); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; color: #6b7280; font-size: 14px; margin-top: 30px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>🎉 Chào Mừng Đến Với Taza Group!</h1>
          </div>
          <div class="content">
            <p>Xin chào ${name || 'bạn'},</p>
            <p>Chúc mừng bạn đã tạo tài khoản thành công tại Taza Group!</p>
            <p>Tài khoản của bạn đã được xác thực và sẵn sàng sử dụng.</p>
            <p>Bạn có thể bắt đầu khám phá các tính năng của chúng tôi ngay bây giờ.</p>
            <p>Nếu bạn cần hỗ trợ, đừng ngần ngại liên hệ với chúng tôi.</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} Taza Group. All rights reserved.</p>
          </div>
        </div>
      </body>
    </html>
  `;

  return sendEmail({
    to: email,
    subject: 'Chào mừng đến với Taza Group! 🎉',
    html,
  });
}
