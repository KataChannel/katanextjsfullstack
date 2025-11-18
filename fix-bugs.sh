#!/bin/bash
# ============================================
# Fix Bugs và Monitor Container trên Server
# ============================================

SERVER_IP="116.118.48.208"
SERVER_USER="root"
CONTAINER_NAME="innerbright-web"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}InnerBright Bug Fix & Monitor${NC}"
echo -e "${BLUE}============================================${NC}"

# Menu
echo -e "\n${YELLOW}Chọn hành động:${NC}"
echo "1) Kiểm tra container status"
echo "2) Xem logs (real-time)"
echo "3) Xem logs (last 100 lines)"
echo "4) Restart container"
echo "5) Check health endpoint"
echo "6) Check database connection"
echo "7) Check memory usage"
echo "8) Fix container không start"
echo "9) Fix permission issues"
echo "0) Exit"

read -p "Nhập lựa chọn (0-9): " choice

case $choice in
    1)
        echo -e "\n${BLUE}Container Status:${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "docker ps -a | grep ${CONTAINER_NAME}"
        ssh ${SERVER_USER}@${SERVER_IP} "docker inspect ${CONTAINER_NAME} --format='Health: {{.State.Health.Status}}' 2>/dev/null || echo 'No health status'"
        ;;
    
    2)
        echo -e "\n${BLUE}Following logs (Ctrl+C to exit):${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "docker logs -f ${CONTAINER_NAME}"
        ;;
    
    3)
        echo -e "\n${BLUE}Recent logs:${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "docker logs ${CONTAINER_NAME} --tail 100"
        ;;
    
    4)
        echo -e "\n${YELLOW}Restarting container...${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "cd /root/innerbright && docker-compose restart"
        echo -e "${GREEN}✓ Container restarted${NC}"
        sleep 5
        ssh ${SERVER_USER}@${SERVER_IP} "docker ps | grep ${CONTAINER_NAME}"
        ;;
    
    5)
        echo -e "\n${BLUE}Testing health endpoint...${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "curl -f http://localhost:3005/api/health 2>/dev/null && echo '\n✓ Health check OK' || echo '✗ Health check failed'"
        ;;
    
    6)
        echo -e "\n${BLUE}Testing database connection...${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
docker exec innerbright-web sh -c '
bunx prisma db execute --stdin <<EOF
SELECT 1 as test;
EOF
' && echo "✓ Database OK" || echo "✗ Database connection failed"
ENDSSH
        ;;
    
    7)
        echo -e "\n${BLUE}Container resource usage:${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} "docker stats ${CONTAINER_NAME} --no-stream"
        ;;
    
    8)
        echo -e "\n${YELLOW}Fixing container startup issues...${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

echo "1. Stopping container..."
docker stop innerbright-web 2>/dev/null || true
docker rm innerbright-web 2>/dev/null || true

echo "2. Checking docker-compose.yml..."
cd /root/innerbright
if [ ! -f "docker-compose.yml" ]; then
    echo "✗ docker-compose.yml not found!"
    exit 1
fi

echo "3. Checking .env file..."
if [ ! -f "/root/.env.innerbright" ]; then
    echo "✗ .env.innerbright not found!"
    exit 1
fi

echo "4. Checking network..."
docker network ls | grep innerbright-network || docker network create innerbright-network

echo "5. Starting container..."
export $(cat /root/.env.innerbright | grep -v '^#' | grep -v '^$' | xargs)
docker-compose up -d

echo "6. Waiting for startup..."
sleep 10

echo "7. Checking status..."
docker ps | grep innerbright-web
docker logs innerbright-web --tail 20

echo "✓ Container should be running now"
ENDSSH
        ;;
    
    9)
        echo -e "\n${YELLOW}Fixing permission issues...${NC}"
        ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e

echo "1. Fix uploads directory permissions..."
mkdir -p /root/innerbright/public/uploads
chmod -R 755 /root/innerbright/public/uploads
chown -R 1001:1001 /root/innerbright/public/uploads 2>/dev/null || true

echo "2. Fix icons directory permissions..."
mkdir -p /root/innerbright/public/icons
chmod -R 755 /root/innerbright/public/icons
chown -R 1001:1001 /root/innerbright/public/icons 2>/dev/null || true

echo "✓ Permissions fixed"

echo "3. Restarting container..."
cd /root/innerbright
docker-compose restart

echo "✓ Done"
ENDSSH
        ;;
    
    0)
        echo -e "${GREEN}Bye!${NC}"
        exit 0
        ;;
    
    *)
        echo -e "${RED}Invalid choice${NC}"
        exit 1
        ;;
esac

echo -e "\n${GREEN}Done!${NC}"

