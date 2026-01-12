#!/bin/bash

# Script kiểm tra chi tiết port 3000

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}╔═══════════════════════════════════════════════════════════╗${NC}"
echo -e "${CYAN}║        🔍 KIỂM TRA PORT 3000 CHI TIẾT 🔍                ║${NC}"
echo -e "${CYAN}╚═══════════════════════════════════════════════════════════╝${NC}"
echo ""

# 1. Kiểm tra với lsof
echo -e "${YELLOW}1️⃣  Kiểm tra với lsof...${NC}"
if lsof -i:3000 2>/dev/null | grep -q LISTEN; then
    echo -e "${RED}✗ Port 3000 ĐANG ĐƯỢC SỬ DỤNG:${NC}"
    lsof -i:3000
else
    echo -e "${GREEN}✓ lsof: Port 3000 FREE${NC}"
fi
echo ""

# 2. Kiểm tra với netstat
echo -e "${YELLOW}2️⃣  Kiểm tra với netstat...${NC}"
if netstat -tulpn 2>/dev/null | grep -q ":3000 "; then
    echo -e "${RED}✗ Port 3000 ĐANG ĐƯỢC SỬ DỤNG:${NC}"
    netstat -tulpn 2>/dev/null | grep ":3000 "
else
    echo -e "${GREEN}✓ netstat: Port 3000 FREE${NC}"
fi
echo ""

# 3. Kiểm tra với ss
echo -e "${YELLOW}3️⃣  Kiểm tra với ss...${NC}"
if ss -tulpn 2>/dev/null | grep -q ":3000 "; then
    echo -e "${RED}✗ Port 3000 ĐANG ĐƯỢC SỬ DỤNG:${NC}"
    ss -tulpn 2>/dev/null | grep ":3000 "
else
    echo -e "${GREEN}✓ ss: Port 3000 FREE${NC}"
fi
echo ""

# 4. Kiểm tra với curl
echo -e "${YELLOW}4️⃣  Test kết nối HTTP...${NC}"
if curl -s --connect-timeout 2 http://localhost:3000/ > /dev/null 2>&1; then
    echo -e "${RED}✗ CÓ RESPONSE từ http://localhost:3000/${NC}"
    echo "Response headers:"
    curl -I http://localhost:3000/ 2>/dev/null | head -5
else
    echo -e "${GREEN}✓ Không kết nối được đến http://localhost:3000/${NC}"
fi
echo ""

# 5. Kiểm tra processes có liên quan
echo -e "${YELLOW}5️⃣  Kiểm tra processes liên quan...${NC}"
PROCESSES=$(ps aux | grep -E "(next|bun.*dev|node.*3000)" | grep -v grep)
if [ ! -z "$PROCESSES" ]; then
    echo -e "${BLUE}Tìm thấy processes:${NC}"
    echo "$PROCESSES"
else
    echo -e "${GREEN}✓ Không có process Next.js/Bun nào đang chạy${NC}"
fi
echo ""

# 6. Kiểm tra Docker
echo -e "${YELLOW}6️⃣  Kiểm tra Docker containers...${NC}"
if command -v docker &> /dev/null; then
    CONTAINERS=$(docker ps 2>/dev/null | grep -E ":3000|3000:")
    if [ ! -z "$CONTAINERS" ]; then
        echo -e "${RED}✗ Tìm thấy Docker containers trên port 3000:${NC}"
        echo "$CONTAINERS"
    else
        echo -e "${GREEN}✓ Không có Docker container nào sử dụng port 3000${NC}"
    fi
else
    echo -e "${BLUE}ℹ️  Docker không được cài đặt${NC}"
fi
echo ""

# 7. Kiểm tra reverse proxy (Apache/Nginx)
echo -e "${YELLOW}7️⃣  Kiểm tra reverse proxy...${NC}"
APACHE_RUNNING=$(ps aux | grep apache2 | grep -v grep | wc -l)
NGINX_RUNNING=$(ps aux | grep nginx | grep -v grep | wc -l)

if [ $APACHE_RUNNING -gt 0 ]; then
    echo -e "${BLUE}ℹ️  Apache2 đang chạy${NC}"
    if sudo grep -r "ProxyPass.*3000" /etc/apache2/ 2>/dev/null | grep -q .; then
        echo -e "${YELLOW}⚠️  Tìm thấy ProxyPass config cho port 3000:${NC}"
        sudo grep -r "ProxyPass.*3000" /etc/apache2/ 2>/dev/null
    else
        echo "   Không có proxy config cho port 3000"
    fi
fi

if [ $NGINX_RUNNING -gt 0 ]; then
    echo -e "${BLUE}ℹ️  Nginx đang chạy${NC}"
    if sudo grep -r "proxy_pass.*3000" /etc/nginx/ 2>/dev/null | grep -q .; then
        echo -e "${YELLOW}⚠️  Tìm thấy proxy_pass config cho port 3000:${NC}"
        sudo grep -r "proxy_pass.*3000" /etc/nginx/ 2>/dev/null
    else
        echo "   Không có proxy config cho port 3000"
    fi
fi

if [ $APACHE_RUNNING -eq 0 ] && [ $NGINX_RUNNING -eq 0 ]; then
    echo -e "${GREEN}✓ Không có reverse proxy nào đang chạy${NC}"
fi
echo ""

# 8. Tổng kết
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
echo -e "${CYAN}📊 TÓM TẮT:${NC}"
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"

# Check final status
if lsof -i:3000 &>/dev/null || netstat -tulpn 2>/dev/null | grep -q ":3000 " || ss -tulpn 2>/dev/null | grep -q ":3000 "; then
    echo -e "${RED}❌ PORT 3000 ĐANG ĐƯỢC SỬ DỤNG!${NC}"
    echo ""
    echo "Giải pháp:"
    echo "  1. Chạy: ./scripts/5killport.sh"
    echo "  2. Hoặc: sudo ./scripts/5killport.sh"
    echo "  3. Xem chi tiết: lsof -i:3000"
else
    echo -e "${GREEN}✅ PORT 3000 HOÀN TOÀN FREE${NC}"
    echo ""
    echo "Nếu browser vẫn hiển thị localhost:3000:"
    echo -e "  ${YELLOW}➜ Đó là CACHE của browser!${NC}"
    echo "  ${YELLOW}➜ Giải pháp:${NC}"
    echo "     1. Hard refresh: Ctrl+Shift+R (Linux/Windows) hoặc Cmd+Shift+R (Mac)"
    echo "     2. Xóa cache browser"
    echo "     3. Mở incognito/private window"
    echo "     4. Restart browser"
    echo ""
    echo "Để start server mới:"
    echo "  1. cd /mnt/chikiet/kata2025/kataseo"
    echo "  2. bun dev"
fi

echo ""
echo -e "${CYAN}═══════════════════════════════════════════════════════════${NC}"
