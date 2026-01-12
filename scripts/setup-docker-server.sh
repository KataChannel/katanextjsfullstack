#!/bin/bash

# ============================================
# InnerBright Server Setup Script (Docker)
# Run on: 116.118.48.208
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}🐳 InnerBright Server Setup (Docker)${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root${NC}"
    exit 1
fi

# Step 1: Update system
echo -e "${BLUE}📦 Step 1: Updating system...${NC}"
apt-get update
apt-get upgrade -y
echo -e "${GREEN}✅ System updated${NC}"
echo ""

# Step 2: Install Docker
echo -e "${BLUE}🐳 Step 2: Installing Docker...${NC}"
if ! command -v docker &> /dev/null; then
    # Install prerequisites
    apt-get install -y ca-certificates curl gnupg lsb-release
    
    # Add Docker's official GPG key
    mkdir -p /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    
    # Set up repository
    echo \
      "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/ubuntu \
      $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null
    
    # Install Docker
    apt-get update
    apt-get install -y docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin
    
    # Start and enable Docker
    systemctl start docker
    systemctl enable docker
    
    echo -e "${GREEN}✅ Docker installed successfully${NC}"
else
    echo -e "${YELLOW}✓ Docker already installed${NC}"
fi
docker --version
echo ""

# Step 3: Install Nginx
echo -e "${BLUE}🌐 Step 3: Installing Nginx...${NC}"
if ! command -v nginx &> /dev/null; then
    apt-get install -y nginx
    systemctl start nginx
    systemctl enable nginx
    echo -e "${GREEN}✅ Nginx installed successfully${NC}"
else
    echo -e "${YELLOW}✓ Nginx already installed${NC}"
fi
nginx -v
echo ""

# Step 4: Install Certbot
echo -e "${BLUE}🔒 Step 4: Installing Certbot...${NC}"
if ! command -v certbot &> /dev/null; then
    apt-get install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✅ Certbot installed successfully${NC}"
else
    echo -e "${YELLOW}✓ Certbot already installed${NC}"
fi
certbot --version
echo ""

# Step 5: Create directories
echo -e "${BLUE}📁 Step 5: Creating directories...${NC}"
mkdir -p /var/www/innerbright
mkdir -p /var/www/innerbright/logs
echo -e "${GREEN}✅ Directories created${NC}"
echo ""

# Step 6: Configure firewall
echo -e "${BLUE}🔥 Step 6: Configuring firewall...${NC}"
if command -v ufw &> /dev/null; then
    ufw allow 22/tcp       # SSH
    ufw allow 80/tcp       # HTTP
    ufw allow 443/tcp      # HTTPS
    ufw allow 3005/tcp     # Next.js app (optional, if direct access needed)
    ufw allow 5432/tcp     # PostgreSQL (optional, for remote access)
    ufw allow 6379/tcp     # Redis (optional, for remote access)
    ufw allow 9000/tcp     # MinIO API
    ufw allow 9001/tcp     # MinIO Console
    ufw allow 5050/tcp     # PgAdmin
    
    # Enable firewall if not already enabled
    ufw --force enable
    echo -e "${GREEN}✅ Firewall configured${NC}"
else
    echo -e "${YELLOW}⚠️  UFW not available, skipping firewall configuration${NC}"
fi
echo ""

# Step 7: Create Nginx configuration
echo -e "${BLUE}⚙️  Step 7: Creating Nginx configuration template...${NC}"
cat > /etc/nginx/sites-available/innerbright.vn << 'EOF'
server {
    listen 80;
    listen [::]:80;
    server_name innerbright.vn www.innerbright.vn;

    # Logs
    access_log /var/www/innerbright/logs/nginx-access.log;
    error_log /var/www/innerbright/logs/nginx-error.log;

    # Client upload size
    client_max_body_size 100M;

    # Proxy to Next.js application
    location / {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # MinIO API
    location /minio/ {
        proxy_pass http://localhost:9000/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        
        # MinIO specific headers
        proxy_set_header X-NginX-Proxy true;
        proxy_buffering off;
    }
}
EOF

# Enable site
ln -sf /etc/nginx/sites-available/innerbright.vn /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test configuration
nginx -t

# Reload Nginx
systemctl reload nginx

echo -e "${GREEN}✅ Nginx configured${NC}"
echo ""

# Step 8: Docker network
echo -e "${BLUE}🌐 Step 8: Creating Docker network...${NC}"
docker network create innerbright-network || echo -e "${YELLOW}✓ Network already exists${NC}"
echo ""

# Summary
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Server Setup Completed!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${CYAN}📋 What was installed:${NC}"
echo "  ✅ Docker & Docker Compose"
echo "  ✅ Nginx web server"
echo "  ✅ Certbot for SSL"
echo "  ✅ Firewall configured"
echo "  ✅ Nginx configuration"
echo "  ✅ Docker network: innerbright-network"
echo ""
echo -e "${YELLOW}📚 Next steps:${NC}"
echo "  1. Go to /var/www/innerbright"
echo "  2. Create .env file from .env.docker.example"
echo "  3. Run deployment script from local machine:"
echo "     ${BLUE}./scripts/deploy-docker-innerbright.sh${NC}"
echo "  4. Setup SSL certificate:"
echo "     ${BLUE}sudo certbot --nginx -d innerbright.vn -d www.innerbright.vn${NC}"
echo ""
echo -e "${CYAN}🔍 Verify installation:${NC}"
echo "  ${BLUE}docker --version${NC}"
echo "  ${BLUE}docker compose version${NC}"
echo "  ${BLUE}nginx -v${NC}"
echo "  ${BLUE}certbot --version${NC}"
echo ""
echo -e "${GREEN}Done! 🚀${NC}"
