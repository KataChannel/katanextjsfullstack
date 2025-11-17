/**
 * Script: Show Pages V2 statistics
 * Run: bun run scripts/show-pages-v2.ts
 */

import { getPrismaClient } from '../lib/database';

async function showPagesV2Stats() {
  const prisma = getPrismaClient('innerbright.vn');
  
  try {
    // Get all pages
    const allPages = await prisma.page.findMany({
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    // Filter pages V2 (same logic as admin page)
    const pagesV2 = allPages.filter(page => {
      if (page.version === 2) return true;
      
      // Check if blocksV2 is a non-empty array
      if (page.blocksV2 !== null && page.blocksV2 !== undefined) {
        try {
          const blocks = Array.isArray(page.blocksV2) ? page.blocksV2 : [];
          return blocks.length > 0;
        } catch {
          return false;
        }
      }
      
      return false;
    });

    const pagesV1 = allPages.filter(page => 
      page.version === 1 && (page.blocksV2 === null || page.blocksV2 === undefined)
    );

    console.log('\n📊 Pages Statistics:\n');
    console.log('  Total Pages:', allPages.length);
    console.log('  Pages V1 (old):', pagesV1.length);
    console.log('  Pages V2 (new):', pagesV2.length);
    console.log('  Published:', allPages.filter(p => p.published).length);
    console.log('  Drafts:', allPages.filter(p => !p.published).length);
    console.log('');

    if (pagesV2.length > 0) {
      console.log('📄 Pages V2 List:\n');
      pagesV2.forEach((page, index) => {
        console.log(`  ${index + 1}. ${page.title}`);
        console.log(`     - Slug: ${page.slug}`);
        console.log(`     - Version: ${page.version}`);
        console.log(`     - Blocks: ${(page.blocksV2 as any[])?.length || 0}`);
        console.log(`     - Status: ${page.published ? '✅ Published' : '📝 Draft'}`);
        console.log(`     - Author: ${page.author.name || page.author.email}`);
        console.log(`     - View: http://localhost:3005/${page.slug}`);
        console.log(`     - Edit: http://localhost:3005/admin/pages-v2/edit/${page.id}`);
        console.log('');
      });
    } else {
      console.log('⚠️  No Pages V2 found.\n');
      console.log('💡 Create one with: bun run scripts/create-page-v2-test.ts\n');
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

showPagesV2Stats();
