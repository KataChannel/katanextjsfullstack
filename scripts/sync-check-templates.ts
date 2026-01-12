/**
 * Check and sync BlockTemplate V1 and BlockTemplateV2
 * Shows differences and provides merge options
 */

import { getPrisma } from '../lib/prisma';

async function main() {
  console.log('🔍 Checking BlockTemplate V1 vs V2 synchronization...\n');

  const prisma = await getPrisma();

  // Get both versions
  const v1Templates = await prisma.blockTemplate.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  });

  const v2Templates = await prisma.blockTemplateV2.findMany({
    include: { author: true },
    orderBy: { createdAt: 'desc' },
  });

  console.log('📊 Summary:');
  console.log(`   V1 (block_templates): ${v1Templates.length} templates`);
  console.log(`   V2 (block_templates_v2): ${v2Templates.length} templates\n`);

  // Check for templates in V1 but not in V2
  console.log('🔍 Templates in V1 but NOT in V2:');
  const v1NotInV2 = v1Templates.filter(
    v1 => !v2Templates.some(v2 => 
      v2.name === v1.name && v2.authorId === v1.authorId
    )
  );
  
  if (v1NotInV2.length > 0) {
    v1NotInV2.forEach(t => {
      console.log(`   ⚠️  ${t.name} (${t.category})`);
      console.log(`       ID: ${t.id}`);
      console.log(`       Author: ${t.author.email}`);
      console.log(`       Created: ${t.createdAt.toISOString()}`);
    });
    console.log(`\n   → Need to migrate ${v1NotInV2.length} templates to V2`);
  } else {
    console.log('   ✅ All V1 templates exist in V2');
  }

  // Check for templates in V2 but not in V1
  console.log('\n🔍 Templates in V2 but NOT in V1:');
  const v2NotInV1 = v2Templates.filter(
    v2 => !v1Templates.some(v1 => 
      v1.name === v2.name && v1.authorId === v2.authorId
    )
  );
  
  if (v2NotInV1.length > 0) {
    v2NotInV1.forEach(t => {
      console.log(`   ℹ️  ${t.name} (${t.category})`);
      console.log(`       ID: ${t.id}`);
      console.log(`       Author: ${t.author.email}`);
      console.log(`       Tags: ${t.tags.join(', ') || 'none'}`);
      console.log(`       Downloads: ${t.downloads}`);
    });
    console.log(`\n   → ${v2NotInV1.length} V2-only templates (OK - newer format)`);
  } else {
    console.log('   ℹ️  No V2-only templates');
  }

  // Detailed comparison for matching templates
  console.log('\n🔍 Matching templates (name + author):');
  const matching = v1Templates.filter(v1 =>
    v2Templates.some(v2 => 
      v2.name === v1.name && v2.authorId === v1.authorId
    )
  );

  matching.forEach(v1 => {
    const v2 = v2Templates.find(v2 => 
      v2.name === v1.name && v2.authorId === v1.authorId
    );
    
    console.log(`\n   📄 ${v1.name}`);
    console.log(`      V1 ID: ${v1.id}`);
    console.log(`      V2 ID: ${v2?.id}`);
    console.log(`      V1 Category: ${v1.category}`);
    console.log(`      V2 Category: ${v2?.category}`);
    console.log(`      V2 Tags: ${v2?.tags.join(', ') || 'none'}`);
    console.log(`      V2 Downloads: ${v2?.downloads || 0}`);
    
    // Check if descriptions match
    if (v1.description !== v2?.description) {
      console.log(`      ⚠️  Descriptions differ`);
    }
    
    // Check if thumbnails match
    if (v1.thumbnail !== v2?.thumbnail) {
      console.log(`      ⚠️  Thumbnails differ`);
    }
  });

  // Recommendations
  console.log('\n\n📋 Recommendations:');
  console.log('─'.repeat(60));
  
  if (v1NotInV2.length > 0) {
    console.log(`\n⚠️  ACTION REQUIRED: Migrate ${v1NotInV2.length} V1 templates to V2`);
    console.log('   Run: bun run scripts/migrate-templates-v1-to-v2.ts');
  } else {
    console.log('\n✅ All V1 templates are in V2');
  }

  if (v2Templates.length === 0) {
    console.log('\n⚠️  WARNING: No V2 templates found!');
    console.log('   BlockSidebar will show empty.');
    console.log('   Run migration to populate V2.');
  } else {
    console.log(`\n✅ V2 has ${v2Templates.length} templates for BlockSidebar`);
  }

  // API endpoint status
  console.log('\n📡 API Endpoints:');
  console.log('   V1 Admin: /api/admin/block-templates (CRUD)');
  console.log('   V2 Public: /api/block-templates-v2 (BlockSidebar)');
  console.log('   V2 Detail: /api/block-templates-v2/[id]');

  // Usage recommendation
  console.log('\n💡 Best Practice:');
  console.log('   ✅ Use V2 (BlockTemplateV2) for new templates');
  console.log('   ✅ V2 supports: tags, downloads, better structure');
  console.log('   ⚠️  V1 kept for backward compatibility only');
  console.log('   📌 BlockSidebar queries V2 exclusively');

  console.log('\n' + '─'.repeat(60));
  console.log('✅ Sync check complete!\n');

  await prisma.$disconnect();
}

main().catch(console.error);
