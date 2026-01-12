import { getPrismaClient } from '../lib/database';

async function updateVisionInfographic() {
  const prisma = getPrismaClient('innerbright.vn');
  const pageId = '4a83da73-fdf0-467a-be5e-8906ee05c18c';

  // Main container block cho toàn bộ infographic với connector lines
  const visionBlock = {
    id: `block-${Date.now()}-vision-v2`,
    name: 'Vision Infographic Enhanced',
    type: 'container',
    hidden: false,
    locked: false,
    styles: {
      container: 'w-full py-12 md:py-20 bg-gradient-to-br from-gray-50 to-blue-50/30',
      element: 'container mx-auto px-4 sm:px-6 lg:px-8',
    },
    content: {
      layout: 'flex',
      direction: 'column',
      gap: 8,
    },
    children: [
      // Title section
      {
        id: `block-${Date.now()}-title`,
        name: 'Main Title',
        type: 'text',
        styles: {
          element: 'text-center mb-8 md:mb-16',
        },
        content: {
          tag: 'div',
          text: `
            <div class="space-y-2">
              <h2 class="text-3xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                <span class="text-orange-400">MẠNG TRONG MÌNH</span>
              </h2>
              <h2 class="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight">
                <span class="text-blue-600">KHÁT VỌNG</span>
              </h2>
            </div>
          `,
        },
      },
      // Content grid container with relative positioning for connector lines
      {
        id: `block-${Date.now()}-content-wrapper`,
        name: 'Content Wrapper',
        type: 'container',
        styles: {
          container: 'relative max-w-7xl mx-auto',
        },
        content: {},
        children: [
          // Grid layout
          {
            id: `block-${Date.now()}-content-grid`,
            name: 'Content Grid',
            type: 'container',
            styles: {
              container: 'grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 md:gap-12 lg:gap-16 items-center',
            },
            content: {},
            children: [
              // Left column - Sứ mệnh & Tầm nhìn
              {
                id: `block-${Date.now()}-left-col`,
                name: 'Left Column',
                type: 'container',
                styles: {
                  container: 'space-y-8 md:space-y-12 lg:space-y-16 text-left lg:text-right',
                },
                content: {},
                children: [
                  // Sứ mệnh
                  {
                    id: `block-${Date.now()}-mission`,
                    name: 'Mission Block',
                    type: 'container',
                    styles: {
                      container: 'space-y-3 md:space-y-4',
                    },
                    content: {},
                    children: [
                      {
                        id: `block-${Date.now()}-mission-title`,
                        type: 'text',
                        styles: {
                          element: 'inline-block border-b-4 border-blue-500 pb-2 mb-4',
                        },
                        content: {
                          tag: 'h3',
                          text: '<span class="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-400">SỨ MỆNH</span>',
                        },
                      },
                      {
                        id: `block-${Date.now()}-mission-text`,
                        type: 'text',
                        styles: {
                          element: 'text-gray-700 text-base md:text-lg leading-relaxed max-w-md lg:ml-auto',
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
                      container: 'space-y-3 md:space-y-4',
                    },
                    content: {},
                    children: [
                      {
                        id: `block-${Date.now()}-vision-title`,
                        type: 'text',
                        styles: {
                          element: 'inline-block border-b-4 border-blue-500 pb-2 mb-4',
                        },
                        content: {
                          tag: 'h3',
                          text: '<span class="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-400">TẦM NHÌN</span>',
                        },
                      },
                      {
                        id: `block-${Date.now()}-vision-text`,
                        type: 'text',
                        styles: {
                          element: 'text-gray-700 text-base md:text-lg leading-relaxed max-w-md lg:ml-auto',
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
              // Center column - Target image with gradient background
              {
                id: `block-${Date.now()}-center-col`,
                name: 'Center Image Container',
                type: 'container',
                styles: {
                  container: 'flex items-center justify-center p-8 lg:p-12',
                },
                content: {},
                children: [
                  {
                    id: `block-${Date.now()}-target-image`,
                    type: 'container',
                    styles: {
                      container: 'relative',
                    },
                    content: {},
                    children: [
                      // SVG Target with gradient circles
                      {
                        id: `block-${Date.now()}-svg-target`,
                        type: 'text',
                        styles: {
                          element: 'w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96',
                        },
                        content: {
                          tag: 'div',
                          text: `
                            <svg viewBox="0 0 400 400" class="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                              <!-- Outer circle (light blue) -->
                              <circle cx="200" cy="200" r="190" fill="#60A5FA" opacity="0.8"/>
                              <!-- Second circle (medium blue) -->
                              <circle cx="200" cy="200" r="150" fill="#3B82F6" opacity="0.85"/>
                              <!-- Third circle (darker blue) -->
                              <circle cx="200" cy="200" r="110" fill="#2563EB" opacity="0.9"/>
                              <!-- Fourth circle (deep blue) -->
                              <circle cx="200" cy="200" r="70" fill="#1E40AF" opacity="0.95"/>
                              <!-- Center circle (indigo) -->
                              <circle cx="200" cy="200" r="30" fill="#4F46E5"/>
                              <!-- White rings -->
                              <circle cx="200" cy="200" r="190" fill="none" stroke="white" stroke-width="3"/>
                              <circle cx="200" cy="200" r="150" fill="none" stroke="white" stroke-width="3"/>
                              <circle cx="200" cy="200" r="110" fill="none" stroke="white" stroke-width="3"/>
                              <circle cx="200" cy="200" r="70" fill="none" stroke="white" stroke-width="3"/>
                              <!-- Arrow hitting center -->
                              <g transform="translate(320, 80) rotate(45)">
                                <line x1="0" y1="0" x2="150" y2="0" stroke="#4F46E5" stroke-width="8"/>
                                <polygon points="150,-10 170,0 150,10" fill="#4F46E5"/>
                                <!-- Arrow fletching -->
                                <line x1="10" y1="-8" x2="25" y2="-15" stroke="#4F46E5" stroke-width="4"/>
                                <line x1="10" y1="8" x2="25" y2="15" stroke="#4F46E5" stroke-width="4"/>
                              </g>
                            </svg>
                          `,
                        },
                      },
                    ],
                  },
                ],
              },
              // Right column - Giá trị cốt lõi
              {
                id: `block-${Date.now()}-right-col`,
                name: 'Right Column',
                type: 'container',
                styles: {
                  container: 'space-y-3 md:space-y-4 text-left',
                },
                content: {},
                children: [
                  {
                    id: `block-${Date.now()}-values-title`,
                    type: 'text',
                    styles: {
                      element: 'inline-block border-b-4 border-blue-500 pb-2 mb-4',
                    },
                    content: {
                      tag: 'h3',
                      text: '<span class="text-2xl md:text-3xl lg:text-4xl font-bold text-orange-400">GIÁ TRỊ CỐT LÕI</span>',
                    },
                  },
                  {
                    id: `block-${Date.now()}-values-list`,
                    type: 'text',
                    styles: {
                      element: 'text-gray-700 text-base md:text-lg leading-relaxed space-y-2 max-w-md',
                    },
                    content: {
                      tag: 'div',
                      text: `
                        <ul class="space-y-3 list-none">
                          <li class="flex items-start gap-3">
                            <span class="text-blue-600 font-bold text-xl">•</span>
                            <span>Hệ thống</span>
                          </li>
                          <li class="flex items-start gap-3">
                            <span class="text-blue-600 font-bold text-xl">•</span>
                            <span>Hợp nhất</span>
                          </li>
                          <li class="flex items-start gap-3">
                            <span class="text-blue-600 font-bold text-xl">•</span>
                            <span>Từ tế</span>
                          </li>
                        </ul>
                      `,
                    },
                  },
                ],
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

  // Remove old vision block
  const filteredBlocks = blocks.filter((b: any) => 
    !b.name?.includes('Vision Infographic') && 
    b.type !== 'container' || 
    b.name?.includes('carousel')
  );

  // Add new enhanced vision block after carousel
  const carouselIndex = filteredBlocks.findIndex((b: any) => b.type === 'carousel');
  const insertIndex = carouselIndex >= 0 ? carouselIndex + 1 : filteredBlocks.length;

  const newBlocks = [
    ...filteredBlocks.slice(0, insertIndex),
    visionBlock,
    ...filteredBlocks.slice(insertIndex),
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

  console.log('✅ Vision infographic updated successfully!');
  console.log(`   Total blocks: ${newBlocks.length}`);
  console.log(`   Block types: ${newBlocks.map((b: any) => b.type).join(', ')}`);

  await prisma.$disconnect();
}

updateVisionInfographic().catch(console.error);
