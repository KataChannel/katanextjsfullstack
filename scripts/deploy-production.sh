#!/bin/bash

# ============================================
# AUTO DEPLOYMENT SCRIPT
# Dùng để deploy/update application
# ============================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Config
APP_DIR="/var/www/katanextjsfullstack"
APP_NAME="multidomain-app"
BRANCH="webseo_dev3_alldomain"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🚀 Multi-Domain Deployment Script${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check if running as correct user
if [ "$EUID" -eq 0 ]; then 
    echo -e "${RED}❌ Please do not run as root${NC}"
    exit 1
fi

# Navigate to app directory
cd $APP_DIR || {
    echo -e "${RED}❌ App directory not found: $APP_DIR${NC}"
    exit 1
}

echo -e "${YELLOW}📂 Current directory: $(pwd)${NC}"
echo ""

# Step 1: Git pull
echo -e "${BLUE}📥 Step 1: Pulling latest code...${NC}"
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Code pulled successfully${NC}"
else
    echo -e "${RED}❌ Failed to pull code${NC}"
    exit 1
fi
echo ""

# Step 2: Install dependencies
echo -e "${BLUE}📦 Step 2: Installing dependencies...${NC}"
bun install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Step 3: Generate Prisma Client
echo -e "${BLUE}🔧 Step 3: Generating Prisma Client...${NC}"
bun run db:generate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Prisma Client generated${NC}"
else
    echo -e "${RED}❌ Failed to generate Prisma Client${NC}"
    exit 1
fi
echo ""

# Step 4: Run migrations (optional - comment if not needed)
echo -e "${BLUE}🗄️  Step 4: Running database migrations...${NC}"
read -p "Run migrations? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    bun run db:migrate
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Migrations completed${NC}"
    else
        echo -e "${RED}❌ Migrations failed${NC}"
        exit 1
    fi
else
    echo -e "${YELLOW}⏭️  Skipped migrations${NC}"
fi
echo ""

# Step 5: Build application
echo -e "${BLUE}🔨 Step 5: Building application...${NC}"
bun run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build completed${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

# Step 6: Reload PM2
echo -e "${BLUE}🔄 Step 6: Reloading PM2...${NC}"
pm2 reload $APP_NAME

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PM2 reloaded${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 reload failed, trying restart...${NC}"
    pm2 restart $APP_NAME
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PM2 restarted${NC}"
    else
        echo -e "${RED}❌ PM2 restart failed${NC}"
        exit 1
    fi
fi
echo ""

# Step 7: Check status
echo -e "${BLUE}📊 Step 7: Checking application status...${NC}"
pm2 status $APP_NAME
echo ""

# Step 8: Show logs
echo -e "${BLUE}📝 Recent logs:${NC}"
pm2 logs $APP_NAME --lines 20 --nostream
echo ""

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Deployment completed successfully!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

# Show domains
echo -e "${BLUE}🌐 Your domains:${NC}"
echo -e "   - https://tazagroup.vn"
echo -e "   - https://tazaskinclinic.com"
echo -e "   - https://timona.edu.vn"
echo -e "   - https://hderma.vn"
echo -e "   - https://elasome.com"
echo ""

# Useful commands
echo -e "${YELLOW}📚 Useful commands:${NC}"
echo -e "   - View logs:    ${BLUE}pm2 logs $APP_NAME${NC}"
echo -e "   - Monitor:      ${BLUE}pm2 monit${NC}"
echo -e "   - Restart:      ${BLUE}pm2 restart $APP_NAME${NC}"
echo -e "   - Stop:         ${BLUE}pm2 stop $APP_NAME${NC}"
echo ""
