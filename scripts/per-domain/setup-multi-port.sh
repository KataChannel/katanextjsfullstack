#!/bin/bash

# ============================================
# SETUP MULTI-PORT - ALL DOMAINS ON ONE SERVER
# Mỗi domain chạy trên port riêng
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🚀 Multi-Port Setup - All Domains${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root${NC}"
    exit 1
fi

# Domain configurations
declare -A DOMAINS
DOMAINS=(
    ["tazagroup.vn"]="tazagroupvn:3000:tazagroup-app"
    ["tazaskinclinic.com"]="tazaskinclinic:3001:tazaskin-app"
    ["timona.edu.vn"]="timona:3002:timona-app"
    ["hderma.vn"]="hderma:3003:hderma-app"
    ["elasome.com"]="elasome:3004:elasome-app"
)

# Update system
echo -e "${BLUE}📦 Step 1: Updating system...${NC}"
apt update && apt upgrade -y
echo -e "${GREEN}✅ System updated${NC}"
echo ""

# Install Bun
echo -e "${BLUE}🔧 Step 2: Installing Bun...${NC}"
if ! command -v bun &> /dev/null; then
    curl -fsSL https://bun.sh/install | bash
    export BUN_INSTALL="$HOME/.bun"
    export PATH="$BUN_INSTALL/bin:$PATH"
    echo -e "${GREEN}✅ Bun installed${NC}"
else
    echo -e "${YELLOW}⏭️  Bun already installed${NC}"
fi
echo ""

# Install dependencies
echo -e "${BLUE}📚 Step 3: Installing dependencies...${NC}"
apt install nginx git certbot python3-certbot-nginx -y
npm install -g pm2
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Create base directory
mkdir -p /var/www
cd /var/www

# Setup each domain
COUNTER=1
TOTAL=${#DOMAINS[@]}

for DOMAIN in "${!DOMAINS[@]}"; do
    IFS=':' read -r DATABASE PORT APP_NAME <<< "${DOMAINS[$DOMAIN]}"
    
    echo ""
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}📦 Setting up ${DOMAIN} (${COUNTER}/${TOTAL})${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo ""
    
    APP_DIR="/var/www/${DOMAIN}"
    
    # Clone repository
    echo -e "${YELLOW}📥 Cloning repository...${NC}"
    if [ -d "$APP_DIR" ]; then
        echo -e "${YELLOW}⏭️  Directory exists, updating...${NC}"
        cd $APP_DIR
        git pull origin webseo_dev3_alldomain
    else
        git clone https://github.com/KataChannel/katanextjsfullstack.git $DOMAIN
        cd $APP_DIR
        git checkout webseo_dev3_alldomain
    fi
    echo -e "${GREEN}✅ Repository ready${NC}"
    
    # Setup .env
    echo -e "${YELLOW}⚙️  Configuring environment...${NC}"
    cat > .env << EOF
NODE_ENV=production
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:13003/${DATABASE}"
NEXTAUTH_URL=https://${DOMAIN}
NEXTAUTH_SECRET=$(openssl rand -base64 32)
PRISMA_HIDE_UPDATE_MESSAGE=true
PRISMA_HIDE_PREVIEW_FEATURES_WARNING=true
EOF
    echo -e "${GREEN}✅ Environment configured${NC}"
    
    # Install dependencies
    echo -e "${YELLOW}📦 Installing dependencies...${NC}"
    bun install
    echo -e "${GREEN}✅ Dependencies installed${NC}"
    
    # Generate Prisma
    echo -e "${YELLOW}🔧 Generating Prisma Client...${NC}"
    bun run db:generate
    echo -e "${GREEN}✅ Prisma Client generated${NC}"
    
    # Build
    echo -e "${YELLOW}🔨 Building application...${NC}"
    bun run build
    echo -e "${GREEN}✅ Application built${NC}"
    
    # PM2 ecosystem
    echo -e "${YELLOW}⚡ Setting up PM2...${NC}"
    cat > ecosystem.config.js << EOFPM2
module.exports = {
  apps: [{
    name: '${APP_NAME}',
    script: 'bun',
    args: 'run start',
    cwd: '${APP_DIR}',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: ${PORT}
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOFPM2
    
    mkdir -p logs
    
    # Start PM2
    pm2 start ecosystem.config.js
    echo -e "${GREEN}✅ PM2 started for ${DOMAIN}${NC}"
    
    cd /var/www
    ((COUNTER++))
done

# Save PM2
pm2 save
pm2 startup

echo ""
echo -e "${BLUE}🌐 Configuring Nginx...${NC}"

# Create Nginx config for all domains
cat > /etc/nginx/sites-available/all-domains << 'NGINXEOF'
# Taza Group
server {
    listen 80;
    server_name tazagroup.vn www.tazagroup.vn;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Taza Skin Clinic
server {
    listen 80;
    server_name tazaskinclinic.com www.tazaskinclinic.com;
    
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Timona Academy
server {
    listen 80;
    server_name timona.edu.vn www.timona.edu.vn;
    
    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# H.Derma
server {
    listen 80;
    server_name hderma.vn www.hderma.vn;
    
    location / {
        proxy_pass http://127.0.0.1:3003;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}

# Elasome
server {
    listen 80;
    server_name elasome.com www.elasome.com;
    
    location / {
        proxy_pass http://127.0.0.1:3004;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
NGINXEOF

ln -sf /etc/nginx/sites-available/all-domains /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx
echo -e "${GREEN}✅ Nginx configured${NC}"
echo ""

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Multi-Port Setup Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

echo -e "${YELLOW}📝 Next steps:${NC}"
echo ""

echo -e "1. Configure DNS records (point all to this server):"
SERVER_IP=$(curl -s ifconfig.me)
echo -e "   ${BLUE}A    tazagroup.vn       → ${SERVER_IP}${NC}"
echo -e "   ${BLUE}A    tazaskinclinic.com → ${SERVER_IP}${NC}"
echo -e "   ${BLUE}A    timona.edu.vn      → ${SERVER_IP}${NC}"
echo -e "   ${BLUE}A    hderma.vn          → ${SERVER_IP}${NC}"
echo -e "   ${BLUE}A    elasome.com        → ${SERVER_IP}${NC}"
echo ""

echo -e "2. Setup SSL certificates:"
echo -e "   ${BLUE}sudo certbot --nginx -d tazagroup.vn -d www.tazagroup.vn \\${NC}"
echo -e "   ${BLUE}  -d tazaskinclinic.com -d www.tazaskinclinic.com \\${NC}"
echo -e "   ${BLUE}  -d timona.edu.vn -d www.timona.edu.vn \\${NC}"
echo -e "   ${BLUE}  -d hderma.vn -d www.hderma.vn \\${NC}"
echo -e "   ${BLUE}  -d elasome.com -d www.elasome.com${NC}"
echo ""

echo -e "3. Check PM2 status:"
echo -e "   ${BLUE}pm2 status${NC}"
echo ""

echo -e "4. Monitor logs:"
echo -e "   ${BLUE}pm2 logs${NC}"
echo ""

echo -e "${YELLOW}🌐 Domains & Ports:${NC}"
echo -e "   - tazagroup.vn       → Port 3000"
echo -e "   - tazaskinclinic.com → Port 3001"
echo -e "   - timona.edu.vn      → Port 3002"
echo -e "   - hderma.vn          → Port 3003"
echo -e "   - elasome.com        → Port 3004"
echo ""
