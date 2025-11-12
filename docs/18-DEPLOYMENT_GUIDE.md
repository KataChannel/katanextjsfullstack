# HƯỚNG DẪN DEPLOYMENT MULTI-DOMAIN

**Ngày cập nhật:** 12/11/2025

## 📋 TỔNG QUAN

Hệ thống multi-domain có thể deploy theo nhiều cách khác nhau. Document này hướng dẫn các phương pháp phổ biến nhất.

## 🎯 CÁC PHƯƠNG PHÁP DEPLOYMENT

### 1. **Single Server - Multiple Domains** (Khuyến nghị)
Một server chạy Next.js app, tất cả domains trỏ về cùng IP.

### 2. **Multiple Instances - Per Domain**
Mỗi domain chạy trên instance riêng với database riêng.

### 3. **Vercel/Netlify với Domain Routing**
Deploy trên serverless platform với domain routing.

---

## 🤖 DEPLOYMENT SCRIPTS

Hệ thống cung cấp sẵn các scripts để tự động hóa deployment:

### 1. Setup Server (Lần đầu) - ALL DOMAINS

```bash
# Download script
wget https://raw.githubusercontent.com/KataChannel/katanextjsfullstack/webseo_dev3_alldomain/scripts/setup-server.sh

# Chạy với quyền root
sudo bash setup-server.sh
```

### 2. Setup Multi-Port (1 Server, 5 Instances)

```bash
# Download script
wget https://raw.githubusercontent.com/KataChannel/katanextjsfullstack/webseo_dev3_alldomain/scripts/per-domain/setup-multi-port.sh

# Chạy với quyền root
sudo bash setup-multi-port.sh
```

### 3. Setup Domain Riêng Lẻ

```bash
# Ví dụ: Setup chỉ tazagroup.vn
wget https://raw.githubusercontent.com/KataChannel/katanextjsfullstack/webseo_dev3_alldomain/scripts/per-domain/setup-tazagroup.sh

sudo bash setup-tazagroup.sh
```

**Script có sẵn cho từng domain:**
- `scripts/per-domain/setup-tazagroup.sh`
- `scripts/per-domain/setup-tazaskin.sh` (tạo tương tự)
- `scripts/per-domain/setup-timona.sh` (tạo tương tự)
- `scripts/per-domain/setup-hderma.sh` (tạo tương tự)
- `scripts/per-domain/setup-elasome.sh` (tạo tương tự)

### 4. Deploy/Update Domain Riêng Lẻ

```bash
# Deploy chỉ 1 domain
./scripts/per-domain/deploy-single-domain.sh tazagroup.vn

# Deploy domain khác
./scripts/per-domain/deploy-single-domain.sh tazaskinclinic.com
```

### 5. Deploy/Update Code (All Domains)

```bash
# Chạy từ thư mục app
cd /var/www/katanextjsfullstack
./scripts/deploy-production.sh
```

### 6. Backup Databases

```bash
# Chạy thủ công
./scripts/backup-databases.sh

# Hoặc đã tự động chạy daily at 2 AM qua cron
```

**Chi tiết:** Xem [DEPLOYMENT_PER_DOMAIN.md](./DEPLOYMENT_PER_DOMAIN.md) để biết thêm về deployment từng domain riêng lẻ.

---

## 🚀 PHƯƠNG PHÁP 1: SINGLE SERVER (KHUYẾN NGHỊ)

### Ưu điểm:
- ✅ Tiết kiệm chi phí (1 server cho tất cả)
- ✅ Dễ quản lý và maintain
- ✅ Code base duy nhất
- ✅ Auto domain detection

### Kiến trúc:

```
Internet
    ↓
DNS (5 domains point to same IP)
    ↓
    116.118.49.XXX (Your Server)
    ↓
Nginx/Caddy (Reverse Proxy)
    ↓
Next.js App (Port 3000)
    ↓
Middleware → Domain Detection
    ↓
PostgreSQL (5 databases)
```

### Bước 1: Chuẩn bị Server

