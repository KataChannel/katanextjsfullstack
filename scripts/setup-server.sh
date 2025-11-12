#!/bin/bash

# ============================================
# SERVER SETUP SCRIPT
# Initial setup cho server production
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🚀 Multi-Domain Server Setup${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root (use sudo)${NC}"
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
if ! command -v nginx &> /dev/null; then
    apt install nginx -y
    systemctl enable nginx
    echo -e "${GREEN}✅ Nginx installed${NC}"
else
    echo -e "${YELLOW}⏭️  Nginx already installed${NC}"
fi
echo ""

# Install PostgreSQL client
echo -e "${BLUE}🗄️  Step 4: Installing PostgreSQL client...${NC}"
if ! command -v psql &> /dev/null; then
    apt install postgresql-client -y
    echo -e "${GREEN}✅ PostgreSQL client installed${NC}"
else
    echo -e "${YELLOW}⏭️  PostgreSQL client already installed${NC}"
fi
echo ""

# Install PM2
echo -e "${BLUE}⚡ Step 5: Installing PM2...${NC}"
if ! command -v pm2 &> /dev/null; then
    npm install -g pm2
    echo -e "${GREEN}✅ PM2 installed${NC}"
else
    echo -e "${YELLOW}⏭️  PM2 already installed${NC}"
fi
echo ""

# Install Certbot
echo -e "${BLUE}🔒 Step 6: Installing Certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    apt install certbot python3-certbot-nginx -y
    echo -e "${GREEN}✅ Certbot installed${NC}"
else
    echo -e "${YELLOW}⏭️  Certbot already installed${NC}"
fi
echo ""

# Install Git
echo -e "${BLUE}📚 Step 7: Installing Git...${NC}"
if ! command -v git &> /dev/null; then
    apt install git -y
    echo -e "${GREEN}✅ Git installed${NC}"
else
    echo -e "${YELLOW}⏭️  Git already installed${NC}"
fi
echo ""

# Create directories
echo -e "${BLUE}📁 Step 8: Creating directories...${NC}"
mkdir -p /var/www
mkdir -p /var/backups/postgres
mkdir -p /var/log/multidomain
echo -e "${GREEN}✅ Directories created${NC}"
echo ""

# Clone repository
echo -e "${BLUE}📥 Step 9: Cloning repository...${NC}"
if [ ! -d "/var/www/katanextjsfullstack" ]; then
    cd /var/www
    git clone https://github.com/KataChannel/katanextjsfullstack.git
    cd katanextjsfullstack
    git checkout webseo_dev3_alldomain
    echo -e "${GREEN}✅ Repository cloned${NC}"
else
    echo -e "${YELLOW}⏭️  Repository already exists${NC}"
fi
echo ""

# Setup .env
echo -e "${BLUE}⚙️  Step 10: Setting up environment...${NC}"
cd /var/www/katanextjsfullstack
if [ ! -f ".env" ]; then
    cp .env.example .env
    echo -e "${YELLOW}⚠️  Please edit .env file with your configuration${NC}"
    echo -e "${YELLOW}   Location: /var/www/katanextjsfullstack/.env${NC}"
else
    echo -e "${YELLOW}⏭️  .env already exists${NC}"
fi
echo ""

# Install dependencies
echo -e "${BLUE}📦 Step 11: Installing application dependencies...${NC}"
cd /var/www/katanextjsfullstack
bun install
echo -e "${GREEN}✅ Dependencies installed${NC}"
echo ""

# Generate Prisma
echo -e "${BLUE}🔧 Step 12: Generating Prisma Client...${NC}"
bun run db:generate
echo -e "${GREEN}✅ Prisma Client generated${NC}"
echo ""

# Build application
echo -e "${BLUE}🔨 Step 13: Building application...${NC}"
bun run build
echo -e "${GREEN}✅ Application built${NC}"
echo ""

# Setup Nginx config
echo -e "${BLUE}🌐 Step 14: Setting up Nginx configuration...${NC}"
cat > /etc/nginx/sites-available/multidomain << 'EOF'
upstream nextjs_app {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 80;
    server_name tazagroup.vn www.tazagroup.vn tazaskinclinic.com www.tazaskinclinic.com timona.edu.vn www.timona.edu.vn hderma.vn www.hderma.vn elasome.com www.elasome.com;

    location / {
        proxy_pass http://nextjs_app;
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
EOF

ln -sf /etc/nginx/sites-available/multidomain /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
echo -e "${GREEN}✅ Nginx configured${NC}"
echo ""

# Setup PM2 ecosystem
echo -e "${BLUE}⚡ Step 15: Setting up PM2 ecosystem...${NC}"
cd /var/www/katanextjsfullstack
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'multidomain-app',
    script: 'bun',
    args: 'run start',
    cwd: '/var/www/katanextjsfullstack',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/err.log',
    out_file: './logs/out.log',
    log_file: './logs/combined.log',
    time: true
  }]
}
EOF

mkdir -p logs
echo -e "${GREEN}✅ PM2 ecosystem configured${NC}"
echo ""

# Start application
echo -e "${BLUE}🚀 Step 16: Starting application...${NC}"
pm2 start ecosystem.config.js
pm2 save
pm2 startup
echo -e "${GREEN}✅ Application started${NC}"
echo ""

# Setup backup cron
echo -e "${BLUE}📅 Step 17: Setting up backup cron...${NC}"
chmod +x /var/www/katanextjsfullstack/scripts/backup-databases.sh
(crontab -l 2>/dev/null; echo "0 2 * * * /var/www/katanextjsfullstack/scripts/backup-databases.sh") | crontab -
echo -e "${GREEN}✅ Backup cron configured (daily at 2 AM)${NC}"
echo ""

# Make scripts executable
echo -e "${BLUE}🔧 Step 18: Making scripts executable...${NC}"
chmod +x /var/www/katanextjsfullstack/scripts/*.sh
echo -e "${GREEN}✅ Scripts are executable${NC}"
echo ""

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Server setup completed!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

echo -e "${YELLOW}📝 Next steps:${NC}"
echo ""
echo -e "1. Edit .env file:"
echo -e "   ${BLUE}nano /var/www/katanextjsfullstack/.env${NC}"
echo ""
echo -e "2. Configure DNS records to point to this server"
echo ""
echo -e "3. Setup SSL certificates:"
echo -e "   ${BLUE}sudo certbot --nginx -d tazagroup.vn -d www.tazagroup.vn -d tazaskinclinic.com -d www.tazaskinclinic.com -d timona.edu.vn -d www.timona.edu.vn -d hderma.vn -d www.hderma.vn -d elasome.com -d www.elasome.com${NC}"
echo ""
echo -e "4. Check application status:"
echo -e "   ${BLUE}pm2 status${NC}"
echo ""
echo -e "5. View logs:"
echo -e "   ${BLUE}pm2 logs multidomain-app${NC}"
echo ""
echo -e "${YELLOW}🌐 Domains to configure:${NC}"
echo -e "   - tazagroup.vn"
echo -e "   - tazaskinclinic.com"
echo -e "   - timona.edu.vn"
echo -e "   - hderma.vn"
echo -e "   - elasome.com"
echo ""
