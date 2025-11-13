import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding admin user with menu permissions...');

  // Tạo admin user
  const adminEmail = 'katachanneloffical@gmail.com';
  const adminPassword = await hash('Admin@123456', 10); // Default password

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'admin',
      emailVerified: new Date(),
    },
    create: {
      email: adminEmail,
      name: 'Admin KataChannel',
      password: adminPassword,
      role: 'admin',
      emailVerified: new Date(),
    },
  });

  console.log('✅ Admin user created/updated:', adminUser.email);

  // Lấy tất cả menu items từ WebsiteSettings
  const websiteSettings = await prisma.websiteSettings.findUnique({
    where: { domain: 'tazagroup.vn' },
  });

  let allMenuUrls: string[] = [];
  
  if (websiteSettings?.navigationMenu) {
    const menus = websiteSettings.navigationMenu as any[];
    allMenuUrls = menus.map((menu: any) => menu.url);
  }

  // Mặc định menu URLs nếu chưa có trong settings
  if (allMenuUrls.length === 0) {
    allMenuUrls = [
      '/ve-innerbright',
      '/nlp',
      '/time-line-therapy',
      '/dao-tao-doanh-nghiep',
      '/khai-van-ca-nhan',
      '/khoa-hoc',
      '/bo-the-nlp',
      '/thu-vien',
      '/lien-he',
    ];
  }

  // Admin có full quyền tất cả menu
  const adminPermission = await prisma.menuPermission.upsert({
    where: { userId: adminUser.id },
    update: {
      allowedMenus: allMenuUrls,
    },
    create: {
      userId: adminUser.id,
      allowedMenus: allMenuUrls,
    },
  });

  console.log('✅ Admin menu permissions:', {
    userId: adminUser.id,
    totalMenus: allMenuUrls.length,
    menus: allMenuUrls,
  });

  // Tạo ví dụ user thường (optional - for demo)
  const demoUser = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Demo User',
      password: await hash('User@123456', 10),
      role: 'user',
      emailVerified: new Date(),
    },
  });

  // User thường chỉ có quyền 1 số menu cơ bản
  const userPermission = await prisma.menuPermission.upsert({
    where: { userId: demoUser.id },
    update: {
      allowedMenus: ['/ve-innerbright', '/lien-he', '/thu-vien'],
    },
    create: {
      userId: demoUser.id,
      allowedMenus: ['/ve-innerbright', '/lien-he', '/thu-vien'],
    },
  });

  console.log('✅ Demo user permissions:', {
    userId: demoUser.id,
    allowedMenus: userPermission.allowedMenus,
  });

  console.log('\n🎉 Seed hoàn tất!');
  console.log('\n📝 Thông tin đăng nhập:');
  console.log('   Admin:', adminEmail, '/ Password: Admin@123456');
  console.log('   User:', demoUser.email, '/ Password: User@123456');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
