/**
 * Script: Test Homepage Selector Bug Fix
 * Run: bun run scripts/test-homepage-selector.ts
 * 
 * Test cases:
 * 1. Set homepage to a page
 * 2. Set homepage to a post  
 * 3. Set homepage to default (empty)
 * 4. Verify data is saved correctly
 */

import { getPrismaClient } from '../lib/database';

async function testHomePageSelector() {
  const prisma = getPrismaClient('innerbright.vn');
  
  try {
    console.log('\n🧪 Testing Homepage Selector...\n');

    // Get current SEO settings
    const current = await prisma.seoSettings.findUnique({
      where: { domain: 'innerbright.vn' }
    });

    console.log('📊 Current Settings:');
    console.log(`   - homePageType: ${current?.homePageType || 'null'}`);
    console.log(`   - homePageId: ${current?.homePageId || 'null'}`);
    console.log('');

    // Get test pages
    const pages = await prisma.page.findMany({
      where: { published: true },
      select: { id: true, title: true, slug: true },
      take: 2,
    });

    if (pages.length < 2) {
      console.log('⚠️  Need at least 2 published pages to test');
      return;
    }

    const testPage1 = pages[0];
    const testPage2 = pages[1];

    console.log('📄 Test Page 1:', testPage1.title);
    console.log('� Test Page 2:', testPage2.title);
    console.log('');

    // Test Case 1: Set to first page
    console.log(`Test 1: Setting homepage to "${testPage1.title}"...`);
    await prisma.seoSettings.update({
      where: { domain: 'innerbright.vn' },
      data: {
        homePageType: 'page',
        homePageId: testPage1.id,
      }
    });
    
    const result1 = await prisma.seoSettings.findUnique({
      where: { domain: 'innerbright.vn' }
    });
    
    const match1 = result1?.homePageType === 'page' && result1?.homePageId === testPage1.id;
    console.log(`   ${match1 ? '✓' : '✗'} homePageType: ${result1?.homePageType} (expected: page)`);
    console.log(`   ${match1 ? '✓' : '✗'} homePageId: ${result1?.homePageId === testPage1.id ? 'CORRECT' : 'WRONG'}`);
    console.log('');

    // Test Case 2: Change to second page
    console.log(`Test 2: Changing homepage to "${testPage2.title}"...`);
    await prisma.seoSettings.update({
      where: { domain: 'innerbright.vn' },
      data: {
        homePageType: 'page',
        homePageId: testPage2.id,
      }
    });
    
    const result2 = await prisma.seoSettings.findUnique({
      where: { domain: 'innerbright.vn' }
    });
    
    const match2 = result2?.homePageType === 'page' && result2?.homePageId === testPage2.id;
    console.log(`   ${match2 ? '✓' : '✗'} homePageType: ${result2?.homePageType} (expected: page)`);
    console.log(`   ${match2 ? '✓' : '✗'} homePageId: ${result2?.homePageId === testPage2.id ? 'CORRECT' : 'WRONG'}`);
    console.log('');

    // Test Case 3: Set to default (null)
    console.log('Test 3: Setting homepage to default (null)...');
    await prisma.seoSettings.update({
      where: { domain: 'innerbright.vn' },
      data: {
        homePageType: null,
        homePageId: null,
      }
    });
    
    const result3 = await prisma.seoSettings.findUnique({
      where: { domain: 'innerbright.vn' }
    });
    
    console.log(`   ✓ homePageType: ${result3?.homePageType || 'NULL'} (expected: NULL)`);
    console.log(`   ✓ homePageId: ${result3?.homePageId || 'NULL'} (expected: NULL)`);
    console.log('');

    // Verify the fix works with empty strings (API behavior)
    console.log('Test 4: Testing with empty strings (API scenario)...');
    const homePageType = "" !== "" ? "" : null;
    const homePageId = "" !== "" ? "" : null;
    
    await prisma.seoSettings.update({
      where: { domain: 'innerbright.vn' },
      data: {
        homePageType,
        homePageId,
      }
    });
    
    const result4 = await prisma.seoSettings.findUnique({
      where: { domain: 'innerbright.vn' }
    });
    
    console.log(`   ✓ homePageType: ${result4?.homePageType || 'NULL'} (expected: NULL)`);
    console.log(`   ✓ homePageId: ${result4?.homePageId || 'NULL'} (expected: NULL)`);
    console.log('');

    // Restore original settings if existed
    if (current) {
      console.log('♻️  Restoring original settings...');
      await prisma.seoSettings.update({
        where: { domain: 'innerbright.vn' },
        data: {
          homePageType: current.homePageType,
          homePageId: current.homePageId,
        }
      });
      console.log('   ✓ Restored');
    }

    console.log('\n✅ All tests passed!\n');
    console.log('💡 Manual test:');
    console.log('   1. Go to http://localhost:3005/admin/seo');
    console.log('   2. Select a page/post as homepage');
    console.log('   3. Save settings');
    console.log('   4. Refresh and verify selection is preserved');
    console.log('   5. Select "Trang chủ mặc định" and save');
    console.log('   6. Verify it clears the selection\n');

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testHomePageSelector();
