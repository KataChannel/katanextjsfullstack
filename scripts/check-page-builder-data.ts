/**
 * Script để kiểm tra Page Builder data trong database
 * Chạy: bun run scripts/check-page-builder-data.ts
 */

import { prisma } from '@/lib/prisma';

async function checkPageBuilderData() {
  console.log('🔍 Checking Page Builder data...\n');

  // Get all pages with blocks
  const allPages = await prisma.page.findMany({
    select: {
      id: true,
      title: true,
      slug: true,
      blocks: true,
    },
  });
  
  // Filter pages with blocks
  const pages = allPages.filter(page => page.blocks !== null);

  console.log(`📊 Found ${pages.length} pages with blocks\n`);

  pages.forEach((page, index) => {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📄 Page ${index + 1}:`);
    console.log(`   ID: ${page.id}`);
    console.log(`   Title: ${page.title}`);
    console.log(`   Slug: ${page.slug}`);
    console.log(`   URL: /admin/page-builder/${page.id}`);
    
    const blocks = page.blocks as any;
    
    if (blocks) {
      console.log(`\n   📦 Blocks structure:`);
      console.log(`      - Has canvas: ${!!blocks.canvas}`);
      console.log(`      - Has elements: ${!!blocks.elements}`);
      console.log(`      - Has canvas.elements: ${!!blocks.canvas?.elements}`);
      
      // Check elements format
      if (blocks.elements) {
        const isArray = Array.isArray(blocks.elements);
        const count = isArray 
          ? blocks.elements.length 
          : Object.keys(blocks.elements).length;
        
        console.log(`\n   🧩 Elements at root:`);
        console.log(`      - Format: ${isArray ? 'Array ❌' : 'Object ✅'}`);
        console.log(`      - Count: ${count}`);
        
        if (count > 0) {
          const firstEl = isArray 
            ? blocks.elements[0] 
            : blocks.elements[Object.keys(blocks.elements)[0]];
          console.log(`      - First element ID: ${firstEl?.id}`);
          console.log(`      - First element type: ${firstEl?.type}`);
        }
      }
      
      if (blocks.canvas?.elements) {
        const isArray = Array.isArray(blocks.canvas.elements);
        const count = isArray 
          ? blocks.canvas.elements.length 
          : Object.keys(blocks.canvas.elements).length;
        
        console.log(`\n   🧩 Elements in canvas:`);
        console.log(`      - Format: ${isArray ? 'Array ❌' : 'Object ✅'}`);
        console.log(`      - Count: ${count}`);
      }
      
      // Check other properties
      if (blocks.canvas) {
        console.log(`\n   🎨 Canvas properties:`);
        console.log(`      - Zoom: ${blocks.canvas.zoom || 1}`);
        console.log(`      - Grid Size: ${blocks.canvas.gridSize || 8}`);
        console.log(`      - Snap to Grid: ${blocks.canvas.snapToGrid ?? true}`);
      }
    } else {
      console.log(`   ⚠️  No blocks data`);
    }
  });

  console.log(`\n${'='.repeat(60)}\n`);
  
  if (pages.length === 0) {
    console.log(`ℹ️  No pages with Page Builder data found.`);
    console.log(`   Run seed: bun run prisma:seed:pagebuilder\n`);
  }

  await prisma.$disconnect();
}

checkPageBuilderData().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
