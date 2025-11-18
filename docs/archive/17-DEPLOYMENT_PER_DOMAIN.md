# DEPLOYMENT TỪNG DOMAIN RIÊNG LẺ

**Ngày cập nhật:** 12/11/2025

## 📋 TỔNG QUAN

Hướng dẫn này giúp bạn deploy **mỗi domain trên server/instance riêng** thay vì tất cả domains trên một server. Phương pháp này phù hợp cho:

- ✅ Scaling độc lập cho từng domain
- ✅ Resource isolation tốt hơn
- ✅ Dễ dàng troubleshoot
- ✅ Downtime chỉ ảnh hưởng 1 domain
- ✅ Customization cao cho từng domain

---

## 🏗️ KIẾN TRÚC

### Phương pháp 1: Multi-Server (5 Servers)

```
tazagroup.vn        → Server 1 (IP: xxx.xxx.xxx.1, Port: 3000)
tazaskinclinic.com  → Server 2 (IP: xxx.xxx.xxx.2, Port: 3000)
timona.edu.vn       → Server 3 (IP: xxx.xxx.xxx.3, Port: 3000)
hderma.vn           → Server 4 (IP: xxx.xxx.xxx.4, Port: 3000)
elasome.com         → Server 5 (IP: xxx.xxx.xxx.5, Port: 3000)
```

Mỗi server:
- Chạy Next.js app riêng
- Connect tới database riêng
- Nginx riêng
- PM2 riêng

### Phương pháp 2: Multi-Port Single Server

```
Server (IP: xxx.xxx.xxx.xxx)
├── tazagroup.vn       → Port 3000 (PM2 instance 1)
├── tazaskinclinic.com → Port 3001 (PM2 instance 2)
├── timona.edu.vn      → Port 3002 (PM2 instance 3)
├── hderma.vn          → Port 3003 (PM2 instance 4)
└── elasome.com        → Port 3004 (PM2 instance 5)
```

---

## 🚀 PHƯƠNG PHÁP 1: MULTI-SERVER (5 Servers Riêng)

### Chuẩn bị

**Bạn cần:**
- 5 VPS/Servers (hoặc ít hơn nếu chỉ deploy một số domains)
- Mỗi server: Min 1GB RAM, 1 CPU, 20GB SSD
- SSH access vào từng server

### Bước 1: Setup Từng Server

Tôi sẽ tạo script setup cho **mỗi domain riêng**:

#### 1.1. Script cho Taza Group

```bash
#!/bin/bash
# scripts/setup-tazagroup.sh

DOMAIN="tazagroup.vn"
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:13003/tazagroupvn"
PORT=3000
APP_NAME="tazagroup-app"

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Setting up ${DOMAIN}...${NC}"

# Update system
apt update && apt upgrade -y

# Install dependencies
curl -fsSL https://bun.sh/install | bash
export BUN_INSTALL="$HOME/.bun"
export PATH="$BUN_INSTALL/bin:$PATH"

apt install nginx certbot python3-certbot-nginx git -y

# Clone repository
mkdir -p /var/www
cd /var/www
git clone https://github.com/KataChannel/katanextjsfullstack.git $DOMAIN
cd $DOMAIN
git checkout webseo_dev3_alldomain

# Setup .env
cat > .env << EOF
NODE_ENV=production
DATABASE_URL="${DATABASE_URL}"
NEXTAUTH_URL=https://${DOMAIN}
NEXTAUTH_SECRET=$(openssl rand -base64 32)
PRISMA_HIDE_UPDATE_MESSAGE=true
PRISMA_HIDE_PREVIEW_FEATURES_WARNING=true
EOF

# Install & build
bun install
bun run db:generate
bun run build

# Nginx config
cat > /etc/nginx/sites-available/$DOMAIN << 'NGINXEOF'
server {
    listen 80;
    server_name DOMAIN_PLACEHOLDER www.DOMAIN_PLACEHOLDER;

    location / {
        proxy_pass http://127.0.0.1:PORT_PLACEHOLDER;
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

# PM2 setup
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [{
    name: '${APP_NAME}',
    script: 'bun',
    args: 'run start',
    cwd: '/var/www/${DOMAIN}',
    instances: 1,
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: ${PORT}
    }
  }]
}
EOF

npm install -g pm2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# SSL
certbot --nginx -d $DOMAIN -d www.$DOMAIN --non-interactive --agree-tos --email admin@$DOMAIN

echo -e "${GREEN}✅ ${DOMAIN} setup complete!${NC}"
echo "Access at: https://${DOMAIN}"
```

