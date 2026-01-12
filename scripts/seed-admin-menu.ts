/**
 * Seed Admin Menu cho InnerBright.vn
 * Cập nhật menu admin sidebar từ database
 */

import { getPrismaClient } from '../lib/database';

async function seedAdminMenu() {
  const domain = 'innerbright.vn';
  const prisma = getPrismaClient(domain);

  console.log('\n🌱 Seeding Admin Menu for InnerBright...');
  console.log(`📍 Domain: ${domain}`);

  try {
    // Xóa menu admin cũ (nếu có)
    await prisma.menu.deleteMany({
      where: { position: 'ADMIN' }
    });

    console.log('✅ Cleared old admin menus');

    // Tạo admin menu items
    const adminMenuItems = [
      {
        label: 'Dashboard',
        url: '/admin',
        icon: 'LayoutDashboard',
        order: 1,
        published: true,
        position: 'ADMIN' as const,
      },
      {
        label: 'Quản lý Nội dung',
        url: '/admin/content',
        icon: 'FileText',
        order: 2,
        published: true,
        position: 'ADMIN' as const,
      },
      {
        label: 'Pages V2',
        url: '/admin/pages-v2',
        icon: 'Layout',
        order: 3,
        published: true,
        position: 'ADMIN' as const,
      },
      {
        label: 'Block Templates',
        url: '/admin/block-templates',
        icon: 'Blocks',
        order: 4,
        published: true,
        position: 'ADMIN' as const,
      },
      {
        label: 'Thư viện Media',
        url: '/admin/media',
        icon: 'Image',
        order: 5,
        published: true,
        position: 'ADMIN' as const,
      },
      {
        label: 'Analytics',
        url: '/admin/analytics',
        icon: 'BarChart3',
        order: 6,
        published: true,
        position: 'ADMIN' as const,
      },
      {
        label: 'Cài đặt SEO',
        url: '/admin/seo-settings',
        icon: 'Settings',
        order: 7,
        published: true,
        position: 'ADMIN' as const,
      },
      {
        label: 'Website Settings',
        url: '/admin/website-settings',
        icon: 'Globe',
        order: 8,
        published: true,
        position: 'ADMIN' as const,
      },
      {
        label: 'Quản lý Menu',
        url: '/admin/menus',
        icon: 'Menu',
        order: 9,
        published: true,
        position: 'ADMIN' as const,
      },
      {
        label: 'Quyền Menu',
        url: '/admin/menu-permissions',
        icon: 'Shield',
        order: 10,
        published: true,
        position: 'ADMIN' as const,
      },
      {
        label: 'Người dùng',
        url: '/admin/users',
        icon: 'Users',
        order: 11,
        published: true,
        position: 'ADMIN' as const,
      },
    ];

    // Insert admin menus
    for (const menuItem of adminMenuItems) {
      await prisma.menu.create({
        data: menuItem,
      });
      console.log(`✅ Created: ${menuItem.label}`);
    }

    console.log('\n✅ Admin menu seeding completed!');
    console.log(`📊 Total menus created: ${adminMenuItems.length}`);

  } catch (error) {
    console.error('❌ Error seeding admin menus:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seed
seedAdminMenu()
  .then(() => {
    console.log('\n🎉 Seeding process completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Seeding process failed:', error);
    process.exit(1);
  });
