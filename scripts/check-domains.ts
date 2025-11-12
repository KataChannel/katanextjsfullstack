import { getPrisma } from '../lib/prisma';

async function checkDomains() {
  console.log('\n🔍 Checking SEO Settings for all domains');
  console.log('═══════════════════════════════════════════\n');

  const domains = ['innerbright.vn', 'localhost', 'localhost:3005'];

  for (const domain of domains) {
    const prisma = await getPrisma(domain);
    
    const seoSettings = await prisma.seoSettings.findUnique({
      where: { domain },
    });

    console.log(`Domain: ${domain}`);
    if (seoSettings) {
      console.log('  ✅ SEO Settings exist');
      console.log('    homePageType:', seoSettings.homePageType);
      console.log('    homePageId:', seoSettings.homePageId);
      
      if (seoSettings.homePageId) {
        const page = await prisma.page.findUnique({
          where: { id: seoSettings.homePageId },
          select: { title: true, slug: true },
        });
        console.log('    Page:', page?.title, `(/${page?.slug})`);
      }
    } else {
      console.log('  ❌ No SEO Settings');
    }
    console.log('');
  }
}

checkDomains()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
