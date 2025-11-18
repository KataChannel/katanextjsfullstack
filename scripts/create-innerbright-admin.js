#!/usr/bin/env node
/**
 * Script to create admin user for innerbright.vn
 * Run: node scripts/create-innerbright-admin.js
 */

const { PrismaClient } = require('@prisma/client');
const { hash } = require('bcryptjs');

async function main() {
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: 'postgresql://postgres:2kOIU5HX98Nb@116.118.48.208:5432/innerv2core',
      },
    },
  });

  try {
    console.log('🔐 Creating admin user for innerbright.vn...\n');

    const email = 'admin@innerbright.vn';
    const password = 'Admin@2025!'; // Change this!
    const hashedPassword = await hash(password, 12);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      // Update existing user
      const updated = await prisma.user.update({
        where: { email },
        data: {
          password: hashedPassword,
          role: 'admin',
          emailVerified: new Date(),
        },
      });
      console.log('✅ Updated existing user:');
      console.log(`   Email: ${updated.email}`);
      console.log(`   Role: ${updated.role}`);
      console.log(`   Verified: ${updated.emailVerified}`);
    } else {
      // Create new user
      const user = await prisma.user.create({
        data: {
          email,
          name: 'InnerBright Admin',
          password: hashedPassword,
          role: 'admin',
          emailVerified: new Date(),
        },
      });
      console.log('✅ Created new admin user:');
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.name}`);
      console.log(`   Role: ${user.role}`);
    }

    console.log(`\n🔑 Login credentials:`);
    console.log(`   URL: https://innerbright.vn/auth/login`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`\n⚠️  IMPORTANT: Change this password after first login!\n`);

  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