#### 1.2. Các Script Tương Tự

Tạo script cho từng domain:

```bash
# scripts/setup-tazaskin.sh
DOMAIN="tazaskinclinic.com"
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:13003/tazaskinclinic"
PORT=3000
APP_NAME="tazaskin-app"
```

```bash
# scripts/setup-timona.sh
DOMAIN="timona.edu.vn"
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:13003/timona"
PORT=3000
APP_NAME="timona-app"
```

```bash
# scripts/setup-hderma.sh
DOMAIN="hderma.vn"
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:13003/hderma"
PORT=3000
APP_NAME="hderma-app"
```

```bash
# scripts/setup-elasome.sh
DOMAIN="elasome.com"
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:13003/elasome"
PORT=3000
APP_NAME="elasome-app"
```

### Bước 2: Deploy Từng Domain

**Trên mỗi server:**

```bash
# SSH vào server
ssh user@server-ip

# Download script
wget https://raw.githubusercontent.com/KataChannel/katanextjsfullstack/webseo_dev3_alldomain/scripts/setup-tazagroup.sh

# Run
sudo bash setup-tazagroup.sh
```

### Bước 3: Cấu hình DNS

Point từng domain tới server tương ứng:

```
# DNS Records
A    tazagroup.vn       → Server 1 IP
A    www.tazagroup.vn   → Server 1 IP

A    tazaskinclinic.com → Server 2 IP
A    www.tazaskinclinic → Server 2 IP

A    timona.edu.vn      → Server 3 IP
A    www.timona.edu.vn  → Server 3 IP

A    hderma.vn          → Server 4 IP
A    www.hderma.vn      → Server 4 IP

A    elasome.com        → Server 5 IP
A    www.elasome.com    → Server 5 IP
```

---

## 🔄 PHƯƠNG PHÁP 2: MULTI-PORT (1 Server, 5 Instances)

Chạy 5 instances PM2 trên cùng server, mỗi instance chạy port khác nhau.

### Bước 1: Cấu trúc thư mục

```bash
/var/www/
├── tazagroup.vn/        # Instance 1 - Port 3000
├── tazaskinclinic.com/  # Instance 2 - Port 3001
├── timona.edu.vn/       # Instance 3 - Port 3002
├── hderma.vn/           # Instance 4 - Port 3003
└── elasome.com/         # Instance 5 - Port 3004
```

### Bước 2: Setup Script

```bash
#!/bin/bash
# scripts/setup-multi-port.sh

DOMAINS=(
    "tazagroup.vn:tazagroupvn:3000"
    "tazaskinclinic.com:tazaskinclinic:3001"
    "timona.edu.vn:timona:3002"
    "hderma.vn:hderma:3003"
    "elasome.com:elasome:3004"
)

cd /var/www

for domain_info in "${DOMAINS[@]}"; do
    IFS=':' read -r DOMAIN DATABASE PORT <<< "$domain_info"
    
    echo "Setting up ${DOMAIN}..."
    
    # Clone vào thư mục riêng
    git clone https://github.com/KataChannel/katanextjsfullstack.git $DOMAIN
    cd $DOMAIN
    git checkout webseo_dev3_alldomain
    
    # Setup .env riêng
    cat > .env << EOF
NODE_ENV=production
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:13003/${DATABASE}"
NEXTAUTH_URL=https://${DOMAIN}
NEXTAUTH_SECRET=$(openssl rand -base64 32)
PRISMA_HIDE_UPDATE_MESSAGE=true
EOF
    
    # Install & build
    bun install
    bun run db:generate
    bun run build
    
    # PM2 ecosystem riêng
    cat > ecosystem.config.js << EOFPM2
module.exports = {
  apps: [{
    name: '${DOMAIN}',
    script: 'bun',
    args: 'run start',
    cwd: '/var/www/${DOMAIN}',
    instances: 1,
    env: {
      NODE_ENV: 'production',
      PORT: ${PORT}
    }
  }]
}
EOFPM2
    
    # Start PM2
    pm2 start ecosystem.config.js
    
    cd /var/www
done

pm2 save
pm2 startup
```

