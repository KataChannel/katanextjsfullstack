#!/bin/bash
# ============================================
# Build Docker Image cho InnerBright
# Tối ưu build ở local với Bun
# ============================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

IMAGE_NAME="innerbright-web"
IMAGE_TAG="latest"
FULL_IMAGE_NAME="${IMAGE_NAME}:${IMAGE_TAG}"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}Build InnerBright Docker Image${NC}"
echo -e "${BLUE}============================================${NC}"

# Copy environment file
echo -e "\n${YELLOW}[1/3] Chuẩn bị environment...${NC}"
if [ -f ".env.innerbright" ]; then
    cp .env.innerbright .env.production
    echo -e "${GREEN}✓ Đã copy .env.innerbright -> .env.production${NC}"
else
    echo -e "${RED}✗ Không tìm thấy .env.innerbright${NC}"
    exit 1
fi

# Build image
echo -e "\n${YELLOW}[2/3] Building Docker image...${NC}"
echo -e "${BLUE}Image: ${FULL_IMAGE_NAME}${NC}"
echo -e "${BLUE}Builder: Docker with Bun${NC}"
echo -e "${BLUE}Start time: $(date)${NC}\n"

SECONDS=0

docker build \
    --tag ${FULL_IMAGE_NAME} \
    --build-arg NODE_ENV=production \
    --progress=plain \
    --no-cache \
    . 2>&1 | tee build.log

BUILD_EXIT_CODE=${PIPESTATUS[0]}
BUILD_TIME=$SECONDS

if [ $BUILD_EXIT_CODE -eq 0 ]; then
    echo -e "\n${GREEN}✓ Build thành công!${NC}"
    echo -e "${GREEN}Time: $(($BUILD_TIME / 60))m $(($BUILD_TIME % 60))s${NC}"
    
    # Show image info
    echo -e "\n${YELLOW}[3/3] Image info:${NC}"
    docker images ${FULL_IMAGE_NAME}
    
    IMAGE_SIZE=$(docker images ${FULL_IMAGE_NAME} --format "{{.Size}}")
    echo -e "${GREEN}Image size: ${IMAGE_SIZE}${NC}"
    
else
    echo -e "\n${RED}✗ Build thất bại!${NC}"
    echo -e "${RED}Xem build.log để biết chi tiết${NC}"
    exit 1
fi

echo -e "\n${GREEN}============================================${NC}"
echo -e "${GREEN}Build hoàn tất!${NC}"
echo -e "${GREEN}============================================${NC}"
echo -e "Image: ${FULL_IMAGE_NAME}"
echo -e "Build log: build.log"
echo -e "\n${YELLOW}Next steps:${NC}"
echo -e "1. Test local: ./test-docker-local.sh"
echo -e "2. Deploy: ./deploy-to-server.sh"