```bash
# SSH vào server
ssh user@your-server-ip

# Update system
sudo apt update && sudo apt upgrade -y

# Cài đặt Node.js/Bun
curl -fsSL https://bun.sh/install | bash

# Cài đặt Nginx
sudo apt install nginx -y

# Cài đặt PostgreSQL (nếu chưa có)
sudo apt install postgresql postgresql-contrib -y

# Cài đặt PM2 (process manager)
bun add -g pm2
```

### Bước 2: Clone và Setup Code

```bash
# Clone repository
cd /var/www
git clone https://github.com/KataChannel/katanextjsfullstack.git
cd katanextjsfullstack

# Checkout branch
git checkout webseo_dev3_alldomain

# Install dependencies
bun install

# Setup environment
cp .env.example .env
nano .env
```

### Bước 3: Cấu hình .env cho Production

```bash
# .env
NODE_ENV=production

# Database - sử dụng một trong các database
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:13003/tazagroupvn"

# NextAuth - Domain chính (hoặc bất kỳ domain nào)
NEXTAUTH_URL=https://tazagroup.vn
NEXTAUTH_SECRET="your-generated-secret-here"

# Optional: Override database cho từng domain
# DATABASE_URL_TAZASKINCLINIC_COM="postgresql://postgres:postgres@116.118.49.243:13003/tazaskinclinic"
# DATABASE_URL_TIMONA_EDU_VN="postgresql://postgres:postgres@116.118.49.243:13003/timona"
# DATABASE_URL_HDERMA_VN="postgresql://postgres:postgres@116.118.49.243:13003/hderma"
# DATABASE_URL_ELASOME_COM="postgresql://postgres:postgres@116.118.49.243:13003/elasome"

# Prisma
PRISMA_HIDE_UPDATE_MESSAGE=true
PRISMA_HIDE_PREVIEW_FEATURES_WARNING=true

# OAuth (Optional)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# Email (Optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
```

**Tạo NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### Bước 4: Build Application

```bash
# Generate Prisma Client
bun run db:generate

# Build for production
bun run build
```

### Bước 5: Cấu hình Nginx

Tạo file cấu hình Nginx:

```bash
sudo nano /etc/nginx/sites-available/multidomain
```

Nội dung:

```nginx
# Upstream cho Next.js
upstream nextjs_app {
    server 127.0.0.1:3000;
    keepalive 64;
}

# Server block cho tazagroup.vn
server {
    listen 80;
    server_name tazagroup.vn www.tazagroup.vn;

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

# Server block cho tazaskinclinic.com
server {
    listen 80;
    server_name tazaskinclinic.com www.tazaskinclinic.com;

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

# Server block cho timona.edu.vn
server {
    listen 80;
    server_name timona.edu.vn www.timona.edu.vn;

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

# Server block cho hderma.vn
server {
    listen 80;
    server_name hderma.vn www.hderma.vn;

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

# Server block cho elasome.com
server {
    listen 80;
    server_name elasome.com www.elasome.com;

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
```

Enable site:

```bash
# Tạo symlink
sudo ln -s /etc/nginx/sites-available/multidomain /etc/nginx/sites-enabled/

# Test cấu hình
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### Bước 6: Cấu hình SSL với Let's Encrypt

```bash
# Cài đặt Certbot
sudo apt install certbot python3-certbot-nginx -y

# Tạo SSL certificate cho tất cả domains
sudo certbot --nginx -d tazagroup.vn -d www.tazagroup.vn \
    -d tazaskinclinic.com -d www.tazaskinclinic.com \
    -d timona.edu.vn -d www.timona.edu.vn \
    -d hderma.vn -d www.hderma.vn \
    -d elasome.com -d www.elasome.com

# Certbot sẽ tự động cập nhật Nginx config với HTTPS
```

### Bước 7: Chạy Application với PM2

Tạo file ecosystem:

```bash
nano ecosystem.config.js
```

Nội dung:

```javascript
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
```

Chạy với PM2:

```bash
# Tạo thư mục logs
mkdir -p logs

# Start app
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
pm2 startup
# Copy và chạy lệnh mà PM2 suggest

# Monitor
pm2 monit

# Check logs
pm2 logs

