import { PrismaClient } from '@prisma/client';

/**
 * Script to ensure katachanneloffical@gmail.com has admin role
 * This fixes the issue where Google OAuth login doesn't grant admin access
 * 
 * Usage:
 * - Local: DATABASE_URL="postgresql://postgres:KataChannel1102@localhost:5432/innerbright" bun run scripts/fix-admin-user.ts
 * - Production: DATABASE_URL="postgresql://postgres:2kOIU5HX98Nb@postgres:5432/innerv2core" bun run scripts/fix-admin-user.ts
 */
async function fixAdminUser() {
  const prisma = new PrismaClient();
  
  console.log('🔍 Checking user katachanneloffical@gmail.com...');
  
  const user = await prisma.user.findUnique({
    where: { email: 'katachanneloffical@gmail.com' },
  });

  if (!user) {
    console.log('❌ User not found! Creating admin user...');
    const newUser = await prisma.user.create({
      data: {
        email: 'katachanneloffical@gmail.com',
        name: 'Kata Channel Admin',
        role: 'admin',
        emailVerified: new Date(),
      },
    });
    console.log('✅ Admin user created:', newUser);
  } else {
    console.log('✅ User found:', {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      emailVerified: user.emailVerified,
    });

    if (user.role !== 'admin' || !user.emailVerified) {
      console.log('🔧 Updating user to admin role and verifying email...');
      const updatedUser = await prisma.user.update({
        where: { id: user.id },
        data: {
          role: 'admin',
          emailVerified: user.emailVerified || new Date(),
        },
      });
      console.log('✅ User updated:', {
        id: updatedUser.id,
        email: updatedUser.email,
        role: updatedUser.role,
        emailVerified: updatedUser.emailVerified,
      });
    } else {
      console.log('✅ User already has admin role and verified email');
    }
  }

  console.log('\n✅ Fix completed successfully!');
  await prisma.$disconnect();
}

fixAdminUser().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
