#!/bin/bash

# Quick fix for tazaskin database using the database URL from domain-config
# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}  Fix TazaSkin Database Schema${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

# Database URL from domain-config.ts
DB_URL="postgresql://postgres:postgres@116.118.49.243:13003/tazaskinclinic"

echo -e "${YELLOW}Database: tazaskinclinic${NC}"
echo -e "${BLUE}Server: 116.118.49.243:13003${NC}"
echo ""

# Export DATABASE_URL
export DATABASE_URL="$DB_URL"

# Push schema
echo -e "${YELLOW}📦 Pushing schema to tazaskinclinic database...${NC}"
bun run prisma db push --accept-data-loss --skip-generate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Schema pushed successfully to tazaskinclinic${NC}"
else
    echo -e "${RED}❌ Failed to push schema${NC}"
    echo -e "${YELLOW}This might be a connection issue. Check:${NC}"
    echo "  - Database server is running"
    echo "  - Port 13003 is accessible"
    echo "  - Database 'tazaskinclinic' exists"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔧 Generating Prisma Client...${NC}"
bun run prisma generate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Prisma Client generated${NC}"
else
    echo -e "${RED}❌ Failed to generate Prisma Client${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ TazaSkin database fixed!${NC}"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Clear Next.js cache: rm -rf .next"
echo "  2. Run dev server: bun run dev:tazaskin"
echo "  3. Access: http://localhost:3001"
echo -e "${BLUE}════════════════════════════════════════${NC}"
