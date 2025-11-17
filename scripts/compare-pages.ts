import { getPrismaClient } from '../lib/database';

async function comparePages() {
  const prisma = getPrismaClient('innerbright.vn');

  // Homepage (Trang Chủ)
  const homepage = await prisma.page.findUnique({
    where: { id: 'dfcd1f81-f5bd-44a9-b4ea-45556a4f811a' },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      blocks: true,
      blocksV2: true,
    },
  });

  // Về InnerBright page
  const aboutPage = await prisma.page.findUnique({
    where: { id: '4a83da73-fdf0-467a-be5e-8906ee05c18c' },
    select: {
      id: true,
      title: true,
      slug: true,
      published: true,
      blocks: true,
      blocksV2: true,
    },
  });

  console.log('\n📄 HOMEPAGE (Trang Chủ):');
  console.log('  ID:', homepage?.id);
  console.log('  Title:', homepage?.title);
  console.log('  Slug:', homepage?.slug);
  console.log('  Has blocks (V1):', !!homepage?.blocks);
  console.log('  Has blocksV2:', !!homepage?.blocksV2);
  
  if (homepage?.blocksV2) {
    const v2Data = homepage.blocksV2 as any;
    console.log('  V2 Format:', {
      version: v2Data.version,
      blocksCount: v2Data.blocks?.length || 0,
      blockTypes: v2Data.blocks?.map((b: any) => b.type) || [],
    });
    console.log('\n  V2 Blocks Detail:');
    v2Data.blocks?.forEach((block: any, idx: number) => {
      console.log(`    ${idx + 1}. ${block.type}:`, {
        id: block.id,
        hasContent: !!block.content,
        contentKeys: block.content ? Object.keys(block.content) : [],
      });
    });
  }

  console.log('\n📄 VỀ INNERBRIGHT:');
  console.log('  ID:', aboutPage?.id);
  console.log('  Title:', aboutPage?.title);
  console.log('  Slug:', aboutPage?.slug);
  console.log('  Has blocks (V1):', !!aboutPage?.blocks);
  console.log('  Has blocksV2:', !!aboutPage?.blocksV2);
  
  if (aboutPage?.blocksV2) {
    const v2Data = aboutPage.blocksV2 as any;
    console.log('  V2 Format:', {
      version: v2Data.version,
      blocksCount: v2Data.blocks?.length || 0,
      blockTypes: v2Data.blocks?.map((b: any) => b.type) || [],
    });
    console.log('\n  V2 Blocks Detail:');
    v2Data.blocks?.forEach((block: any, idx: number) => {
      console.log(`    ${idx + 1}. ${block.type}:`, {
        id: block.id,
        hasContent: !!block.content,
        contentKeys: block.content ? Object.keys(block.content) : [],
      });
    });
  }

  if (aboutPage?.blocks) {
    console.log('\n  Page Builder Blocks:', aboutPage.blocks);
  }

  await prisma.$disconnect();
}

comparePages().catch(console.error);
