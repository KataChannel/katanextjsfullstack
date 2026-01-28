import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding WebsiteSettings...');

  // Navigation menu như trong hình
  const navigationMenu = [
    { label: 'Về InnerBright', url: '/innerbright', children: [] },
    { label: 'NLP', url: '/nlp', children: [] },
    { label: 'Time Line Therapy®', url: '/time-line-therapy', children: [] },
    { label: 'Đào tạo doanh nghiệp', url: '/dao-tao-doanh-nghiep', children: [] },
    { label: 'Khái vận cá nhân', url: '/khai-van-ca-nhan', children: [] },
    { label: 'Khoá học', url: '/khoa-hoc', children: [] },
    { label: 'Bộ thẻ NLP', url: '/bo-the-nlp', children: [] },
    { label: 'Thư viện', url: '/thu-vien', children: [] },
    { label: 'Liên hệ', url: '/lien-he', children: [] },
  ];

  const websiteSettings = await prisma.websiteSettings.upsert({
    where: { domain: 'tazagroup.vn' },
    update: {
      logo: '/logo.png',
      logoAlt: 'Taza Group Logo',
      navigationMenu: navigationMenu,
      footerText: '© 2025 Taza Group. All rights reserved.',
      socialLinks: [
        { platform: 'facebook', url: 'https://facebook.com/tazagroup', icon: 'facebook' },
        { platform: 'instagram', url: 'https://instagram.com/tazagroup', icon: 'instagram' },
        { platform: 'youtube', url: 'https://youtube.com/tazagroup', icon: 'youtube' },
      ],
    },
    create: {
      domain: 'tazagroup.vn',
      logo: '/logo.png',
      logoAlt: 'Taza Group Logo',
      navigationMenu: navigationMenu,
      footerText: '© 2025 Taza Group. All rights reserved.',
      socialLinks: [
        { platform: 'facebook', url: 'https://facebook.com/tazagroup', icon: 'facebook' },
        { platform: 'instagram', url: 'https://instagram.com/tazagroup', icon: 'instagram' },
        { platform: 'youtube', url: 'https://youtube.com/tazagroup', icon: 'youtube' },
      ],
    },
  });

  console.log('✅ WebsiteSettings created/updated:', websiteSettings.domain);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
