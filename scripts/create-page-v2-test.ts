/**
 * Script: Create a test Page V2 with blocks
 * Run: bun run scripts/create-page-v2-test.ts
 */

import { getPrismaClient } from '../lib/database';

async function createTestPageV2() {
  const prisma = getPrismaClient('innerbright.vn');
  
  try {
    // Get first user as author
    const user = await prisma.user.findFirst();
    
    if (!user) {
      console.error('❌ No users found. Please create a user first.');
      process.exit(1);
    }

    // Check if test page already exists
    const existing = await prisma.page.findUnique({
      where: { slug: 'test-page-v2' }
    });

    if (existing) {
      console.log('✅ Test page already exists:', existing.slug);
      return;
    }

    // Create test page with blocksV2
    const testPage = await prisma.page.create({
      data: {
        title: 'Test Page V2',
        slug: 'test-page-v2',
        content: 'This is a test page created with Page Builder V2',
        version: 2,
        published: true,
        publishedAt: new Date(),
        authorId: user.id,
        blocksV2: [
          {
            id: 'block-1',
            type: 'text',
            content: {
              tag: 'h1',
              text: 'Welcome to Page V2',
            },
            styles: {
              container: 'py-8',
              wrapper: 'container mx-auto',
              element: 'text-4xl font-bold text-primary',
            },
            hidden: false,
          },
          {
            id: 'block-2',
            type: 'text',
            content: {
              tag: 'p',
              text: 'This page was created using the new Block Editor V2.',
            },
            styles: {
              container: 'py-4',
              wrapper: 'container mx-auto',
              element: 'text-lg text-muted-foreground',
            },
            hidden: false,
          },
          {
            id: 'block-3',
            type: 'button',
            content: {
              text: 'Learn More',
              link: '/about',
              target: '_self',
            },
            styles: {
              container: 'py-6',
              wrapper: 'container mx-auto',
              element: 'bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors inline-block',
            },
            hidden: false,
          },
        ],
        metaTitle: 'Test Page V2',
        metaDescription: 'A test page created with Block Editor V2',
      },
      include: {
        author: {
          select: {
            name: true,
            email: true,
          },
        },
      },
    });

    console.log('✅ Created test page V2:');
    console.log('  - ID:', testPage.id);
    console.log('  - Title:', testPage.title);
    console.log('  - Slug:', testPage.slug);
    console.log('  - Version:', testPage.version);
    console.log('  - Blocks:', (testPage.blocksV2 as any[])?.length || 0);
    console.log('  - Author:', testPage.author.name || testPage.author.email);
    console.log('');
    console.log('🌐 View at: http://localhost:3005/' + testPage.slug);
    console.log('✏️  Edit at: http://localhost:3005/admin/pages-v2/edit/' + testPage.id);
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createTestPageV2();
