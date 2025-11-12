#!/bin/bash

# ============================================
# DEPLOY SINGLE DOMAIN
# Update một domain cụ thể
# ============================================

set -e

# Get domain from argument
DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "❌ Error: Domain not specified"
    echo ""
    echo "Usage: ./deploy-single-domain.sh <domain>"
    echo ""
    echo "Available domains:"
    echo "  - tazagroup.vn"
    echo "  - tazaskinclinic.com"
    echo "  - timona.edu.vn"
    echo "  - hderma.vn"
    echo "  - elasome.com"
    echo ""
    echo "Example:"
    echo "  ./deploy-single-domain.sh tazagroup.vn"
    exit 1
fi

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Determine app directory based on deployment method
# Method 1: Each domain in its own directory
APP_DIR="/var/www/${DOMAIN}"

# If not found, try multi-port setup
if [ ! -d "$APP_DIR" ]; then
    # Method 2: All domains in same directory but different instances
    APP_DIR="/var/www/katanextjsfullstack"
    if [ ! -d "$APP_DIR" ]; then
        echo -e "${RED}❌ Error: Application directory not found${NC}"
        echo -e "${YELLOW}Searched: /var/www/${DOMAIN} and /var/www/katanextjsfullstack${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🚀 Deploying ${DOMAIN}${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

echo -e "${YELLOW}📂 App directory: ${APP_DIR}${NC}"
echo ""

# Navigate to app directory
cd $APP_DIR || {
    echo -e "${RED}❌ Failed to enter directory: $APP_DIR${NC}"
    exit 1
}

# Pull latest code
echo -e "${BLUE}📥 Step 1: Pulling latest code...${NC}"
git fetch origin
git checkout webseo_dev3_alldomain
git pull origin webseo_dev3_alldomain

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Code updated${NC}"
else
    echo -e "${RED}❌ Failed to pull code${NC}"
    exit 1
fi
echo ""

# Install dependencies
echo -e "${BLUE}📦 Step 2: Installing dependencies...${NC}"
bun install

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Dependencies installed${NC}"
else
    echo -e "${RED}❌ Failed to install dependencies${NC}"
    exit 1
fi
echo ""

# Generate Prisma Client
echo -e "${BLUE}🔧 Step 3: Generating Prisma Client...${NC}"
bun run db:generate

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Prisma Client generated${NC}"
else
    echo -e "${RED}❌ Failed to generate Prisma Client${NC}"
    exit 1
fi
echo ""

# Run migrations (optional)
echo -e "${BLUE}🗄️  Step 4: Database migrations...${NC}"
read -p "Run database migrations? (y/n): " -n 1 -r
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

# Build application
echo -e "${BLUE}🔨 Step 5: Building application...${NC}"
bun run build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Build completed${NC}"
else
    echo -e "${RED}❌ Build failed${NC}"
    exit 1
fi
echo ""

# Determine PM2 app name
# Could be domain name or specific app name
PM2_NAME="${DOMAIN}"

# Try to find PM2 process
pm2 describe $PM2_NAME > /dev/null 2>&1
if [ $? -ne 0 ]; then
    # Try alternative names
    if [[ "$DOMAIN" == "tazagroup.vn" ]]; then
        PM2_NAME="tazagroup-app"
    elif [[ "$DOMAIN" == "tazaskinclinic.com" ]]; then
        PM2_NAME="tazaskin-app"
    elif [[ "$DOMAIN" == "timona.edu.vn" ]]; then
        PM2_NAME="timona-app"
    elif [[ "$DOMAIN" == "hderma.vn" ]]; then
        PM2_NAME="hderma-app"
    elif [[ "$DOMAIN" == "elasome.com" ]]; then
        PM2_NAME="elasome-app"
    fi
fi

# Reload PM2
echo -e "${BLUE}🔄 Step 6: Reloading PM2...${NC}"
pm2 reload $PM2_NAME

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ PM2 reloaded${NC}"
else
    echo -e "${YELLOW}⚠️  PM2 reload failed, trying restart...${NC}"
    pm2 restart $PM2_NAME
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ PM2 restarted${NC}"
    else
        echo -e "${RED}❌ PM2 restart failed${NC}"
        echo -e "${YELLOW}Try: pm2 status to check process name${NC}"
        exit 1
    fi
fi
echo ""

# Show status
echo -e "${BLUE}📊 Step 7: Checking status...${NC}"
pm2 status $PM2_NAME
echo ""

# Show recent logs
echo -e "${BLUE}📝 Recent logs:${NC}"
pm2 logs $PM2_NAME --lines 20 --nostream
echo ""

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ ${DOMAIN} deployed successfully!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

echo -e "${YELLOW}📚 Useful commands:${NC}"
echo -e "   - View logs:    ${BLUE}pm2 logs ${PM2_NAME}${NC}"
echo -e "   - Monitor:      ${BLUE}pm2 monit${NC}"
echo -e "   - Restart:      ${BLUE}pm2 restart ${PM2_NAME}${NC}"
echo -e "   - Stop:         ${BLUE}pm2 stop ${PM2_NAME}${NC}"
echo ""
echo -e "${BLUE}🌐 Access: https://${DOMAIN}${NC}"
echo ""