# Check status
pm2 status
```

### Bước 8: Cấu hình DNS

Trỏ tất cả domains về IP server của bạn:

**Tại nhà cung cấp DNS (GoDaddy, Cloudflare, v.v.):**

```
Type    Name                Value               TTL
A       tazagroup.vn       YOUR_SERVER_IP      3600
A       www.tazagroup.vn   YOUR_SERVER_IP      3600

A       tazaskinclinic.com YOUR_SERVER_IP      3600
A       www.tazaskinclinic YOUR_SERVER_IP      3600

A       timona.edu.vn      YOUR_SERVER_IP      3600
A       www.timona.edu.vn  YOUR_SERVER_IP      3600

A       hderma.vn          YOUR_SERVER_IP      3600
A       www.hderma.vn      YOUR_SERVER_IP      3600

A       elasome.com        YOUR_SERVER_IP      3600
A       www.elasome.com    YOUR_SERVER_IP      3600
```

### Bước 9: Kiểm tra

```bash
# Test từng domain
curl https://tazagroup.vn
curl https://tazaskinclinic.com
curl https://timona.edu.vn
curl https://hderma.vn
curl https://elasome.com

# Check logs
pm2 logs multidomain-app --lines 100

# Check Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log
```

---

## 🔄 CẬP NHẬT CODE (UPDATE/REDEPLOY)

### Tự động với script

Tạo file `scripts/deploy.sh`:

```bash
#!/bin/bash

echo "🚀 Starting deployment..."

# Pull latest code
git pull origin webseo_dev3_alldomain

# Install dependencies
bun install

# Generate Prisma Client
bun run db:generate

# Run database migrations
bun run db:migrate

# Build application
bun run build

# Reload PM2
pm2 reload multidomain-app

echo "✅ Deployment complete!"
```

Chạy deployment:

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Hoặc thủ công:

```bash
cd /var/www/katanextjsfullstack

# Pull code mới
git pull

# Update dependencies
bun install

# Rebuild
bun run db:generate
bun run build

# Restart app
pm2 restart multidomain-app
```

---

## 🎨 PHƯƠNG PHÁP 2: VERCEL DEPLOYMENT

### Bước 1: Push code lên GitHub

```bash
git add .
git commit -m "Multi-domain ready"
git push origin webseo_dev3_alldomain
```

### Bước 2: Import vào Vercel

1. Truy cập [vercel.com](https://vercel.com)
2. Click "Import Project"
3. Chọn repository GitHub
4. Configure:

```yaml
Framework Preset: Next.js
Build Command: bun run build
Output Directory: .next
Install Command: bun install
```

### Bước 3: Environment Variables

Thêm vào Vercel Dashboard:

```
NODE_ENV=production
DATABASE_URL=postgresql://...
NEXTAUTH_URL=https://tazagroup.vn
NEXTAUTH_SECRET=your-secret
```

### Bước 4: Thêm Custom Domains

Trong Vercel Dashboard → Settings → Domains:

1. Add `tazagroup.vn`
2. Add `www.tazagroup.vn`
3. Add `tazaskinclinic.com`
4. Add `www.tazaskinclinic.com`
5. Add `timona.edu.vn`
6. Add `www.timona.edu.vn`
7. Add `hderma.vn`
8. Add `www.hderma.vn`
9. Add `elasome.com`
10. Add `www.elasome.com`

Vercel sẽ tự động cung cấp hướng dẫn cấu hình DNS.

### Bước 5: Cấu hình DNS

Tại nhà cung cấp DNS, thêm CNAME records:

```
Type     Name                Value                    TTL
CNAME    tazagroup.vn       cname.vercel-dns.com     3600
CNAME    www                cname.vercel-dns.com     3600
```

**Lưu ý:** Vercel có giới hạn số domains trên plan miễn phí.

---

## 🐳 PHƯƠNG PHÁP 3: DOCKER DEPLOYMENT

### Tạo Dockerfile

```dockerfile
FROM oven/bun:latest AS base

# Dependencies
FROM base AS deps
WORKDIR /app
COPY package.json bun.lockb ./
RUN bun install --frozen-lockfile

# Builder
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client
RUN bun run db:generate

# Build
ENV NODE_ENV=production
RUN bun run build

# Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["bun", "server.js"]
```

### Docker Compose

```yaml
version: '3.8'

services:
  app:
    build: .
    ports:
      - "3000:3000"
    environment:
      - NODE_ENV=production
      - DATABASE_URL=postgresql://postgres:postgres@db:5432/tazagroupvn
      - NEXTAUTH_URL=https://tazagroup.vn
      - NEXTAUTH_SECRET=your-secret
    depends_on:
      - db
    restart: unless-stopped

  nginx:
    image: nginx:alpine
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./nginx.conf:/etc/nginx/nginx.conf
      - ./ssl:/etc/nginx/ssl
    depends_on:
      - app
    restart: unless-stopped

  db:
    image: postgres:15
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    volumes:
      - postgres_data:/var/lib/postgresql/data
    restart: unless-stopped

volumes:
  postgres_data:
```

Chạy:

```bash
docker-compose up -d
```

---

## 📊 MONITORING & MAINTENANCE

### PM2 Monitoring

```bash
# Real-time monitoring
pm2 monit

# Web dashboard
pm2 web

# Logs
pm2 logs --lines 200
```

### Database Maintenance

```bash
# Backup tất cả databases
pg_dump -h 116.118.49.243 -p 13003 -U postgres tazagroupvn > backup_tazagroup.sql
pg_dump -h 116.118.49.243 -p 13003 -U postgres tazaskinclinic > backup_tazaskin.sql
# ... repeat cho các database khác

# Restore
psql -h 116.118.49.243 -p 13003 -U postgres tazagroupvn < backup_tazagroup.sql
```

### Auto Backup Script

```bash
#!/bin/bash
# /var/www/scripts/backup.sh

BACKUP_DIR="/var/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)

mkdir -p $BACKUP_DIR

databases=("tazagroupvn" "tazaskinclinic" "timona" "hderma" "elasome")

for db in "${databases[@]}"; do
    echo "Backing up $db..."
    pg_dump -h 116.118.49.243 -p 13003 -U postgres $db > "$BACKUP_DIR/${db}_${DATE}.sql"
done

# Giữ backup 30 ngày
find $BACKUP_DIR -name "*.sql" -mtime +30 -delete

echo "✅ Backup complete!"
```

Thêm vào crontab:

```bash
crontab -e

# Backup mỗi ngày lúc 2h sáng
0 2 * * * /var/www/scripts/backup.sh
```

---

## 🔍 TROUBLESHOOTING

### 1. Domain không kết nối được

```bash
# Check DNS
dig tazagroup.vn

# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check application
pm2 status
pm2 logs
```

### 2. Database connection error

```bash
# Test database connection
psql -h 116.118.49.243 -p 13003 -U postgres -d tazagroupvn

# Check .env
cat .env | grep DATABASE_URL
```

### 3. SSL certificate issues

```bash
# Renew certificates
sudo certbot renew

# Force renew
sudo certbot renew --force-renewal
```

### 4. High memory usage

```bash
# Check memory
free -m

# Reduce PM2 instances
pm2 scale multidomain-app 2

# Restart
pm2 restart multidomain-app
```

---

## ✅ CHECKLIST DEPLOYMENT

- [ ] Code đã được push lên repository
- [ ] .env.example đã được cấu hình đúng
- [ ] Database migrations đã chạy
- [ ] SSL certificates đã được tạo
- [ ] DNS records đã được cấu hình
- [ ] Nginx đã được cấu hình
- [ ] PM2 đã được setup với startup script
- [ ] Backup script đã được thiết lập
- [ ] Monitoring đã được cấu hình
- [ ] Test tất cả 5 domains

---

## 📚 TÀI LIỆU THAM KHẢO

- [MULTI_DOMAIN_CONFIG.md](./MULTI_DOMAIN_CONFIG.md) - Cấu hình chi tiết
- [MULTI_DOMAIN_USAGE_EXAMPLES.md](./docs/MULTI_DOMAIN_USAGE_EXAMPLES.md) - Ví dụ code
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [PM2 Documentation](https://pm2.keymetrics.io/)
- [Nginx Documentation](https://nginx.org/en/docs/)

---

**Deployment thành công!** 🎉
