import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding block templates...');

  // Lấy admin user
  const adminUser = await prisma.user.findUnique({
    where: { email: 'katachanneloffical@gmail.com' },
  });

  if (!adminUser) {
    console.error('❌ Admin user not found. Please run seed-current-menus.ts first.');
    return;
  }

  // Template: "Mạng trong mình Khát vọng" - 3 sections layout
  const visionTemplate = {
    name: 'Mạng Trong Mình Khát Vọng',
    description: 'Template 3 cột: Sứ mệnh, Tầm nhìn, Giải trí cốt lõi với icon target giữa',
    category: 'hero',
    published: true,
    authorId: adminUser.id,
    elements: [
      // Container chính
      {
        id: 'container-vision',
        type: 'container',
        name: 'Container Vision',
        x: 0,
        y: 0,
        width: 1200,
        height: 600,
        content: '',
        layout: {
          display: 'flex',
          flexDirection: 'column',
          padding: 60,
          gap: 20,
        },
        style: {
          backgroundColor: '#f8f9fa',
        },
        states: {
          default: {
            backgroundColor: '#f8f9fa',
          },
        },
        animation: {
          type: 'none',
        },
      },
      // Tiêu đề chính "MẠNG TRONG MÌNH"
      {
        id: 'heading-vision-top',
        type: 'heading',
        name: 'Heading Vision Top',
        x: 350,
        y: 40,
        width: 500,
        height: 50,
        content: 'MẠNG TRONG MÌNH',
        layout: {},
        style: {
          fontSize: 36,
          fontWeight: 700,
          color: '#fb923c',
          textAlign: 'center',
        },
        states: {
          default: {
            color: '#fb923c',
          },
        },
        animation: {
          type: 'fade',
          duration: 0.5,
          trigger: 'scroll',
        },
      },
      // Tiêu đề chính "KHÁT VỌNG"
      {
        id: 'heading-vision-main',
        type: 'heading',
        name: 'Heading Vision Main',
        x: 300,
        y: 100,
        width: 600,
        height: 80,
        content: 'KHÁT VỌNG',
        layout: {},
        style: {
          fontSize: 64,
          fontWeight: 700,
          color: '#2563eb',
          textAlign: 'center',
        },
        states: {
          default: {
            color: '#2563eb',
          },
        },
        animation: {
          type: 'fade',
          duration: 0.5,
          trigger: 'scroll',
        },
      },
      // CỘT TRÁI - SỨ MỆNH
      {
        id: 'heading-mission',
        type: 'heading',
        name: 'Heading Mission',
        x: 50,
        y: 220,
        width: 320,
        height: 50,
        content: 'SỨ MỆNH',
        layout: {},
        style: {
          fontSize: 28,
          fontWeight: 700,
          color: '#fb923c',
          borderBottom: '3px solid #fb923c',
          paddingBottom: 8,
        },
        states: {
          default: {
            color: '#fb923c',
          },
        },
        animation: {
          type: 'fade',
          duration: 0.5,
          trigger: 'scroll',
        },
      },
      {
        id: 'text-mission',
        type: 'text',
        name: 'Text Mission',
        x: 50,
        y: 290,
        width: 320,
        height: 150,
        content: 'Tạo dựng cuộc sống thịnh vượng hơn cho người người Việt Nam bằng việc khai phóng tiềm năng và giúp phát huy tối đa nội lực của mỗi cá nhân.',
        layout: {},
        style: {
          fontSize: 15,
          fontWeight: 400,
          color: '#374151',
          lineHeight: 1.8,
        },
        states: {
          default: {
            color: '#374151',
          },
        },
        animation: {
          type: 'fade',
          duration: 0.5,
          trigger: 'scroll',
        },
      },
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#fb923c',
          marginBottom: '20px',
          borderBottom: '3px solid #fb923c',
          paddingBottom: '10px',
        },
        props: { level: 2 },
      },
      {
        id: 'text-mission',
        type: 'text',
        content: 'Tạo dựng cuộc sống thịnh vượng hơn cho người Việt Nam bằng việc khai phóng tiềm năng và giúp phát huy tối đa nội lực của mỗi cá nhân.',
        styles: {
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#6b7280',
        },
        props: {},
      },
      // CỘT GIỮA - TẦM NHÌN
      {
        id: 'col-center',
        type: 'container',
        content: '',
        styles: {
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        },
        props: {},
      },
      {
        id: 'heading-vision',
        type: 'heading',
        content: 'TẦM NHÌN',
        styles: {
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#fb923c',
          marginBottom: '20px',
          borderBottom: '3px solid #fb923c',
          paddingBottom: '10px',
        },
        props: { level: 2 },
      },
      {
        id: 'text-vision',
        type: 'text',
        content: 'Trang bị cho mỗi người Việt Nam đủ sở hữu tư duy phát triển bản thân đúng đắn, hiệu quả và bền vững.',
        styles: {
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#6b7280',
          marginBottom: '30px',
        },
        props: {},
      },
      // Icon Target giữa
      {
        id: 'icon-target',
        type: 'image',
        content: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgdmlld0JveD0iMCAwIDIwMCAyMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iOTAiIHN0cm9rZT0iIzI1NjNlYiIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNzAiIHN0cm9rZT0iIzM3ODZmZiIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iNTAiIHN0cm9rZT0iIzYwYTVmYSIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMzAiIHN0cm9rZT0iIzhiYzVmZiIgc3Ryb2tlLXdpZHRoPSI0IiBmaWxsPSJub25lIi8+CjxjaXJjbGUgY3g9IjEwMCIgY3k9IjEwMCIgcj0iMTAiIGZpbGw9IiMyNTYzZWIiLz4KPGxpbmUgeDE9IjEwMCIgeTE9IjAiIHgyPSIxMDAiIHkyPSI1MCIgc3Ryb2tlPSIjZmI5MjNjIiBzdHJva2Utd2lkdGg9IjQiLz4KPHBhdGggZD0iTTEwMCA1MEw5NSA2NUwxMDUgNjVaIiBmaWxsPSIjZmI5MjNjIi8+Cjwvc3ZnPg==',
        styles: {
          width: '200px',
          height: '200px',
          margin: '0 auto',
        },
        props: {
          alt: 'Target Icon - Khát vọng',
        },
      },
      // CỘT PHẢI - GIẢI TRÍ CỐT LÕI
      {
        id: 'col-right',
        type: 'container',
        content: '',
        styles: {
          textAlign: 'right',
        },
        props: {},
      },
      {
        id: 'heading-values',
        type: 'heading',
        content: 'GIẢI TRÍ CỐT LÕI',
        styles: {
          fontSize: '32px',
          fontWeight: 'bold',
          color: '#fb923c',
          marginBottom: '20px',
          borderBottom: '3px solid #fb923c',
          paddingBottom: '10px',
        },
        props: { level: 2 },
      },
      {
        id: 'list-values',
        type: 'text',
        content: '• Hệ thống<br/>• Hợp nhất<br/>• Từ tế',
        styles: {
          fontSize: '18px',
          lineHeight: '2',
          color: '#374151',
          fontWeight: '500',
        },
        props: {},
      },
      // Divider cuối
      {
        id: 'divider-bottom',
        type: 'divider',
        content: '',
        styles: {
          width: '100%',
          height: '4px',
          backgroundColor: '#fb923c',
          marginTop: '40px',
        },
        props: {},
      },
    ],
  };

  // Tạo template
  await prisma.blockTemplate.create({
    data: {
      name: visionTemplate.name,
      description: visionTemplate.description,
      category: visionTemplate.category,
      published: visionTemplate.published,
      authorId: visionTemplate.authorId,
      elements: visionTemplate.elements,
    },
  });

  console.log(`✅ Created template: ${visionTemplate.name}`);

  // Template 2: Hero Banner đơn giản
  const heroTemplate = {
    name: 'Hero Banner Đơn Giản',
    description: 'Hero section với tiêu đề lớn, mô tả và CTA button',
    category: 'hero',
    published: true,
    authorId: adminUser.id,
    elements: [
      {
        id: 'hero-container',
        type: 'container',
        content: '',
        styles: {
          width: '100%',
          padding: '80px 20px',
          backgroundColor: '#1e40af',
          textAlign: 'center',
        },
        props: {},
      },
      {
        id: 'hero-heading',
        type: 'heading',
        content: 'Chào mừng đến với dịch vụ của chúng tôi',
        styles: {
          fontSize: '56px',
          fontWeight: 'bold',
          color: '#ffffff',
          marginBottom: '20px',
        },
        props: { level: 1 },
      },
      {
        id: 'hero-text',
        type: 'text',
        content: 'Giải pháp tốt nhất cho doanh nghiệp của bạn',
        styles: {
          fontSize: '24px',
          color: '#e0e7ff',
          marginBottom: '30px',
        },
        props: {},
      },
      {
        id: 'hero-button',
        type: 'button',
        content: 'Bắt đầu ngay',
        styles: {
          padding: '16px 48px',
          fontSize: '18px',
          backgroundColor: '#fb923c',
          color: '#ffffff',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
          fontWeight: '600',
        },
        props: {},
      },
    ],
  };

  await prisma.blockTemplate.create({
    data: {
      name: heroTemplate.name,
      description: heroTemplate.description,
      category: heroTemplate.category,
      published: heroTemplate.published,
      authorId: heroTemplate.authorId,
      elements: heroTemplate.elements,
    },
  });

  console.log(`✅ Created template: ${heroTemplate.name}`);

  const count = await prisma.blockTemplate.count();
  console.log(`\n✅ Seeding completed! Created ${count} block templates.`);
}

main()
  .catch((e) => {
    console.error('❌ Error seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
