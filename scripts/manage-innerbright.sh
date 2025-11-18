#!/bin/bash

# ============================================
# InnerBright Management Script
# Quick commands for InnerBright deployment
# ============================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
MAGENTA='\033[0;35m'
NC='\033[0m'

# Config
REMOTE_HOST="116.118.48.208"
REMOTE_USER="root"
REMOTE_DIR="/var/www/innerbright"

# Function to display menu
show_menu() {
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}🌐 InnerBright Management${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo -e "${CYAN}Server: ${REMOTE_HOST}${NC}"
    echo ""
    echo -e "${GREEN}1)${NC} Deploy to server (Full deployment)"
    echo -e "${GREEN}2)${NC} Check health status"
    echo -e "${GREEN}3)${NC} View logs"
    echo -e "${GREEN}4)${NC} Restart website"
    echo -e "${GREEN}5)${NC} Restart all services"
    echo -e "${GREEN}6)${NC} SSH to server"
    echo -e "${GREEN}7)${NC} Database backup"
    echo -e "${GREEN}8)${NC} Clean Docker (prune)"
    echo -e "${GREEN}9)${NC} View resource usage"
    echo -e "${GREEN}0)${NC} Exit"
    echo ""
    echo -e "${YELLOW}Choose an option:${NC} "
}

# Function: Deploy
deploy() {
    echo -e "${BLUE}🚀 Starting deployment...${NC}\n"
    ./scripts/deploy-docker-innerbright.sh
}

# Function: Health check
health_check() {
    echo -e "${BLUE}🏥 Running health check...${NC}\n"
    ./scripts/check-innerbright-health.sh
}

# Function: View logs
view_logs() {
    echo -e "${BLUE}📝 Viewing logs...${NC}"
    echo -e "${YELLOW}Press Ctrl+C to exit${NC}\n"
    ssh ${REMOTE_USER}@${REMOTE_HOST} "cd ${REMOTE_DIR} && docker compose logs -f --tail=50"
}

# Function: Restart website
restart_website() {
    echo -e "${BLUE}🔄 Restarting website...${NC}\n"
    ssh ${REMOTE_USER}@${REMOTE_HOST} << ENDSSH
cd ${REMOTE_DIR}
docker compose restart innerbright-web
echo ""
echo "Checking status..."
sleep 3
docker compose ps innerbright-web
echo ""
echo "Testing health endpoint..."
sleep 2
curl -s http://localhost:3005/api/health || echo "Health check failed"
ENDSSH
    echo -e "\n${GREEN}✅ Website restarted${NC}"
}

# Function: Restart all
restart_all() {
    echo -e "${YELLOW}⚠️  This will restart all services (Website, PostgreSQL, Redis, MinIO)${NC}"
    echo -e "${YELLOW}Are you sure? (y/n):${NC} "
    read -r confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        echo -e "${BLUE}🔄 Restarting all services...${NC}\n"
        ssh ${REMOTE_USER}@${REMOTE_HOST} << ENDSSH
cd ${REMOTE_DIR}
echo "Stopping all services..."
docker compose down
echo ""
echo "Starting infrastructure..."
docker compose -f docker-compose.infrastructure.yml up -d
sleep 10
echo ""
echo "Starting website..."
docker compose up -d
echo ""
echo "Checking status..."
sleep 5
docker compose ps
ENDSSH
        echo -e "\n${GREEN}✅ All services restarted${NC}"
    else
        echo -e "${YELLOW}Cancelled${NC}"
    fi
}

# Function: SSH
ssh_connect() {
    echo -e "${BLUE}🔐 Connecting to server...${NC}\n"
    ssh ${REMOTE_USER}@${REMOTE_HOST}
}

# Function: Database backup
db_backup() {
    echo -e "${BLUE}💾 Creating database backup...${NC}\n"
    BACKUP_FILE="innerbright_backup_$(date +%Y%m%d_%H%M%S).sql"
    
    ssh ${REMOTE_USER}@${REMOTE_HOST} << ENDSSH
cd ${REMOTE_DIR}
mkdir -p backups
docker compose exec -T postgres pg_dump -U postgres innerv2core > backups/${BACKUP_FILE}
if [ -f "backups/${BACKUP_FILE}" ]; then
    echo "✅ Backup created: backups/${BACKUP_FILE}"
    ls -lh backups/${BACKUP_FILE}
else
    echo "❌ Backup failed"
fi
ENDSSH
    
    echo -e "\n${YELLOW}Download backup? (y/n):${NC} "
    read -r download
    
    if [ "$download" = "y" ] || [ "$download" = "Y" ]; then
        echo -e "${BLUE}📥 Downloading backup...${NC}"
        scp ${REMOTE_USER}@${REMOTE_HOST}:${REMOTE_DIR}/backups/${BACKUP_FILE} ./backups/
        echo -e "${GREEN}✅ Downloaded to ./backups/${BACKUP_FILE}${NC}"
    fi
}

# Function: Clean Docker
clean_docker() {
    echo -e "${YELLOW}⚠️  This will remove unused Docker images, containers, and networks${NC}"
    echo -e "${YELLOW}Are you sure? (y/n):${NC} "
    read -r confirm
    
    if [ "$confirm" = "y" ] || [ "$confirm" = "Y" ]; then
        echo -e "${BLUE}🧹 Cleaning Docker...${NC}\n"
        ssh ${REMOTE_USER}@${REMOTE_HOST} << ENDSSH
docker system prune -f
echo ""
echo "Docker disk usage after cleanup:"
docker system df
ENDSSH
        echo -e "\n${GREEN}✅ Cleanup completed${NC}"
    else
        echo -e "${YELLOW}Cancelled${NC}"
    fi
}

# Function: Resource usage
resource_usage() {
    echo -e "${BLUE}💻 Checking resource usage...${NC}\n"
    ssh ${REMOTE_USER}@${REMOTE_HOST} << ENDSSH
echo "=== Container Stats ==="
docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}"
echo ""
echo "=== Disk Usage ==="
df -h /var/www/innerbright
echo ""
echo "=== Docker Disk Usage ==="
docker system df
echo ""
echo "=== System Memory ==="
free -h
ENDSSH
}

# Main loop
while true; do
    show_menu
    read -r choice
    echo ""
    
    case $choice in
        1)
            deploy
            ;;
        2)
            health_check
            ;;
        3)
            view_logs
            ;;
        4)
            restart_website
            ;;
        5)
            restart_all
            ;;
        6)
            ssh_connect
            ;;
        7)
            db_backup
            ;;
        8)
            clean_docker
            ;;
        9)
            resource_usage
            ;;
        0)
            echo -e "${GREEN}👋 Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}❌ Invalid option${NC}"
            ;;
    esac
    
    echo ""
    echo -e "${CYAN}Press Enter to continue...${NC}"
    read -r
    clear
done
