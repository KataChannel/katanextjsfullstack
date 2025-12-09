import { getPrisma } from '../lib/prisma';

async function setHomepage() {
  const domain = 'innerbright.vn';
  const prisma = await getPrisma(domain);

  console.log('\n🔧 Setting homepage for:', domain);
  console.log('═══════════════════════════════════════════\n');

  // Find the page
  const page = await prisma.page.findFirst({
    where: { slug: 've-innerbright' },
  });

  if (!page) {
    console.log('❌ Page not found');
    return;
  }

  console.log('✅ Page found:', page.title);
  console.log('   ID:', page.id);
  console.log('');

  // Check if SEO settings exist
  let seoSettings = await prisma.seoSettings.findUnique({
    where: { domain },
  });

  if (!seoSettings) {
    console.log('ℹ️  No SEO settings found, creating...');
    seoSettings = await prisma.seoSettings.create({
      data: {
        domain,
        siteName: 'InnerBright',
        siteDescription: 'InnerBright Training & Coaching',
        homePageType: 'page',
        homePageId: page.id,
      },
    });
    console.log('✅ Created SEO settings with homepage set');
  } else {
    console.log('ℹ️  Updating existing SEO settings...');
    seoSettings = await prisma.seoSettings.update({
      where: { domain },
      data: {
        homePageType: 'page',
        homePageId: page.id,
      },
    });
    console.log('✅ Updated SEO settings with homepage');
  }

  console.log('');
  console.log('📄 Current homepage settings:');
  console.log('   homePageType:', seoSettings.homePageType);
  console.log('   homePageId:', seoSettings.homePageId);
  console.log('   Page:', page.slug);
  console.log('');
  console.log('✅ Done! Now visit http://innerbright.vn to see the homepage');
}

setHomepage()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
