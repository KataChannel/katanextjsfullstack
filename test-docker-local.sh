#!/bin/bash
# ============================================
# Test Docker Image Locally
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
CONTAINER_NAME="innerbright-test"
TEST_PORT="3006"

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}Test Docker Image Locally${NC}"
echo -e "${BLUE}============================================${NC}"

# Check if image exists
if ! docker images ${FULL_IMAGE_NAME} | grep -q ${IMAGE_TAG}; then
    echo -e "${RED}✗ Image ${FULL_IMAGE_NAME} không tồn tại!${NC}"
    echo -e "${YELLOW}Chạy: ./build-docker-local.sh trước${NC}"
    exit 1
fi

# Stop existing test container
echo -e "\n${YELLOW}[1/3] Cleanup old test container...${NC}"
docker stop ${CONTAINER_NAME} 2>/dev/null || true
docker rm ${CONTAINER_NAME} 2>/dev/null || true

# Start test container
echo -e "\n${YELLOW}[2/3] Starting test container...${NC}"
docker run -d \
    --name ${CONTAINER_NAME} \
    --env-file .env.production \
    -p ${TEST_PORT}:3005 \
    ${FULL_IMAGE_NAME}

echo -e "${GREEN}✓ Container started!${NC}"

# Wait for startup
echo -e "\n${YELLOW}[3/3] Waiting for container to be ready...${NC}"
sleep 5

# Check logs
echo -e "\n${BLUE}Container logs:${NC}"
docker logs ${CONTAINER_NAME} --tail 30

# Check health
echo -e "\n${BLUE}Container status:${NC}"
docker ps | grep ${CONTAINER_NAME}

echo -e "\n${GREEN}============================================${NC}"
echo -e "${GREEN}Test container is running!${NC}"
echo -e "${GREEN}============================================${NC}"
echo -e "URL: ${BLUE}http://localhost:${TEST_PORT}${NC}"
echo -e "Admin: ${BLUE}http://localhost:${TEST_PORT}/admin${NC}"
echo -e "\n${YELLOW}Useful commands:${NC}"
echo -e "View logs: docker logs -f ${CONTAINER_NAME}"
echo -e "Stop test: docker stop ${CONTAINER_NAME} && docker rm ${CONTAINER_NAME}"
echo -e "\n${YELLOW}Nhấn Ctrl+C khi test xong để stop container${NC}"

# Follow logs
docker logs -f ${CONTAINER_NAME}