### Bước 3: Nginx Config cho Multi-Port

```nginx
# /etc/nginx/sites-available/all-domains

# Taza Group
server {
    listen 443 ssl http2;
    server_name tazagroup.vn www.tazagroup.vn;
    
    ssl_certificate /etc/letsencrypt/live/tazagroup.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tazagroup.vn/privkey.pem;
    
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Taza Skin Clinic
server {
    listen 443 ssl http2;
    server_name tazaskinclinic.com www.tazaskinclinic.com;
    
    ssl_certificate /etc/letsencrypt/live/tazaskinclinic.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tazaskinclinic.com/privkey.pem;
    
    location / {
        proxy_pass http://127.0.0.1:3001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Timona Academy
server {
    listen 443 ssl http2;
    server_name timona.edu.vn www.timona.edu.vn;
    
    ssl_certificate /etc/letsencrypt/live/timona.edu.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/timona.edu.vn/privkey.pem;
    
    location / {
        proxy_pass http://127.0.0.1:3002;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# H.Derma
server {
    listen 443 ssl http2;
    server_name hderma.vn www.hderma.vn;
    
    ssl_certificate /etc/letsencrypt/live/hderma.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/hderma.vn/privkey.pem;
    
    location / {
        proxy_pass http://127.0.0.1:3003;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}

# Elasome
server {
    listen 443 ssl http2;
    server_name elasome.com www.elasome.com;
    
    ssl_certificate /etc/letsencrypt/live/elasome.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/elasome.com/privkey.pem;
    
    location / {
        proxy_pass http://127.0.0.1:3004;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
}
```

---

## 🔄 UPDATE/DEPLOY TỪNG DOMAIN

### Update Domain Riêng Lẻ (Multi-Server)

```bash
#!/bin/bash
# scripts/deploy-single-domain.sh

DOMAIN=$1

if [ -z "$DOMAIN" ]; then
    echo "Usage: ./deploy-single-domain.sh <domain>"
    echo "Example: ./deploy-single-domain.sh tazagroup.vn"
    exit 1
fi

cd /var/www/$DOMAIN

echo "Deploying ${DOMAIN}..."

git pull origin webseo_dev3_alldomain
bun install
bun run db:generate
bun run build

pm2 reload $DOMAIN

echo "✅ ${DOMAIN} deployed!"
```

Sử dụng:

```bash
# Deploy chỉ 1 domain
./scripts/deploy-single-domain.sh tazagroup.vn

# Deploy domain khác
./scripts/deploy-single-domain.sh tazaskinclinic.com
```

### Update Domain Riêng Lẻ (Multi-Port)

```bash
# Vào thư mục domain
cd /var/www/tazaskinclinic.com

# Update
git pull
bun install
bun run db:generate
bun run build

# Reload chỉ instance này
pm2 reload tazaskinclinic.com
```

---

## 📊 SO SÁNH PHƯƠNG PHÁP

| Tiêu chí | Single Server | Multi-Port | Multi-Server |
|----------|--------------|------------|--------------|
| **Chi phí** | Thấp nhất | Thấp | Cao |
| **Isolation** | Trung bình | Khá | Cao nhất |
| **Performance** | Share resources | Share resources | Độc lập |
| **Scaling** | Khó | Trung bình | Dễ |
| **Management** | Đơn giản | Trung bình | Phức tạp |
| **Downtime** | Ảnh hưởng tất cả | Ảnh hưởng 1 domain | Ảnh hưởng 1 domain |
| **Customization** | Khó | Khá | Dễ nhất |
| **Recommended for** | Start-up | SME | Enterprise |

---

## 🎯 KHUYẾN NGHỊ

### Nên dùng Single Server khi:
- ✅ Mới bắt đầu, traffic thấp
- ✅ Ngân sách hạn chế
- ✅ Tất cả domains có traffic tương đương
- ✅ Không cần scaling riêng

### Nên dùng Multi-Port khi:
- ✅ Muốn isolation tốt hơn single server
- ✅ Dễ debug từng domain
- ✅ Traffic trung bình
- ✅ Cần update riêng lẻ

