import { getPrismaClient } from '../lib/database';

async function cleanupCarousels() {
  const prisma = getPrismaClient('innerbright.vn');
  const pageId = '4a83da73-fdf0-467a-be5e-8906ee05c18c';

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

  console.log(`📦 Total blocks: ${blocks.length}`);
  console.log(`   Types: ${blocks.map((b: any) => b.type).join(', ')}`);

  // Remove duplicate carousel blocks, keep only the first one
  const carouselIndices: number[] = [];
  blocks.forEach((block: any, index: number) => {
    if (block.type === 'carousel') {
      carouselIndices.push(index);
    }
  });

  if (carouselIndices.length > 1) {
    console.log(`\n🔍 Found ${carouselIndices.length} carousel blocks`);
    
    // Keep only the first carousel, remove others
    const newBlocks = blocks.filter((block: any, index: number) => {
      if (block.type === 'carousel' && index !== carouselIndices[0]) {
        return false;
      }
      return true;
    });

    // Update page with cleaned blocks
    await prisma.page.update({
      where: { id: pageId },
      data: {
        blocksV2: {
          version: 2,
          blocks: newBlocks,
        },
      },
    });

    console.log(`✅ Removed ${carouselIndices.length - 1} duplicate carousel blocks`);
    console.log(`📦 New total blocks: ${newBlocks.length}`);
    console.log(`   Types: ${newBlocks.map((b: any) => b.type).join(', ')}`);
  } else {
    console.log('✅ No duplicate carousel blocks found');
  }

  await prisma.$disconnect();
}

cleanupCarousels().catch(console.error);
