import { getPrisma } from '../lib/prisma';

async function findPage() {
  const domain = 'innerbright.vn';
  const prisma = await getPrisma(domain);

  console.log('\n🔍 Looking for /ve-innerbright page in:', domain);
  console.log('═══════════════════════════════════════════\n');

  // Find page by slug
  const page = await prisma.page.findFirst({
    where: { 
      slug: 've-innerbright',
    },
  });

  if (!page) {
    console.log('❌ Page not found with slug: ve-innerbright');
    
    // List all pages
    const allPages = await prisma.page.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        published: true,
      },
    });
    
    console.log('\n📄 All pages in database:');
    allPages.forEach((p) => {
      console.log(`   - ${p.slug} (${p.title}) [${p.published ? 'Published' : 'Draft'}]`);
    });
    return;
  }

  console.log('✅ Page found!');
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
          console.log(`        carousel autoPlay: ${el.carousel?.autoPlay}`);
          console.log(`        carousel interval: ${el.carousel?.interval}`);
        }
      });
    }

    console.log('\n📋 Full blocks structure (first 1000 chars):');
    const blocksStr = JSON.stringify(blocks, null, 2);
    console.log(blocksStr.substring(0, 1000));
    if (blocksStr.length > 1000) {
      console.log('... (truncated)');
    }
  }
}

findPage()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