### Nên dùng Multi-Server khi:
- ✅ Traffic cao hoặc không đồng đều
- ✅ Cần scaling độc lập
- ✅ Budget đủ
- ✅ Yêu cầu uptime cao
- ✅ Một domain quan trọng hơn các domain khác

---

## 🔧 QUẢN LÝ NHIỀU SERVERS

### SSH Config

Tạo file `~/.ssh/config`:

```
Host tazagroup
    HostName xxx.xxx.xxx.1
    User root
    IdentityFile ~/.ssh/id_rsa

Host tazaskin
    HostName xxx.xxx.xxx.2
    User root
    IdentityFile ~/.ssh/id_rsa

Host timona
    HostName xxx.xxx.xxx.3
    User root
    IdentityFile ~/.ssh/id_rsa

Host hderma
    HostName xxx.xxx.xxx.4
    User root
    IdentityFile ~/.ssh/id_rsa

Host elasome
    HostName xxx.xxx.xxx.5
    User root
    IdentityFile ~/.ssh/id_rsa
```

Sử dụng:

```bash
ssh tazagroup
ssh tazaskin
ssh timona
```

### Script Deploy All Servers

```bash
#!/bin/bash
# scripts/deploy-all-servers.sh

SERVERS=("tazagroup" "tazaskin" "timona" "hderma" "elasome")

for server in "${SERVERS[@]}"; do
    echo "Deploying to ${server}..."
    ssh $server "cd /var/www/* && git pull && bun install && bun run build && pm2 reload all"
done

echo "✅ All servers deployed!"
```

---

## 📊 MONITORING NHIỀU SERVERS

### PM2 Keymetrics (Optional)

Dùng PM2 Plus để monitor tất cả servers từ 1 dashboard:

```bash
# Trên mỗi server
pm2 link <secret> <public>
```

### Custom Monitoring Script

```bash
#!/bin/bash
# scripts/check-all-servers.sh

DOMAINS=("tazagroup.vn" "tazaskinclinic.com" "timona.edu.vn" "hderma.vn" "elasome.com")

for domain in "${DOMAINS[@]}"; do
    echo "Checking ${domain}..."
    
    STATUS=$(curl -s -o /dev/null -w "%{http_code}" https://$domain)
    
    if [ $STATUS -eq 200 ]; then
        echo "✅ ${domain} is UP"
    else
        echo "❌ ${domain} is DOWN (HTTP ${STATUS})"
    fi
done
```

---

## 💾 BACKUP PER DOMAIN

```bash
#!/bin/bash
# scripts/backup-single-database.sh

DOMAIN=$1
DB_NAME=$2

if [ -z "$DOMAIN" ] || [ -z "$DB_NAME" ]; then
    echo "Usage: ./backup-single-database.sh <domain> <db_name>"
    exit 1
fi

BACKUP_DIR="/var/backups/${DOMAIN}"
mkdir -p $BACKUP_DIR

DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${DATE}.sql.gz"

PGPASSWORD="postgres" pg_dump \
    -h 116.118.49.243 \
    -p 13003 \
    -U postgres \
    -d $DB_NAME \
    | gzip > $BACKUP_FILE

echo "✅ Backup saved: $BACKUP_FILE"
```

---

## ✅ CHECKLIST DEPLOY TỪNG DOMAIN

### Pre-deployment
- [ ] Chọn phương pháp deploy (Single/Multi-Port/Multi-Server)
- [ ] Chuẩn bị server(s) với specs phù hợp
- [ ] Setup SSH access
- [ ] Clone repository

### Domain Setup
- [ ] Configure .env với DATABASE_URL riêng
- [ ] Set NEXTAUTH_URL cho domain
- [ ] Generate NEXTAUTH_SECRET riêng
- [ ] Install dependencies
- [ ] Generate Prisma Client
- [ ] Build application

### Server Configuration
- [ ] Configure Nginx cho domain
- [ ] Setup PM2 với port riêng
- [ ] Configure firewall
- [ ] Setup SSL certificate

### DNS & SSL
- [ ] Point DNS records
- [ ] Generate SSL certificates
- [ ] Test HTTPS access

### Monitoring
- [ ] Setup PM2 monitoring
- [ ] Configure backup scripts
- [ ] Test deployment script
- [ ] Document access credentials

---

**Hoàn thành hướng dẫn deploy từng domain!** 🚀
