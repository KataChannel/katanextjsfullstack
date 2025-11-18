#!/bin/bash

# ============================================
# InnerBright Docker Deployment Script
# Deploy to: 116.118.48.208
# Optimized for low-resource server (1CPU, 2GB RAM)
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Config
REMOTE_HOST="116.118.48.208"
REMOTE_USER="root"
REMOTE_DIR="/var/www/innerbright"
DEPLOY_ENV="production"
IMAGE_NAME="innerbright-web"
IMAGE_TAG="latest"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🐳 InnerBright Docker Deployment${NC}"
echo -e "${BLUE}============================================${NC}"
echo -e "${CYAN}Host: ${REMOTE_HOST}${NC}"
echo -e "${CYAN}Directory: ${REMOTE_DIR}${NC}"
echo ""

# Check if .env file exists locally
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found${NC}"
    echo -e "${YELLOW}Create .env from .env.docker.example first${NC}"
    exit 1
fi

# Step 1: Sync files to remote server
echo -e "${BLUE}📤 Step 1: Syncing files to remote server...${NC}"
rsync -avz --progress \
  --exclude 'node_modules' \
  --exclude '.next' \
  --exclude '.git' \
  --exclude 'public/uploads' \
  --exclude '.env.local' \
  ./ ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Files synced successfully${NC}"
else
    echo -e "${RED}❌ Failed to sync files${NC}"
    exit 1
fi
echo ""

# Step 2: Copy .env file
echo -e "${BLUE}📋 Step 2: Copying .env file...${NC}"
scp .env ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/.env
echo -e "${GREEN}✅ .env file copied${NC}"
echo ""

# Step 3: Build Docker image locally
echo -e "${BLUE}🔨 Step 3: Building Docker image locally...${NC}"
echo -e "${YELLOW}This will take a few minutes...${NC}"
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} . --quiet

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Image built successfully${NC}"
else
    echo -e "${RED}❌ Failed to build image${NC}"
    exit 1
fi
echo ""

# Step 4: Save and transfer image
echo -e "${BLUE}📦 Step 4: Saving and transferring image...${NC}"
echo -e "${YELLOW}This may take a few minutes...${NC}"

# Save image to tar
docker save ${IMAGE_NAME}:${IMAGE_TAG} | gzip > /tmp/innerbright-web.tar.gz

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Image saved${NC}"
    
    # Transfer to server
    echo -e "${BLUE}📤 Uploading image to server...${NC}"
    scp /tmp/innerbright-web.tar.gz ${REMOTE_USER}@${REMOTE_HOST}:/tmp/
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Image uploaded${NC}"
        rm /tmp/innerbright-web.tar.gz
    else
        echo -e "${RED}❌ Failed to upload image${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Failed to save image${NC}"
    exit 1
fi
echo ""

# Step 5: Execute remote deployment
echo -e "${BLUE}🚀 Step 5: Executing remote deployment...${NC}"
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'

# Remote config
REMOTE_DIR="/var/www/innerbright"
cd $REMOTE_DIR || exit 1

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}📂 Current directory: $(pwd)${NC}"
echo ""

# Create network if not exists
echo -e "${BLUE}🌐 Checking Docker network...${NC}"
docker network inspect innerbright-network >/dev/null 2>&1 || {
    echo -e "${YELLOW}Creating network innerbright-network...${NC}"
    docker network create innerbright-network
}
echo -e "${GREEN}✅ Network ready${NC}"
echo ""

# Load Docker image
echo -e "${BLUE}📥 Loading Docker image...${NC}"
if [ -f /tmp/innerbright-web.tar.gz ]; then
    gunzip -c /tmp/innerbright-web.tar.gz | docker load
    
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✅ Image loaded${NC}"
        rm /tmp/innerbright-web.tar.gz
    else
        echo -e "${RED}❌ Failed to load image${NC}"
        exit 1
    fi
else
    echo -e "${RED}❌ Image file not found${NC}"
    exit 1
fi
echo ""

# Check if infrastructure is already running
echo -e "${BLUE}🏗️  Checking infrastructure status...${NC}"
INFRA_RUNNING=$(docker compose -f docker-compose.infrastructure.yml ps --services --filter "status=running" 2>/dev/null | wc -l)

# Check if infrastructure needs network fix
INFRA_NETWORK_OK=true
if [ "$INFRA_RUNNING" -ge 4 ]; then
    # Verify postgres is on correct network
    POSTGRES_NET=$(docker inspect innerbright-postgres -f '{{range $key, $value := .NetworkSettings.Networks}}{{$key}}{{end}}' 2>/dev/null || echo "")
    if [ "$POSTGRES_NET" != "innerbright-network" ]; then
        echo -e "${YELLOW}⚠️  Infrastructure on wrong network, restarting...${NC}"
        docker compose -f docker-compose.infrastructure.yml down
        INFRA_RUNNING=0
        INFRA_NETWORK_OK=false
    fi
