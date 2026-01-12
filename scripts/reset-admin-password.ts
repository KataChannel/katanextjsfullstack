import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

/**
 * Reset password for admin@example.com to admin123
 */
async function resetAdminPassword() {
  const prisma = new PrismaClient();
  
  console.log('🔧 Resetting password for admin@example.com...');
  
  const email = 'admin@example.com';
  const newPassword = 'admin123';
  
  // Hash the password
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  
  // Update user
  const user = await prisma.user.update({
    where: { email },
    data: {
      password: hashedPassword,
      emailVerified: new Date(), // Ensure email is verified
      role: 'admin', // Ensure role is admin
      updatedAt: new Date(),
    },
    select: {
      id: true,
      email: true,
      name: true,
      role: true,
      emailVerified: true,
    },
  });

  console.log('✅ Password reset successfully!');
  console.log('User details:', user);
  console.log('');
  console.log('Login credentials:');
  console.log('  Email:', email);
  console.log('  Password:', newPassword);
  console.log('');
  console.log('Test at: https://innerbright.vn/auth/login');

  await prisma.$disconnect();
}

resetAdminPassword().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
