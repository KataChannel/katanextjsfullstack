/**
 * Script: Check specific page by ID
 * Run: bun run scripts/check-page-by-id.ts
 */

import { getPrismaClient } from '../lib/database';

async function checkPageById() {
  const domain = 'innerbright.vn';
  const pageId = 'dfcd1f81-f5bd-44a9-b4ea-45556a4f811a';
  
  console.log('\n==================================================');
  console.log(`  Checking Page: ${pageId}`);
  console.log('==================================================\n');

  try {
    const prisma = getPrismaClient(domain);
    
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        blocks: true,
        blocksV2: true,
        createdAt: true,
        updatedAt: true,
      }
    });

    if (!page) {
      console.log('❌ Page not found!');
      return;
    }

    console.log('✅ Page found:');
    console.log(`  - ID: ${page.id}`);
    console.log(`  - Title: ${page.title}`);
    console.log(`  - Slug: /${page.slug}`);
    console.log(`  - Published: ${page.published}`);
    console.log(`  - Has blocks (V1): ${!!page.blocks}`);
    console.log(`  - Has blocksV2: ${!!page.blocksV2}`);
    
    if (page.blocksV2) {
      try {
        const parsed = typeof page.blocksV2 === 'string' ? JSON.parse(page.blocksV2) : page.blocksV2;
        const blocksArray = (parsed as any)?.blocks;
        console.log(`  - V2 blocks count: ${blocksArray?.length || 0}`);
        if (blocksArray && blocksArray.length > 0) {
          console.log(`  - V2 block types: ${blocksArray.map((b: any) => b.type).join(', ')}`);
        }
      } catch (e) {
        console.log('  - V2 blocks: (parse error)');
      }
    }
    
    console.log('\n==================================================\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

checkPageById();
