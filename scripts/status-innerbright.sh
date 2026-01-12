#!/bin/bash

# ============================================
# STATUS CHECK SCRIPT
# Check application status and health
# ============================================

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Configuration
REMOTE_SERVER="root@116.118.48.208"
REMOTE_DIR="/var/www/innerbright"

echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║   InnerBright.vn Status Check      ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# 1. Server Info
echo -e "${CYAN}📊 Server Information${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
ssh $REMOTE_SERVER << 'EOF'
echo "Hostname:     $(hostname)"
echo "Uptime:       $(uptime -p)"
echo "Load Average: $(uptime | awk -F'load average:' '{print $2}')"
echo "Memory:       $(free -h | awk 'NR==2{printf "Used: %s / %s (%.0f%%)", $3, $2, $3*100/$2}')"
echo "Disk:         $(df -h / | awk 'NR==2{printf "Used: %s / %s (%s)", $3, $2, $5}')"
EOF
echo ""

# 2. Docker Containers
echo -e "${CYAN}🐳 Docker Containers${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
ssh $REMOTE_SERVER "cd $REMOTE_DIR && docker compose ps"
echo ""

# 3. Container Health
echo -e "${CYAN}🏥 Container Health${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
HEALTH=$(ssh $REMOTE_SERVER "docker inspect innerbright-web --format='{{.State.Health.Status}}' 2>/dev/null || echo 'unknown'")
if [ "$HEALTH" = "healthy" ]; then
    echo -e "Status: ${GREEN}✅ Healthy${NC}"
else
    echo -e "Status: ${RED}❌ $HEALTH${NC}"
fi

# Container uptime
UPTIME=$(ssh $REMOTE_SERVER "docker inspect innerbright-web --format='{{.State.StartedAt}}' 2>/dev/null | xargs -I {} date -d {} '+%Y-%m-%d %H:%M:%S' 2>/dev/null || echo 'unknown'")
echo "Started: $UPTIME"

# Container restart count
RESTARTS=$(ssh $REMOTE_SERVER "docker inspect innerbright-web --format='{{.RestartCount}}' 2>/dev/null || echo '0'")
echo "Restarts: $RESTARTS"
echo ""

# 4. Resource Usage
echo -e "${CYAN}💻 Resource Usage${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
ssh $REMOTE_SERVER "docker stats innerbright-web --no-stream --format 'table {{.CPUPerc}}\t{{.MemUsage}}\t{{.MemPerc}}\t{{.NetIO}}\t{{.BlockIO}}'"
echo ""

# 5. Application Endpoints
echo -e "${CYAN}🌐 Application Endpoints${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

