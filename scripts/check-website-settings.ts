/**
 * Script: Check WebsiteSettings in database
 * Run: bun run scripts/check-website-settings.ts
 */

import { getPrismaClient } from '../lib/database';

async function checkWebsiteSettings() {
  const prisma = getPrismaClient('innerbright.vn');
  
  try {
    console.log('\n📊 Checking WebsiteSettings...\n');

    const settings = await prisma.websiteSettings.findMany({
      select: {
        domain: true,
        logo: true,
        logoAlt: true,
        footerText: true,
      }
    });

    console.log(`Total WebsiteSettings: ${settings.length}`);
    console.log('');

    if (settings.length === 0) {
      console.log('⚠️  No WebsiteSettings found in database!');
      console.log('');
      console.log('Creating default settings for innerbright.vn...');
      
      const created = await prisma.websiteSettings.create({
        data: {
          domain: 'innerbright.vn',
          logo: '/logo.png',
          logoAlt: 'InnerBright',
          footerText: 'Copyright © 2025 InnerBright. All rights reserved.',
        }
      });
      
      console.log('✅ Created default WebsiteSettings:');
      console.log(`   - Domain: ${created.domain}`);
      console.log(`   - Logo: ${created.logo}`);
      console.log('');
    } else {
      settings.forEach(s => {
        console.log(`✓ Domain: ${s.domain}`);
        console.log(`  Logo: ${s.logo || 'NOT SET'}`);
        console.log(`  LogoAlt: ${s.logoAlt || 'NOT SET'}`);
        console.log('');
      });
    }

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkWebsiteSettings();
