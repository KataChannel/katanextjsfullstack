/**
 * Script: Clear all V1 blocks data after migrating to V2
 * Run: bun run scripts/clear-v1-blocks.ts
 * 
 * This script removes V1 blocks field from pages that have been migrated to V2
 */

import { getPrismaClient } from '../lib/database';
import { Prisma } from '@prisma/client';

async function clearV1Blocks() {
  const prisma = getPrismaClient('innerbright.vn');
  
  try {
    console.log('\n🧹 Clearing V1 Blocks Data\n');
    console.log('='.repeat(60));

    // Find all pages with BOTH V1 and V2 blocks
    const pages = await prisma.page.findMany({
      where: {
        AND: [
          { blocks: { not: Prisma.JsonNull } },
          { blocksV2: { not: Prisma.JsonNull } },
        ]
      },
      select: {
        id: true,
        title: true,
        slug: true,
        blocks: true,
        blocksV2: true,
      }
    });

    console.log(`\nFound ${pages.length} pages with both V1 and V2 blocks\n`);

    if (pages.length === 0) {
      console.log('✅ No pages need cleaning. All good!\n');
      return;
    }

    console.log('Pages to clean:');
    pages.forEach((page, index) => {
      console.log(`${index + 1}. ${page.title} (${page.slug})`);
    });

    console.log('\n⚠️  This will remove V1 blocks field from these pages.');
    console.log('    V2 blocks will be kept intact.\n');

    // Auto-proceed (remove prompt for automated execution)
    console.log('Proceeding with cleanup...\n');

    let successCount = 0;
    let errorCount = 0;

    for (const page of pages) {
      try {
        await prisma.page.update({
          where: { id: page.id },
          data: {
            blocks: Prisma.JsonNull, // Clear V1 blocks
          }
        });

        console.log(`✅ Cleared: ${page.title}`);
        successCount++;
      } catch (error) {
        console.error(`❌ Error clearing ${page.title}:`, error);
        errorCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('\n📊 SUMMARY:\n');
    console.log(`  ✅ Successfully cleared: ${successCount} pages`);
    console.log(`  ❌ Errors: ${errorCount} pages`);
    console.log(`  📄 Total processed: ${pages.length} pages\n`);

    if (successCount > 0) {
      console.log('✨ V1 blocks data has been removed!');
      console.log('   All pages now use V2 blocks format only.\n');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

clearV1Blocks();
