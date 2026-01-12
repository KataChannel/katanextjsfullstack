import { getPrismaClient } from '../lib/database';

async function addCarousel() {
  const prisma = getPrismaClient('innerbright.vn');

  const pageId = '4a83da73-fdf0-467a-be5e-8906ee05c18c';

  // Carousel data based on the image
  const carouselBlock = {
    id: `block-${Date.now()}-carousel`,
    name: 'carousel block',
    type: 'carousel',
    hidden: false,
    locked: false,
    styles: {
      element: 'w-full relative overflow-hidden',
    },
    content: {
      autoplay: true,
      interval: 5000,
      slides: [
        {
          id: 'slide-1',
          image: 'https://images.unsplash.com/photo-1552664730-d307ca884978?w=1200&h=600&fit=crop',
          title: 'CÂU CHUYỆN',
          subtitle: 'Về INNERBRIGHT',
          description: 'InnerBright Training & Coaching được thành lập từ năm 2020',
          badge: 'Bởi nhà đào tạo',
          badgeHighlight: 'CHLOE QUÝ CHÂU',
        },
        {
          id: 'slide-2',
          image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=1200&h=600&fit=crop',
          title: 'TRAINING',
          subtitle: 'Professional Coaching',
          description: 'Đào tạo chuyên nghiệp với phương pháp hiện đại',
          badge: 'Chuyên gia hàng đầu',
          badgeHighlight: 'NLP MASTER',
        },
        {
          id: 'slide-3',
          image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=1200&h=600&fit=crop',
          title: 'COACHING',
          subtitle: 'Personal Development',
          description: 'Phát triển bản thân toàn diện',
          badge: 'Huấn luyện viên',
          badgeHighlight: 'CHỨNG NHẬN QUỐC TẾ',
        },
      ],
    },
  };

  // Get current page data
  const currentPage = await prisma.page.findUnique({
    where: { id: pageId },
    select: { blocksV2: true },
  });

  if (!currentPage) {
    console.error('❌ Page not found');
    await prisma.$disconnect();
    return;
  }

  // Parse current blocks
  const currentBlocks = currentPage.blocksV2 as any;
  const blocks = currentBlocks?.blocks || [];

  // Add carousel at the beginning
  const newBlocks = [carouselBlock, ...blocks];

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

  console.log('✅ Carousel added successfully!');
  console.log(`   Total blocks: ${newBlocks.length}`);
  console.log(`   Block types: ${newBlocks.map((b: any) => b.type).join(', ')}`);

  await prisma.$disconnect();
}

addCarousel().catch(console.error);
