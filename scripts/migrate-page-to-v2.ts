/**
 * Script: Migrate a page from V1 to V2
 * Run: bun run scripts/migrate-page-to-v2.ts <slug>
 * Example: bun run scripts/migrate-page-to-v2.ts bo-the-nlp
 */

import { getPrismaClient } from '../lib/database';

async function migratePageToV2(slug: string) {
  const prisma = getPrismaClient('innerbright.vn');
  
  try {
    // Find the page
    const page = await prisma.page.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    if (!page) {
      console.error(`❌ Page not found with slug: ${slug}`);
      return;
    }

    console.log(`\n📄 Found page: ${page.title}`);
    console.log(`   - Current version: ${page.version}`);
    console.log(`   - Has blocksV2: ${page.blocksV2 !== null ? 'YES' : 'NO'}`);

    // Check if already V2
    if (page.blocksV2 !== null && page.blocksV2 !== undefined) {
      console.log(`\n⚠️  Page already has blocksV2 data!`);
      console.log(`   Do you want to reset and create empty V2 structure? (y/n)`);
      // For script automation, we'll proceed with reset
    }

    // Create empty V2 structure
    const blocksV2Data = {
      blocks: [],
      version: 2,
    };

    // Update page to V2
    const updatedPage = await prisma.page.update({
      where: { id: page.id },
      data: {
        version: 2,
        blocksV2: blocksV2Data,
      },
    });

    console.log(`\n✅ Migration successful!`);
    console.log(`   - Page: ${updatedPage.title}`);
    console.log(`   - New version: ${updatedPage.version}`);
    console.log(`   - blocksV2: Empty structure created`);
    console.log(`\n🔗 Edit in V2: http://localhost:3005/admin/pages-v2/edit/${updatedPage.id}`);
    console.log(`\n💡 Note: Old V1 blocks data is preserved in 'blocks' field if you need to migrate content manually.`);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Get slug from command line args
const slug = process.argv[2];

if (!slug) {
  console.error('\n❌ Error: Please provide a page slug');
  console.error('Usage: bun run scripts/migrate-page-to-v2.ts <slug>');
  console.error('Example: bun run scripts/migrate-page-to-v2.ts bo-the-nlp\n');
  process.exit(1);
}

migratePageToV2(slug);
