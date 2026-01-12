/**
 * Script: Update homepage setting
 * Run: bun run scripts/update-homepage.ts
 */

import { getPrismaClient } from '../lib/database';

async function updateHomepage() {
  const domain = 'innerbright.vn';
  const newPageId = 'dfcd1f81-f5bd-44a9-b4ea-45556a4f811a';
  
  console.log('\n==================================================');
  console.log(`  Updating Homepage for: ${domain}`);
  console.log('==================================================\n');

  try {
    const prisma = getPrismaClient(domain);
    
    // Get current settings
    console.log('📊 BEFORE:');
    const before = await prisma.websiteSettings.findUnique({
      where: { domain }
    });
    console.log(`  - homePageType: ${before?.homePageType || 'null'}`);
    console.log(`  - homePageId: ${before?.homePageId || 'null'}`);
    
    // Update settings
    console.log('\n🔄 UPDATING...');
    const updated = await prisma.websiteSettings.update({
      where: { domain },
      data: {
        homePageType: 'page',
        homePageId: newPageId,
        updatedAt: new Date(),
      }
    });
    
    console.log('\n✅ AFTER:');
    console.log(`  - homePageType: ${updated.homePageType}`);
    console.log(`  - homePageId: ${updated.homePageId}`);
    
    // Verify the new page
    const page = await prisma.page.findUnique({
      where: { id: newPageId },
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
      }
    });
    
    if (page) {
      console.log('\n📄 New Homepage:');
      console.log(`  - Title: ${page.title}`);
      console.log(`  - Slug: /${page.slug}`);
      console.log(`  - Published: ${page.published}`);
    }
    
    console.log('\n==================================================');
    console.log('✅ Homepage updated successfully!');
    console.log('==================================================\n');
    
  } catch (error) {
    console.error('❌ Error:', error);
  }
}

updateHomepage();
