#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}========================================${NC}"
echo -e "${GREEN}  Next.js 16 Migration Verification${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

ERRORS=0

# 1. Check middleware.ts does NOT exist
echo -n "1. Checking middleware.ts is deleted... "
if [ -f "./middleware.ts" ] || [ -f "./middleware.js" ]; then
    echo -e "${RED}FAILED${NC}"
    echo -e "   ${RED}❌ Found deprecated middleware file!${NC}"
    ERRORS=$((ERRORS + 1))
else
    echo -e "${GREEN}PASSED${NC}"
fi

# 2. Check proxy.ts exists
echo -n "2. Checking proxy.ts exists... "
if [ -f "./proxy.ts" ]; then
    echo -e "${GREEN}PASSED${NC}"
else
    echo -e "${RED}FAILED${NC}"
    echo -e "   ${RED}❌ proxy.ts not found!${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 3. Check proxy.ts has getDomainConfig import
echo -n "3. Checking proxy.ts imports getDomainConfig... "
if grep -q "getDomainConfig" "./proxy.ts"; then
    echo -e "${GREEN}PASSED${NC}"
else
    echo -e "${RED}FAILED${NC}"
    echo -e "   ${RED}❌ Missing getDomainConfig import${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 4. Check proxy.ts has proxy function
echo -n "4. Checking proxy.ts exports proxy function... "
if grep -q "export async function proxy" "./proxy.ts"; then
    echo -e "${GREEN}PASSED${NC}"
else
    echo -e "${RED}FAILED${NC}"
    echo -e "   ${RED}❌ Missing proxy function${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 5. Check .gitignore includes middleware.ts
echo -n "5. Checking .gitignore blocks middleware.ts... "
if grep -q "middleware.ts" "./.gitignore"; then
    echo -e "${GREEN}PASSED${NC}"
else
    echo -e "${YELLOW}WARNING${NC}"
    echo -e "   ${YELLOW}⚠️  .gitignore doesn't block middleware.ts${NC}"
fi

# 6. Check domain-config.ts exists
echo -n "6. Checking lib/domain-config.ts exists... "
if [ -f "./lib/domain-config.ts" ]; then
    echo -e "${GREEN}PASSED${NC}"
else
    echo -e "${RED}FAILED${NC}"
    echo -e "   ${RED}❌ lib/domain-config.ts not found!${NC}"
    ERRORS=$((ERRORS + 1))
fi

# 7. Check for old cache
echo -n "7. Checking for Next.js cache... "
if [ -d "./.next" ]; then
    echo -e "${YELLOW}WARNING${NC}"
    echo -e "   ${YELLOW}⚠️  .next cache exists (will be cleared)${NC}"
    rm -rf .next .turbo
    echo -e "   ${GREEN}✓ Cache cleared${NC}"
else
    echo -e "${GREEN}PASSED${NC}"
fi

echo ""
echo -e "${BLUE}========================================${NC}"

if [ $ERRORS -eq 0 ]; then
    echo -e "${GREEN}✅ All checks passed!${NC}"
    echo -e "${GREEN}   Ready to run: bun run dev${NC}"
    echo -e "${BLUE}========================================${NC}"
    exit 0
else
    echo -e "${RED}❌ $ERRORS error(s) found!${NC}"
    echo -e "${RED}   Please fix the issues above${NC}"
    echo -e "${BLUE}========================================${NC}"
    exit 1
fi
