import { getPrisma } from '../lib/prisma';

/**
 * Script seed menu cho tất cả domains
 */

interface MenuConfig {
  domain: string;
  menus: Array<{
    label: string;
    url: string;
    icon?: string;
    order: number;
  }>;
}

const menuConfigs: MenuConfig[] = [
  // TazaGroup - Mỹ phẩm và spa
  {
    domain: 'tazagroup.vn',
    menus: [
      { label: 'Trang chủ', url: '/', icon: 'Home', order: 1 },
      { label: 'Giới thiệu', url: '/gioi-thieu', icon: 'Info', order: 2 },
      { label: 'Dịch vụ', url: '/dich-vu', icon: 'Sparkles', order: 3 },
      { label: 'Sản phẩm', url: '/san-pham', icon: 'Package', order: 4 },
      { label: 'Bảng giá', url: '/bang-gia', icon: 'DollarSign', order: 5 },
      { label: 'Tin tức', url: '/tin-tuc', icon: 'Newspaper', order: 6 },
      { label: 'Liên hệ', url: '/lien-he', icon: 'Mail', order: 7 },
    ],
  },
  
  // TazaSkin - Thẩm mỹ da
  {
    domain: 'tazaskinclinic.com',
    menus: [
      { label: 'Trang chủ', url: '/', icon: 'Home', order: 1 },
      { label: 'Về chúng tôi', url: '/ve-chung-toi', icon: 'Users', order: 2 },
      { label: 'Dịch vụ', url: '/dich-vu', icon: 'Sparkles', order: 3 },
      { label: 'Công nghệ', url: '/cong-nghe', icon: 'Cpu', order: 4 },
      { label: 'Chuyên gia', url: '/chuyen-gia', icon: 'Award', order: 5 },
      { label: 'Blog', url: '/blog', icon: 'FileText', order: 6 },
      { label: 'Đặt lịch', url: '/dat-lich', icon: 'Calendar', order: 7 },
    ],
  },
  
  // Timona - Giáo dục
  {
    domain: 'timona.edu.vn',
    menus: [
      { label: 'Trang chủ', url: '/', icon: 'Home', order: 1 },
      { label: 'Giới thiệu', url: '/gioi-thieu', icon: 'School', order: 2 },
      { label: 'Khóa học', url: '/khoa-hoc', icon: 'BookOpen', order: 3 },
      { label: 'Giảng viên', url: '/giang-vien', icon: 'Users', order: 4 },
      { label: 'Thư viện', url: '/thu-vien', icon: 'Library', order: 5 },
      { label: 'Tin tức', url: '/tin-tuc', icon: 'Newspaper', order: 6 },
      { label: 'Liên hệ', url: '/lien-he', icon: 'Mail', order: 7 },
    ],
  },
  
  // HDerma - Thẩm mỹ da
  {
    domain: 'hderma.vn',
    menus: [
      { label: 'Trang chủ', url: '/', icon: 'Home', order: 1 },
      { label: 'Về HDerma', url: '/ve-hderma', icon: 'Info', order: 2 },
      { label: 'Liệu trình', url: '/lieu-trinh', icon: 'Activity', order: 3 },
      { label: 'Sản phẩm', url: '/san-pham', icon: 'ShoppingBag', order: 4 },
      { label: 'Khuyến mãi', url: '/khuyen-mai', icon: 'Tag', order: 5 },
      { label: 'Câu chuyện', url: '/cau-chuyen', icon: 'Heart', order: 6 },
      { label: 'Liên hệ', url: '/lien-he', icon: 'Phone', order: 7 },
    ],
  },
  
  // Elasome - Mỹ phẩm
  {
    domain: 'elasome.com',
    menus: [
      { label: 'Trang chủ', url: '/', icon: 'Home', order: 1 },
      { label: 'Về Elasome', url: '/ve-elasome', icon: 'Leaf', order: 2 },
      { label: 'Sản phẩm', url: '/san-pham', icon: 'Package', order: 3 },
      { label: 'Công nghệ', url: '/cong-nghe', icon: 'Microscope', order: 4 },
      { label: 'Hướng dẫn', url: '/huong-dan', icon: 'BookOpen', order: 5 },
      { label: 'Đại lý', url: '/dai-ly', icon: 'Store', order: 6 },
      { label: 'Liên hệ', url: '/lien-he', icon: 'Mail', order: 7 },
    ],
  },
  
  // InnerBright - Coaching & Training
  {
    domain: 'innerbright.vn',
    menus: [
      { label: 'Về InnerBright', url: '/innerbright', icon: 'Home', order: 1 },
      { label: 'NLP', url: '/nlp', icon: 'Brain', order: 2 },
      { label: 'Time Line Therapy®', url: '/time-line-therapy', icon: 'Clock', order: 3 },
      { label: 'Đào tạo doanh nghiệp', url: '/dao-tao-doanh-nghiep', icon: 'Building', order: 4 },
      { label: 'Khai vấn cá nhân', url: '/khai-van-ca-nhan', icon: 'Users', order: 5 },
      { label: 'Khoá học', url: '/khoa-hoc', icon: 'GraduationCap', order: 6 },
      { label: 'Bộ thẻ NLP', url: '/bo-the-nlp', icon: 'CreditCard', order: 7 },
      { label: 'Thư viện', url: '/thu-vien', icon: 'Library', order: 8 },
      { label: 'Liên hệ', url: '/lien-he', icon: 'Mail', order: 9 },
    ],
  },
];

async function seedAllMenus() {
  console.log('\n🌱 Seeding Menus for All Domains...');
  console.log('═══════════════════════════════════════════\n');

  for (const config of menuConfigs) {
    console.log(`\n📋 Processing: ${config.domain}`);
    console.log('─────────────────────────────────────────');
    
    try {
      const prisma = await getPrisma(config.domain);

      // Xóa menu cũ
      await prisma.menu.deleteMany({});
      console.log('  ✅ Cleaned old menus');

      // Tạo menu mới
      for (const menu of config.menus) {
        await prisma.menu.create({
          data: {
            label: menu.label,
            url: menu.url,
            icon: menu.icon,
            order: menu.order,
            published: true,
          },
        });
        console.log(`  ✅ ${menu.label} → ${menu.url}`);
      }

      console.log(`  ✅ Total: ${config.menus.length} menus`);
    } catch (error) {
      console.error(`  ❌ Error for ${config.domain}:`, error);
    }
  }

  console.log('\n═══════════════════════════════════════════');
  console.log('✅ Menu seeding completed for all domains!');
  console.log('\n📊 Summary:');
  console.log(`   Total domains: ${menuConfigs.length}`);
  console.log(`   Total menus: ${menuConfigs.reduce((sum, c) => sum + c.menus.length, 0)}`);
  console.log('\n💡 Next steps:');
  console.log('   1. Test menu trên từng domain');
  console.log('   2. Tạo pages cho các URL menu');
  console.log('   3. Cấu hình menu permissions nếu cần');
}

seedAllMenus()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Fatal error:', error);
    process.exit(1);
  });
