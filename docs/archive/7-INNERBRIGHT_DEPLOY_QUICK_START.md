# 🚀 Quick Start: Deploy InnerBright.vn

## 📋 Thông tin Server
- **Server IP**: 116.118.48.208
- **Domain**: innerbright.vn
- **Frontend**: Next.js với Bun.js
- **Backend**: Docker (PostgreSQL, Redis, MinIO)
- **Port**: 3005

---

## ⚡ Deploy Nhanh (3 bước)

### Bước 1: Chuẩn bị file .env

```bash
# Copy template
cp .env.innerbright .env.innerbright.local

# Chỉnh sửa các giá trị cần thiết
nano .env.innerbright.local
```

**Các giá trị BẮT BUỘC phải thay đổi:**
- `NEXTAUTH_SECRET` - Generate mới: `openssl rand -base64 32`
- `SMTP_PASSWORD` - Gmail App Password
- `POSTGRES_PASSWORD` - Đổi password mới cho bảo mật
- `REDIS_PASSWORD` - Đổi password mới
- `MINIO_ROOT_PASSWORD` - Đổi password mới

### Bước 2: Deploy lên server

```bash
# Chạy deployment script
./scripts/deploy-docker-innerbright.sh
```

Script sẽ tự động:
1. ✅ Validate file .env
2. ✅ Sync code lên server
3. ✅ Build Docker image (Next.js + Bun)
4. ✅ Upload image lên server
5. ✅ Start infrastructure (PostgreSQL, Redis, MinIO)
6. ✅ Deploy website
7. ✅ Show logs và status

**Thời gian**: 5-10 phút (tùy tốc độ mạng)

### Bước 3: Kiểm tra health

```bash
# Kiểm tra status
./scripts/check-innerbright-health.sh
```

---

## 🔧 Lần Deploy Đầu Tiên

Sau khi deploy thành công, cần chạy migrations:

```bash
# SSH vào server
ssh root@116.118.48.208
cd /var/www/innerbright

# Chạy Prisma migrations
docker compose exec innerbright-web bun run db:push

# Hoặc nếu có migration files
docker compose exec innerbright-web bun run db:migrate
```

---

## 🌐 Setup Nginx & SSL (Một lần duy nhất)

### 1. Cấu hình Nginx

```bash
# SSH vào server
ssh root@116.118.48.208

# Tạo file config
sudo nano /etc/nginx/sites-available/innerbright.vn
```

Paste nội dung sau:

```nginx
# Redirect HTTP to HTTPS
server {
    listen 80;
    listen [::]:80;
    server_name innerbright.vn www.innerbright.vn;
    
    location /.well-known/acme-challenge/ {
        root /var/www/letsencrypt;
    }
    
    location / {
        return 301 https://$server_name$request_uri;
    }
}

# HTTPS configuration
server {
    listen 443 ssl http2;
    listen [::]:443 ssl http2;
    server_name innerbright.vn www.innerbright.vn;

    # SSL certificates (will be configured by Certbot)
    ssl_certificate /etc/letsencrypt/live/innerbright.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/innerbright.vn/privkey.pem;
    
    # SSL configuration
    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;
    ssl_ciphers ECDHE-RSA-AES256-GCM-SHA512:DHE-RSA-AES256-GCM-SHA512:ECDHE-RSA-AES256-GCM-SHA384:DHE-RSA-AES256-GCM-SHA384;
    
    # Logs
    access_log /var/log/nginx/innerbright.vn.access.log;
    error_log /var/log/nginx/innerbright.vn.error.log;

    # Max upload size
    client_max_body_size 100M;

    # Proxy to Next.js
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
}
```

### 2. Enable site và test

```bash
# Enable site
sudo ln -s /etc/nginx/sites-available/innerbright.vn /etc/nginx/sites-enabled/

# Test config
sudo nginx -t

# Reload Nginx
sudo systemctl reload nginx
```

### 3. Setup SSL Certificate

```bash
# Cài Certbot (nếu chưa có)
sudo apt update
sudo apt install -y certbot python3-certbot-nginx

# Tạo thư mục cho ACME challenge
sudo mkdir -p /var/www/letsencrypt

# Generate SSL certificate
sudo certbot --nginx -d innerbright.vn -d www.innerbright.vn

# Test auto-renewal
sudo certbot renew --dry-run
```

