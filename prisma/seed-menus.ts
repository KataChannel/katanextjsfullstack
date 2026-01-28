import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding menu items...');

  // Lấy navigationMenu từ WebsiteSettings
  const websiteSettings = await prisma.websiteSettings.findFirst();
  
  if (!websiteSettings || !websiteSettings.navigationMenu) {
    console.log('⚠️  No navigationMenu found in WebsiteSettings');
    
    // Tạo menu mặc định nếu không có
    const defaultMenus = [
      { label: 'Về InnerBright', url: '/innerbright', order: 1 },
      { label: 'NLP', url: '/nlp', order: 2 },
      { label: 'Time Line Therapy®', url: '/time-line-therapy', order: 3 },
      { label: 'Đào tạo doanh nghiệp', url: '/dao-tao-doanh-nghiep', order: 4 },
      { label: 'Khái vận cá nhân', url: '/khai-van-ca-nhan', order: 5 },
      { label: 'Khoá học', url: '/khoa-hoc', order: 6 },
      { label: 'Bộ thẻ NLP', url: '/bo-the-nlp', order: 7 },
      { label: 'Thư viện', url: '/thu-vien', order: 8 },
      { label: 'Liên hệ', url: '/lien-he', order: 9 },
    ];

    for (const menu of defaultMenus) {
      await prisma.menu.create({
        data: {
          label: menu.label,
          url: menu.url,
          order: menu.order,
          published: true,
        },
      });
      console.log(`✅ Created menu: ${menu.label}`);
    }
  } else {
    // Migrate từ navigationMenu JSON
    const navMenu = websiteSettings.navigationMenu as any[];
    
    for (let i = 0; i < navMenu.length; i++) {
      const menu = navMenu[i];
      await prisma.menu.create({
        data: {
          label: menu.label,
          url: menu.url,
          order: i + 1,
          published: true,
        },
      });
      console.log(`✅ Migrated menu: ${menu.label}`);
    }
  }

  const menuCount = await prisma.menu.count();
  console.log(`\n✅ Seeding completed! Created ${menuCount} menu items.`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding menus:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
