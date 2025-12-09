import { PrismaClient } from '@prisma/client';
import { readFileSync } from 'fs';
import { join } from 'path';

const prisma = new PrismaClient();

async function restoreBackup() {
  try {
    console.log('🔄 Starting restore from backup...');
    
    const backupDir = process.argv[2] || '/root/20251118_114836';
    console.log(`📂 Backup directory: ${backupDir}`);

    // 1. Restore Users
    console.log('\n👤 Restoring users...');
    const users = JSON.parse(readFileSync(join(backupDir, 'user.json'), 'utf-8'));
    for (const user of users) {
      await prisma.user.upsert({
        where: { id: user.id },
        update: user,
        create: user,
      });
      console.log(`  ✓ User: ${user.email}`);
    }

    // 2. Restore SEO Settings -> Website Settings
    console.log('\n⚙️  Restoring website settings (from seoSettings)...');
    const seoSettings = JSON.parse(readFileSync(join(backupDir, 'seoSettings.json'), 'utf-8'));
    for (const seo of seoSettings) {
      // Convert seoSettings to websiteSettings format
      const websiteData = {
        id: seo.id,
        domain: seo.domain,
        siteName: seo.siteName || '',
        metaTitle: seo.siteName || '',
        metaDescription: seo.siteDescription || '',
        siteKeywords: '',
        siteOgImage: seo.defaultOgImage || null,
        twitterHandle: seo.twitterHandle || null,
        googleAnalytics: seo.googleAnalytics || null,
        googleTagManager: seo.googleTagManager || null,
        facebookPixel: seo.facebookPixel || null,
        homePageType: seo.homePageType || null,
        homePageId: seo.homePageId || null,
        organizationSchema: seo.organizationSchema || null,
        websiteSchema: seo.websiteSchema || null,
        createdAt: new Date(seo.createdAt),
        updatedAt: new Date(seo.updatedAt),
      };

      await prisma.websiteSettings.upsert({
        where: { id: websiteData.id },
        update: websiteData,
        create: websiteData,
      });
      console.log(`  ✓ Website settings: ${seo.domain}`);
    }

    // 3. Restore Pages
    console.log('\n📄 Restoring pages...');
    const pages = JSON.parse(readFileSync(join(backupDir, 'page.json'), 'utf-8'));
    for (const page of pages) {
      await prisma.page.upsert({
        where: { id: page.id },
        update: {
          ...page,
          createdAt: new Date(page.createdAt),
          updatedAt: new Date(page.updatedAt),
        },
        create: {
          ...page,
          createdAt: new Date(page.createdAt),
          updatedAt: new Date(page.updatedAt),
        },
      });
      console.log(`  ✓ Page: ${page.slug}`);
    }

    // 4. Restore Posts
    console.log('\n📝 Restoring posts...');
    const posts = JSON.parse(readFileSync(join(backupDir, 'post.json'), 'utf-8'));
    if (posts && posts.length > 0) {
      for (const post of posts) {
        await prisma.post.upsert({
          where: { id: post.id },
          update: {
            ...post,
            createdAt: new Date(post.createdAt),
            updatedAt: new Date(post.updatedAt),
          },
          create: {
            ...post,
            createdAt: new Date(post.createdAt),
            updatedAt: new Date(post.updatedAt),
          },
        });
        console.log(`  ✓ Post: ${post.slug}`);
      }
    } else {
      console.log('  ℹ️  No posts to restore');
    }

    // 5. Restore Menus
    console.log('\n🔗 Restoring menus...');
    const menus = JSON.parse(readFileSync(join(backupDir, 'menu.json'), 'utf-8'));
    for (const menu of menus) {
      await prisma.menu.upsert({
        where: { id: menu.id },
        update: {
          ...menu,
          createdAt: new Date(menu.createdAt),
          updatedAt: new Date(menu.updatedAt),
        },
        create: {
          ...menu,
          createdAt: new Date(menu.createdAt),
          updatedAt: new Date(menu.updatedAt),
        },
      });
      console.log(`  ✓ Menu: ${menu.label}`);
    }

    // 6. Restore Media
    console.log('\n🖼️  Restoring media...');
    const media = JSON.parse(readFileSync(join(backupDir, 'media.json'), 'utf-8'));
    for (const item of media) {
      await prisma.media.upsert({
        where: { id: item.id },
        update: {
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        },
        create: {
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        },
      });
      console.log(`  ✓ Media: ${item.filename}`);
    }

    console.log('\n✅ Restore completed successfully!');
    console.log('\n📊 Summary:');
    console.log(`  - Users: ${users.length}`);
    console.log(`  - Website Settings: ${seoSettings.length}`);
    console.log(`  - Pages: ${pages.length}`);
    console.log(`  - Posts: ${posts.length}`);
    console.log(`  - Menus: ${menus.length}`);
    console.log(`  - Media: ${media.length}`);

  } catch (error) {
    console.error('❌ Error during restore:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

restoreBackup();
