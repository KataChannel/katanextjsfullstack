import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Seed data cho Page Builder
 * - Tạo 1 user admin
 * - Tạo 3 pages mẫu với blocks từ page builder
 */
async function main() {
  console.log('🌱 Seeding page builder data...');

  // 1. Tạo user admin
  const admin = await prisma.user.upsert({
    where: { email: 'admin@pagebuilder.com' },
    update: {},
    create: {
      email: 'admin@pagebuilder.com',
      name: 'Admin Page Builder',
      role: 'admin',
    },
  });

  console.log('✅ User admin created:', admin.email);

  // 2. Page mẫu 1: Landing Page - Hero Section
  const landingPage = await prisma.page.upsert({
    where: { slug: 'landing-page-demo' },
    update: {},
    create: {
      title: 'Landing Page Demo',
      slug: 'landing-page-demo',
      content: 'Landing page được tạo bằng Page Builder',
      published: true,
      authorId: admin.id,
      metaTitle: 'Landing Page Demo - Ultra Builder',
      metaDescription: 'Demo landing page với hero section, features, và CTA',
      blocks: {
        canvas: {
          width: 1440,
          height: 900,
          zoom: 1,
          snapToGrid: true,
          gridSize: 8,
          showGrid: true,
          magneticAlignment: true,
          selectedIds: [],
        },
        elements: [
          {
            id: 'hero-container',
            type: 'container',
            x: 0,
            y: 0,
            width: 1440,
            height: 600,
            styles: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              gap: '32px',
              padding: '64px',
            },
            children: [],
          },
          {
            id: 'hero-heading',
            type: 'heading',
            x: 420,
            y: 200,
            width: 600,
            height: 80,
            content: 'Ultra Page Builder',
            styles: {
              fontSize: '56px',
              fontWeight: '800',
              color: '#ffffff',
              textAlign: 'center',
              lineHeight: '1.2',
            },
            children: [],
          },
          {
            id: 'hero-text',
            type: 'text',
            x: 520,
            y: 300,
            width: 400,
            height: 60,
            content: 'Tạo landing page chuyên nghiệp chỉ với drag & drop',
            styles: {
              fontSize: '20px',
              color: 'rgba(255, 255, 255, 0.9)',
              textAlign: 'center',
              lineHeight: '1.6',
            },
            children: [],
          },
          {
            id: 'hero-button',
            type: 'button',
            x: 620,
            y: 400,
            width: 200,
            height: 56,
            content: 'Bắt đầu ngay',
            styles: {
              background: '#ffffff',
              color: '#667eea',
              fontSize: '18px',
              fontWeight: '600',
              borderRadius: '28px',
              padding: '16px 32px',
              cursor: 'pointer',
              boxShadow: '0 4px 14px rgba(0, 0, 0, 0.2)',
            },
            children: [],
          },
          {
            id: 'features-container',
            type: 'container',
            x: 0,
            y: 600,
            width: 1440,
            height: 300,
            styles: {
              background: '#ffffff',
              display: 'flex',
              justifyContent: 'space-around',
              alignItems: 'center',
              padding: '64px 120px',
            },
            children: [],
          },
        ],
        history: {
          past: [],
          future: [],
        },
      },
    },
  });

  console.log('✅ Landing page created:', landingPage.slug);

  // 3. Page mẫu 2: Pricing Page
  const pricingPage = await prisma.page.upsert({
    where: { slug: 'pricing-demo' },
    update: {},
    create: {
      title: 'Pricing Demo',
      slug: 'pricing-demo',
      content: 'Pricing page với 3 plans',
      published: true,
      authorId: admin.id,
      metaTitle: 'Pricing Demo - Ultra Builder',
      metaDescription: 'Demo pricing page với 3 pricing cards',
      blocks: {
        canvas: {
          width: 1440,
          height: 800,
          zoom: 1,
          snapToGrid: true,
          gridSize: 8,
          showGrid: false,
          magneticAlignment: true,
          selectedIds: [],
        },
        elements: [
          {
            id: 'pricing-header',
            type: 'heading',
            x: 520,
            y: 80,
            width: 400,
            height: 60,
            content: 'Chọn gói phù hợp với bạn',
            styles: {
              fontSize: '48px',
              fontWeight: '700',
              color: '#1a202c',
              textAlign: 'center',
            },
            children: [],
          },
          {
            id: 'pricing-card-1',
            type: 'container',
            x: 120,
            y: 200,
            width: 360,
            height: 480,
            styles: {
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            },
            children: [],
          },
          {
            id: 'pricing-card-2',
            type: 'container',
            x: 540,
            y: 200,
            width: 360,
            height: 480,
            styles: {
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '16px',
              boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
              border: '2px solid #667eea',
            },
            children: [],
          },
          {
            id: 'pricing-card-3',
            type: 'container',
            x: 960,
            y: 200,
            width: 360,
            height: 480,
            styles: {
              background: '#ffffff',
              borderRadius: '16px',
              boxShadow: '0 4px 24px rgba(0, 0, 0, 0.1)',
              padding: '40px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            },
            children: [],
          },
        ],
        history: {
          past: [],
          future: [],
        },
      },
    },
  });

  console.log('✅ Pricing page created:', pricingPage.slug);

  // 4. Page mẫu 3: Contact Page
  const contactPage = await prisma.page.upsert({
    where: { slug: 'contact-demo' },
    update: {},
    create: {
      title: 'Contact Demo',
      slug: 'contact-demo',
      content: 'Contact page với form',
      published: true,
      authorId: admin.id,
      metaTitle: 'Contact Demo - Ultra Builder',
      metaDescription: 'Demo contact page với form và thông tin liên hệ',
      blocks: {
        canvas: {
          width: 1440,
          height: 900,
          zoom: 1,
          snapToGrid: true,
          gridSize: 12,
          showGrid: false,
          magneticAlignment: true,
          selectedIds: [],
        },
        elements: [
          {
            id: 'contact-container',
            type: 'container',
            x: 0,
            y: 0,
            width: 1440,
            height: 900,
            styles: {
              background: '#f7fafc',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              padding: '80px',
            },
            children: [],
          },
          {
            id: 'contact-card',
            type: 'container',
            x: 420,
            y: 200,
            width: 600,
            height: 500,
            styles: {
              background: '#ffffff',
              borderRadius: '24px',
              boxShadow: '0 20px 60px rgba(0, 0, 0, 0.1)',
              padding: '48px',
              display: 'flex',
              flexDirection: 'column',
              gap: '32px',
            },
            children: [],
          },
          {
            id: 'contact-heading',
            type: 'heading',
            x: 520,
            y: 240,
            width: 400,
            height: 50,
            content: 'Liên hệ với chúng tôi',
            styles: {
              fontSize: '36px',
              fontWeight: '700',
              color: '#1a202c',
              textAlign: 'center',
            },
            children: [],
          },
          {
            id: 'contact-text',
            type: 'text',
            x: 470,
            y: 310,
            width: 500,
            height: 40,
            content: 'Gửi tin nhắn cho chúng tôi, chúng tôi sẽ phản hồi trong 24h',
            styles: {
              fontSize: '16px',
              color: '#718096',
              textAlign: 'center',
              lineHeight: '1.6',
            },
            children: [],
          },
          {
            id: 'contact-button',
            type: 'button',
            x: 620,
            y: 600,
            width: 200,
            height: 48,
            content: 'Gửi tin nhắn',
            styles: {
              background: '#667eea',
              color: '#ffffff',
              fontSize: '16px',
              fontWeight: '600',
              borderRadius: '12px',
              padding: '12px 24px',
              cursor: 'pointer',
            },
            children: [],
          },
        ],
        history: {
          past: [],
          future: [],
        },
      },
    },
  });

  console.log('✅ Contact page created:', contactPage.slug);

  console.log('\n🎉 Seeding completed successfully!');
  console.log('\n📄 Created pages:');
  console.log(`   - /pages/${landingPage.slug}`);
  console.log(`   - /pages/${pricingPage.slug}`);
  console.log(`   - /pages/${contactPage.slug}`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Error seeding data:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
