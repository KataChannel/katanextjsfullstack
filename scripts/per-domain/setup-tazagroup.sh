#!/bin/bash

# ============================================
# SETUP SCRIPT - TAZAGROUP.VN
# Deploy domain này lên server riêng
# ============================================

set -e

# Configuration
DOMAIN="tazagroup.vn"
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:13003/tazagroupvn"
PORT=3000
APP_NAME="tazagroup-app"
APP_DIR="/var/www/${DOMAIN}"

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🚀 Setup Script for ${DOMAIN}${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root${NC}"
    exit 1
fi

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

# Install Nginx
echo -e "${BLUE}🌐 Step 3: Installing Nginx...${NC}"
apt install nginx -y
systemctl enable nginx
echo -e "${GREEN}✅ Nginx installed${NC}"
echo ""

# Install dependencies
echo -e "${BLUE}📚 Step 4: Installing dependencies...${NC}"
apt install git certbot python3-certbot-nginx -y
npm install -g pm2
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Clone repository
echo -e "${BLUE}📥 Step 5: Cloning repository...${NC}"
mkdir -p /var/www
cd /var/www

if [ -d "$APP_DIR" ]; then
    echo -e "${YELLOW}⏭️  Directory exists, pulling latest...${NC}"
    cd $APP_DIR
    git pull origin webseo_dev3_alldomain
else
    git clone https://github.com/KataChannel/katanextjsfullstack.git $DOMAIN
    cd $APP_DIR
    git checkout webseo_dev3_alldomain
fi
echo -e "${GREEN}✅ Repository ready${NC}"
echo ""

# Setup .env
echo -e "${BLUE}⚙️  Step 6: Setting up environment...${NC}"
cat > .env << EOF
NODE_ENV=production
DATABASE_URL="${DATABASE_URL}"
NEXTAUTH_URL=https://${DOMAIN}
NEXTAUTH_SECRET=$(openssl rand -base64 32)
PRISMA_HIDE_UPDATE_MESSAGE=true
PRISMA_HIDE_PREVIEW_FEATURES_WARNING=true
EOF
echo -e "${GREEN}✅ Environment configured${NC}"
echo ""

# Install app dependencies
echo -e "${BLUE}📦 Step 7: Installing application dependencies...${NC}"
bun install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Generate Prisma Client
echo -e "${BLUE}🔧 Step 8: Generating Prisma Client...${NC}"
bun run db:generate
echo -e "${GREEN}✅ Prisma Client generated${NC}"
echo ""

# Build application
echo -e "${BLUE}🔨 Step 9: Building application...${NC}"
bun run build
echo -e "${GREEN}✅ Application built${NC}"
echo ""

# Setup Nginx
echo -e "${BLUE}🌐 Step 10: Configuring Nginx...${NC}"
cat > /etc/nginx/sites-available/$DOMAIN << 'NGINXEOF'
upstream app_server {
    server 127.0.0.1:PORT_PLACEHOLDER;
    keepalive 64;
}

server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

    location / {
        proxy_pass http://app_server;
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

sed -i "s/DOMAIN_PLACEHOLDER/${DOMAIN}/g" /etc/nginx/sites-available/$DOMAIN
sed -i "s/PORT_PLACEHOLDER/${PORT}/g" /etc/nginx/sites-available/$DOMAIN

ln -sf /etc/nginx/sites-available/$DOMAIN /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

nginx -t && systemctl reload nginx
echo -e "${GREEN}✅ Nginx configured${NC}"
echo ""

# Setup PM2
echo -e "${BLUE}⚡ Step 11: Setting up PM2...${NC}"
cat > $APP_DIR/ecosystem.config.js << EOF
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
EOF

mkdir -p $APP_DIR/logs

pm2 start $APP_DIR/ecosystem.config.js
pm2 save
pm2 startup
echo -e "${GREEN}✅ PM2 configured and started${NC}"
echo ""

# Setup SSL
echo -e "${BLUE}🔒 Step 12: Setting up SSL...${NC}"
read -p "Setup SSL certificate now? (y/n): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN || {
        echo -e "${YELLOW}⚠️  SSL setup failed. You can run it manually later:${NC}"
        echo -e "${BLUE}sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN${NC}"
    }
else
    echo -e "${YELLOW}⏭️  SSL setup skipped${NC}"
    echo -e "${YELLOW}Run later: sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN${NC}"
fi
echo ""

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ ${DOMAIN} Setup Complete!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

echo -e "${YELLOW}📝 Next steps:${NC}"
echo ""
echo -e "1. Configure DNS A record:"
echo -e "   ${BLUE}A    ${DOMAIN}      → $(curl -s ifconfig.me)${NC}"
echo -e "   ${BLUE}A    www.${DOMAIN} → $(curl -s ifconfig.me)${NC}"
echo ""
echo -e "2. If SSL was skipped, run:"
echo -e "   ${BLUE}sudo certbot --nginx -d ${DOMAIN} -d www.${DOMAIN}${NC}"
echo ""
echo -e "3. Check application status:"
echo -e "   ${BLUE}pm2 status${NC}"
echo -e "   ${BLUE}pm2 logs ${APP_NAME}${NC}"
echo ""
echo -e "4. Access your site:"
echo -e "   ${BLUE}https://${DOMAIN}${NC}"
echo ""
