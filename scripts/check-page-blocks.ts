#!/usr/bin/env bun
/**
 * Check specific page blocks data in database
 */

import { PrismaClient } from '@prisma/client';

const pageId = process.argv[2];

if (!pageId) {
  console.error('❌ Please provide a page ID');
  console.error('Usage: bun scripts/check-page-blocks.ts <page-id>');
  process.exit(1);
}

async function checkPageBlocks() {
  console.log(`🔍 Checking page blocks: ${pageId}\n`);
  
  try {
    // Use current DATABASE_URL from .env
    const prisma = new PrismaClient();
    
    const page = await prisma.page.findUnique({
      where: { id: pageId },
      select: {
        id: true,
        title: true,
        slug: true,
        blocks: true,
        published: true,
        createdAt: true,
        updatedAt: true,
      }
    });
    
    if (!page) {
      console.log('❌ Page not found in current database');
      console.log('   Make sure you are connected to the correct domain database');
      await prisma.$disconnect();
      return;
    }
    
    console.log('✅ Page found:');
    console.log(`   ID: ${page.id}`);
    console.log(`   Title: ${page.title}`);
    console.log(`   Slug: ${page.slug}`);
    console.log(`   Published: ${page.published}`);
    console.log(`   Created: ${page.createdAt.toISOString()}`);
    console.log(`   Updated: ${page.updatedAt.toISOString()}\n`);
    
    if (!page.blocks) {
      console.log('⚠️  No blocks data found');
      await prisma.$disconnect();
      return;
    }
    
    const blocks = page.blocks as any;
    
    console.log('📦 Blocks structure:');
    console.log(`   Has canvas: ${!!blocks.canvas}`);
    console.log(`   Has elements (root): ${!!blocks.elements}`);
    console.log(`   Has canvas.elements: ${!!(blocks.canvas?.elements)}\n`);
    
    if (blocks.elements) {
      const elementsAtRoot = blocks.elements;
      const isArray = Array.isArray(elementsAtRoot);
      const count = isArray ? elementsAtRoot.length : Object.keys(elementsAtRoot).length;
      
      console.log('🧩 Elements at root:');
      console.log(`   Format: ${isArray ? 'Array' : 'Object'}`);
      console.log(`   Count: ${count}`);
      
      if (count > 0) {
        const firstElement = isArray ? elementsAtRoot[0] : elementsAtRoot[Object.keys(elementsAtRoot)[0]];
        console.log(`   First element:`);
        console.log(`     ID: ${firstElement.id}`);
        console.log(`     Type: ${firstElement.type}`);
        console.log(`     Position: x=${firstElement.x}, y=${firstElement.y}`);
        console.log(`     Size: ${firstElement.width}x${firstElement.height}`);
        if (firstElement.content) {
          console.log(`     Content: ${firstElement.content.substring(0, 50)}...`);
        }
        
        console.log(`\n   All element IDs:`);
        if (isArray) {
          elementsAtRoot.forEach((el: any, idx: number) => {
            console.log(`     ${idx + 1}. ${el.id} (${el.type})`);
          });
        } else {
          Object.values(elementsAtRoot).forEach((el: any, idx: number) => {
            console.log(`     ${idx + 1}. ${el.id} (${el.type})`);
          });
        }
      }
    }
    
    if (blocks.canvas?.elements) {
      const canvasElements = blocks.canvas.elements;
      const isArray = Array.isArray(canvasElements);
      const count = isArray ? canvasElements.length : Object.keys(canvasElements).length;
      
      console.log('\n🎨 Elements in canvas:');
      console.log(`   Format: ${isArray ? 'Array' : 'Object'}`);
      console.log(`   Count: ${count}`);
      
      if (count > 0) {
        console.log(`\n   All element IDs:`);
        if (isArray) {
          canvasElements.forEach((el: any, idx: number) => {
            console.log(`     ${idx + 1}. ${el.id} (${el.type})`);
          });
        } else {
          Object.values(canvasElements).forEach((el: any, idx: number) => {
            console.log(`     ${idx + 1}. ${el.id} (${el.type})`);
          });
        }
      }
    }
    
    if (blocks.canvas) {
      console.log('\n🎨 Canvas settings:');
      console.log(`   Zoom: ${blocks.canvas.zoom || 1}`);
      console.log(`   Grid Size: ${blocks.canvas.gridSize || 12}`);
      console.log(`   Snap to Grid: ${blocks.canvas.snapToGrid !== false}`);
      console.log(`   Show Grid: ${blocks.canvas.showGrid !== false}`);
      console.log(`   Magnetic Alignment: ${blocks.canvas.magneticAlignment !== false}`);
    }
    
    // Show raw JSON (truncated)
    console.log('\n📄 Raw blocks JSON (first 500 chars):');
    const blocksJson = JSON.stringify(blocks, null, 2);
    console.log(blocksJson.substring(0, 500));
    if (blocksJson.length > 500) {
      console.log('...\n(truncated)');
    }
    
    await prisma.$disconnect();
    
  } catch (error) {
    console.error('\n❌ Error:', error);
    process.exit(1);
  }
}

checkPageBlocks()
  .then(() => {
    console.log('\n✨ Check completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Check failed:', error);
    process.exit(1);
  });
