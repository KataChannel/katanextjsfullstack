import { getPrisma } from '../lib/prisma';

async function testRender() {
  const domain = 'innerbright.vn';
  const prisma = await getPrisma(domain);

  // Get SEO settings
  const websiteSettings = await prisma.websiteSettings.findUnique({
    where: { domain },
    select: {
      homePageType: true,
      homePageId: true,
    },
  });

  console.log('\n🧪 Testing Homepage Render Logic');
  console.log('═══════════════════════════════════════════\n');

  if (!websiteSettings?.homePageType || !websiteSettings?.homePageId) {
    console.log('❌ No custom homepage set');
    return;
  }

  console.log('✅ Custom homepage configured:');
  console.log('   Type:', websiteSettings.homePageType);
  console.log('   ID:', websiteSettings.homePageId);
  console.log('');

  if (websiteSettings.homePageType === 'page') {
    const page = await prisma.page.findUnique({
      where: { id: websiteSettings.homePageId },
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
      console.log('❌ Page not found');
      return;
    }

    console.log('📄 Page loaded:');
    console.log('   Title:', page.title);
    console.log('   Slug:', page.slug);
    console.log('   Published:', page.published);
    console.log('');

    if (!page.published) {
      console.log('⚠️  Warning: Page is not published!');
      return;
    }

    // Test the rendering logic
    const hasBlocks = page.blocks && typeof page.blocks === 'object';
    const blocks = page.blocks as any;
    const isPageBuilder = hasBlocks && (blocks.elements || blocks.canvas);
    const isLegacyBlocks = hasBlocks && Array.isArray(blocks);

    console.log('🔍 Content Format Detection:');
    console.log('   hasBlocks:', hasBlocks);
    console.log('   isPageBuilder:', isPageBuilder);
    console.log('   isLegacyBlocks:', isLegacyBlocks);
    console.log('');

    if (isPageBuilder) {
      console.log('✅ Will use PageBuilderRenderer');
      
      const elements = blocks.elements || blocks.canvas?.elements || {};
      const elementsArray = Array.isArray(elements)
        ? elements
        : Object.values(elements);

      console.log('   Elements source:', blocks.elements ? 'blocks.elements' : 'blocks.canvas.elements');
      console.log('   Elements count:', elementsArray.length);
      console.log('');

      elementsArray.forEach((el: any, idx: number) => {
        console.log(`   [${idx}] ${el.type} (id: ${el.id})`);
        if (el.type === 'carousel') {
          console.log(`       - slides: ${el.carousel?.slides?.length || 0}`);
          console.log(`       - autoPlay: ${el.carousel?.autoPlay}`);
          console.log(`       - interval: ${el.carousel?.interval}`);
          console.log(`       - showDots: ${el.carousel?.showDots}`);
          console.log(`       - showArrows: ${el.carousel?.showArrows}`);
          console.log(`       - height: ${el.carousel?.height || el.height}`);
        }
      });
    } else if (isLegacyBlocks) {
      console.log('✅ Will use PageBlocksRenderer (legacy)');
    } else {
      console.log('✅ Will use raw HTML rendering');
    }
  }
}

testRender()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
