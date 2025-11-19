import { getPrisma } from '../lib/prisma';

async function main() {
  const prisma = await getPrisma();
  
  console.log('📊 Checking templates in database...\n');
  
  const templates = await prisma.blockTemplate.findMany();
  console.log(`BlockTemplate (V1): ${templates.length} records`);
  templates.forEach(t => console.log(`  - ${t.name} (${t.category})`));
  
  const templatesV2 = await prisma.blockTemplateV2.findMany();
  console.log(`\nBlockTemplateV2 (V2): ${templatesV2.length} records`);
  templatesV2.forEach(t => console.log(`  - ${t.name} (${t.category})`));
  
  await prisma.$disconnect();
}

main();
