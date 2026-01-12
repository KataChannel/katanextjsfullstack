import { getPrismaClient } from '../lib/database';

async function checkImageBlocks() {
  const prisma = getPrismaClient('innerbright.vn');

  // Homepage (Trang Chủ)
  const homepage = await prisma.page.findUnique({
    where: { id: 'dfcd1f81-f5bd-44a9-b4ea-45556a4f811a' },
    select: { blocksV2: true },
  });

  // Về InnerBright page
  const aboutPage = await prisma.page.findUnique({
    where: { id: '4a83da73-fdf0-467a-be5e-8906ee05c18c' },
    select: { blocksV2: true },
  });

  console.log('\n📄 HOMEPAGE - Image Block:');
  if (homepage?.blocksV2) {
    const v2Data = homepage.blocksV2 as any;
    const imageBlock = v2Data.blocks?.find((b: any) => b.type === 'image');
    console.log(JSON.stringify(imageBlock, null, 2));
  }

  console.log('\n📄 VỀ INNERBRIGHT - Image Block:');
  if (aboutPage?.blocksV2) {
    const v2Data = aboutPage.blocksV2 as any;
    const imageBlock = v2Data.blocks?.find((b: any) => b.type === 'image');
    console.log(JSON.stringify(imageBlock, null, 2));
  }

  await prisma.$disconnect();
}

checkImageBlocks().catch(console.error);
