# 🚀 InnerBright Deployment - Tổng Quan

## 📋 Thông Tin Hệ Thống

### Server
- **IP**: 116.118.48.208
- **User**: root
- **Directory**: /var/www/innerbright

### Domain
- **Production**: https://innerbright.vn
- **Port**: 3005

### Tech Stack
- **Frontend**: Next.js 16 với Bun.js runtime
- **Database**: PostgreSQL 15
- **Cache**: Redis 7
- **Storage**: MinIO
- **Container**: Docker & Docker Compose

---

## 🎯 Quick Start

### 1️⃣ Chuẩn Bị (Lần đầu tiên)

```bash
# 1. Clone repository hoặc pull code mới nhất
git pull origin main

# 2. Copy và chỉnh sửa file .env
cp .env.innerbright .env.innerbright.local
nano .env.innerbright.local

# 3. Thay đổi các giá trị quan trọng:
#    - NEXTAUTH_SECRET (generate: openssl rand -base64 32)
#    - SMTP_PASSWORD (Gmail App Password)
#    - POSTGRES_PASSWORD
#    - REDIS_PASSWORD
#    - MINIO_ROOT_PASSWORD
```

### 2️⃣ Deploy

```bash
# Sử dụng management script (Recommended)
./scripts/manage-innerbright.sh

# Hoặc deploy trực tiếp
./scripts/deploy-docker-innerbright.sh
```

### 3️⃣ Kiểm Tra

```bash
# Check health
./scripts/check-innerbright-health.sh

# Hoặc dùng management script
./scripts/manage-innerbright.sh
# Chọn option 2 (Check health status)
```

---

## 📁 Cấu Trúc Files Quan Trọng

```
kataseo/
├── .env.innerbright              # Template env file cho InnerBright
├── docker-compose.yml            # Main app container (Next.js)
├── docker-compose.infrastructure.yml  # Infrastructure (DB, Redis, MinIO)
├── Dockerfile                    # Next.js image với Bun
├── INNERBRIGHT_DEPLOY_QUICK_START.md  # Hướng dẫn chi tiết
├── scripts/
│   ├── deploy-docker-innerbright.sh   # Deploy script chính
│   ├── check-innerbright-health.sh    # Health check script
│   ├── manage-innerbright.sh          # Management menu (Recommended)
│   └── setup-docker-server.sh         # Setup server lần đầu
```

---

## 🛠️ Management Script (Recommended)

Script này cung cấp menu tương tác để quản lý:

```bash
./scripts/manage-innerbright.sh
```

**Các tính năng:**
1. 🚀 Deploy to server (Full deployment)
2. 🏥 Check health status
3. 📝 View logs
4. 🔄 Restart website
5. 🔄 Restart all services
6. 🔐 SSH to server
7. 💾 Database backup
8. 🧹 Clean Docker (prune)
9. 💻 View resource usage

---

## 📚 Các Script Chính

### 1. Deploy Script
```bash
./scripts/deploy-docker-innerbright.sh
```
- ✅ Validate .env file
- ✅ Sync code to server
- ✅ Build Docker image locally
- ✅ Upload to server
- ✅ Start infrastructure
- ✅ Deploy website
- ✅ Show status

### 2. Health Check Script
```bash
./scripts/check-innerbright-health.sh
```
- ✅ Check Docker status
- ✅ Check network
- ✅ Check all containers
- ✅ Test health endpoint
- ✅ Show resource usage
- ✅ Show recent logs

### 3. Management Script
```bash
./scripts/manage-innerbright.sh
```
- ✅ Interactive menu
- ✅ All common operations
- ✅ Easy to use

---

## 🔧 Các Thao Tác Thường Dùng

### View Logs
```bash
# Từ local (qua SSH)
./scripts/manage-innerbright.sh  # Chọn option 3

# Hoặc SSH vào server
ssh root@116.118.48.208
cd /var/www/innerbright
docker compose logs -f
```

### Restart Services
```bash
# Restart website only
ssh root@116.118.48.208
cd /var/www/innerbright
docker compose restart innerbright-web

# Restart all
docker compose restart
```

