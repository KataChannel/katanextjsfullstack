/**
 * Script: Show ALL pages with detailed info
 * Run: bun run scripts/show-all-pages-detailed.ts
 */

import { getPrismaClient } from '../lib/database';

async function showAllPagesDetailed() {
  const prisma = getPrismaClient('innerbright.vn');
  
  try {
    // Get all pages
    const allPages = await prisma.page.findMany({
      orderBy: {
        updatedAt: 'desc',
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    console.log('\n📊 ALL Pages Detailed Info:\n');
    console.log('  Total Pages:', allPages.length);
    console.log('');

    allPages.forEach((page, index) => {
      console.log(`${index + 1}. ${page.title}`);
      console.log(`   - ID: ${page.id}`);
      console.log(`   - Slug: ${page.slug}`);
      console.log(`   - Version: ${page.version}`);
      console.log(`   - Published: ${page.published ? '✅' : '❌'}`);
      console.log(`   - Author: ${page.author.name || page.author.email}`);
      console.log(`   - Created: ${page.createdAt.toLocaleDateString('vi-VN')}`);
      console.log(`   - Updated: ${page.updatedAt.toLocaleDateString('vi-VN')}`);
      
      // Check blocks
      console.log(`   - blocks (V1): ${page.blocks ? 'YES' : 'NO'}`);
      
      // Check blocksV2 (object with structure: { blocks: [...], version: 2 })
      if (page.blocksV2 !== null && page.blocksV2 !== undefined) {
        try {
          const v2Data = page.blocksV2 as any;
          const blocks = Array.isArray(v2Data.blocks) ? v2Data.blocks : [];
          console.log(`   - blocksV2: Object with ${blocks.length} blocks`);
          if (blocks.length > 0) {
            console.log(`   - Block types: ${blocks.map((b: any) => b.type).join(', ')}`);
          }
        } catch (e) {
          console.log(`   - blocksV2: Invalid format - ${typeof page.blocksV2}`);
        }
      } else {
        console.log(`   - blocksV2: NULL/undefined`);
      }
      
      // Determine which editor should show this (CORRECT LOGIC)
      // blocksV2 is an object like { blocks: [...], version: 2 }, NOT an array
      const hasBlocksV2Field = page.blocksV2 !== null && page.blocksV2 !== undefined && typeof page.blocksV2 === 'object';
      const showInV1 = page.version === 1 && !hasBlocksV2Field;
      const showInV2 = page.version === 2 || hasBlocksV2Field;
      
      console.log(`   - Show in V1: ${showInV1 ? '✅' : '❌'}`);
      console.log(`   - Show in V2: ${showInV2 ? '✅' : '❌'}`);
      console.log('');
    });

    // Summary (CORRECT LOGIC)
    const v1Pages = allPages.filter(p => p.version === 1 && (p.blocksV2 === null || p.blocksV2 === undefined));
    const v2Pages = allPages.filter(p => p.version === 2 || (p.blocksV2 !== null && p.blocksV2 !== undefined && typeof p.blocksV2 === 'object'));
    
    console.log('📈 Summary:');
    console.log(`  Pages V1: ${v1Pages.length}`);
    console.log(`  Pages V2: ${v2Pages.length}`);
    console.log(`  Total: ${allPages.length}`);
    console.log('');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showAllPagesDetailed();
