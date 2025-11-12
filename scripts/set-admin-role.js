#!/usr/bin/env node

/**
 * Script to set role for a user by email
 * Usage: node scripts/set-admin-role.js <email> [role]
 * Roles: admin, manager, editor, user (default: admin)
 */

const { PrismaClient } = require('@prisma/client');

const email = process.argv[2];
const role = process.argv[3] || 'admin';

const validRoles = ['admin', 'manager', 'editor', 'user'];

if (!email) {
  console.error('❌ Error: Email is required!');
  console.log('Usage: node scripts/set-admin-role.js <email> [role]');
  console.log('Roles: admin, manager, editor, user (default: admin)');
  console.log('');
  console.log('Examples:');
  console.log('  node scripts/set-admin-role.js user@example.com admin');
  console.log('  node scripts/set-admin-role.js user@example.com manager');
  console.log('  node scripts/set-admin-role.js user@example.com editor');
  process.exit(1);
}

if (!validRoles.includes(role)) {
  console.error(`❌ Error: Invalid role "${role}"!`);
  console.log('Valid roles: admin, manager, editor, user');
  process.exit(1);
}

// Connect to tazagroupvn database (default auth database)
const DATABASE_URL = 'postgresql://postgres:postgres@116.118.49.243:13003/tazagroupvn';

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: DATABASE_URL,
    },
  },
});

async function setUserRole() {
  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      console.error(`❌ Error: User with email "${email}" not found!`);
      process.exit(1);
    }

    await prisma.user.update({
      where: { email },
      data: { role },
    });

    const roleNames = {
      admin: 'Quản trị viên (Admin)',
      manager: 'Người quản lý (Manager)',
      editor: 'Biên tập viên (Editor)',
      user: 'Người dùng (User)',
    };

    const rolePermissions = {
      admin: 'Full quyền - Toàn bộ hệ thống',
      manager: 'Quản lý nội dung, media, page builder',
      editor: 'Chỉnh sửa nội dung, media, page builder',
      user: 'Không có quyền quản trị',
    };

    console.log('✅ Success!');
    console.log(`User "${email}" role updated to: ${roleNames[role]}`);
    console.log('');
    console.log('User details:');
    console.log('  Email:', user.email);
    console.log('  Name:', user.name || 'N/A');
    console.log('  Role:', roleNames[role]);
    console.log('  Permissions:', rolePermissions[role]);
    console.log('');
    
    if (role !== 'user') {
      console.log('You can now access: http://localhost:3000/admin');
    } else {
      console.log('Note: User role does not have admin access.');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setUserRole();
