import { getPrisma } from '../lib/prisma';

/**
 * Script cập nhật menu cho InnerBright domain
 * Public Header Menu: Về InnerBright, NLP, Time Line Therapy®, Đào tạo doanh nghiệp, 
 *                      Khai vấn cá nhân, Khoá học, Bộ thẻ NLP, Thư viện, Liên hệ
 */

async function seedMenus() {
  const domain = 'innerbright.vn';
  const prisma = await getPrisma(domain);

  console.log('\n🌱 Seeding Menus for InnerBright...');
  console.log('═══════════════════════════════════════════\n');

  // Xóa menu cũ
  await prisma.menu.deleteMany({});

  console.log('✅ Cleaned old menus');

  // Tạo menu mới theo hình
  const menus = [
    {
      label: 'Về InnerBright',
      url: '/ve-innerbright',
      icon: 'Home',
      order: 1,
      published: true,
    },
    {
      label: 'NLP',
      url: '/nlp',
      icon: 'Brain',
      order: 2,
      published: true,
    },
    {
      label: 'Time Line Therapy®',
      url: '/time-line-therapy',
      icon: 'Clock',
      order: 3,
      published: true,
    },
    {
      label: 'Đào tạo doanh nghiệp',
      url: '/dao-tao-doanh-nghiep',
      icon: 'Building',
      order: 4,
      published: true,
    },
    {
      label: 'Khai vấn cá nhân',
      url: '/khai-van-ca-nhan',
      icon: 'Users',
      order: 5,
      published: true,
    },
    {
      label: 'Khoá học',
      url: '/khoa-hoc',
      icon: 'GraduationCap',
      order: 6,
      published: true,
    },
    {
      label: 'Bộ thẻ NLP',
      url: '/bo-the-nlp',
      icon: 'CreditCard',
      order: 7,
      published: true,
    },
    {
      label: 'Thư viện',
      url: '/thu-vien',
      icon: 'Library',
      order: 8,
      published: true,
    },
    {
      label: 'Liên hệ',
      url: '/lien-he',
      icon: 'Mail',
      order: 9,
      published: true,
    },
  ];

  for (const menu of menus) {
    await prisma.menu.create({
      data: menu,
    });
    console.log(`  ✅ Created menu: ${menu.label} (${menu.url})`);
  }

  console.log('\n✅ Menu seeding completed for InnerBright!');
  console.log('\n📋 Summary:');
  console.log(`   Domain: ${domain}`);
  console.log(`   Total menus: ${menus.length}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Tạo các pages tương ứng với URL menu');
  console.log('   2. Cấu hình menu permissions nếu cần');
  console.log('   3. Test menu trên header');
}

seedMenus()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error seeding menus:', error);
    process.exit(1);
  });
