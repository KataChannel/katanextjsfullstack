#!/bin/bash

# Fix all domain databases
# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Fix All Domain Databases - Push Schema${NC}"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo ""

# Array of databases from domain-config.ts
declare -A DATABASES
DATABASES=(
    [tazagroup]="postgresql://postgres:postgres@116.118.49.243:13003/tazagroupvn"
    [tazaskin]="postgresql://postgres:postgres@116.118.49.243:13003/tazaskinclinic"
    [timona]="postgresql://postgres:postgres@116.118.49.243:13003/timona"
    [hderma]="postgresql://postgres:postgres@116.118.49.243:13003/hderma"
    [elasome]="postgresql://postgres:postgres@116.118.49.243:13003/elasome"
    [innerbright]="postgresql://postgres:postgres@116.118.48.208:5432/innerv2core"
)

SUCCESS_COUNT=0
FAIL_COUNT=0

# Process each database
for domain in "${!DATABASES[@]}"; do
    DB_URL="${DATABASES[$domain]}"
    DB_NAME=$(echo "$DB_URL" | sed 's/.*\///')
    
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${YELLOW}Processing: ${domain} (${DB_NAME})${NC}"
    echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    
    # Export DATABASE_URL
    export DATABASE_URL="$DB_URL"
    
    # Push schema
    echo -e "${YELLOW}📦 Pushing schema...${NC}"
    bun x prisma db push --accept-data-loss --skip-generate 2>&1 | grep -v "deprecated"
    
    if [ ${PIPESTATUS[0]} -eq 0 ]; then
        echo -e "${GREEN}✅ ${domain}: Schema pushed successfully${NC}"
        SUCCESS_COUNT=$((SUCCESS_COUNT + 1))
    else
        echo -e "${RED}❌ ${domain}: Failed to push schema${NC}"
        FAIL_COUNT=$((FAIL_COUNT + 1))
    fi
    
    echo ""
done

# Generate Prisma Client once
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}🔧 Generating Prisma Client...${NC}"
bun x prisma generate 2>&1 | grep -v "deprecated"

if [ ${PIPESTATUS[0]} -eq 0 ]; then
    echo -e "${GREEN}✅ Prisma Client generated${NC}"
else
    echo -e "${RED}❌ Failed to generate Prisma Client${NC}"
fi

echo ""
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}📊 Summary:${NC}"
echo -e "   ✅ Success: ${SUCCESS_COUNT} database(s)"
echo -e "   ❌ Failed:  ${FAIL_COUNT} database(s)"
echo ""
echo -e "${YELLOW}Next steps:${NC}"
echo "  1. Stop any running dev servers (Ctrl+C)"
echo "  2. Clear cache: rm -rf .next .turbo"
echo "  3. Run: bun run dev"
echo -e "${BLUE}════════════════════════════════════════════════════${NC}"
