import { getPrisma } from '../lib/prisma';

async function debugHomepage() {
  const domain = 'innerbright.vn';
  const prisma = await getPrisma(domain);

  console.log('\n🔍 Debug Homepage Loading');
  console.log('═══════════════════════════════════════════\n');

  // Get SEO settings
  const seoSettings = await prisma.seoSettings.findUnique({
    where: { domain },
  });

  if (!seoSettings) {
    console.log('❌ No SEO settings');
    return;
  }

  console.log('📋 SEO Settings:');
  console.log('   homePageType:', seoSettings.homePageType);
  console.log('   homePageId:', seoSettings.homePageId);
  console.log('');

  if (!seoSettings.homePageId) {
    console.log('❌ No homePageId set');
    return;
  }

  // Try to load the page exactly like the app does
  const page = await prisma.page.findUnique({
    where: { id: seoSettings.homePageId },
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
    console.log('❌ Page not found with ID:', seoSettings.homePageId);
    
    // List all pages
    const allPages = await prisma.page.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
      },
    });
    
    console.log('\nAll pages:');
    allPages.forEach((p) => {
      console.log(`  ${p.id === seoSettings.homePageId ? '→' : ' '} ${p.id}`);
      console.log(`    Title: ${p.title}`);
      console.log(`    Slug: ${p.slug}`);
      console.log(`    Published: ${p.published}`);
      console.log('');
    });
    return;
  }

  console.log('✅ Page loaded:');
  console.log('   ID:', page.id);
  console.log('   Title:', page.title);
  console.log('   Slug:', page.slug);
  console.log('   Published:', page.published);
  console.log('   Author:', page.author.name || page.author.email);
  console.log('');

  console.log('📦 Blocks:');
  console.log('   Type:', typeof page.blocks);
  console.log('   Is null:', page.blocks === null);
  console.log('   Value:', page.blocks ? 'has data' : 'empty');
  
  if (page.blocks) {
    const blocks = page.blocks as any;
    console.log('   Has elements:', !!blocks.elements);
    console.log('   Has canvas:', !!blocks.canvas);
    console.log('   Has canvas.elements:', !!blocks.canvas?.elements);
  }
}

debugHomepage()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