### Database Backup
```bash
# Dùng management script
./scripts/manage-innerbright.sh  # Chọn option 7

# Hoặc manual
ssh root@116.118.48.208
cd /var/www/innerbright
docker compose exec postgres pg_dump -U postgres innerv2core > backup.sql
```

### Update Code
```bash
# Pull code mới
git pull origin main

# Deploy lại
./scripts/deploy-docker-innerbright.sh
```

---

## 🏗️ Infrastructure Services

### PostgreSQL
- **Container**: innerbright-postgres
- **Port**: 5432
- **Database**: innerv2core
- **User**: postgres

### Redis
- **Container**: innerbright-redis
- **Port**: 6379
- **Password**: Từ .env

### MinIO
- **Container**: innerbright-minio
- **API Port**: 9000
- **Console Port**: 9001
- **Console**: http://116.118.48.208:9001

### PgAdmin
- **Container**: innerbright-pgadmin
- **Port**: 5050
- **URL**: http://116.118.48.208:5050

---

## 🌐 URLs & Endpoints

### Production
- **Website**: https://innerbright.vn
- **Admin**: https://innerbright.vn/admin
- **API Health**: http://116.118.48.208:3005/api/health

### Management
- **PgAdmin**: http://116.118.48.208:5050
- **MinIO Console**: http://116.118.48.208:9001

---

## 🐛 Troubleshooting

### Website không start
```bash
# 1. Xem logs
docker compose logs innerbright-web

# 2. Check container
docker compose ps

# 3. Restart
docker compose restart innerbright-web
```

### Database error
```bash
# 1. Check PostgreSQL
docker compose ps postgres

# 2. Test connection
docker compose exec postgres psql -U postgres -d innerv2core -c "SELECT 1;"

# 3. Restart
docker compose restart postgres
```

### Out of memory
```bash
# 1. Check usage
docker stats

# 2. Clean up
docker system prune -f

# 3. Restart services gradually
docker compose restart postgres
sleep 10
docker compose restart innerbright-web
```

### Port conflict
```bash
# Check ports
sudo netstat -tulpn | grep -E "3005|5432|6379|9000"

# Stop conflicting services
sudo systemctl stop postgresql  # If local PostgreSQL
```

---

## 📖 Documentation Files

1. **INNERBRIGHT_DEPLOY_QUICK_START.md** - Hướng dẫn chi tiết từng bước
2. **DOCKER_DEPLOY_GUIDE.md** - Hướng dẫn tổng quan về Docker deployment
3. **README_INNERBRIGHT.md** - File này (Overview)

---

## 🔐 Security Checklist

- [ ] Đổi tất cả passwords trong .env
- [ ] Generate NEXTAUTH_SECRET mới
- [ ] Cấu hình Google OAuth với domain chính xác
- [ ] Setup SSL certificate với Certbot
- [ ] Cấu hình firewall cho ports cần thiết
- [ ] Backup database định kỳ
- [ ] Không commit file .env vào git

---

## 📞 Quick Help

**Cần deploy nhanh?**
```bash
./scripts/manage-innerbright.sh
# Chọn option 1
```

**Kiểm tra status?**
```bash
./scripts/manage-innerbright.sh
# Chọn option 2
```

**Xem logs?**
```bash
./scripts/manage-innerbright.sh
# Chọn option 3
```

**Backup database?**
```bash
./scripts/manage-innerbright.sh
# Chọn option 7
```

---

## 🎯 Best Practices

1. **Trước khi deploy**: Luôn test code trên local
2. **Sau khi deploy**: Chạy health check
3. **Định kỳ**: Backup database (hàng tuần)
4. **Monitoring**: Check logs thường xuyên
5. **Security**: Update passwords định kỳ
6. **Cleanup**: Chạy docker prune hàng tháng

---

## 📈 Performance Tips

1. **Memory**: Monitor với `docker stats`
2. **Disk**: Clean up unused images: `docker system prune`
3. **Logs**: Rotate logs để tránh disk full
4. **Database**: Vacuum và analyze định kỳ
5. **Cache**: Clear Redis cache khi cần

---

**✅ Happy Deploying! 🚀**

Để biết thêm chi tiết, xem: `INNERBRIGHT_DEPLOY_QUICK_START.md`
