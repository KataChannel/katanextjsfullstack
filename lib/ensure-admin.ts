/**
 * Script để đảm bảo có ít nhất 1 admin user
 * Chạy tự động khi cần thiết
 */

import { getPrisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

export async function ensureAdminUser() {
  try {
    // Get Prisma client for CURRENT DOMAIN only
    const prisma = await getPrisma();
    
    // Check if any user exists
    const userCount = await prisma.user.count();
    
    if (userCount === 0) {
      console.log('📝 No users found. Creating default admin user...');
      
      // Create default admin user
      const hashedPassword = await hash('admin123', 10);
      
      const adminUser = await prisma.user.create({
        data: {
          email: 'admin@example.com',
          name: 'Admin',
          password: hashedPassword,
          role: 'admin',
          emailVerified: new Date(),
        },
      });
      
      console.log('✅ Default admin user created:');
      console.log('   Email: admin@example.com');
      console.log('   Password: admin123');
      console.log('   Role: admin');
      console.log('   ID:', adminUser.id);
      
      return adminUser.id;
    }
    
    // If users exist, return first admin user
    const adminUser = await prisma.user.findFirst({
      where: { role: 'admin' },
      select: { id: true },
    });
    
    if (adminUser) {
      return adminUser.id;
    }
    
    // If no admin, return first user
    const firstUser = await prisma.user.findFirst({
      select: { id: true },
    });
    
    return firstUser?.id || null;
  } catch (error) {
    console.error('Error ensuring admin user:', error);
    return null;
  }
}

// Run if called directly
if (require.main === module) {
  ensureAdminUser()
    .then((id) => {
      if (id) {
        console.log('✅ Admin user ID:', id);
      } else {
        console.log('❌ Could not create/find admin user');
      }
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Error:', error);
      process.exit(1);
    });
}
