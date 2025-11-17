import { getPrismaClient } from '../lib/database';

async function checkButtonBlocks() {
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

  console.log('\n📄 HOMEPAGE - Button Block:');
  if (homepage?.blocksV2) {
    const v2Data = homepage.blocksV2 as any;
    const buttonBlock = v2Data.blocks?.find((b: any) => b.type === 'button');
    console.log(JSON.stringify(buttonBlock, null, 2));
  }

  console.log('\n📄 VỀ INNERBRIGHT - Button Block:');
  if (aboutPage?.blocksV2) {
    const v2Data = aboutPage.blocksV2 as any;
    const buttonBlock = v2Data.blocks?.find((b: any) => b.type === 'button');
    console.log(JSON.stringify(buttonBlock, null, 2));
  }

  await prisma.$disconnect();
}

checkButtonBlocks().catch(console.error);
