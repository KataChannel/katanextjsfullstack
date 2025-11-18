#!/bin/bash
# ============================================
# Deploy Docker Image to Production Server
# Server: 116.118.48.208
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
echo -e "${BLUE}Deploy InnerBright to Production${NC}"
echo -e "${BLUE}============================================${NC}"

# Check if image exists
if ! docker images ${FULL_IMAGE_NAME} | grep -q ${IMAGE_TAG}; then
    echo -e "${RED}✗ Image ${FULL_IMAGE_NAME} không tồn tại!${NC}"
    echo -e "${YELLOW}Chạy: ./build-docker-local.sh trước${NC}"
    exit 1
fi

# Confirm deployment
echo -e "\n${YELLOW}Xác nhận deploy:${NC}"
echo -e "Image: ${FULL_IMAGE_NAME}"
echo -e "Server: ${SERVER_USER}@${SERVER_IP}"
echo -e "Domain: https://innerbright.vn"
read -p "Continue? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${YELLOW}Cancelled${NC}"
    exit 0
fi

# Step 1: Export image
echo -e "\n${YELLOW}[1/4] Export Docker image...${NC}"
echo -e "${BLUE}Exporting ${FULL_IMAGE_NAME}...${NC}"

SECONDS=0
docker save ${FULL_IMAGE_NAME} | gzip > ${EXPORT_FILE}.gz
EXPORT_TIME=$SECONDS

if [ -f "${EXPORT_FILE}.gz" ]; then
    FILE_SIZE=$(du -h "${EXPORT_FILE}.gz" | cut -f1)
    echo -e "${GREEN}✓ Export thành công!${NC}"
    echo -e "${GREEN}Size: ${FILE_SIZE}, Time: ${EXPORT_TIME}s${NC}"
else
    echo -e "${RED}✗ Export thất bại!${NC}"
    exit 1
fi

# Step 2: Transfer to server
echo -e "\n${YELLOW}[2/4] Transfer image to server...${NC}"
echo -e "${BLUE}Uploading to ${SERVER_USER}@${SERVER_IP}...${NC}"

SECONDS=0
scp -o ConnectTimeout=30 ${EXPORT_FILE}.gz ${SERVER_USER}@${SERVER_IP}:/root/
TRANSFER_TIME=$SECONDS

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Upload thành công! Time: ${TRANSFER_TIME}s${NC}"
else
    echo -e "${RED}✗ Upload thất bại!${NC}"
    exit 1
fi

# Step 3: Deploy on server
echo -e "\n${YELLOW}[3/4] Deploy on server...${NC}"

ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

cd /root

echo -e "${BLUE}Loading Docker image...${NC}"
gunzip -c innerbright-web-latest.tar.gz | docker load

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Image loaded${NC}"
else
    echo -e "${RED}✗ Failed to load image${NC}"
    exit 1
fi

echo -e "\n${BLUE}Stopping old container...${NC}"
docker stop innerbright-web 2>/dev/null || echo "No old container"
docker rm innerbright-web 2>/dev/null || echo "No old container to remove"

echo -e "\n${BLUE}Starting new container...${NC}"
cd /root/innerbright

# Load environment variables
if [ -f "/root/.env.innerbright" ]; then
    export $(cat /root/.env.innerbright | grep -v '^#' | grep -v '^$' | xargs)
    echo -e "${GREEN}✓ Loaded environment from /root/.env.innerbright${NC}"
fi

# Start with docker-compose
docker-compose up -d

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Container started${NC}"
else
    echo -e "${RED}✗ Failed to start container${NC}"
    exit 1
fi

# Wait for container to be ready
echo -e "\n${BLUE}Waiting for container to be ready...${NC}"
sleep 10

# Check status
echo -e "\n${BLUE}Container status:${NC}"
docker ps | grep innerbright-web

echo -e "\n${BLUE}Recent logs:${NC}"
docker logs innerbright-web --tail 30

# Health check
echo -e "\n${BLUE}Health check:${NC}"
docker inspect innerbright-web --format='{{.State.Health.Status}}' 2>/dev/null || echo "No health status"

echo -e "\n${GREEN}✓ Deploy complete!${NC}"

# Cleanup
echo -e "\n${BLUE}Cleanup old images...${NC}"
docker image prune -f

ENDSSH

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✓ Deploy thành công!${NC}"
else
    echo -e "\n${RED}✗ Deploy thất bại!${NC}"
    echo -e "${YELLOW}Check server logs: ssh ${SERVER_USER}@${SERVER_IP} 'docker logs innerbright-web'${NC}"
    exit 1
fi

# Step 4: Cleanup local
echo -e "\n${YELLOW}[4/4] Cleanup...${NC}"
read -p "Xóa file export local? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f ${EXPORT_FILE}.gz
    echo -e "${GREEN}✓ Deleted ${EXPORT_FILE}.gz${NC}"
fi

# Summary
echo -e "\n${GREEN}============================================${NC}"
echo -e "${GREEN}Deploy Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo -e "Website: ${BLUE}https://innerbright.vn${NC}"
echo -e "Admin: ${BLUE}https://innerbright.vn/admin${NC}"
echo -e "\n${YELLOW}Useful commands:${NC}"
echo -e "Check status: ${BLUE}ssh ${SERVER_USER}@${SERVER_IP} 'docker ps | grep innerbright'${NC}"
echo -e "View logs: ${BLUE}ssh ${SERVER_USER}@${SERVER_IP} 'docker logs -f innerbright-web'${NC}"
echo -e "Restart: ${BLUE}ssh ${SERVER_USER}@${SERVER_IP} 'cd /root/innerbright && docker-compose restart'${NC}"

