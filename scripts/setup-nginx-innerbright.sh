#!/bin/bash

# ============================================
# Nginx Setup Script for InnerBright
# Run on server: 116.118.48.208
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
echo -e "${BLUE}🌐 Nginx Setup for InnerBright.vn${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Check if running as root
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Please run as root or with sudo${NC}"
    exit 1
fi

# Step 1: Install Nginx if not already installed
echo -e "${BLUE}📦 Step 1: Checking Nginx installation...${NC}"
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}Installing Nginx...${NC}"
    apt-get update
    apt-get install -y nginx
    systemctl enable nginx
    systemctl start nginx
    echo -e "${GREEN}✅ Nginx installed${NC}"
else
    echo -e "${GREEN}✅ Nginx already installed${NC}"
    nginx -v
fi
echo ""

# Step 2: Install Certbot
echo -e "${BLUE}🔒 Step 2: Checking Certbot installation...${NC}"
if ! command -v certbot &> /dev/null; then
    echo -e "${YELLOW}Installing Certbot...${NC}"
    apt-get update
    apt-get install -y certbot python3-certbot-nginx
    echo -e "${GREEN}✅ Certbot installed${NC}"
else
    echo -e "${GREEN}✅ Certbot already installed${NC}"
    certbot --version
fi
echo ""

# Step 3: Create Let's Encrypt directory
echo -e "${BLUE}📁 Step 3: Creating directories...${NC}"
mkdir -p /var/www/letsencrypt
chown -R www-data:www-data /var/www/letsencrypt
echo -e "${GREEN}✅ Directories created${NC}"
echo ""

# Step 4: Copy Nginx configuration
echo -e "${BLUE}⚙️  Step 4: Configuring Nginx...${NC}"

# Check if config file exists in current directory
if [ ! -f "nginx.innerbright.conf" ]; then
    echo -e "${RED}❌ nginx.innerbright.conf not found in current directory${NC}"
    echo -e "${YELLOW}Please copy the config file here first${NC}"
    exit 1
fi

# Backup existing config if exists
if [ -f "/etc/nginx/sites-available/innerbright.vn" ]; then
    echo -e "${YELLOW}Backing up existing config...${NC}"
    cp /etc/nginx/sites-available/innerbright.vn /etc/nginx/sites-available/innerbright.vn.backup.$(date +%Y%m%d_%H%M%S)
fi

# Copy new config
cp nginx.innerbright.conf /etc/nginx/sites-available/innerbright.vn

# Remove SSL certificate lines for initial setup (will be added by Certbot)
sed -i '/ssl_certificate/d' /etc/nginx/sites-available/innerbright.vn
sed -i '/ssl_trusted_certificate/d' /etc/nginx/sites-available/innerbright.vn

echo -e "${GREEN}✅ Configuration copied${NC}"
echo ""

# Step 5: Enable site
echo -e "${BLUE}🔗 Step 5: Enabling site...${NC}"
ln -sf /etc/nginx/sites-available/innerbright.vn /etc/nginx/sites-enabled/
echo -e "${GREEN}✅ Site enabled${NC}"
echo ""

# Step 6: Test configuration
echo -e "${BLUE}🧪 Step 6: Testing Nginx configuration...${NC}"
if nginx -t; then
    echo -e "${GREEN}✅ Configuration is valid${NC}"
else
    echo -e "${RED}❌ Configuration has errors${NC}"
    exit 1
fi
echo ""

# Step 7: Reload Nginx
echo -e "${BLUE}🔄 Step 7: Reloading Nginx...${NC}"
systemctl reload nginx
echo -e "${GREEN}✅ Nginx reloaded${NC}"
echo ""

# Step 8: Get SSL certificate
echo -e "${BLUE}🔒 Step 8: SSL Certificate Setup${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${YELLOW}Would you like to obtain an SSL certificate now? (y/n):${NC} "
read -r get_ssl

if [ "$get_ssl" = "y" ] || [ "$get_ssl" = "Y" ]; then
    echo -e "\n${BLUE}Obtaining SSL certificate...${NC}"
    echo -e "${YELLOW}Please make sure DNS is already pointing to this server${NC}"
    echo ""
    
    certbot --nginx -d innerbright.vn -d www.innerbright.vn
    
    if [ $? -eq 0 ]; then
        echo -e "\n${GREEN}✅ SSL certificate obtained successfully${NC}"
        
        # Test auto-renewal
        echo -e "\n${BLUE}Testing SSL auto-renewal...${NC}"
        certbot renew --dry-run
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Auto-renewal is configured correctly${NC}"
        fi
    else
        echo -e "\n${YELLOW}⚠️  SSL certificate setup incomplete${NC}"
        echo -e "${YELLOW}You can run it manually later:${NC}"
        echo -e "${CYAN}sudo certbot --nginx -d innerbright.vn -d www.innerbright.vn${NC}"
    fi
else
    echo -e "${YELLOW}Skipped SSL certificate setup${NC}"
    echo -e "${YELLOW}To set up SSL later, run:${NC}"
    echo -e "${CYAN}sudo certbot --nginx -d innerbright.vn -d www.innerbright.vn${NC}"
fi
echo ""

# Step 9: Configure firewall
echo -e "${BLUE}🔥 Step 9: Firewall Configuration${NC}"
echo -e "${CYAN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"

if command -v ufw &> /dev/null; then
    echo -e "${YELLOW}Configuring UFW firewall...${NC}"
    ufw allow 'Nginx Full'
    ufw allow 'OpenSSH'
    echo -e "${GREEN}✅ Firewall configured${NC}"
else
    echo -e "${YELLOW}UFW not found, skipping firewall configuration${NC}"
fi
echo ""

# Final status
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Nginx Setup Completed!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

# Show status
echo -e "${CYAN}📊 Current Status:${NC}"
systemctl status nginx --no-pager -l
echo ""

echo -e "${CYAN}🌐 URLs:${NC}"
echo -e "   HTTP: http://innerbright.vn"
if [ "$get_ssl" = "y" ] || [ "$get_ssl" = "Y" ]; then
    echo -e "   HTTPS: https://innerbright.vn"
fi
echo ""

echo -e "${CYAN}📁 Configuration Files:${NC}"
echo -e "   Config: /etc/nginx/sites-available/innerbright.vn"
echo -e "   Access log: /var/log/nginx/innerbright.vn.access.log"
echo -e "   Error log: /var/log/nginx/innerbright.vn.error.log"
echo ""

echo -e "${CYAN}🔧 Useful Commands:${NC}"
echo -e "   ${BLUE}sudo nginx -t${NC}                    - Test configuration"
echo -e "   ${BLUE}sudo systemctl reload nginx${NC}      - Reload (no downtime)"
echo -e "   ${BLUE}sudo systemctl restart nginx${NC}     - Restart"
echo -e "   ${BLUE}sudo certbot renew${NC}               - Renew SSL certificates"
echo -e "   ${BLUE}sudo tail -f /var/log/nginx/innerbright.vn.access.log${NC}"
echo ""

echo -e "${GREEN}Done! 🚀${NC}"
