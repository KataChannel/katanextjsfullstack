/**
 * Verify Admin Menu cho InnerBright.vn
 * Kiểm tra menu admin sidebar từ database
 */

import { getPrismaClient } from '../lib/database';

async function verifyAdminMenu() {
  const domain = 'innerbright.vn';
  const prisma = getPrismaClient(domain);

  console.log('\n🔍 Verifying Admin Menu for InnerBright...');
  console.log(`📍 Domain: ${domain}\n`);

  try {
    // Lấy tất cả admin menus
    const adminMenus = await prisma.menu.findMany({
      where: { position: 'ADMIN' },
      orderBy: { order: 'asc' },
    });

    console.log(`📊 Total Admin Menus: ${adminMenus.length}\n`);

    // Hiển thị chi tiết
    adminMenus.forEach((menu, index) => {
      console.log(`${index + 1}. ${menu.label}`);
      console.log(`   URL: ${menu.url}`);
      console.log(`   Icon: ${menu.icon}`);
      console.log(`   Order: ${menu.order}`);
      console.log(`   Published: ${menu.published ? '✅' : '❌'}`);
      console.log('');
    });

    console.log('✅ Verification completed!\n');

  } catch (error) {
    console.error('❌ Error verifying admin menus:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run verification
verifyAdminMenu()
  .then(() => {
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Verification failed:', error);
    process.exit(1);
  });
