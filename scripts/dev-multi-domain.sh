#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}================================${NC}"
echo -e "${GREEN}  Multi-Domain Development${NC}"
echo -e "${BLUE}================================${NC}"
echo ""

# Domain configuration
declare -A DOMAINS
DOMAINS=(
    [1]="tazagroup:3000:tazagroup.vn"
    [2]="tazaskin:3001:tazaskinclinic.com"
    [3]="timona:3002:timona.edu.vn"
    [4]="hderma:3003:hderma.vn"
    [5]="elasome:3004:elasome.com"
    [6]="innerbright:3005:innerbright.vn"
)

# Show menu
echo -e "${YELLOW}Chọn domain để dev:${NC}"
echo ""
echo "  1) TazaGroup      - http://localhost:3000 (tazagroup.vn)"
echo "  2) TazaSkin       - http://localhost:3001 (tazaskinclinic.com)"
echo "  3) Timona         - http://localhost:3002 (timona.edu.vn)"
echo "  4) HDerma         - http://localhost:3003 (hderma.vn)"
echo "  5) Elasome        - http://localhost:3004 (elasome.com)"
echo "  6) InnerBright    - http://localhost:3005 (innerbright.vn)"
echo "  7) All domains    - Run all domains simultaneously"
echo "  0) Exit"
echo ""
echo -n "Nhập lựa chọn [0-7]: "
read choice

case $choice in
    0)
        echo -e "${YELLOW}Thoát...${NC}"
        exit 0
        ;;
    1|2|3|4|5|6)
        IFS=':' read -r name port domain <<< "${DOMAINS[$choice]}"
        echo ""
        echo -e "${GREEN}🚀 Starting development server for ${domain}...${NC}"
        echo -e "${BLUE}   Port: ${port}${NC}"
        echo -e "${BLUE}   URL:  http://localhost:${port}${NC}"
        echo ""
        
        # Set environment variable for domain
        export NEXT_PUBLIC_DOMAIN=$domain
        
        # Run dev server
        ./scripts/bun-wrapper.sh bun --bun next dev -p $port
        ;;
    7)
        echo ""
        echo -e "${GREEN}🚀 Starting ALL domains...${NC}"
        echo ""
        echo -e "${BLUE}Domains:${NC}"
        echo "  - TazaGroup:   http://localhost:3000"
        echo "  - TazaSkin:    http://localhost:3001"
        echo "  - Timona:      http://localhost:3002"
        echo "  - HDerma:      http://localhost:3003"
        echo "  - Elasome:     http://localhost:3004"
        echo "  - InnerBright: http://localhost:3005"
        echo ""
        echo -e "${YELLOW}Press Ctrl+C to stop all servers${NC}"
        echo ""
        
        # Run all domains in background
        NEXT_PUBLIC_DOMAIN=tazagroup.vn ./scripts/bun-wrapper.sh bun --bun next dev -p 3000 &
        PID1=$!
        
        NEXT_PUBLIC_DOMAIN=tazaskinclinic.com ./scripts/bun-wrapper.sh bun --bun next dev -p 3001 &
        PID2=$!
        
        NEXT_PUBLIC_DOMAIN=timona.edu.vn ./scripts/bun-wrapper.sh bun --bun next dev -p 3002 &
        PID3=$!
        
        NEXT_PUBLIC_DOMAIN=hderma.vn ./scripts/bun-wrapper.sh bun --bun next dev -p 3003 &
        PID4=$!
        
        NEXT_PUBLIC_DOMAIN=elasome.com ./scripts/bun-wrapper.sh bun --bun next dev -p 3004 &
        PID5=$!
        
        NEXT_PUBLIC_DOMAIN=innerbright.vn ./scripts/bun-wrapper.sh bun --bun next dev -p 3005 &
        PID6=$!
        
        # Wait for Ctrl+C
        trap "kill $PID1 $PID2 $PID3 $PID4 $PID5 $PID6 2>/dev/null; echo -e '\n${YELLOW}All servers stopped${NC}'; exit 0" INT
        
        wait
        ;;
    *)
        echo -e "${RED}Lựa chọn không hợp lệ!${NC}"
        exit 1
        ;;
esac
