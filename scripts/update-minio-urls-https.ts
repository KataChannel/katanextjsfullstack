/**
 * Update existing MinIO URLs to use HTTPS proxy
 * Old: http://116.118.48.208:9000/innerbright/filename.webp
 * New: https://innerbright.vn/minio/innerbright/filename.webp
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function updateMinioUrls() {
  console.log('🔄 Updating MinIO URLs to HTTPS proxy format...\n');

  try {
    // Update media table
    console.log('📊 Updating media table...');
    const mediaRecords = await prisma.media.findMany({
      where: {
        url: {
          contains: '116.118.48.208:9000/innerbright',
        },
      },
    });

    console.log(`Found ${mediaRecords.length} media records to update`);

    let mediaUpdated = 0;
    for (const media of mediaRecords) {
      const oldUrl = media.url;
      const newUrl = oldUrl.replace(
        'http://116.118.48.208:9000/innerbright',
        'https://innerbright.vn/minio/innerbright'
      );

      await prisma.media.update({
        where: { id: media.id },
        data: { url: newUrl },
      });

      console.log(`  ✅ ${media.filename}: ${newUrl}`);
      mediaUpdated++;
    }

    // Update pages with blocksV2
    console.log('\n📄 Updating pages blocksV2...');
    const pages = await prisma.page.findMany({
      where: {
        blocksV2: {
          not: null,
        },
      },
    });

    let pagesUpdated = 0;
    for (const page of pages) {
      if (!page.blocksV2) continue;

      const blocksStr = JSON.stringify(page.blocksV2);
      if (blocksStr.includes('116.118.48.208:9000/innerbright')) {
        const newBlocks = JSON.parse(
          blocksStr.replace(
            /http:\/\/116\.118\.48\.208:9000\/innerbright/g,
            'https://innerbright.vn/minio/innerbright'
          )
        );

        await prisma.page.update({
          where: { id: page.id },
          data: { blocksV2: newBlocks },
        });

        console.log(`  ✅ Page: ${page.slug}`);
        pagesUpdated++;
      }
    }

    // Update pages content
    console.log('\n📝 Updating pages content...');
    const pagesWithContent = await prisma.page.findMany({
      where: {
        content: {
          contains: '116.118.48.208:9000/innerbright',
        },
      },
    });

    let contentUpdated = 0;
    for (const page of pagesWithContent) {
      const newContent = page.content?.replace(
        /http:\/\/116\.118\.48\.208:9000\/innerbright/g,
        'https://innerbright.vn/minio/innerbright'
      );

      await prisma.page.update({
        where: { id: page.id },
        data: { content: newContent },
      });

      console.log(`  ✅ Page content: ${page.slug}`);
      contentUpdated++;
    }

    console.log('\n✅ Update completed!');
    console.log('\n📊 Summary:');
    console.log(`  - Media records: ${mediaUpdated}/${mediaRecords.length}`);
    console.log(`  - Pages blocksV2: ${pagesUpdated}`);
    console.log(`  - Pages content: ${contentUpdated}`);

  } catch (error) {
    console.error('❌ Error updating URLs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateMinioUrls();
