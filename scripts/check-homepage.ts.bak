import { getPrisma } from '../lib/prisma';

async function checkHomepage() {
  const domain = 'innerbright.vn';
  const prisma = await getPrisma(domain);

  console.log('\n🔍 Checking homepage settings for:', domain);
  console.log('═══════════════════════════════════════════\n');

  // Get SEO settings
  const seoSettings = await prisma.seoSettings.findUnique({
    where: { domain },
  });

  if (!seoSettings) {
    console.log('❌ No SEO settings found');
    return;
  }

  console.log('✅ SEO Settings:');
  console.log('   homePageType:', seoSettings.homePageType);
  console.log('   homePageId:', seoSettings.homePageId);
  console.log('');

  if (seoSettings.homePageType === 'page' && seoSettings.homePageId) {
    const page = await prisma.page.findUnique({
      where: { id: seoSettings.homePageId },
    });

    if (!page) {
      console.log('❌ Page not found');
      return;
    }

    console.log('📄 Page Details:');
    console.log('   ID:', page.id);
    console.log('   Title:', page.title);
    console.log('   Slug:', page.slug);
    console.log('   Published:', page.published);
    console.log('');

    console.log('📦 Blocks Data:');
    console.log('   Type:', typeof page.blocks);
    console.log('   Is null:', page.blocks === null);
    
    if (page.blocks) {
      const blocks = page.blocks as any;
      console.log('   Has elements:', !!blocks.elements);
      console.log('   Has canvas:', !!blocks.canvas);
      console.log('   Has canvas.elements:', !!blocks.canvas?.elements);
      console.log('');

      if (blocks.elements) {
        const elementsArray = Array.isArray(blocks.elements)
          ? blocks.elements
          : Object.values(blocks.elements);
        console.log('   Elements count:', elementsArray.length);
        console.log('   Elements:', JSON.stringify(blocks.elements, null, 2));
      }

      if (blocks.canvas?.elements) {
        const elementsArray = Array.isArray(blocks.canvas.elements)
          ? blocks.canvas.elements
          : Object.values(blocks.canvas.elements);
        console.log('   Canvas elements count:', elementsArray.length);
        
        // Show element types
        elementsArray.forEach((el: any, idx: number) => {
          console.log(`   [${idx}] type: ${el.type}, id: ${el.id}`);
          if (el.type === 'carousel') {
            console.log(`        carousel slides: ${el.carousel?.slides?.length || 0}`);
            console.log(`        carousel settings:`, JSON.stringify({
              autoPlay: el.carousel?.autoPlay,
              interval: el.carousel?.interval,
              showDots: el.carousel?.showDots,
              showArrows: el.carousel?.showArrows,
            }, null, 2));
          }
        });
      }

      console.log('\n📋 Full blocks structure:');
      console.log(JSON.stringify(blocks, null, 2));
    }
  }
}

checkHomepage()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
