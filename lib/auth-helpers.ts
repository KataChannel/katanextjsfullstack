import { hash } from 'bcryptjs';
import { getPrisma } from './prisma';
import crypto from 'crypto';

/**
 * Generate OTP code (6 digits)
 */
export function generateOTP(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

/**
 * Generate verification token
 */
export function generateToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Hash password
 */
export async function hashPassword(password: string): Promise<string> {
  return hash(password, 12);
}

/**
 * Create user with hashed password
 */
export async function createUser(data: {
  email: string;
  password: string;
  name?: string;
}) {
  const prisma = await getPrisma();
  
  // Check if user exists
  const existingUser = await prisma.user.findUnique({
    where: { email: data.email },
  });

  if (existingUser) {
    throw new Error('Email đã được sử dụng');
  }

  // Hash password
  const hashedPassword = await hashPassword(data.password);

  // Generate OTP for email verification
  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

  // Create user
  const user = await prisma.user.create({
    data: {
      email: data.email,
      password: hashedPassword,
      name: data.name,
      otp,
      otpExpiresAt,
    },
  });

  return { user, otp };
}

/**
 * Verify OTP
 */
export async function verifyOTP(email: string, otp: string) {
  const prisma = await getPrisma();
  
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }

  if (!user.otp || !user.otpExpiresAt) {
    throw new Error('Không có mã OTP');
  }

  if (new Date() > user.otpExpiresAt) {
    throw new Error('Mã OTP đã hết hạn');
  }

  if (user.otp !== otp) {
    throw new Error('Mã OTP không đúng');
  }

  // Verify email and clear OTP
  await prisma.user.update({
    where: { id: user.id },
    data: {
      emailVerified: new Date(),
      otp: null,
      otpExpiresAt: null,
    },
  });

  return user;
}

/**
 * Resend OTP
 */
export async function resendOTP(email: string) {
  const prisma = await getPrisma();
  
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }

  if (user.emailVerified) {
    throw new Error('Email đã được xác thực');
  }

  const otp = generateOTP();
  const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000);

  await prisma.user.update({
    where: { id: user.id },
    data: { otp, otpExpiresAt },
  });

  return { user, otp };
}

/**
 * Create password reset token
 */
export async function createPasswordResetToken(email: string) {
  const prisma = await getPrisma();
  
  const user = await prisma.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new Error('Người dùng không tồn tại');
  }

  // Delete old tokens
  await prisma.verificationToken.deleteMany({
    where: {
      identifier: email,
      type: 'password_reset',
    },
  });

  // Create new token
  const token = generateToken();
  const expires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

  await prisma.verificationToken.create({
    data: {
      identifier: email,
      token,
      type: 'password_reset',
      expires,
    },
  });

  return { user, token };
}

/**
 * Reset password with token
 */
export async function resetPassword(token: string, newPassword: string) {
  const prisma = await getPrisma();
  
  const verificationToken = await prisma.verificationToken.findUnique({
    where: { token },
  });

  if (!verificationToken) {
    throw new Error('Token không hợp lệ');
  }

  if (new Date() > verificationToken.expires) {
    throw new Error('Token đã hết hạn');
  }

  if (verificationToken.type !== 'password_reset') {
    throw new Error('Token không hợp lệ');
  }

  const hashedPassword = await hashPassword(newPassword);

  await prisma.user.update({
    where: { email: verificationToken.identifier },
    data: { password: hashedPassword },
  });

  // Delete token
  await prisma.verificationToken.delete({
    where: { id: verificationToken.id },
  });
}

/**
 * Check if user is admin
 */
export function isAdmin(role?: string): boolean {
  return role === 'admin';
}

/**
 * Check if user is editor or admin
 */
export function isEditor(role?: string): boolean {
  return role === 'editor' || role === 'admin';
}
