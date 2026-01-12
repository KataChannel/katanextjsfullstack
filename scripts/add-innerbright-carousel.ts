#!/usr/bin/env bun
/**
 * Add InnerBright Carousel to page builder
 * Adds carousel with 3 slides matching the image design
 */

import { PrismaClient } from '@prisma/client';

const pageId = '4a83da73-fdf0-467a-be5e-8906ee05c18c';

async function addCarousel() {
  console.log('🎠 Adding InnerBright Carousel...\n');

  try {
    // Connect to innerbright database
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: 'postgresql://postgres:postgres@116.118.49.243:13003/innerv2core'
        }
      }
    });

    // Fetch current page
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: {
        id: true,
        title: true,
        blocks: true,
      }
    });

    if (!page) {
      console.error('❌ Page not found');
      await prisma.$disconnect();
      return;
    }

    console.log(`✅ Found page: ${page.title}`);

    const blocks = page.blocks as any;
    const currentElements = blocks?.elements || {};

    // Create carousel element
    const carouselId = `carousel-${Date.now()}`;
    const carouselElement = {
      id: carouselId,
      type: 'carousel',
      name: 'InnerBright Carousel',
      x: 0,
      y: 0,
      width: 1200,
      height: 500,
      layout: {},
      style: {
        borderRadius: 0,
      },
      states: {
        default: {},
      },
      animation: {
        type: 'none',
      },
      carousel: {
        slides: [
          {
            id: 'slide-1',
            image: '/images/innerbright/slide-1.jpg',
            title: 'CÂU CHUYỆN về INNERBRIGHT',
            description: 'InnerBright Training & Coaching được thành lập từ năm 2020',
            alt: 'InnerBright Slide 1',
          },
          {
            id: 'slide-2',
            image: '/images/innerbright/slide-2.jpg',
            title: 'CHƯƠNG TRÌNH ĐÀO TẠO',
            description: 'Phát triển bản thân và kỹ năng lãnh đạo',
            alt: 'InnerBright Slide 2',
          },
          {
            id: 'slide-3',
            image: '/images/innerbright/slide-3.jpg',
            title: 'CHLOE QUÝ CHÂU',
            description: 'Bồi nhà đào tạo',
            alt: 'Chloe Quý Châu',
          },
        ],
        autoPlay: true,
        interval: 5000,
        showDots: true,
        showArrows: true,
        height: 500,
      },
    };

    // Update blocks
    const updatedBlocks = {
      ...blocks,
      elements: {
        ...currentElements,
        [carouselId]: carouselElement,
      },
      canvas: {
        ...blocks.canvas,
        elements: {
          ...(blocks.canvas?.elements || {}),
          [carouselId]: carouselElement,
        },
      },
    };

    // Save to database
    await prisma.page.update({
      where: { id: pageId },
      data: {
        blocks: updatedBlocks,
      },
    });

    console.log('\n✅ Carousel added successfully!');
    console.log(`   Carousel ID: ${carouselId}`);
    console.log(`   Slides: ${carouselElement.carousel.slides.length}`);
    console.log(`   Total elements: ${Object.keys(updatedBlocks.elements).length}`);

    await prisma.$disconnect();

  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

addCarousel()
  .then(() => {
    console.log('\n✨ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Failed:', error);
    process.exit(1);
  });
