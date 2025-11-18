#!/bin/bash
# ============================================
# Build và Deploy InnerBright lên Server
# Build ở local để tối ưu tốc độ
# Deploy lên server 116.118.48.208
# ============================================

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="innerbright-web"
IMAGE_TAG="latest"
FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_TAG}"
SERVER_IP="116.118.48.208"
SERVER_USER="root"
EXPORT_FILE="innerbright-web-${IMAGE_TAG}.tar"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}Build và Deploy InnerBright${NC}"
echo -e "${BLUE}============================================${NC}"

# Step 1: Copy environment file
echo -e "\n${YELLOW}[1/7] Chuẩn bị environment file...${NC}"
if [ -f ".env.innerbright" ]; then
    cp .env.innerbright .env.production
    echo -e "${GREEN}✓ Đã copy .env.innerbright -> .env.production${NC}"
else
    echo -e "${RED}✗ Không tìm thấy .env.innerbright${NC}"
    exit 1
fi

# Step 2: Build Docker image
echo -e "\n${YELLOW}[2/7] Build Docker image ở local...${NC}"
echo -e "${BLUE}Building ${FULL_IMAGE_NAME}...${NC}"

docker build \
    --tag ${FULL_IMAGE_NAME} \
    --build-arg NODE_ENV=production \
    --progress=plain \
    . 2>&1 | tee build.log

if [ ${PIPESTATUS[0]} -eq 0 ]; then
    echo -e "${GREEN}✓ Build thành công!${NC}"
else
    echo -e "${RED}✗ Build thất bại! Xem build.log để biết chi tiết${NC}"
    exit 1
fi

# Step 3: Test image locally (optional)
echo -e "\n${YELLOW}[3/7] Test Docker image...${NC}"
read -p "Bạn có muốn test image trước khi deploy? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    echo -e "${BLUE}Starting container for testing...${NC}"
    docker run -d \
        --name innerbright-test \
        --env-file .env.production \
        -p 3006:3005 \
        ${FULL_IMAGE_NAME}
    
    echo -e "${GREEN}✓ Container đang chạy ở http://localhost:3006${NC}"
    echo -e "${YELLOW}Nhấn Enter để tiếp tục deploy sau khi test xong...${NC}"
    read
    
    docker stop innerbright-test
    docker rm innerbright-test
fi

# Step 4: Export image
echo -e "\n${YELLOW}[4/7] Export Docker image...${NC}"
echo -e "${BLUE}Exporting to ${EXPORT_FILE}...${NC}"

docker save ${FULL_IMAGE_NAME} | gzip > ${EXPORT_FILE}.gz

if [ -f "${EXPORT_FILE}.gz" ]; then
    FILE_SIZE=$(du -h "${EXPORT_FILE}.gz" | cut -f1)
    echo -e "${GREEN}✓ Export thành công! Size: ${FILE_SIZE}${NC}"
else
    echo -e "${RED}✗ Export thất bại!${NC}"
    exit 1
fi

# Step 5: Transfer to server
echo -e "\n${YELLOW}[5/7] Transfer image lên server...${NC}"
echo -e "${BLUE}Uploading to ${SERVER_USER}@${SERVER_IP}...${NC}"

scp ${EXPORT_FILE}.gz ${SERVER_USER}@${SERVER_IP}:/root/

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Upload thành công!${NC}"
else
    echo -e "${RED}✗ Upload thất bại!${NC}"
    exit 1
fi

# Step 6: Deploy on server
echo -e "\n${YELLOW}[6/7] Deploy trên server...${NC}"

ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

cd /root

# Load image
echo "Loading Docker image..."
gunzip -c innerbright-web-latest.tar.gz | docker load

# Stop and remove old container
echo "Stopping old container..."
docker stop innerbright-web 2>/dev/null || true
docker rm innerbright-web 2>/dev/null || true

# Load environment
if [ -f "/root/.env.innerbright" ]; then
    export $(cat /root/.env.innerbright | grep -v '^#' | xargs)
fi

# Start new container
echo "Starting new container..."
cd /root/innerbright
docker-compose up -d

# Wait for healthcheck
echo "Waiting for healthcheck..."
sleep 10

# Check status
docker ps | grep innerbright-web
docker logs innerbright-web --tail 20

echo "✓ Deploy hoàn tất!"
ENDSSH

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Deploy thành công!${NC}"
else
    echo -e "${RED}✗ Deploy thất bại!${NC}"
    exit 1
fi

# Step 7: Cleanup
echo -e "\n${YELLOW}[7/7] Cleanup...${NC}"
read -p "Xóa file export local? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    rm -f ${EXPORT_FILE}.gz
    echo -e "${GREEN}✓ Đã xóa file export${NC}"
fi

# Summary
echo -e "\n${GREEN}============================================${NC}"
echo -e "${GREEN}Deploy hoàn tất!${NC}"
echo -e "${GREEN}============================================${NC}"
echo -e "Image: ${FULL_IMAGE_NAME}"
echo -e "Server: https://innerbright.vn"
echo -e "Admin: https://innerbright.vn/admin"
echo -e "\n${YELLOW}Lệnh kiểm tra:${NC}"
echo -e "ssh ${SERVER_USER}@${SERVER_IP} 'docker ps | grep innerbright'"
echo -e "ssh ${SERVER_USER}@${SERVER_IP} 'docker logs innerbright-web'"

