# 🐳 Hướng Dẫn Deploy InnerBright với Docker

## 📋 Mục Lục
1. [Tổng quan](#tổng-quan)
2. [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
3. [Chuẩn bị](#chuẩn-bị)
4. [Cài đặt ban đầu](#cài-đặt-ban-đầu)
5. [Deploy ứng dụng](#deploy-ứng-dụng)
6. [Quản lý & Monitoring](#quản-lý--monitoring)
7. [Troubleshooting](#troubleshooting)

---

## 🎯 Tổng quan

Hệ thống deploy InnerBright sử dụng Docker với 2 phần:

### **Phần 1: Infrastructure (Cơ sở hạ tầng)**
- PostgreSQL (Database)
- Redis (Cache & Session)
- MinIO (Object Storage)
- PgAdmin (Database Management UI)

### **Phần 2: Application (Ứng dụng)**
- Next.js website với Bun runtime

---

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────────────────────────────────────────────┐
│                    NGINX (Port 80/443)                   │
│                  SSL/TLS Termination                     │
└───────────────────┬─────────────────────────────────────┘
                    │
    ┌───────────────┼───────────────┐
    │               │               │
    ▼               ▼               ▼
┌─────────┐   ┌─────────┐   ┌──────────┐
│Next.js  │   │  MinIO  │   │ PgAdmin  │
│:3005    │   │  :9000  │   │  :5050   │
└────┬────┘   └────┬────┘   └──────────┘
     │             │
     │    ┌────────┴────────┐
     │    │                 │
     ▼    ▼                 ▼
┌──────────┐          ┌─────────┐
│PostgreSQL│          │  Redis  │
│  :5432   │          │  :6379  │
└──────────┘          └─────────┘

Docker Network: innerbright-network
```

---

## 🛠️ Chuẩn bị

### Yêu cầu hệ thống
- **Server**: Ubuntu 20.04+ hoặc Debian 11+
- **RAM**: Tối thiểu 4GB (khuyến nghị 8GB)
- **Disk**: Tối thiểu 20GB free space
- **CPU**: 2 cores trở lên
- **Network**: Port 22, 80, 443 mở

### Trên máy local
1. **SSH access** đến server 116.118.48.208
2. **rsync** đã cài đặt

```bash
# Kiểm tra SSH
ssh root@116.118.48.208

# Kiểm tra rsync
which rsync
```

---

## 📦 Cài đặt ban đầu

### Bước 1: Setup server (chạy 1 lần duy nhất)

```bash
# Copy script lên server
scp scripts/setup-docker-server.sh root@116.118.48.208:/tmp/

# SSH vào server
ssh root@116.118.48.208

# Chạy script setup
bash /tmp/setup-docker-server.sh
```

**Script sẽ tự động:**
- ✅ Update hệ thống
- ✅ Cài Docker & Docker Compose
- ✅ Cài Nginx
- ✅ Cài Certbot (cho SSL)
- ✅ Tạo thư mục /var/www/innerbright
- ✅ Cấu hình firewall
- ✅ Tạo Docker network
- ✅ Cấu hình Nginx template

### Bước 2: Cấu hình môi trường

```bash
# Vẫn ở trên server
cd /var/www/innerbright

# Tạo file .env (file này sẽ được deploy script copy lên)
# Bây giờ tạm thời tạo template
cat > .env << 'EOF'
# PostgreSQL
POSTGRES_PASSWORD=your_secure_password_here

# PgAdmin
PGADMIN_EMAIL=admin@innerbright.vn
PGADMIN_PASSWORD=your_pgadmin_password

# Redis
REDIS_PASSWORD=your_redis_password

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=your_minio_password

# NextAuth (Generate: openssl rand -base64 32)
NEXTAUTH_URL=https://innerbright.vn
NEXTAUTH_SECRET=your_nextauth_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# SMTP
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=info@innerbright.vn
SMTP_PASSWORD=your_gmail_app_password
SMTP_FROM_EMAIL=info@innerbright.vn
EOF

# Chỉnh sửa file .env với các giá trị thật
nano .env
```

**Các bước quan trọng:**

1. **Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

2. **Thay đổi TẤT CẢ passwords** thành giá trị an toàn

3. **Cấu hình Google OAuth:**
   - Truy cập: https://console.cloud.google.com
   - Tạo OAuth 2.0 credentials
   - Thêm redirect URI: `https://innerbright.vn/api/auth/callback/google`

4. **Cấu hình Gmail SMTP:**
   - Bật 2-Factor Authentication
   - Tạo App Password tại: https://myaccount.google.com/apppasswords

---

## 🚀 Deploy ứng dụng

### Từ máy local

```bash
# 1. Đảm bảo có file .env trong project local
cp .env.docker.example .env
nano .env  # Chỉnh sửa các giá trị

# 2. Chạy deploy script
./scripts/deploy-docker-innerbright.sh
```

**Deploy script sẽ:**
1. ✅ Sync code lên server (rsync)
2. ✅ Copy file .env
3. ✅ Start infrastructure (PostgreSQL, Redis, MinIO, PgAdmin)
4. ✅ Build Docker image cho Next.js
5. ✅ Deploy website container
6. ✅ Hiển thị logs và status

### Lần deploy đầu tiên

Sau khi chạy deploy script thành công, cần chạy Prisma migrations:

```bash
# SSH vào server
ssh root@116.118.48.208
cd /var/www/innerbright

# Chạy migrations
docker compose exec innerbright-web bun run db:push

# Hoặc nếu có migration files
docker compose exec innerbright-web bun run db:migrate
```

---

## 🔒 Setup SSL Certificate

```bash
# Trên server
sudo certbot --nginx -d innerbright.vn -d www.innerbright.vn

# Certbot sẽ:
# 1. Tự động cấu hình Nginx
# 2. Tạo SSL certificate
# 3. Setup auto-renewal
```

Kiểm tra auto-renewal:
```bash
sudo certbot renew --dry-run
```

---

## 🌐 Cấu hình DNS

Trỏ domain về server:

| Type | Name | Value | TTL |
|------|------|-------|-----|
| A | innerbright.vn | 116.118.48.208 | 3600 |
| A | www.innerbright.vn | 116.118.48.208 | 3600 |

Kiểm tra DNS:
```bash
dig innerbright.vn
nslookup innerbright.vn
```

---

## 📊 Quản lý & Monitoring

### Container Management

```bash
cd /var/www/innerbright

# Xem status tất cả containers
docker compose ps

# Xem logs
docker compose logs -f                    # All services
docker compose logs -f innerbright-web    # Chỉ website
docker compose logs -f postgres           # Chỉ database

# Restart services
docker compose restart                    # All
docker compose restart innerbright-web    # Chỉ website

# Stop/Start
docker compose down                       # Stop all
docker compose up -d                      # Start all

# Rebuild và restart website
docker compose build --no-cache
docker compose up -d
```

### Infrastructure Management

```bash
# Infrastructure services
docker compose -f docker-compose.infrastructure.yml ps
docker compose -f docker-compose.infrastructure.yml logs -f
docker compose -f docker-compose.infrastructure.yml restart
```

### Database Access

**Via PgAdmin:**
- URL: http://116.118.48.208:5050
- Email: admin@innerbright.vn (từ .env)
- Password: (từ .env)

**Add server trong PgAdmin:**
- Name: InnerBright
- Host: postgres (Docker hostname)
- Port: 5432
- Database: innerv2core
- Username: postgres
- Password: (từ .env)

**Via Command Line:**
```bash
# Connect vào PostgreSQL container
docker compose exec postgres psql -U postgres -d innerv2core

# Backup database
docker compose exec postgres pg_dump -U postgres innerv2core > backup.sql

# Restore database
docker compose exec -T postgres psql -U postgres innerv2core < backup.sql
```

### MinIO Management

**MinIO Console:**
- URL: http://116.118.48.208:9001
- Username: minioadmin (từ .env)
- Password: (từ .env)

**MinIO API:**
- Endpoint: http://116.118.48.208:9000

### Redis Management

```bash
# Connect to Redis
docker compose exec redis redis-cli -a your_redis_password

# Check keys
KEYS *

# Monitor commands
MONITOR
```

---

## 🔍 Health Checks

```bash
# Website health
curl http://localhost:3005/api/health

# PostgreSQL
docker compose exec postgres pg_isready -U postgres

# Redis
docker compose exec redis redis-cli -a password ping

# MinIO
curl http://localhost:9000/minio/health/live
```

---

## 🐛 Troubleshooting

### Website không start

```bash
# Xem logs chi tiết
docker compose logs innerbright-web

# Kiểm tra database connection
docker compose exec innerbright-web env | grep DATABASE_URL

# Rebuild container
docker compose down
docker compose build --no-cache
docker compose up -d
```

### Database connection error

```bash
# Kiểm tra PostgreSQL running
docker compose ps postgres

# Test connection
docker compose exec postgres psql -U postgres -d innerv2core -c "SELECT 1;"

# Check network
docker network inspect innerbright-network
```

### Port conflicts

```bash
# Kiểm tra ports đang dùng
sudo netstat -tulpn | grep -E "3005|5432|6379|9000|9001|5050"

# Stop conflict services
sudo systemctl stop postgresql  # If local PostgreSQL running
sudo systemctl stop redis      # If local Redis running
```

### Out of memory

```bash
# Xem memory usage
docker stats

# Giảm memory limit trong docker-compose.yml
# Thêm vào service:
#   deploy:
#     resources:
#       limits:
#         memory: 1G
```

### Nginx 502 Bad Gateway

```bash
# Kiểm tra website container running
docker compose ps innerbright-web

# Kiểm tra Nginx config
sudo nginx -t

# Xem Nginx logs
sudo tail -f /var/www/innerbright/logs/nginx-error.log

# Restart Nginx
sudo systemctl restart nginx
```

### SSL Certificate issues

```bash
# Xem logs
sudo journalctl -u certbot -n 50

# Force renewal
sudo certbot renew --force-renewal

# Check certificate
sudo certbot certificates
```

### Disk space full

```bash
# Xem disk usage
df -h

# Xem Docker disk usage
docker system df

# Clean up
docker system prune -a --volumes  # ⚠️ Cẩn thận: Xóa tất cả unused data
```

---

## 📝 Maintenance Tasks

### Weekly

```bash
# Backup database
cd /var/www/innerbright
docker compose exec postgres pg_dump -U postgres innerv2core | gzip > backups/db-$(date +%Y%m%d).sql.gz

# Clean Docker system
docker system prune -f
```

### Monthly

```bash
# Update Docker images
cd /var/www/innerbright
docker compose pull
docker compose up -d

# Check SSL renewal
sudo certbot renew --dry-run
```

---

## 🎯 Quick Commands Reference

```bash
# Deploy từ local
./scripts/deploy-docker-innerbright.sh

# Trên server - Xem logs
docker compose logs -f

# Trên server - Restart website
docker compose restart innerbright-web

# Trên server - Full restart
docker compose down && docker compose up -d

# Trên server - Database backup
docker compose exec postgres pg_dump -U postgres innerv2core > backup.sql

# Trên server - View health
curl http://localhost:3005/api/health
```

---

## 🔗 URLs

### Production
- **Website**: https://innerbright.vn
- **Admin**: https://innerbright.vn/admin

### Management Interfaces
- **PgAdmin**: http://116.118.48.208:5050
- **MinIO Console**: http://116.118.48.208:9001
- **MinIO API**: http://116.118.48.208:9000

---

## 📞 Support

Nếu gặp vấn đề:
1. Kiểm tra logs: `docker compose logs -f`
2. Kiểm tra health: `curl http://localhost:3005/api/health`
3. Review troubleshooting section
4. Check Docker status: `docker compose ps`

---

**✅ Setup hoàn tất! Website đã sẵn sàng chạy trên production với Docker! 🚀**
