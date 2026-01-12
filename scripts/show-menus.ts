import { getPrisma } from '../lib/prisma';

/**
 * Script hiển thị menu structure từ database
 */

async function showMenus() {
  const domain = 'innerbright.vn';
  const prisma = await getPrisma(domain);

  console.log('\n📋 Menu Structure for InnerBright');
  console.log('═══════════════════════════════════════════\n');

  const allMenus = await prisma.menu.findMany({
    orderBy: { order: 'asc' },
  });

  const publicMenus = allMenus.filter(m => !m.url.startsWith('/admin'));
  const adminMenus = allMenus.filter(m => m.url.startsWith('/admin'));

  console.log('🌐 PUBLIC MENUS (Header Navigation)');
  console.log('─────────────────────────────────────────');
  publicMenus.forEach((menu, idx) => {
    const icon = menu.icon ? `[${menu.icon}]` : '';
    const status = menu.published ? '✅' : '❌';
    console.log(`  ${idx + 1}. ${status} ${menu.label.padEnd(30)} ${icon.padEnd(20)} → ${menu.url}`);
  });
  
  console.log(`\n  Total: ${publicMenus.length} items\n`);

  console.log('🔐 ADMIN MENUS (Admin Sidebar)');
  console.log('─────────────────────────────────────────');
  adminMenus.forEach((menu, idx) => {
    const icon = menu.icon ? `[${menu.icon}]` : '';
    const status = menu.published ? '✅' : '❌';
    console.log(`  ${idx + 1}. ${status} ${menu.label.padEnd(30)} ${icon.padEnd(20)} → ${menu.url}`);
  });
  
  console.log(`\n  Total: ${adminMenus.length} items\n`);

  console.log('📊 SUMMARY');
  console.log('─────────────────────────────────────────');
  console.log(`  Domain: ${domain}`);
  console.log(`  Public menus: ${publicMenus.length}`);
  console.log(`  Admin menus: ${adminMenus.length}`);
  console.log(`  Total menus: ${allMenus.length}`);
  console.log(`  Published: ${allMenus.filter(m => m.published).length}`);
  console.log(`  Unpublished: ${allMenus.filter(m => !m.published).length}`);
  console.log('');
}

showMenus()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('❌ Error:', error);
    process.exit(1);
  });
