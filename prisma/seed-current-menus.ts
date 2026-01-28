import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding current menus and admin permissions...');

  // Danh sách menu từ screenshot
  const currentMenus = [
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

  // 1. Xóa menu cũ (nếu có)
  console.log('🗑️  Deleting old menus...');
  await prisma.menu.deleteMany({});

  // 2. Tạo menu mới
  console.log('📝 Creating menus...');
  const createdMenus = [];
  for (const menu of currentMenus) {
    const created = await prisma.menu.create({
      data: {
        label: menu.label,
        url: menu.url,
        order: menu.order,
        published: true,
      },
    });
    createdMenus.push(created);
    console.log(`✅ Created: ${menu.label} (${menu.url})`);
  }

  // 3. Lấy admin user (katachanneloffical@gmail.com)
  console.log('\n👤 Checking admin user...');
  let adminUser = await prisma.user.findUnique({
    where: { email: 'katachanneloffical@gmail.com' },
  });

  // Nếu chưa có, tạo admin user
  if (!adminUser) {
    console.log('Creating admin user...');
    const hashedPassword = await bcrypt.hash('Admin@123456', 10);
    adminUser = await prisma.user.create({
      data: {
        email: 'katachanneloffical@gmail.com',
        name: 'Kata Channel Admin',
        password: hashedPassword,
        role: 'admin',
        emailVerified: new Date(),
      },
    });
    console.log('✅ Admin user created');
  } else {
    // Update role to admin nếu chưa phải admin
    if (adminUser.role !== 'admin') {
      await prisma.user.update({
        where: { id: adminUser.id },
        data: { role: 'admin' },
      });
      console.log('✅ Updated user role to admin');
    } else {
      console.log('✅ Admin user already exists');
    }
  }

  // 4. Cập nhật MenuPermission cho admin - FULL QUYỀN tất cả menu
  console.log('\n🔐 Setting admin permissions...');
  const allMenuUrls = createdMenus.map(m => m.url);
  
  await prisma.menuPermission.upsert({
    where: { userId: adminUser.id },
    update: {
      allowedMenus: allMenuUrls,
    },
    create: {
      userId: adminUser.id,
      allowedMenus: allMenuUrls,
    },
  });

  console.log(`✅ Admin has FULL permissions for ${allMenuUrls.length} menus:`);
  allMenuUrls.forEach(url => console.log(`   - ${url}`));

  console.log('\n✅ Seeding completed successfully!');
  console.log('\n📊 Summary:');
  console.log(`   - Created ${createdMenus.length} menus`);
  console.log(`   - Admin user: katachanneloffical@gmail.com (role: admin)`);
  console.log(`   - Admin has FULL access to all ${allMenuUrls.length} menus`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
