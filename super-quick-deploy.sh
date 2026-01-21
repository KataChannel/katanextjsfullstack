#!/bin/bash

# ============================================
# SUPER QUICK DEPLOY - Git Push & Restart
# ============================================
# Dùng khi:
# - Chỉ sửa code nhỏ (components, pages)
# - Không thay đổi dependencies
# - Không thay đổi Dockerfile
# ============================================

set -e

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Config
SERVER_USER="root"
SERVER_IP="116.118.48.208"
DOMAIN="innerbright.vn"

echo -e "${CYAN}⚡ Super Quick Deploy${NC}"
echo -e "${CYAN}============================================${NC}"
echo ""

# Step 1: Git
echo -e "${YELLOW}[1/3] Git Push...${NC}"
read -p "Commit message: " MSG
git add .
git commit -m "${MSG:-quick update}" || true
git push origin webseo_dev3_alldomain
echo -e "${GREEN}✓ Pushed${NC}"
echo ""

# Step 2: Pull & Rebuild on Server
echo -e "${YELLOW}[2/3] Pull & Rebuild on Server...${NC}"
ssh ${SERVER_USER}@${SERVER_IP} << 'ENDSSH'
set -e
cd /var/www/innerbright

# Pull code
echo "📥 Pulling..."
git pull origin webseo_dev3_alldomain

# Rebuild & Restart
echo "🔨 Rebuilding..."
docker compose build innerbright-web
docker compose up -d innerbright-web

# Wait
echo "⏳ Waiting..."
sleep 10

# Status
docker compose ps innerbright-web
docker compose logs innerbright-web --tail 20
ENDSSH

echo -e "${GREEN}✓ Restarted${NC}"
echo ""

# Step 3: Test
echo -e "${YELLOW}[3/3] Testing...${NC}"
sleep 3
curl -s https://${DOMAIN}/api/health | grep -q "ok" && echo -e "${GREEN}✓ API OK${NC}" || echo -e "✗ API Failed"
curl -s -o /dev/null -w "%{http_code}" https://${DOMAIN}/ | grep -q "200" && echo -e "${GREEN}✓ Homepage OK${NC}" || echo -e "✗ Homepage Failed"

echo ""
echo -e "${GREEN}✅ Done! https://${DOMAIN}${NC}"
echo ""
