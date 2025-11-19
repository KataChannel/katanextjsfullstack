#!/bin/bash

# ============================================
# QUICK DEPLOY - Deploy Code Mới Lên Server
# ============================================
# Features:
# - Tiptap Text Block
# - Container Background Settings
# - Homepage Settings
# - All latest updates
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
IMAGE_NAME="innerbright-web"
IMAGE_TAG="latest"
SERVER_IP="116.118.48.208"
SERVER_USER="root"
DOMAIN="innerbright.vn"

echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}🚀 Quick Deploy - Code Mới${NC}"
echo -e "${CYAN}============================================${NC}"
echo -e "${BLUE}Domain: ${DOMAIN}${NC}"
echo -e "${BLUE}Server: ${SERVER_IP}${NC}"
echo ""

# Step 1: Git commit (optional - cho phép skip)
echo -e "${YELLOW}[1/6] Git Commit${NC}"
read -p "Commit message (hoặc Enter để skip): " COMMIT_MSG
if [ ! -z "$COMMIT_MSG" ]; then
    git add .
    git commit -m "$COMMIT_MSG" || echo "No changes to commit"
    git push origin webseo_dev3_alldomain
    echo -e "${GREEN}✓ Code pushed${NC}"
else
    echo -e "${YELLOW}⊘ Skipped git commit${NC}"
fi
echo ""

# Step 2: Build Docker Image
echo -e "${YELLOW}[2/6] Building Docker Image...${NC}"
docker build -t ${IMAGE_NAME}:${IMAGE_TAG} \
    --build-arg DOMAIN=${DOMAIN} \
    -f Dockerfile .
echo -e "${GREEN}✓ Image built${NC}"
echo ""

# Step 3: Export Image
echo -e "${YELLOW}[3/6] Exporting image...${NC}"
EXPORT_FILE="${IMAGE_NAME}-$(date +%Y%m%d_%H%M%S).tar.gz"
docker save ${IMAGE_NAME}:${IMAGE_TAG} | gzip > ${EXPORT_FILE}
FILE_SIZE=$(du -h "${EXPORT_FILE}" | cut -f1)
echo -e "${GREEN}✓ Exported: ${FILE_SIZE}${NC}"
echo ""

# Step 4: Transfer to Server
echo -e "${YELLOW}[4/6] Transferring to server...${NC}"
scp ${EXPORT_FILE} ${SERVER_USER}@${SERVER_IP}:/root/
echo -e "${GREEN}✓ Uploaded${NC}"
echo ""

# Step 5: Deploy on Server
echo -e "${YELLOW}[5/6] Deploying on server...${NC}"

ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

cd /root

# Find latest tar.gz file
LATEST_FILE=$(ls -t innerbright-web-*.tar.gz 2>/dev/null | head -1)

if [ -z "$LATEST_FILE" ]; then
    echo "ERROR: No image file found!"
    exit 1
fi

echo "Loading image: $LATEST_FILE"
gunzip -c "$LATEST_FILE" | docker load

# Stop old container
echo "Stopping old container..."
docker stop innerbright-web 2>/dev/null || true
docker rm innerbright-web 2>/dev/null || true

# Network
NETWORK_NAME="innerv2core-network"
if ! docker network ls | grep -q $NETWORK_NAME; then
    echo "Creating network..."
    docker network create $NETWORK_NAME
fi

# Check env file
if [ ! -f "/root/.env.innerbright" ]; then
    echo "ERROR: .env.innerbright not found!"
    exit 1
fi

# Start new container
echo "Starting new container..."
docker run -d \
    --name innerbright-web \
    --restart unless-stopped \
    --network $NETWORK_NAME \
    -p 3005:3005 \
    --env-file /root/.env.innerbright \
    -v /root/innerbright/public/uploads:/app/public/uploads \
    -v /root/innerbright/public/icons:/app/public/icons \
    --memory="768m" \
    --memory-reservation="512m" \
    innerbright-web:latest

# Wait for startup
echo "Waiting for startup..."
sleep 15

# Health check
echo "Health check..."
if docker ps | grep -q innerbright-web; then
    echo "✓ Container running"
    docker logs innerbright-web --tail 30
else
    echo "✗ Container failed to start"
    docker logs innerbright-web --tail 50
    exit 1
fi

# Cleanup old images (keep last 3)
echo "Cleaning up old images..."
ls -t innerbright-web-*.tar.gz 2>/dev/null | tail -n +4 | xargs rm -f 2>/dev/null || true

# Cleanup unused Docker images
docker image prune -f

echo "✓ Deploy complete!"
ENDSSH

echo -e "${GREEN}✓ Deployed on server${NC}"
echo ""

# Step 6: Health Check
echo -e "${YELLOW}[6/6] Testing website...${NC}"
sleep 5

# Test homepage
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://${DOMAIN}/)
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ Homepage: OK (200)${NC}"
else
    echo -e "${RED}✗ Homepage: Failed ($HTTP_CODE)${NC}"
fi

# Test API health
API_RESPONSE=$(curl -s https://${DOMAIN}/api/health || echo "error")
if echo "$API_RESPONSE" | grep -q "ok"; then
    echo -e "${GREEN}✓ API Health: OK${NC}"
else
    echo -e "${RED}✗ API Health: Failed${NC}"
fi

# Cleanup local
rm -f ${EXPORT_FILE}

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Deploy Hoàn Tất!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${CYAN}📝 Features Deployed:${NC}"
echo "  ✓ Tiptap Text Block (Notion-like)"
echo "  ✓ Container Background Settings"
echo "  ✓ Homepage Settings với Combobox"
echo "  ✓ Block Templates V2"
echo "  ✓ All latest updates"
echo ""
echo -e "${CYAN}🌐 Website:${NC} ${BLUE}https://${DOMAIN}${NC}"
echo -e "${CYAN}🔧 Admin:${NC} ${BLUE}https://${DOMAIN}/admin${NC}"
echo ""
echo -e "${YELLOW}📊 Check logs:${NC}"
echo -e "  ssh ${SERVER_USER}@${SERVER_IP} 'docker logs -f innerbright-web'"
echo ""
echo -e "${YELLOW}🔄 Rollback (if needed):${NC}"
echo -e "  ssh ${SERVER_USER}@${SERVER_IP}"
echo -e "  docker stop innerbright-web && docker rm innerbright-web"
echo -e "  docker run ... (previous image)"
echo ""
