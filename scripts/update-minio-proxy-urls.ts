import { PrismaClient } from '@prisma/client';

// Use DATABASE_URL from environment
const prisma = new PrismaClient();

async function updateMinioProxyUrls() {
  try {
    console.log('🔄 Updating MinIO URLs to API proxy format...\n');

    // Update Media table - fetch and update individually
    const mediaRecords = await prisma.media.findMany({
      where: {
        url: {
          contains: '/minio/innerbright/',
        },
      },
    });

    let mediaCount = 0;
    for (const media of mediaRecords) {
      await prisma.media.update({
        where: { id: media.id },
        data: {
          url: media.url.replace('/minio/', '/api/minio-proxy/'),
        },
      });
      mediaCount++;
    }

    console.log(`✅ Updated ${mediaCount} media records`);

    // Update Pages - search by content/JSON string
    const pages = await prisma.page.findMany({});

    let pagesUpdated = 0;

    for (const page of pages) {
      let updated = false;
      let blocksV2 = page.blocksV2;
      let content = page.content;
      
      // Check if page has MinIO URLs
      const hasMinioUrl = 
        (blocksV2 && JSON.stringify(blocksV2).includes('/minio/innerbright/')) ||
        (content && content.includes('/minio/innerbright/'));
      
      if (!hasMinioUrl) continue;

      if (blocksV2) {
        const blocksStr = JSON.stringify(blocksV2);
        if (blocksStr.includes('/minio/innerbright/')) {
          blocksV2 = JSON.parse(
            blocksStr.replace(/\/minio\//g, '/api/minio-proxy/')
          );
          updated = true;
        }
      }

      if (content && content.includes('/minio/innerbright/')) {
        content = content.replace(/\/minio\//g, '/api/minio-proxy/');
        updated = true;
      }

      if (updated) {
        await prisma.page.update({
          where: { id: page.id },
          data: { blocksV2, content },
        });
        console.log(`  ✅ Updated page: ${page.slug}`);
        pagesUpdated++;
      }
    }

    console.log(`✅ Updated ${pagesUpdated} pages`);
    console.log('\n✨ All URLs updated successfully!');
  } catch (error) {
    console.error('❌ Error updating URLs:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

updateMinioProxyUrls();
