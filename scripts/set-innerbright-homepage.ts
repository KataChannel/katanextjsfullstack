import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Cập nhật trang chủ cho innerbright.vn...');

  // Upsert website settings for innerbright.vn
  const settings = await prisma.websiteSettings.upsert({
    where: { domain: 'innerbright.vn' },
    update: {
      homeRedirect: '/innerbright',
    },
    create: {
      domain: 'innerbright.vn',
      siteName: 'InnerBright Training & Coaching',
      metaTitle: 'InnerBright - Đào tạo NLP & Coaching chuyên nghiệp',
      metaDescription: 'InnerBright Training & Coaching - Đào tạo NLP và Coaching chuyên nghiệp, chứng nhận ABNLP',
      siteKeywords: 'NLP, coaching, đào tạo NLP, ABNLP, phát triển bản thân',
      siteOgImage: '/images/innerbright-og.jpg',
      twitterHandle: '@innerbright',
      googleAnalytics: 'G-XXXXXXXXXX',
      homeRedirect: '/innerbright',
      organizationSchema: {
        '@context': 'https://schema.org',
        '@type': 'Organization',
        name: 'InnerBright Training & Coaching',
        url: 'https://innerbright.vn',
        logo: 'https://innerbright.vn/logo.png',
      },
    },
  });

  console.log('✅ Đã cập nhật thành công!');
  console.log('📌 Domain:', settings.domain);
  console.log('🏠 Trang chủ redirect:', settings.homeRedirect);
  console.log('📝 Site name:', settings.siteName);
  console.log('\n✨ Bây giờ khi truy cập https://innerbright.vn sẽ tự động redirect sang /innerbright');
}

main()
  .catch((e) => {
    console.error('❌ Lỗi:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
