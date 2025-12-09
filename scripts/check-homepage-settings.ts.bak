/**
 * Script: Check homepage settings in database
 * Run: bun run scripts/check-homepage-settings.ts
 */

import { getPrismaClient } from '../lib/database';

async function checkHomepageSettings() {
  const domain = 'innerbright.vn';
  console.log('\n==================================================');
  console.log(`  Checking Homepage Settings for: ${domain}`);
  console.log('==================================================\n');

  try {
    const prisma = getPrismaClient(domain);
    
    // Get SEO settings
    const seoSettings = await prisma.seoSettings.findUnique({
      where: { domain }
    });

    if (!seoSettings) {
      console.log('❌ No SEO settings found for this domain');
      return;
    }

    console.log('📊 SEO Settings:');
    console.log('  - Domain:', seoSettings.domain);
    console.log('  - Home Page Type:', seoSettings.homePageType || '(not set)');
    console.log('  - Home Page ID:', seoSettings.homePageId || '(not set)');
    console.log('');

    if (seoSettings.homePageType && seoSettings.homePageId) {
      if (seoSettings.homePageType === 'page') {
        const page = await prisma.page.findUnique({
          where: { id: seoSettings.homePageId },
          select: {
            id: true,
            title: true,
            slug: true,
            published: true,
            blocks: true,
            blocksV2: true,
          }
        });

        if (page) {
          console.log('✅ Homepage is set to PAGE:');
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
        } else {
          console.log('❌ Page not found (may have been deleted)');
        }
      } else if (seoSettings.homePageType === 'post') {
        const post = await prisma.post.findUnique({
          where: { id: seoSettings.homePageId },
          select: {
            id: true,
            title: true,
            slug: true,
            published: true,
            blocks: true,
          }
        });

        if (post) {
          console.log('✅ Homepage is set to POST:');
          console.log(`  - Title: ${post.title}`);
          console.log(`  - Slug: /${post.slug}`);
          console.log(`  - Published: ${post.published}`);
          console.log(`  - Has blocks: ${!!post.blocks}`);
        } else {
          console.log('❌ Post not found (may have been deleted)');
        }
      }
    } else {
      console.log('ℹ️  Using default homepage (not customized)');
    }

    console.log('\n==================================================\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error checking homepage settings:', error);
    process.exit(1);
  }
}

checkHomepageSettings();
