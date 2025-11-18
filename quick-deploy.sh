#!/bin/bash
# ============================================
# Quick Deploy Fix - Deploy without infrastructure
# Chỉ deploy web app, sử dụng infrastructure có sẵn
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

IMAGE_NAME="innerbright-web"
IMAGE_TAG="latest"
FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_TAG}"
SERVER_IP="116.118.48.208"
SERVER_USER="root"
EXPORT_FILE="${IMAGE_NAME}-${IMAGE_TAG}.tar"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}Quick Deploy - Web App Only${NC}"
echo -e "${BLUE}============================================${NC}"

# Check image
if ! docker images ${FULL_IMAGE_NAME} | grep -q ${IMAGE_TAG}; then
    echo -e "${RED}✗ Image không tồn tại!${NC}"
    exit 1
fi

# Step 1: Export
echo -e "\n${YELLOW}[1/3] Export image...${NC}"
docker save ${FULL_IMAGE_NAME} | gzip > ${EXPORT_FILE}.gz
FILE_SIZE=$(du -h "${EXPORT_FILE}.gz" | cut -f1)
echo -e "${GREEN}✓ Exported: ${FILE_SIZE}${NC}"

# Step 2: Transfer
echo -e "\n${YELLOW}[2/3] Transfer to server...${NC}"
scp ${EXPORT_FILE}.gz ${SERVER_USER}@${SERVER_IP}:/root/
echo -e "${GREEN}✓ Uploaded${NC}"

# Step 3: Deploy on server
echo -e "\n${YELLOW}[3/3] Deploy...${NC}"

ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

cd /root

# Load image
echo "Loading image..."
gunzip -c innerbright-web-latest.tar.gz | docker load

# Stop old container
echo "Stopping old container..."
docker stop innerbright-web 2>/dev/null || true
docker rm innerbright-web 2>/dev/null || true

# Get network
NETWORK_NAME="innerv2core-network"
if ! docker network ls | grep -q $NETWORK_NAME; then
    echo "Creating network..."
    docker network create $NETWORK_NAME
fi

# Check environment file
if [ ! -f "/root/.env.innerbright" ]; then
    echo "ERROR: .env.innerbright not found!"
    exit 1
fi

# Start container directly with docker run
echo "Starting container..."
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

# Wait
echo "Waiting for startup..."
sleep 10

# Check
echo "Container status:"
docker ps | grep innerbright-web

echo "Recent logs:"
docker logs innerbright-web --tail 20

echo "✓ Deploy complete!"

# Cleanup
rm -f /root/innerbright-web-latest.tar.gz
ENDSSH

# Cleanup local
rm -f ${EXPORT_FILE}.gz

echo -e "\n${GREEN}============================================${NC}"
echo -e "${GREEN}Deploy Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo -e "Website: ${BLUE}https://innerbright.vn${NC}"
echo -e "\n${YELLOW}Check logs:${NC}"
echo -e "ssh ${SERVER_USER}@${SERVER_IP} 'docker logs -f innerbright-web'"

