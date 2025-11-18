#!/bin/bash

echo "==================================="
echo "  Fix Database for OAuth Login"
echo "==================================="

# SSH to server and run fix
ssh root@116.118.48.208 << 'ENDSSH'

# Create fix script inside container
docker exec innerbright-web sh -c 'cat > /tmp/fix-oauth.js << '\''ENDJS'\''
const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient({
  datasources: { db: { url: process.env.DATABASE_URL } }
});

async function fix() {
  console.log("Starting OAuth fix...");
  
  // 1. Delete old Google account links
  const deleted = await prisma.account.deleteMany({
    where: { provider: "google" }
  });
  console.log("Deleted Google accounts:", deleted.count);
  
  // 2. Check if kata user exists
  const kataUser = await prisma.user.findUnique({
    where: { email: "katachanneloffical@gmail.com" }
  });
  
  if (!kataUser) {
    // 3. Create new user
    const newUser = await prisma.user.create({
      data: {
        email: "katachanneloffical@gmail.com",
        name: "Kata Channel",
        role: "admin",
        emailVerified: new Date(),
      }
    });
    console.log("Created user:", newUser.email, "with role:", newUser.role);
  } else {
    console.log("User already exists:", kataUser.email);
  }
  
  await prisma.$disconnect();
  console.log("Fix complete!");
}

fix().catch(console.error);
ENDJS'

# Run the fix script
echo "Running fix script..."
docker exec innerbright-web bun /tmp/fix-oauth.js

# Clean up
docker exec innerbright-web rm /tmp/fix-oauth.js

ENDSSH

echo ""
echo "✓ Fix complete! Try logging in with katachanneloffical@gmail.com"
