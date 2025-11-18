#!/bin/bash

# ============================================
# Remote Database Restore Script
# Restore backup to production server
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
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="./backups"

# Remote server configurations
declare -A REMOTE_SERVERS=(
    ["innerbright.vn"]="root@116.118.48.208"
)

declare -A REMOTE_PATHS=(
    ["innerbright.vn"]="/var/www/innerbright"
)

declare -A CONTAINER_NAMES=(
    ["innerbright.vn"]="innerbright-web"
)

echo "============================================"
echo "📦 Remote Database Restore"
echo "============================================"
echo ""

# Check arguments
if [ $# -lt 2 ] || [ $# -gt 3 ]; then
    echo -e "${RED}❌ Usage: $0 <domain> <timestamp> [--no-confirm]${NC}"
    echo ""
    echo -e "${CYAN}Available domains:${NC}"
    for domain in "${!REMOTE_SERVERS[@]}"; do
        echo -e "  - ${BLUE}${domain}${NC} (${REMOTE_SERVERS[$domain]})"
    done
    echo ""
    echo -e "${CYAN}Available backups:${NC}"
    for domain in "${!REMOTE_SERVERS[@]}"; do
        if [ -d "${BACKUP_DIR}/${domain}" ]; then
            echo -e "${YELLOW}  ${domain}:${NC}"
            ls -1 "${BACKUP_DIR}/${domain}/" 2>/dev/null | grep ".tar.gz" | sed 's/.tar.gz$//' | sed "s/${domain}_/    /" || echo "    (none)"
        fi
    done
    echo ""
    echo -e "${YELLOW}Example:${NC}"
    echo -e "  ${BLUE}$0 innerbright.vn 20251118_114836${NC}"
    echo -e "  ${BLUE}$0 innerbright.vn 20251118_114836 --no-confirm${NC}"
    echo ""
    exit 1
fi

DOMAIN=$1
TIMESTAMP=$2
NO_CONFIRM=$3

# Validate domain
if [ -z "${REMOTE_SERVERS[$DOMAIN]}" ]; then
    echo -e "${RED}❌ Unknown domain: $DOMAIN${NC}"
    echo -e "${CYAN}Available domains:${NC}"
    for domain in "${!REMOTE_SERVERS[@]}"; do
        echo -e "  - ${BLUE}${domain}${NC}"
    done
    exit 1
fi

REMOTE_SERVER="${REMOTE_SERVERS[$DOMAIN]}"
REMOTE_PATH="${REMOTE_PATHS[$DOMAIN]}"
CONTAINER_NAME="${CONTAINER_NAMES[$DOMAIN]}"
BACKUP_FILE="${BACKUP_DIR}/${DOMAIN}/${DOMAIN}_${TIMESTAMP}.tar.gz"

# Check if backup exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

echo -e "${CYAN}🔄 Remote Restore Configuration:${NC}"
echo -e "  Domain:          ${BLUE}${DOMAIN}${NC}"
echo -e "  Server:          ${BLUE}${REMOTE_SERVER}${NC}"
echo -e "  Container:       ${BLUE}${CONTAINER_NAME}${NC}"
echo -e "  Backup:          ${BLUE}${BACKUP_FILE}${NC}"
echo -e "  Timestamp:       ${BLUE}${TIMESTAMP}${NC}"
echo ""

# Confirmation
if [ "$NO_CONFIRM" != "--no-confirm" ]; then
    echo -e "${YELLOW}⚠️  WARNING: This will overwrite existing data on production server!${NC}"
    echo ""
    read -p "Continue? (yes/no): " confirm
    
    if [ "$confirm" != "yes" ]; then
        echo -e "${YELLOW}❌ Restore cancelled${NC}"
        exit 0
    fi
fi

echo ""
echo -e "${BLUE}📤 Step 1: Transfer backup to server...${NC}"
scp "$BACKUP_FILE" "${REMOTE_SERVER}:/tmp/" || {
    echo -e "${RED}❌ Failed to transfer backup file${NC}"
    exit 1
}
echo -e "${GREEN}✅ Backup transferred${NC}"

echo ""
echo -e "${BLUE}📂 Step 2: Extract backup on server...${NC}"
ssh "$REMOTE_SERVER" "cd /tmp && tar -xzf ${DOMAIN}_${TIMESTAMP}.tar.gz" || {
    echo -e "${RED}❌ Failed to extract backup${NC}"
    exit 1
}
echo -e "${GREEN}✅ Backup extracted${NC}"

echo ""
echo -e "${BLUE}📥 Step 3: Copy files into container...${NC}"
ssh "$REMOTE_SERVER" "
    docker cp /tmp/${TIMESTAMP} ${CONTAINER_NAME}:/app/restore-data
    docker cp ${SCRIPT_DIR}/import-data.ts ${CONTAINER_NAME}:/app/
" || {
    echo -e "${RED}❌ Failed to copy files to container${NC}"
    exit 1
}
echo -e "${GREEN}✅ Files copied to container${NC}"

echo ""
echo -e "${BLUE}🔄 Step 4: Run import...${NC}"
ssh "$REMOTE_SERVER" "
    cd ${REMOTE_PATH}
    docker compose exec ${CONTAINER_NAME} bun run /app/import-data.ts /app/restore-data --clear
" || {
    echo -e "${RED}❌ Import failed${NC}"
    exit 1
}
echo -e "${GREEN}✅ Import completed${NC}"

echo ""
echo -e "${BLUE}🧹 Step 5: Cleanup temporary files...${NC}"
ssh "$REMOTE_SERVER" "
    rm -rf /tmp/${TIMESTAMP} /tmp/${DOMAIN}_${TIMESTAMP}.tar.gz
    docker exec ${CONTAINER_NAME} rm -rf /app/restore-data /app/import-data.ts
" || {
    echo -e "${YELLOW}⚠️  Warning: Cleanup failed (non-critical)${NC}"
}
echo -e "${GREEN}✅ Cleanup completed${NC}"

echo ""
echo "============================================"
echo "✅ Remote Restore Completed!"
echo "============================================"
echo ""
echo "Domain: ${DOMAIN}"
echo "Server: ${REMOTE_SERVER}"
echo "Timestamp: ${TIMESTAMP}"
echo ""
echo -e "${CYAN}💡 Test the website:${NC}"
echo -e "  ${BLUE}https://${DOMAIN}${NC}"
