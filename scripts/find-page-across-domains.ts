#!/usr/bin/env bun
/**
 * Search for a specific page ID across all domains
 */

import { PrismaClient } from '@prisma/client';

const pageId = process.argv[2];

if (!pageId) {
  console.error('❌ Please provide a page ID');
  console.error('Usage: bun scripts/find-page-across-domains.ts <page-id>');
  process.exit(1);
}

const domains = [
  { name: 'tazagroup', url: 'postgresql://postgres:postgres@116.118.49.243:13003/tazagroupvn' },
  { name: 'tazaskin', url: 'postgresql://postgres:postgres@116.118.49.243:13003/tazaskin' },
  { name: 'timona', url: 'postgresql://postgres:postgres@116.118.49.243:13003/timona' },
  { name: 'hderma', url: 'postgresql://postgres:postgres@116.118.49.243:13003/hderma' },
  { name: 'elasome', url: 'postgresql://postgres:postgres@116.118.49.243:13003/elasome' },
  { name: 'innerbright', url: 'postgresql://postgres:postgres@116.118.49.243:13003/innerbright' },
];

async function searchPage() {
  console.log(`🔍 Searching for page ID: ${pageId}\n`);
  
  for (const domain of domains) {
    try {
      const prisma = new PrismaClient({
        datasources: {
          db: { url: domain.url }
        }
      });
      
      const page = await prisma.page.findUnique({
        where: { id: pageId },
        select: {
          id: true,
          title: true,
          slug: true,
          published: true,
          createdAt: true,
          updatedAt: true,
        }
      });
      
      if (page) {
        console.log(`✅ Found in domain: ${domain.name}`);
        console.log(`   Title: ${page.title}`);
        console.log(`   Slug: ${page.slug}`);
        console.log(`   Published: ${page.published}`);
        console.log(`   Created: ${page.createdAt.toISOString()}`);
        console.log(`   Updated: ${page.updatedAt.toISOString()}`);
        console.log(`   URL: https://${domain.name}.com/admin/page-builder/${page.id}\n`);
      } else {
        console.log(`❌ Not found in: ${domain.name}`);
      }
      
      await prisma.$disconnect();
    } catch (error) {
      console.error(`⚠️  Error checking ${domain.name}:`, (error as Error).message);
    }
  }
}

searchPage()
  .then(() => {
    console.log('\n✨ Search completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Search failed:', error);
    process.exit(1);
  });
