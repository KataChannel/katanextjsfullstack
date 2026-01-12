#!/bin/bash

# Script to create an admin user quickly
# Usage: ./scripts/create-admin.sh

echo "🔐 Create Admin User Script"
echo "============================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ Error: .env file not found!"
    echo "Please create .env file first (copy from .env.example)"
    exit 1
fi

# Prompt for user details
read -p "Enter admin email: " ADMIN_EMAIL
read -sp "Enter admin password: " ADMIN_PASSWORD
echo ""
read -p "Enter admin name (optional): " ADMIN_NAME

# Validate inputs
if [ -z "$ADMIN_EMAIL" ] || [ -z "$ADMIN_PASSWORD" ]; then
    echo "❌ Error: Email and password are required!"
    exit 1
fi

# Check password length
if [ ${#ADMIN_PASSWORD} -lt 8 ]; then
    echo "❌ Error: Password must be at least 8 characters!"
    exit 1
fi

echo ""
echo "Creating admin user..."

# Use Node.js to create user with bcrypt hashing
node -e "
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createAdmin() {
  try {
    const hashedPassword = await bcrypt.hash('$ADMIN_PASSWORD', 12);
    
    const user = await prisma.user.create({
      data: {
        email: '$ADMIN_EMAIL',
        password: hashedPassword,
        name: '$ADMIN_NAME' || null,
        role: 'admin',
        emailVerified: new Date(),
      },
    });
    
    console.log('✅ Admin user created successfully!');
    console.log('Email:', user.email);
    console.log('Name:', user.name || 'N/A');
    console.log('Role:', user.role);
    console.log('');
    console.log('You can now login at: http://localhost:3000/auth/login');
    
    process.exit(0);
  } catch (error) {
    if (error.code === 'P2002') {
      console.error('❌ Error: User with this email already exists!');
    } else {
      console.error('❌ Error:', error.message);
    }
    process.exit(1);
  } finally {
    await prisma.\$disconnect();
  }
}

createAdmin();
"

echo ""
echo "Done!"
