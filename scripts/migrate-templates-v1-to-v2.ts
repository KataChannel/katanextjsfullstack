/**
 * Migrate BlockTemplate (V1) to BlockTemplateV2
 * Convert elements array format to single block with children
 */

import { getPrisma } from '../lib/prisma';

async function main() {
  console.log('🔄 Migrating BlockTemplate V1 to V2...\n');

  const prisma = await getPrisma();

  // Get all V1 templates
  const v1Templates = await prisma.blockTemplate.findMany({
    include: {
      author: true,
    },
  });

  console.log(`Found ${v1Templates.length} V1 templates to migrate\n`);

  for (const v1 of v1Templates) {
    console.log(`Migrating: ${v1.name}`);

    // Check if already exists in V2
    const existing = await prisma.blockTemplateV2.findFirst({
      where: {
        name: v1.name,
        authorId: v1.authorId,
      },
    });

    if (existing) {
      console.log(`  ⚠️  Already exists in V2, skipping...`);
      continue;
    }

    // Convert V1 format to V2 format
    // V1: { elements: [array of blocks] }
    // V2: { block: single block object }
    
    const v2Block = v1.elements;

    // Create V2 template
    const v2Template = await prisma.blockTemplateV2.create({
      data: {
        name: v1.name,
        description: v1.description,
        category: mapCategoryToV2(v1.category),
        tags: extractTags(v1.name, v1.description),
        block: v2Block,
        thumbnail: v1.thumbnail,
        published: v1.published,
        downloads: 0,
        authorId: v1.authorId,
      },
    });

    console.log(`  ✅ Created V2 template: ${v2Template.id}`);
  }

  console.log(`\n✅ Migration complete!`);
  console.log(`Migrated ${v1Templates.length} templates to V2\n`);

  await prisma.$disconnect();
}

// Map V1 categories to V2
function mapCategoryToV2(v1Category: string): string {
  const mapping: Record<string, string> = {
    'general': 'template',
    'hero': 'template',
    'content': 'template',
    'cta': 'template',
    'footer': 'template',
    'header': 'template',
  };

  return mapping[v1Category] || 'custom';
}

// Extract tags from name and description
function extractTags(name: string, description: string | null): string[] {
  const tags: string[] = [];
  
  const text = `${name} ${description || ''}`.toLowerCase();
  
  if (text.includes('hero')) tags.push('hero');
  if (text.includes('banner')) tags.push('banner');
  if (text.includes('cta')) tags.push('cta');
  if (text.includes('button')) tags.push('button');
  if (text.includes('form')) tags.push('form');
  if (text.includes('footer')) tags.push('footer');
  if (text.includes('header')) tags.push('header');
  if (text.includes('khát vọng') || text.includes('vision')) tags.push('vision');
  if (text.includes('mạng') || text.includes('target')) tags.push('target');
  if (text.includes('sứ mệnh') || text.includes('mission')) tags.push('mission');
  
  return tags.length > 0 ? tags : ['general'];
}

main().catch(console.error);