# HTTP Direct
echo -n "HTTP (port 3005):  "
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 http://116.118.48.208:3005/api/health 2>/dev/null || echo "000")
HTTP_TIME=$(curl -s -o /dev/null -w "%{time_total}s" -m 5 http://116.118.48.208:3005/api/health 2>/dev/null || echo "timeout")
if [ "$HTTP_CODE" = "200" ]; then
    echo -e "${GREEN}✅ OK${NC} (${HTTP_CODE}, ${HTTP_TIME})"
else
    echo -e "${RED}❌ FAIL${NC} (${HTTP_CODE})"
fi

# HTTPS
echo -n "HTTPS (443):       "
HTTPS_CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 https://innerbright.vn/api/health 2>/dev/null || echo "000")
HTTPS_TIME=$(curl -s -o /dev/null -w "%{time_total}s" -m 5 https://innerbright.vn/api/health 2>/dev/null || echo "timeout")
if [ "$HTTPS_CODE" = "200" ]; then
    echo -e "${GREEN}✅ OK${NC} (${HTTPS_CODE}, ${HTTPS_TIME})"
else
    echo -e "${RED}❌ FAIL${NC} (${HTTPS_CODE})"
fi

# Admin Panel
echo -n "Admin Panel:       "
ADMIN_CODE=$(curl -s -o /dev/null -w "%{http_code}" -m 5 https://innerbright.vn/admin 2>/dev/null || echo "000")
if [ "$ADMIN_CODE" = "200" ] || [ "$ADMIN_CODE" = "307" ]; then
    echo -e "${GREEN}✅ OK${NC} (${ADMIN_CODE})"
else
    echo -e "${RED}❌ FAIL${NC} (${ADMIN_CODE})"
fi
echo ""

# 6. Database Status
echo -e "${CYAN}🗄️  Database Status${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
ssh $REMOTE_SERVER << 'EOF'
DB_STATUS=$(docker exec innerbright-postgres pg_isready -U postgres 2>&1)
if echo "$DB_STATUS" | grep -q "accepting connections"; then
    echo -e "\033[0;32m✅ PostgreSQL is running\033[0m"
else
    echo -e "\033[0;31m❌ PostgreSQL is down\033[0m"
fi

# Database size
DB_SIZE=$(docker exec innerbright-postgres psql -U postgres -d innerv2core -t -c "SELECT pg_size_pretty(pg_database_size('innerv2core'));" 2>/dev/null | xargs || echo "unknown")
echo "Database size: $DB_SIZE"

# Connection count
CONN_COUNT=$(docker exec innerbright-postgres psql -U postgres -d innerv2core -t -c "SELECT count(*) FROM pg_stat_activity WHERE datname='innerv2core';" 2>/dev/null | xargs || echo "0")
echo "Active connections: $CONN_COUNT"
EOF
echo ""

# 7. SSL Certificate
echo -e "${CYAN}🔒 SSL Certificate${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
CERT_INFO=$(echo | openssl s_client -connect innerbright.vn:443 -servername innerbright.vn 2>/dev/null | openssl x509 -noout -dates 2>/dev/null)
if [ $? -eq 0 ]; then
    echo "$CERT_INFO" | while read line; do
        if [[ $line == notBefore* ]]; then
            echo "Valid from: ${line#*=}"
        elif [[ $line == notAfter* ]]; then
            EXPIRY="${line#*=}"
            EXPIRY_DATE=$(date -d "$EXPIRY" +%Y-%m-%d 2>/dev/null || echo "$EXPIRY")
            DAYS_LEFT=$(( ($(date -d "$EXPIRY" +%s 2>/dev/null || echo 0) - $(date +%s)) / 86400 ))
            
            if [ $DAYS_LEFT -gt 30 ]; then
                echo -e "Valid until: ${GREEN}$EXPIRY_DATE${NC} (${DAYS_LEFT} days left)"
            elif [ $DAYS_LEFT -gt 0 ]; then
                echo -e "Valid until: ${YELLOW}$EXPIRY_DATE${NC} (${DAYS_LEFT} days left) ⚠️"
            else
                echo -e "Valid until: ${RED}$EXPIRY_DATE${NC} (EXPIRED) ❌"
            fi
        fi
    done
else
    echo -e "${RED}❌ Cannot retrieve certificate info${NC}"
fi
echo ""

# 8. Nginx Status
echo -e "${CYAN}🔧 Nginx Status${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
ssh $REMOTE_SERVER << 'EOF'
NGINX_STATUS=$(systemctl is-active nginx 2>/dev/null || echo "unknown")
if [ "$NGINX_STATUS" = "active" ]; then
    echo -e "\033[0;32m✅ Nginx is running\033[0m"
    NGINX_VERSION=$(nginx -v 2>&1 | awk -F/ '{print $2}')
    echo "Version: $NGINX_VERSION"
else
    echo -e "\033[0;31m❌ Nginx is not running\033[0m"
fi
EOF
echo ""

# 9. Recent Errors
echo -e "${CYAN}📋 Recent Errors (last 10 lines)${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
ERROR_COUNT=$(ssh $REMOTE_SERVER "docker logs innerbright-web --since 1h 2>&1 | grep -i error | wc -l")
if [ "$ERROR_COUNT" -eq 0 ]; then
    echo -e "${GREEN}✅ No errors in the last hour${NC}"
else
    echo -e "${YELLOW}⚠️  Found $ERROR_COUNT errors in the last hour:${NC}"
    ssh $REMOTE_SERVER "docker logs innerbright-web --since 1h 2>&1 | grep -i error | tail -10"
fi
echo ""

# 10. Backup Status
echo -e "${CYAN}💾 Latest Backup${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
ssh $REMOTE_SERVER << EOF
LATEST_BACKUP=\$(ls -t $REMOTE_DIR/backups/ 2>/dev/null | head -1)
if [ -n "\$LATEST_BACKUP" ]; then
    echo "Latest: \$LATEST_BACKUP"
    BACKUP_SIZE=\$(du -sh "$REMOTE_DIR/backups/\$LATEST_BACKUP" 2>/dev/null | awk '{print \$1}')
    echo "Size: \$BACKUP_SIZE"
    BACKUP_DATE=\$(stat -c %y "$REMOTE_DIR/backups/\$LATEST_BACKUP" 2>/dev/null | awk '{print \$1, \$2}' | cut -d. -f1)
    echo "Date: \$BACKUP_DATE"
else
    echo -e "\033[1;33m⚠️  No backups found\033[0m"
fi
EOF
echo ""

# 11. Git Status
echo -e "${CYAN}🔀 Git Status${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
ssh $REMOTE_SERVER << EOF
cd $REMOTE_DIR
echo "Branch: \$(git branch --show-current)"
echo "Latest commit:"
git log -1 --pretty=format:"  %h - %s (%ar)" --abbrev-commit
echo ""
echo "Behind remote:"
git fetch origin -q 2>/dev/null
BEHIND=\$(git rev-list HEAD..origin/\$(git branch --show-current) --count 2>/dev/null || echo 0)
if [ "\$BEHIND" -eq 0 ]; then
    echo -e "  \033[0;32m✅ Up to date\033[0m"
else
    echo -e "  \033[1;33m⚠️  $BEHIND commits behind\033[0m"
fi
EOF
echo ""

# Summary
echo -e "${BLUE}╔══════════════════════════════════════╗${NC}"
echo -e "${BLUE}║         Status Check Complete       ║${NC}"
echo -e "${BLUE}╚══════════════════════════════════════╝${NC}"
echo ""

# Quick actions
echo -e "${YELLOW}📚 Quick Actions:${NC}"
echo -e "  ${BLUE}View logs:${NC}     ssh $REMOTE_SERVER 'docker logs -f innerbright-web'"
echo -e "  ${BLUE}Restart:${NC}       ssh $REMOTE_SERVER 'cd $REMOTE_DIR && docker compose restart innerbright-web'"
echo -e "  ${BLUE}Deploy:${NC}        ./scripts/deploy-innerbright.sh"
echo -e "  ${BLUE}Rollback:${NC}      ./scripts/rollback-innerbright.sh"
echo ""
