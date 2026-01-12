#!/usr/bin/env bun
/**
 * Test script: Ensure Admin User API
 * 
 * Tests the auto-creation of admin user when none exists
 */

import { getPrisma } from '../lib/prisma';

async function testEnsureAdmin() {
  console.log('🧪 Testing Ensure Admin User API...\n');
  
  try {
    const prisma = await getPrisma();
    
    // Step 1: Check current user count
    const userCount = await prisma.user.count();
    console.log(`📊 Current user count: ${userCount}`);
    
    const adminCount = await prisma.user.count({
      where: { role: 'admin' }
    });
    console.log(`👤 Admin count: ${adminCount}\n`);
    
    // Step 2: Test the ensure-admin API
    console.log('🔧 Testing /api/users/ensure-admin endpoint...');
    
    const response = await fetch('http://localhost:3000/api/users/ensure-admin', {
      method: 'POST',
    });
    
    const data = await response.json();
    console.log('\n📥 API Response:');
    console.log(JSON.stringify(data, null, 2));
    
    // Step 3: Verify result
    if (data.success) {
      console.log('\n✅ Success!');
      console.log(`   User ID: ${data.userId}`);
      console.log(`   Message: ${data.message}`);
      
      if (data.credentials) {
        console.log('\n🔑 Default Credentials:');
        console.log(`   Email: ${data.credentials.email}`);
        console.log(`   Password: ${data.credentials.password}`);
        console.log(`   Note: ${data.credentials.note}`);
      }
    } else {
      console.log('\n❌ Failed');
      console.log(`   Error: ${data.error}`);
      if (data.details) {
        console.log(`   Details: ${data.details}`);
      }
    }
    
    // Step 4: Verify in database
    console.log('\n🔍 Verifying in database...');
    const verifyUser = await prisma.user.findUnique({
      where: { id: data.userId },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        emailVerified: true,
        createdAt: true,
      }
    });
    
    if (verifyUser) {
      console.log('✅ User found in database:');
      console.log(`   ID: ${verifyUser.id}`);
      console.log(`   Email: ${verifyUser.email}`);
      console.log(`   Name: ${verifyUser.name}`);
      console.log(`   Role: ${verifyUser.role}`);
      console.log(`   Email Verified: ${verifyUser.emailVerified ? 'Yes' : 'No'}`);
      console.log(`   Created: ${verifyUser.createdAt.toISOString()}`);
    } else {
      console.log('❌ User not found in database');
    }
    
  } catch (error) {
    console.error('\n❌ Test failed:');
    console.error(error);
    process.exit(1);
  }
}

// Run test
testEnsureAdmin()
  .then(() => {
    console.log('\n✨ Test completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Test error:', error);
    process.exit(1);
  });
