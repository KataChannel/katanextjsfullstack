/**
 * Script: Audit all Pages and Posts for V1 vs V2 blocks
 * Run: bun run scripts/audit-blocks-v1-v2.ts
 */

import { getPrismaClient } from '../lib/database';

async function auditBlocks() {
  const prisma = getPrismaClient('innerbright.vn');
  
  try {
    console.log('\n🔍 AUDIT: Pages & Posts Blocks Format\n');
    console.log('='.repeat(60));

    // Audit Pages
    console.log('\n📄 PAGES AUDIT:\n');
    const pages = await prisma.page.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        version: true,
        published: true,
        blocks: true,
        blocksV2: true,
      }
    });

    let pagesV1Only = 0;
    let pagesV2Only = 0;
    let pagesBoth = 0;
    let pagesNeither = 0;

    pages.forEach(page => {
      const hasV1 = page.blocks !== null && page.blocks !== undefined;
      const hasV2 = page.blocksV2 !== null && page.blocksV2 !== undefined;

      let status = '';
      if (hasV1 && hasV2) {
        status = '⚠️  BOTH V1 & V2';
        pagesBoth++;
      } else if (hasV1 && !hasV2) {
        status = '❌ V1 ONLY';
        pagesV1Only++;
      } else if (!hasV1 && hasV2) {
        status = '✅ V2 ONLY';
        pagesV2Only++;
      } else {
        status = '⭕ NO BLOCKS';
        pagesNeither++;
      }

      console.log(`${status} | ${page.title}`);
      console.log(`   ID: ${page.id}`);
      console.log(`   Slug: ${page.slug}`);
      console.log(`   Version: ${page.version}`);
      console.log(`   Published: ${page.published ? 'YES' : 'NO'}`);
      if (hasV1) {
        const v1Data = page.blocks as any;
        const v1Length = Array.isArray(v1Data) ? v1Data.length : 'N/A';
        console.log(`   V1 blocks: ${v1Length} items`);
      }
      if (hasV2) {
        const v2Data = page.blocksV2 as any;
        const v2Length = v2Data?.blocks?.length || 0;
        console.log(`   V2 blocks: ${v2Length} items`);
      }
      console.log('');
    });

    // Audit Posts (Note: Post model doesn't have blocksV2, only content field)
    console.log('\n📝 POSTS AUDIT:\n');
    const posts = await prisma.post.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
        content: true,
      }
    });

    let postsV1Only = 0;
    let postsV2Only = 0;
    let postsBoth = 0;
    let postsNeither = 0;

    posts.forEach(post => {
      const hasContent = post.content !== null && post.content !== undefined && post.content.trim() !== '';

      let status = hasContent ? '📄 HAS CONTENT' : '⭕ NO CONTENT';
      if (hasContent) {
        postsV1Only++; // Count as V1 (content field)
      } else {
        postsNeither++;
      }

      console.log(`${status} | ${post.title}`);
      console.log(`   ID: ${post.id}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Published: ${post.published ? 'YES' : 'NO'}`);
      if (hasContent) {
        const contentLength = post.content?.length || 0;
        console.log(`   Content: ${contentLength} characters`);
      }
      console.log('');
    });

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('\n📊 SUMMARY:\n');
    
    console.log('PAGES:');
    console.log(`  ❌ V1 Only: ${pagesV1Only} pages`);
    console.log(`  ✅ V2 Only: ${pagesV2Only} pages`);
    console.log(`  ⚠️  Both V1 & V2: ${pagesBoth} pages`);
    console.log(`  ⭕ No blocks: ${pagesNeither} pages`);
    console.log(`  📄 Total: ${pages.length} pages`);
    
    console.log('\nPOSTS:');
    console.log(`  ❌ V1 Only: ${postsV1Only} posts`);
    console.log(`  ✅ V2 Only: ${postsV2Only} posts`);
    console.log(`  ⚠️  Both V1 & V2: ${postsBoth} posts`);
    console.log(`  ⭕ No blocks: ${postsNeither} posts`);
    console.log(`  📝 Total: ${posts.length} posts`);

    const totalNeedsMigration = pagesV1Only + pagesBoth + postsV1Only + postsBoth;
    console.log(`\n🔧 NEEDS MIGRATION: ${totalNeedsMigration} records`);
    
    if (totalNeedsMigration > 0) {
      console.log('\n💡 Next steps:');
      console.log('   1. Run: bun run scripts/migrate-all-to-v2.ts');
      console.log('   2. Update components to render V2 blocks');
      console.log('   3. Test all pages/posts');
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

auditBlocks();
