import { getPrisma } from '../lib/prisma';

async function main() {
  const prisma = await getPrisma();
  
  console.log('🔍 Checking BlockTemplateV2 details...\n');
  
  const templates = await prisma.blockTemplateV2.findMany({
    include: {
      author: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  
  console.log(`Found ${templates.length} templates:\n`);
  
  templates.forEach(t => {
    console.log(`📄 ${t.name}`);
    console.log(`   ID: ${t.id}`);
    console.log(`   Category: ${t.category}`);
    console.log(`   Published: ${t.published}`);
    console.log(`   Tags: ${t.tags.join(', ')}`);
    console.log(`   Downloads: ${t.downloads}`);
    console.log(`   Author: ${t.author.email}`);
    console.log(`   Created: ${t.createdAt.toISOString()}`);
    console.log('');
  });
  
  await prisma.$disconnect();
}

main();
