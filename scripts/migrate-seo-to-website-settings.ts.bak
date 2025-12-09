/**
 * Migration Script: Merge seo_settings into website_settings
 * 
 * This script:
 * 1. Copies all data from seo_settings to website_settings
 * 2. Updates website_settings schema with new metadata fields
 * 3. Preserves existing website_settings data (logo, header, footer)
 */

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function migrateSeoToWebsiteSettings() {
  try {
    console.log('🚀 Starting migration: seo_settings → website_settings\n');

    // Get all seo_settings records
    const seoSettingsRecords = await prisma.$queryRaw<any[]>`
      SELECT * FROM seo_settings
    `;

    console.log(`📊 Found ${seoSettingsRecords.length} seo_settings records\n`);

    if (seoSettingsRecords.length === 0) {
      console.log('⚠️  No seo_settings records to migrate');
      return;
    }

    // Process each seo_settings record
    for (const seoRecord of seoSettingsRecords) {
      console.log(`📝 Processing domain: ${seoRecord.domain}`);

      // Check if website_settings already exists for this domain
      const existingWebsiteSettings = await prisma.websiteSettings.findUnique({
        where: { domain: seoRecord.domain }
      });

      if (existingWebsiteSettings) {
        // Update existing record with SEO data
        console.log(`   ↪ Updating existing website_settings for ${seoRecord.domain}`);
        
        await prisma.websiteSettings.update({
          where: { domain: seoRecord.domain },
          data: {
            siteName: seoRecord.siteName || existingWebsiteSettings.siteName,
            siteDescription: seoRecord.siteDescription || existingWebsiteSettings.siteDescription,
            siteOgImage: seoRecord.defaultOgImage || existingWebsiteSettings.siteOgImage,
            twitterHandle: seoRecord.twitterHandle || existingWebsiteSettings.twitterHandle,
            googleAnalytics: seoRecord.googleAnalytics || existingWebsiteSettings.googleAnalytics,
            googleTagManager: seoRecord.googleTagManager || existingWebsiteSettings.googleTagManager,
            facebookPixel: seoRecord.facebookPixel || existingWebsiteSettings.facebookPixel,
            homePageType: seoRecord.homePageType || existingWebsiteSettings.homePageType,
            homePageId: seoRecord.homePageId || existingWebsiteSettings.homePageId,
            organizationSchema: seoRecord.organizationSchema || existingWebsiteSettings.organizationSchema,
            websiteSchema: seoRecord.websiteSchema || existingWebsiteSettings.websiteSchema,
          }
        });

        console.log(`   ✅ Updated website_settings for ${seoRecord.domain}`);
      } else {
        // Create new website_settings record
        console.log(`   ↪ Creating new website_settings for ${seoRecord.domain}`);
        
        await prisma.websiteSettings.create({
          data: {
            domain: seoRecord.domain,
            siteName: seoRecord.siteName || '',
            siteDescription: seoRecord.siteDescription,
            siteOgImage: seoRecord.defaultOgImage,
            twitterHandle: seoRecord.twitterHandle,
            googleAnalytics: seoRecord.googleAnalytics,
            googleTagManager: seoRecord.googleTagManager,
            facebookPixel: seoRecord.facebookPixel,
            homePageType: seoRecord.homePageType,
            homePageId: seoRecord.homePageId,
            organizationSchema: seoRecord.organizationSchema,
            websiteSchema: seoRecord.websiteSchema,
          }
        });

        console.log(`   ✅ Created website_settings for ${seoRecord.domain}`);
      }
    }

    console.log('\n✨ Migration completed successfully!\n');
    console.log('📋 Summary:');
    console.log(`   - Processed ${seoSettingsRecords.length} domains`);
    console.log(`   - All SEO data merged into website_settings`);
    console.log('\n⚠️  Next steps:');
    console.log('   1. Run: bun prisma migrate dev --name merge_seo_to_website_settings');
    console.log('   2. Verify data in database');
    console.log('   3. Drop seo_settings table if no longer needed');

  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run migration
migrateSeoToWebsiteSettings();