---

## 📊 Monitoring & Management

### Xem Logs

```bash
# SSH vào server
ssh root@116.118.48.208
cd /var/www/innerbright

# Xem logs real-time
docker compose logs -f

# Chỉ xem website logs
docker compose logs -f innerbright-web

# Xem 100 dòng cuối
docker compose logs --tail=100 innerbright-web
```

### Quản lý Containers

```bash
# Xem status
docker compose ps

# Restart website
docker compose restart innerbright-web

# Restart tất cả
docker compose restart

# Stop tất cả
docker compose down

# Start tất cả
docker compose up -d
```

### Database Management

**Via PgAdmin Web UI:**
- URL: http://116.118.48.208:5050
- Email: admin@innerbright.vn
- Password: (từ .env)

**Via Command Line:**
```bash
# Connect PostgreSQL
docker compose exec postgres psql -U postgres -d innerv2core

# Backup database
docker compose exec postgres pg_dump -U postgres innerv2core > backup_$(date +%Y%m%d).sql

# Restore database
docker compose exec -T postgres psql -U postgres innerv2core < backup.sql
```

### MinIO Storage

**MinIO Console:**
- URL: http://116.118.48.208:9001
- Username: minioadmin
- Password: (từ .env)

---

## 🔄 Re-deploy (Cập nhật code)

Khi có code mới, chỉ cần chạy lại script:

```bash
# Từ máy local
./scripts/deploy-docker-innerbright.sh
```

Script sẽ tự động:
1. Sync code mới
2. Rebuild image
3. Restart container với code mới

---

## 🐛 Troubleshooting

### Website không start

```bash
# Xem logs chi tiết
docker compose logs innerbright-web

# Kiểm tra container status
docker compose ps

# Restart
docker compose restart innerbright-web
```

### Database connection error

```bash
# Kiểm tra PostgreSQL
docker compose ps postgres

# Test connection
docker compose exec postgres psql -U postgres -d innerv2core -c "SELECT 1;"

# Restart PostgreSQL
docker compose restart postgres
```

### Out of memory

```bash
# Xem memory usage
docker stats

# Clean up unused resources
docker system prune -f

# Restart services một cách từ từ
docker compose restart postgres
sleep 5
docker compose restart redis
sleep 5
docker compose restart innerbright-web
```

### Nginx 502 Bad Gateway

```bash
# Kiểm tra website running
docker compose ps innerbright-web

# Test health endpoint
curl http://localhost:3005/api/health

# Restart Nginx
sudo systemctl restart nginx
```

---

## 📝 Useful Commands Cheat Sheet

```bash
# Deploy từ local
./scripts/deploy-docker-innerbright.sh

# Check health
./scripts/check-innerbright-health.sh

# SSH vào server
ssh root@116.118.48.208

# View logs
docker compose logs -f

# Restart website
docker compose restart innerbright-web

# Database backup
docker compose exec postgres pg_dump -U postgres innerv2core > backup.sql

# Check health endpoint
curl http://localhost:3005/api/health

# View resource usage
docker stats

# Clean up Docker
docker system prune -f
```

---

## 🔗 URLs

### Production
- **Website**: https://innerbright.vn
- **Admin Panel**: https://innerbright.vn/admin
- **API Health**: http://116.118.48.208:3005/api/health

### Management Interfaces
- **PgAdmin**: http://116.118.48.208:5050
- **MinIO Console**: http://116.118.48.208:9001
- **MinIO API**: http://116.118.48.208:9000

---

## 📞 Quick Help

**Website không truy cập được?**
1. Kiểm tra containers: `docker compose ps`
2. Xem logs: `docker compose logs -f innerbright-web`
3. Check health: `curl http://localhost:3005/api/health`

**Database lỗi?**
1. Restart PostgreSQL: `docker compose restart postgres`
2. Check connection: `docker compose exec postgres pg_isready`

**Out of memory?**
1. Check usage: `docker stats`
2. Clean up: `docker system prune -f`
3. Restart services one by one

---

**✅ Happy Deploying! 🚀**

Nếu có vấn đề, chạy health check script để xem chi tiết:
```bash
./scripts/check-innerbright-health.sh
```
