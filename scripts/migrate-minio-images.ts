/**
 * Script to migrate MinIO images from old server to new server
 * Old: 116.118.49.243:12007
 * New: 116.118.48.208:9000
 */

import { PrismaClient } from '@prisma/client';
import * as Minio from 'minio';

const prisma = new PrismaClient();

// Old MinIO config
const oldMinioClient = new Minio.Client({
  endPoint: '116.118.49.243',
  port: 12007,
  useSSL: false,
  accessKey: 'minio-admin',
  secretKey: 'minio-secret-2025',
});

// New MinIO config
const newMinioClient = new Minio.Client({
  endPoint: '116.118.48.208',
  port: 9000,
  useSSL: false,
  accessKey: 'minioadmin',
  secretKey: '97G6UiPTilf2',
});

const BUCKET_NAME = 'innerbright';

async function ensureBucket(client: Minio.Client, bucketName: string) {
  const exists = await client.bucketExists(bucketName);
  if (!exists) {
    await client.makeBucket(bucketName, 'us-east-1');
    console.log(`✅ Created bucket: ${bucketName}`);
    
    // Set public read policy
    const policy = {
      Version: '2012-10-17',
      Statement: [
        {
          Effect: 'Allow',
          Principal: { AWS: ['*'] },
          Action: ['s3:GetObject'],
          Resource: [`arn:aws:s3:::${bucketName}/*`],
        },
      ],
    };
    await client.setBucketPolicy(bucketName, JSON.stringify(policy));
    console.log(`✅ Set public read policy for bucket: ${bucketName}`);
  }
}

async function migrateImages() {
  console.log('🔄 Starting image migration...\n');

  try {
    // Ensure new bucket exists
    await ensureBucket(newMinioClient, BUCKET_NAME);

    // Get all media records from database
    const mediaRecords = await prisma.media.findMany({
      where: {
        url: {
          contains: '116.118.49.243:12007',
        },
      },
    });

    console.log(`📊 Found ${mediaRecords.length} images to migrate\n`);

    let successCount = 0;
    let errorCount = 0;

    for (const media of mediaRecords) {
      try {
        // Extract filename from URL
        const filename = media.url.split('/').pop();
        if (!filename) {
          console.log(`❌ Invalid URL: ${media.url}`);
          errorCount++;
          continue;
        }

        console.log(`📥 Downloading: ${filename}`);

        // Download from old server
        const stream = await oldMinioClient.getObject(BUCKET_NAME, filename);
        const chunks: Buffer[] = [];
        
        await new Promise<void>((resolve, reject) => {
          stream.on('data', (chunk) => chunks.push(chunk));
          stream.on('end', () => resolve());
          stream.on('error', (err) => reject(err));
        });

        const buffer = Buffer.concat(chunks);

        // Upload to new server
        console.log(`📤 Uploading: ${filename}`);
        await newMinioClient.putObject(BUCKET_NAME, filename, buffer, buffer.length, {
          'Content-Type': media.mimeType || 'application/octet-stream',
        });

        // Update database with new URL
        const oldUrl = media.url;
        const newUrl = `http://116.118.48.208:9000/${BUCKET_NAME}/${filename}`;
        
        await prisma.media.update({
          where: { id: media.id },
          data: { url: newUrl },
        });

        console.log(`✅ Migrated: ${filename}`);
        console.log(`   Old: ${oldUrl}`);
        console.log(`   New: ${newUrl}\n`);
        
        successCount++;
      } catch (error) {
        console.error(`❌ Error migrating ${media.filename}:`, error);
        errorCount++;
      }
    }

    console.log('\n📊 Migration Summary:');
    console.log(`   ✅ Success: ${successCount}`);
    console.log(`   ❌ Failed: ${errorCount}`);
    console.log(`   📦 Total: ${mediaRecords.length}`);

    // Update pages content
    console.log('\n🔄 Updating page content URLs...');
    const pages = await prisma.page.findMany({
      where: {
        OR: [
          { content: { contains: '116.118.49.243:12007' } },
          { blocks: { not: null } },
          { blocksV2: { not: null } },
        ],
      },
    });

    let pagesUpdated = 0;
    for (const page of pages) {
      let updated = false;
      let newContent = page.content;
      let newBlocks = page.blocks;
      let newBlocksV2 = page.blocksV2;

      // Update content
      if (page.content && page.content.includes('116.118.49.243:12007')) {
        newContent = page.content.replace(/116\.118\.49\.243:12007/g, '116.118.48.208:9000');
        updated = true;
      }

      // Update blocks
      if (page.blocks) {
        const blocksStr = JSON.stringify(page.blocks);
        if (blocksStr.includes('116.118.49.243:12007')) {
          newBlocks = JSON.parse(blocksStr.replace(/116\.118\.49\.243:12007/g, '116.118.48.208:9000'));
          updated = true;
        }
      }

      // Update blocksV2
      if (page.blocksV2) {
        const blocksV2Str = JSON.stringify(page.blocksV2);
        if (blocksV2Str.includes('116.118.49.243:12007')) {
          newBlocksV2 = JSON.parse(blocksV2Str.replace(/116\.118\.49\.243:12007/g, '116.118.48.208:9000'));
          updated = true;
        }
      }

      if (updated) {
        await prisma.page.update({
          where: { id: page.id },
          data: {
            content: newContent,
            blocks: newBlocks,
            blocksV2: newBlocksV2,
          },
        });
        console.log(`   ✅ Updated page: ${page.slug}`);
        pagesUpdated++;
      }
    }

    console.log(`   📄 Pages updated: ${pagesUpdated}`);

    console.log('\n✅ Migration completed successfully!');
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

migrateImages();
