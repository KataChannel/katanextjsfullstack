import { getPrismaClient } from '../lib/database';

async function addVisionInfographic() {
  const prisma = getPrismaClient('innerbright.vn');
  const pageId = '4a83da73-fdf0-467a-be5e-8906ee05c18c';

  // Main container block cho toàn bộ infographic
  const visionBlock = {
    id: `block-${Date.now()}-vision`,
    name: 'Vision Infographic',
    type: 'container',
    hidden: false,
    locked: false,
    styles: {
      container: 'w-full py-12 md:py-16 bg-gradient-to-br from-gray-50 to-blue-50',
      element: 'container mx-auto px-4',
    },
    content: {
      layout: 'flex',
      direction: 'column',
      gap: 8,
    },
    children: [
      // Title section
      {
        id: `block-${Date.now()}-title-1`,
        name: 'Main Title',
        type: 'text',
        styles: {
          element: 'text-center mb-8 md:mb-12',
        },
        content: {
          tag: 'div',
          text: '<h2 class="text-3xl md:text-4xl lg:text-5xl font-bold"><span class="text-orange-400">MẠNG TRONG MÌNH</span><br><span class="text-blue-600">KHÁT VỌNG</span></h2>',
        },
      },
      // Content grid container
      {
        id: `block-${Date.now()}-content-grid`,
        name: 'Content Grid',
        type: 'container',
        styles: {
          container: 'grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12 items-center max-w-6xl mx-auto',
        },
        content: {
          layout: 'grid',
          direction: 'row',
          gap: 8,
        },
        children: [
          // Left column - Sứ mệnh & Tầm nhìn
          {
            id: `block-${Date.now()}-left-col`,
            name: 'Left Column',
            type: 'container',
            styles: {
              container: 'space-y-8 lg:space-y-12',
            },
            content: {
              layout: 'flex',
              direction: 'column',
              gap: 8,
            },
            children: [
              // Sứ mệnh
              {
                id: `block-${Date.now()}-mission`,
                name: 'Mission Block',
                type: 'container',
                styles: {
                  container: 'space-y-3',
                },
                content: {
                  layout: 'flex',
                  direction: 'column',
                  gap: 3,
                },
                children: [
                  {
                    id: `block-${Date.now()}-mission-title`,
                    type: 'text',
                    styles: {
                      element: 'border-b-2 border-blue-500 pb-2 mb-3',
                    },
                    content: {
                      tag: 'h3',
                      text: '<span class="text-2xl md:text-3xl font-bold text-orange-400">SỨ MỆNH</span>',
                    },
                  },
                  {
                    id: `block-${Date.now()}-mission-text`,
                    type: 'text',
                    styles: {
                      element: 'text-gray-700 leading-relaxed',
                    },
                    content: {
                      tag: 'p',
                      text: 'Tạo dựng cuộc sống thịnh vượng hơn cho người người Việt Nam bằng việc khai phóng tiềm năng và giúp phát huy tối đa nội lực của mỗi cá nhân.',
                    },
                  },
                ],
              },
              // Tầm nhìn
              {
                id: `block-${Date.now()}-vision`,
                name: 'Vision Block',
                type: 'container',
                styles: {
                  container: 'space-y-3',
                },
                content: {
                  layout: 'flex',
                  direction: 'column',
                  gap: 3,
                },
                children: [
                  {
                    id: `block-${Date.now()}-vision-title`,
                    type: 'text',
                    styles: {
                      element: 'border-b-2 border-blue-500 pb-2 mb-3',
                    },
                    content: {
                      tag: 'h3',
                      text: '<span class="text-2xl md:text-3xl font-bold text-orange-400">TẦM NHÌN</span>',
                    },
                  },
                  {
                    id: `block-${Date.now()}-vision-text`,
                    type: 'text',
                    styles: {
                      element: 'text-gray-700 leading-relaxed',
                    },
                    content: {
                      tag: 'p',
                      text: 'Trang bị cho mỗi người Việt Nam đủ sở hữu tư duy phát triển bản thân đúng đắn, hiệu quả và bền vững.',
                    },
                  },
                ],
              },
            ],
          },
          // Center column - Target image
          {
            id: `block-${Date.now()}-center-col`,
            name: 'Center Image',
            type: 'image',
            styles: {
              element: 'w-full max-w-md mx-auto aspect-square object-contain',
            },
            content: {
              url: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=600&h=600&fit=crop&q=80',
              alt: 'Khát vọng - Target with arrow',
            },
          },
          // Right column - Giá trị cốt lõi
          {
            id: `block-${Date.now()}-right-col`,
            name: 'Right Column',
            type: 'container',
            styles: {
              container: 'space-y-3 lg:pl-8',
            },
            content: {
              layout: 'flex',
              direction: 'column',
              gap: 3,
            },
            children: [
              {
                id: `block-${Date.now()}-values-title`,
                type: 'text',
                styles: {
                  element: 'border-b-2 border-blue-500 pb-2 mb-3',
                },
                content: {
                  tag: 'h3',
                  text: '<span class="text-2xl md:text-3xl font-bold text-orange-400">GIÁ TRỊ CỐT LÕI</span>',
                },
              },
              {
                id: `block-${Date.now()}-values-list`,
                type: 'text',
                styles: {
                  element: 'text-gray-700 leading-relaxed',
                },
                content: {
                  tag: 'ul',
                  text: '<ul class="space-y-2 list-none"><li class="flex items-start gap-2"><span class="text-blue-600 font-bold">•</span><span>Hệ thống</span></li><li class="flex items-start gap-2"><span class="text-blue-600 font-bold">•</span><span>Hợp nhất</span></li><li class="flex items-start gap-2"><span class="text-blue-600 font-bold">•</span><span>Từ tế</span></li></ul>',
                },
              },
            ],
          },
        ],
      },
    ],
  };

  // Get current page data
  const currentPage = await prisma.page.findUnique({
    where: { id: pageId },
    select: { blocksV2: true, slug: true, title: true },
  });

  if (!currentPage) {
    console.error('❌ Page not found');
    await prisma.$disconnect();
    return;
  }

  console.log(`📄 Page: ${currentPage.title} (/${currentPage.slug})`);

  // Parse current blocks
  const currentBlocks = currentPage.blocksV2 as any;
  const blocks = currentBlocks?.blocks || [];

  console.log(`📦 Current blocks: ${blocks.length}`);
  console.log(`   Types: ${blocks.map((b: any) => b.type).join(', ')}`);

  // Add vision infographic after carousel
  const carouselIndex = blocks.findIndex((b: any) => b.type === 'carousel');
  const insertIndex = carouselIndex >= 0 ? carouselIndex + 1 : blocks.length;

  const newBlocks = [
    ...blocks.slice(0, insertIndex),
    visionBlock,
    ...blocks.slice(insertIndex),
  ];

  // Update page with new blocks
  await prisma.page.update({
    where: { id: pageId },
    data: {
      blocksV2: {
        version: 2,
        blocks: newBlocks,
      },
    },
  });

  console.log('✅ Vision infographic added successfully!');
  console.log(`   Total blocks: ${newBlocks.length}`);
  console.log(`   Block types: ${newBlocks.map((b: any) => b.type).join(', ')}`);
  console.log(`   Position: After carousel (index ${insertIndex})`);

  await prisma.$disconnect();
}

addVisionInfographic().catch(console.error);
