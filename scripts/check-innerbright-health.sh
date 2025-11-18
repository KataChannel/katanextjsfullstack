#!/bin/bash

# ============================================
# InnerBright Health Check Script
# Check deployment status on 116.118.48.208
# ============================================

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

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🏥 InnerBright Health Check${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Execute health check on remote server
ssh ${REMOTE_USER}@${REMOTE_HOST} << 'ENDSSH'

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

REMOTE_DIR="/var/www/innerbright"
cd $REMOTE_DIR 2>/dev/null || {
    echo -e "${RED}❌ Directory not found: ${REMOTE_DIR}${NC}"
    exit 1
}

echo -e "${BLUE}📍 Location: $(pwd)${NC}"
echo ""

# Check Docker
echo -e "${BLUE}🐳 Docker Status${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if command -v docker &> /dev/null; then
    echo -e "${GREEN}✅ Docker installed${NC}"
    docker --version
else
    echo -e "${RED}❌ Docker not installed${NC}"
    exit 1
fi
echo ""

# Check Docker Compose
if command -v docker compose &> /dev/null; then
    echo -e "${GREEN}✅ Docker Compose available${NC}"
else
    echo -e "${RED}❌ Docker Compose not available${NC}"
    exit 1
fi
echo ""

# Check network
echo -e "${BLUE}🌐 Docker Network${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
if docker network inspect innerbright-network &>/dev/null; then
    echo -e "${GREEN}✅ Network 'innerbright-network' exists${NC}"
else
    echo -e "${YELLOW}⚠️  Network 'innerbright-network' not found${NC}"
    echo -e "${YELLOW}   Run: docker network create innerbright-network${NC}"
fi
echo ""

# Check infrastructure containers
echo -e "${BLUE}🏗️  Infrastructure Services${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

check_service() {
    local service=$1
    local container=$2
    
    if docker ps --format '{{.Names}}' | grep -q "^${container}$"; then
        local status=$(docker inspect -f '{{.State.Status}}' ${container})
        local health=$(docker inspect -f '{{.State.Health.Status}}' ${container} 2>/dev/null || echo "none")
        
        if [ "$health" = "healthy" ] || [ "$health" = "none" ]; then
            echo -e "${GREEN}✅ ${service}: running${NC}"
        else
            echo -e "${YELLOW}⚠️  ${service}: running but ${health}${NC}"
        fi
    else
        echo -e "${RED}❌ ${service}: not running${NC}"
    fi
}

check_service "PostgreSQL" "innerbright-postgres"
check_service "Redis" "innerbright-redis"
check_service "MinIO" "innerbright-minio"
check_service "PgAdmin" "innerbright-pgadmin"
echo ""

# Check website container
echo -e "${BLUE}🌐 Website Application${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if docker ps --format '{{.Names}}' | grep -q "^innerbright-web$"; then
    local status=$(docker inspect -f '{{.State.Status}}' innerbright-web)
    local uptime=$(docker inspect -f '{{.State.StartedAt}}' innerbright-web)
    
    echo -e "${GREEN}✅ Website: running${NC}"
    echo -e "   Started: ${uptime}"
    
    # Check health endpoint
    echo -e "\n${BLUE}Testing health endpoint...${NC}"
    if curl -f -s http://localhost:3005/api/health > /dev/null 2>&1; then
        echo -e "${GREEN}✅ Health endpoint responding${NC}"
    else
        echo -e "${YELLOW}⚠️  Health endpoint not responding${NC}"
    fi
else
    echo -e "${RED}❌ Website: not running${NC}"
fi
echo ""

# Show resource usage
echo -e "${BLUE}💻 Resource Usage${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}" innerbright-web innerbright-postgres innerbright-redis innerbright-minio 2>/dev/null || echo "Unable to get stats"
echo ""

# Show recent logs (last 10 lines)
echo -e "${BLUE}📝 Recent Logs (Website)${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
docker logs --tail=10 innerbright-web 2>/dev/null || echo "Unable to get logs"
echo ""

# Port status
echo -e "${BLUE}🔌 Port Status${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
netstat -tlnp 2>/dev/null | grep -E ':(3005|5432|6379|9000|9001|5050)' || ss -tlnp | grep -E ':(3005|5432|6379|9000|9001|5050)' || echo "Unable to check ports"
echo ""

# Disk usage
echo -e "${BLUE}💾 Disk Usage${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
df -h /var/www/innerbright 2>/dev/null || echo "Unable to check disk usage"
echo ""

# Docker disk usage
echo -e "${BLUE}🐳 Docker Disk Usage${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
docker system df
echo ""

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}Health check completed!${NC}"
echo -e "${GREEN}============================================${NC}"

ENDSSH

if [ $? -eq 0 ]; then
    echo -e "\n${GREEN}✅ Health check completed successfully${NC}"
else
    echo -e "\n${RED}❌ Health check failed${NC}"
    exit 1
fi

echo ""
echo -e "${CYAN}📚 Useful URLs:${NC}"
echo -e "   Website: http://${REMOTE_HOST}:3005"
echo -e "   Domain: https://innerbright.vn"
echo -e "   PgAdmin: http://${REMOTE_HOST}:5050"
echo -e "   MinIO Console: http://${REMOTE_HOST}:9001"
echo ""
echo -e "${CYAN}📚 Useful commands:${NC}"
echo -e "   ${BLUE}ssh ${REMOTE_USER}@${REMOTE_HOST}${NC}"
echo -e "   ${BLUE}cd ${REMOTE_DIR}${NC}"
echo -e "   ${BLUE}docker compose logs -f${NC}              - View logs"
echo -e "   ${BLUE}docker compose ps${NC}                   - Check status"
echo -e "   ${BLUE}docker compose restart innerbright-web${NC} - Restart website"
echo ""
