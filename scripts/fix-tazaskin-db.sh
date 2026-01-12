#!/bin/bash

# Quick fix script for tazaskin database
# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}  Quick Fix: TazaSkin Database${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

# Get tazaskin database URL from .env
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    exit 1
fi

DB_URL=$(grep "^DATABASE_TAZASKIN_URL=" .env | cut -d '=' -f2- | tr -d '"')

if [ -z "$DB_URL" ]; then
    echo -e "${RED}❌ DATABASE_TAZASKIN_URL not found in .env${NC}"
    exit 1
fi

echo -e "${YELLOW}Database: TazaSkin${NC}"
echo -e "${BLUE}URL: ${DB_URL:0:50}...${NC}"
echo ""

# Export DATABASE_URL
export DATABASE_URL="$DB_URL"

# Push schema
echo -e "${YELLOW}📦 Pushing schema to database...${NC}"
bunx prisma db push --accept-data-loss --skip-generate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Schema pushed successfully${NC}"
else
    echo -e "${RED}❌ Failed to push schema${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}🔧 Generating Prisma Client...${NC}"
bunx prisma generate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Prisma Client generated${NC}"
else
    echo -e "${RED}❌ Failed to generate Prisma Client${NC}"
    exit 1
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ TazaSkin database fixed!${NC}"
echo -e "${YELLOW}   You can now run: bun run dev:tazaskin${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
