import { getPrisma } from '../lib/prisma';

/**
 * Script seed Admin Menu cho InnerBright
 * Admin menu structure từ admin-sidebar.tsx
 */

async function seedAdminMenus() {
  const domain = 'innerbright.vn';
  const prisma = await getPrisma(domain);

  console.log('\n🔐 Seeding Admin Menus for InnerBright...');
  console.log('═══════════════════════════════════════════\n');

  // Xóa admin menu cũ (menu có URL bắt đầu bằng /admin)
  const deleted = await prisma.menu.deleteMany({
    where: {
      url: {
        startsWith: '/admin'
      }
    }
  });

  console.log(`✅ Cleaned ${deleted.count} old admin menus`);

  // Tạo admin menu mới theo structure từ admin-sidebar.tsx
  const adminMenus = [
    {
      label: 'Dashboard',
      url: '/admin',
      icon: 'LayoutDashboard',
      order: 100, // Start from 100 to separate from public menus
      published: true,
    },
    {
      label: 'Quản lý Nội dung',
      url: '/admin/content',
      icon: 'FileText',
      order: 101,
      published: true,
    },
    {
      label: 'Page Builder',
      url: '/admin/page-builder',
      icon: 'Palette',
      order: 102,
      published: true,
    },
    {
      label: 'Block Templates',
      url: '/admin/block-templates',
      icon: 'Blocks',
      order: 103,
      published: true,
    },
    {
      label: 'Thư viện Media',
      url: '/admin/media',
      icon: 'Image',
      order: 104,
      published: true,
    },
    {
      label: 'Analytics',
      url: '/admin/analytics',
      icon: 'BarChart3',
      order: 105,
      published: true,
    },
    {
      label: 'Cài đặt SEO',
      url: '/admin/seo-settings',
      icon: 'Settings',
      order: 106,
      published: true,
    },
    {
      label: 'Website Settings',
      url: '/admin/website-settings',
      icon: 'Globe',
      order: 107,
      published: true,
    },
    {
      label: 'Quản lý Menu',
      url: '/admin/menus',
      icon: 'Menu',
      order: 108,
      published: true,
    },
    {
      label: 'Quyền Menu',
      url: '/admin/menu-permissions',
      icon: 'Shield',
      order: 109,
      published: true,
    },
    {
      label: 'Người dùng',
      url: '/admin/users',
      icon: 'Users',
      order: 110,
      published: true,
    },
  ];

  for (const menu of adminMenus) {
    await prisma.menu.create({
      data: menu,
    });
    console.log(`  ✅ Created admin menu: ${menu.label} (${menu.url})`);
  }

  console.log('\n✅ Admin menu seeding completed for InnerBright!');
  console.log('\n📋 Summary:');
  console.log(`   Domain: ${domain}`);
  console.log(`   Total admin menus: ${adminMenus.length}`);
  
  // Show all menus (public + admin)
  const allMenus = await prisma.menu.findMany({
    orderBy: { order: 'asc' },
  });
  
  const publicMenus = allMenus.filter(m => !m.url.startsWith('/admin'));
  const adminMenusDb = allMenus.filter(m => m.url.startsWith('/admin'));
  
  console.log('\n📊 Menu Statistics:');
  console.log(`   Public menus: ${publicMenus.length}`);
  console.log(`   Admin menus: ${adminMenusDb.length}`);
  console.log(`   Total: ${allMenus.length}`);
  
  console.log('\n💡 Note:');
  console.log('   - Admin menus có order từ 100+ để phân biệt với public menus');
  console.log('   - Admin menus được identify bằng URL bắt đầu với /admin');
  console.log('   - Sidebar component vẫn sử dụng hard-coded menu items');
  console.log('   - DB menu có thể dùng cho dynamic rendering hoặc permissions');
}

seedAdminMenus()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error seeding admin menus:', error);
    process.exit(1);
  });
