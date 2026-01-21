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
BRANCH="webseo_dev5"

echo -e "${CYAN}============================================${NC}"
echo -e "${CYAN}🚀 Quick Deploy - Code Mới${NC}"
echo -e "${CYAN}============================================${NC}"
echo -e "${BLUE}Domain: ${DOMAIN}${NC}"
echo -e "${BLUE}Server: ${SERVER_IP}${NC}"
echo -e "${BLUE}Branch: ${BRANCH}${NC}"
echo ""

# Step 0: Pre-check Server
echo -e "${YELLOW}[0/6] Checking Server Status...${NC}"
if ! ssh -o ConnectTimeout=5 -o BatchMode=yes ${SERVER_USER}@${SERVER_IP} "echo 'SSH OK'" &>/dev/null; then
    echo -e "${YELLOW}⚠️  SSH Password-less access not verified, you may need to enter password during deployment.${NC}"
else
    DISK_USAGE=$(ssh ${SERVER_USER}@${SERVER_IP} "df -h / | awk 'NR==2 {print \$5}' | sed 's/%//'")
    if [ "$DISK_USAGE" -gt 90 ]; then
        echo -e "${RED}❌ Server Disk Usage is high: ${DISK_USAGE}%${NC}"
        echo -e "${YELLOW}Please clean up server before deployment.${NC}"
        exit 1
    fi
    echo -e "${GREEN}✓ Server Disk Usage: ${DISK_USAGE}% (OK)${NC}"
fi
echo ""

# Step 1: Git commit (optional - cho phép skip)
echo -e "${YELLOW}[1/6] Git Commit${NC}"
read -p "Commit message (hoặc Enter để skip/auto): " COMMIT_MSG
if [ -z "$COMMIT_MSG" ]; then
    COMMIT_MSG="Auto deploy at $(date +'%Y-%m-%d %H:%M:%S')"
fi

git add .
git commit -m "$COMMIT_MSG" || echo "No changes to commit"
git push origin $BRANCH
echo -e "${GREEN}✓ Code pushed to $BRANCH${NC}"
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
EXPORT_FILE="${IMAGE_NAME}.tar.gz"
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
IMAGE_FILE="innerbright-web.tar.gz"

if [ ! -f "$IMAGE_FILE" ]; then
    echo "ERROR: Image file $IMAGE_FILE not found!"
    exit 1
fi

echo "Loading image: $IMAGE_FILE"
gunzip -c "$IMAGE_FILE" | docker load

# Stop old container
echo "Stopping old container..."
docker stop innerbright-web 2>/dev/null || true
docker rm innerbright-web 2>/dev/null || true

# Network check
NETWORK_NAME="innerbright-network"
if ! docker network ls | grep -q $NETWORK_NAME; then
    echo "Creating network $NETWORK_NAME..."
    docker network create $NETWORK_NAME
fi

# Start new container
echo "Starting new container..."
# Lưu ý: Volume mapping cho uploads và icons
mkdir -p /root/innerbright/public/uploads
mkdir -p /root/innerbright/public/icons

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

# Cleanup image file
rm -f "$IMAGE_FILE"

# Health check
echo "Waiting for startup..."
sleep 20

if docker ps | grep -q innerbright-web; then
    echo "✓ Container running"
    docker logs innerbright-web --tail 50
else
    echo "✗ Container failed to start"
    docker logs innerbright-web --tail 100
    exit 1
fi

docker image prune -f
echo "✓ Deploy complete on server!"
ENDSSH

echo -e "${GREEN}✓ Deployed on server${NC}"
echo ""

# Step 6: Health Check
echo -e "${YELLOW}[6/6] Testing website...${NC}"
sleep 10

# Test IP direct
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://${SERVER_IP}:3005/api/health || echo "500")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✓ API Health check (IP): OK (200)${NC}"
else
    echo -e "${RED}✗ API Health check (IP): Failed ($HTTP_CODE)${NC}"
fi

# Cleanup local
rm -f ${EXPORT_FILE}

echo ""
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Deploy Hoàn Tất!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${CYAN}Website:${NC} ${BLUE}https://${DOMAIN}${NC}"
echo -e "${CYAN}IP Direct:${NC} ${BLUE}http://${SERVER_IP}:3005${NC}"
echo ""
