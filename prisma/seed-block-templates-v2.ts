import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding block templates v2...');

  // Lấy admin user
  const adminUser = await prisma.user.findUnique({
    where: { email: 'katachanneloffical@gmail.com' },
  });

  if (!adminUser) {
    console.error('❌ Admin user not found.');
    return;
  }

  // Xóa templates cũ nếu có
  await prisma.blockTemplate.deleteMany({});

  // Template: "Mạng trong mình Khát vọng"
  const visionTemplate = await prisma.blockTemplate.create({
    data: {
      name: 'Mạng Trong Mình Khát Vọng',
      description: 'Template 3 cột: Sứ mệnh, Tầm nhìn, Giải trí cốt lõi',
      category: 'hero',
      published: true,
      authorId: adminUser.id,
      elements: [
        // Tiêu đề trên "MẠNG TRONG MÌNH"
        {
          id: 'heading-top',
          type: 'heading',
          name: 'Heading Top',
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
            default: { color: '#fb923c' },
          },
          animation: {
            type: 'fade',
            duration: 0.5,
            trigger: 'scroll',
          },
        },
        // Tiêu đề chính "KHÁT VỌNG"
        {
          id: 'heading-main',
          type: 'heading',
          name: 'Heading Main',
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
            default: { color: '#2563eb' },
          },
          animation: {
            type: 'fade',
            duration: 0.5,
            trigger: 'scroll',
          },
        },
        // Container cho cột trái
        {
          id: 'container-left',
          type: 'container',
          name: 'Container Left',
          x: 50,
          y: 220,
          width: 320,
          height: 350,
          layout: {
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
          },
          style: {
            backgroundColor: 'transparent',
          },
          states: {
            default: {},
          },
          animation: {
            type: 'none',
          },
        },
        // SỨ MỆNH - Heading
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
            default: { color: '#fb923c' },
          },
          animation: {
            type: 'fade',
            duration: 0.5,
            trigger: 'scroll',
          },
        },
        // SỨ MỆNH - Text
        {
          id: 'text-mission',
          type: 'text',
          name: 'Text Mission',
          x: 50,
          y: 290,
          width: 320,
          height: 150,
          content: 'Tạo dựng cuộc sống thịnh vượng hơn cho người Việt Nam bằng việc khai phóng tiềm năng và giúp phát huy tối đa nội lực của mỗi cá nhân.',
          layout: {},
          style: {
            fontSize: 15,
            fontWeight: 400,
            color: '#374151',
            lineHeight: 1.8,
          },
          states: {
            default: { color: '#374151' },
          },
          animation: {
            type: 'fade',
            duration: 0.5,
            trigger: 'scroll',
          },
        },
        // TẦM NHÌN - Container giữa
        {
          id: 'container-center',
          type: 'container',
          name: 'Container Center',
          x: 440,
          y: 220,
          width: 320,
          height: 350,
          layout: {
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: 0,
          },
          style: {
            backgroundColor: 'transparent',
          },
          states: {
            default: {},
          },
          animation: {
            type: 'none',
          },
        },
        // TẦM NHÌN - Heading
        {
          id: 'heading-vision',
          type: 'heading',
          name: 'Heading Vision',
          x: 440,
          y: 220,
          width: 320,
          height: 50,
          content: 'TẦM NHÌN',
          layout: {},
          style: {
            fontSize: 28,
            fontWeight: 700,
            color: '#fb923c',
            textAlign: 'center',
            borderBottom: '3px solid #fb923c',
            paddingBottom: 8,
          },
          states: {
            default: { color: '#fb923c' },
          },
          animation: {
            type: 'fade',
            duration: 0.5,
            trigger: 'scroll',
          },
        },
        // TẦM NHÌN - Text
        {
          id: 'text-vision',
          type: 'text',
          name: 'Text Vision',
          x: 440,
          y: 290,
          width: 320,
          height: 150,
          content: 'Trang bị cho mỗi người Việt Nam đủ sở hữu tư duy phát triển bản thân đúng đắn, hiểu quả và bền vững.',
          layout: {},
          style: {
            fontSize: 15,
            fontWeight: 400,
            color: '#374151',
            lineHeight: 1.8,
            textAlign: 'center',
          },
          states: {
            default: { color: '#374151' },
          },
          animation: {
            type: 'fade',
            duration: 0.5,
            trigger: 'scroll',
          },
        },
        // GIẢI TRÍ CỐT LÕI - Container phải
        {
          id: 'container-right',
          type: 'container',
          name: 'Container Right',
          x: 830,
          y: 220,
          width: 320,
          height: 350,
          layout: {
            display: 'flex',
            flexDirection: 'column',
            padding: 0,
          },
          style: {
            backgroundColor: 'transparent',
          },
          states: {
            default: {},
          },
          animation: {
            type: 'none',
          },
        },
        // GIẢI TRÍ CỐT LÕI - Heading
        {
          id: 'heading-values',
          type: 'heading',
          name: 'Heading Values',
          x: 830,
          y: 220,
          width: 320,
          height: 50,
          content: 'GIẢI TRÍ CỐT LÕI',
          layout: {},
          style: {
            fontSize: 28,
            fontWeight: 700,
            color: '#fb923c',
            borderBottom: '3px solid #fb923c',
            paddingBottom: 8,
          },
          states: {
            default: { color: '#fb923c' },
          },
          animation: {
            type: 'fade',
            duration: 0.5,
            trigger: 'scroll',
          },
        },
        // GIẢI TRÍ CỐT LÕI - Bullet 1
        {
          id: 'text-value-1',
          type: 'text',
          name: 'Text Value 1',
          x: 830,
          y: 290,
          width: 320,
          height: 30,
          content: '• Hệ thống',
          layout: {},
          style: {
            fontSize: 16,
            fontWeight: 400,
            color: '#374151',
            lineHeight: 1.8,
          },
          states: {
            default: { color: '#374151' },
          },
          animation: {
            type: 'fade',
            duration: 0.5,
            trigger: 'scroll',
          },
        },
        // GIẢI TRÍ CỐT LÕI - Bullet 2
        {
          id: 'text-value-2',
          type: 'text',
          name: 'Text Value 2',
          x: 830,
          y: 330,
          width: 320,
          height: 30,
          content: '• Hợp nhất',
          layout: {},
          style: {
            fontSize: 16,
            fontWeight: 400,
            color: '#374151',
            lineHeight: 1.8,
          },
          states: {
            default: { color: '#374151' },
          },
          animation: {
            type: 'fade',
            duration: 0.5,
            trigger: 'scroll',
          },
        },
        // GIẢI TRÍ CỐT LÕI - Bullet 3
        {
          id: 'text-value-3',
          type: 'text',
          name: 'Text Value 3',
          x: 830,
          y: 370,
          width: 320,
          height: 30,
          content: '• Từ tế',
          layout: {},
          style: {
            fontSize: 16,
            fontWeight: 400,
            color: '#374151',
            lineHeight: 1.8,
          },
          states: {
            default: { color: '#374151' },
          },
          animation: {
            type: 'fade',
            duration: 0.5,
            trigger: 'scroll',
          },
        },
      ],
    },
  });

  console.log('✅ Created template:', visionTemplate.name);

  // Template: Hero Banner Simple
  const heroTemplate = await prisma.blockTemplate.create({
    data: {
      name: 'Hero Banner Đơn Giản',
      description: 'Hero section cơ bản với heading, text và button CTA',
      category: 'hero',
      published: true,
      authorId: adminUser.id,
      elements: [
        {
          id: 'hero-heading',
          type: 'heading',
          name: 'Hero Heading',
          x: 200,
          y: 100,
          width: 800,
          height: 80,
          content: 'Tiêu đề Hero Banner',
          layout: {},
          style: {
            fontSize: 48,
            fontWeight: 700,
            color: '#111827',
            textAlign: 'center',
          },
          states: {
            default: { color: '#111827' },
          },
          animation: {
            type: 'fade',
            duration: 0.5,
            trigger: 'scroll',
          },
        },
        {
          id: 'hero-text',
          type: 'text',
          name: 'Hero Text',
          x: 300,
          y: 200,
          width: 600,
          height: 60,
          content: 'Mô tả ngắn gọn về sản phẩm hoặc dịch vụ của bạn',
          layout: {},
          style: {
            fontSize: 18,
            fontWeight: 400,
            color: '#6b7280',
            textAlign: 'center',
            lineHeight: 1.6,
          },
          states: {
            default: { color: '#6b7280' },
          },
          animation: {
            type: 'fade',
            duration: 0.5,
            trigger: 'scroll',
          },
        },
        {
          id: 'hero-button',
          type: 'button',
          name: 'Hero Button',
          x: 520,
          y: 280,
          width: 160,
          height: 50,
          content: 'Tìm hiểu thêm',
          layout: {
            padding: 12,
          },
          style: {
            backgroundColor: '#2563eb',
            color: '#ffffff',
            fontSize: 16,
            fontWeight: 600,
            borderRadius: 8,
          },
          states: {
            default: {
              backgroundColor: '#2563eb',
            },
            hover: {
              backgroundColor: '#1d4ed8',
            },
            active: {
              backgroundColor: '#1e40af',
            },
          },
          animation: {
            type: 'scale',
            duration: 0.2,
            trigger: 'hover',
          },
        },
      ],
    },
  });

  console.log('✅ Created template:', heroTemplate.name);
  console.log(`✅ Seeding completed! Created ${2} block templates.`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