fi

if [ "$INFRA_RUNNING" -ge 4 ] && [ "$INFRA_NETWORK_OK" = true ]; then
    echo -e "${YELLOW}📊 Infrastructure already running (${INFRA_RUNNING} services)${NC}"
else
    echo -e "${BLUE}🏗️  Starting infrastructure (PostgreSQL, Redis, MinIO, PgAdmin)...${NC}"
    echo -e "${YELLOW}Starting services one by one to avoid resource spike...${NC}"
    
    # Start PostgreSQL first
    docker compose -f docker-compose.infrastructure.yml up -d postgres
    sleep 10
    
    # Start Redis
    docker compose -f docker-compose.infrastructure.yml up -d redis
    sleep 5
    
    # Start MinIO
    docker compose -f docker-compose.infrastructure.yml up -d minio
    sleep 5
    
    # Start MinIO client and PgAdmin
    docker compose -f docker-compose.infrastructure.yml up -d minio-client pgadmin
    
    echo -e "${GREEN}✅ Infrastructure started${NC}"
    
    # Wait for services to be healthy
    echo -e "${YELLOW}⏳ Waiting for services to be healthy (20s)...${NC}"
    sleep 20
    
    # Verify infrastructure
    docker compose -f docker-compose.infrastructure.yml ps
fi
echo ""

# Deploy website
echo -e "${BLUE}� Deploying website...${NC}"

# Stop old container if running
docker compose stop innerbright-web 2>/dev/null || true
docker compose rm -f innerbright-web 2>/dev/null || true

# Start new container
docker compose up -d

if [ $? -ne 0 ]; then
    echo -e "${RED}❌ Deployment failed${NC}"
    echo -e "${YELLOW}Checking if network exists...${NC}"
    docker network inspect innerbright-network >/dev/null 2>&1 || {
        echo -e "${YELLOW}Creating network...${NC}"
        docker network create innerbright-network
        docker compose up -d
    }
fi
echo -e "${GREEN}✅ Website deployed${NC}"
echo ""

# Cleanup old images
echo -e "${BLUE}🧹 Cleaning up old images...${NC}"
docker image prune -f
echo -e "${GREEN}✅ Cleanup completed${NC}"
echo ""

# Show status
echo -e "${BLUE}📊 Container status:${NC}"
echo ""
echo -e "${CYAN}Infrastructure:${NC}"
docker compose -f docker-compose.infrastructure.yml ps
echo ""
echo -e "${CYAN}Website:${NC}"
docker compose ps
echo ""

# Show logs
echo -e "${BLUE}📝 Recent logs (website):${NC}"
docker compose logs --tail=30 innerbright-web
echo ""

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Deployment completed!${NC}"
echo -e "${GREEN}============================================${NC}"

ENDSSH

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Remote deployment successful${NC}"
else
    echo -e "${RED}❌ Remote deployment failed${NC}"
    exit 1
fi
echo ""

# Summary
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}🎉 Deployment Summary${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${CYAN}✅ Infrastructure running:${NC}"
echo -e "   • PostgreSQL: port 5432"
echo -e "   • PgAdmin: http://${REMOTE_HOST}:5050"
echo -e "   • Redis: port 6379"
echo -e "   • MinIO: http://${REMOTE_HOST}:9000"
echo -e "   • MinIO Console: http://${REMOTE_HOST}:9001"
echo ""
echo -e "${CYAN}✅ Website running:${NC}"
echo -e "   • Application: http://${REMOTE_HOST}:3005"
echo -e "   • Domain: https://innerbright.vn (after Nginx setup)"
echo ""
echo -e "${YELLOW}📚 Useful commands (run on remote server):${NC}"
echo -e "   ${BLUE}ssh ${REMOTE_USER}@${REMOTE_HOST}${NC}"
echo -e "   ${BLUE}cd ${REMOTE_DIR}${NC}"
echo -e "   ${BLUE}docker compose logs -f${NC}              - View logs"
echo -e "   ${BLUE}docker compose ps${NC}                   - Check status"
echo -e "   ${BLUE}docker compose restart${NC}              - Restart services"
echo -e "   ${BLUE}docker compose down${NC}                 - Stop services"
echo -e "   ${BLUE}docker compose up -d${NC}                - Start services"
echo ""
echo -e "${YELLOW}🔧 Next steps:${NC}"
echo -e "   1. Setup Nginx reverse proxy"
echo -e "   2. Configure SSL with Certbot"
echo -e "   3. Update DNS records"
echo ""
echo -e "${GREEN}Done! 🚀${NC}"
