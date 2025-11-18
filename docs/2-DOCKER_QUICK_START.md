# 🚀 Quick Start - Deploy InnerBright với Docker

## 📋 Checklist nhanh

### 1️⃣ Setup server (1 lần duy nhất)

```bash
# Copy script lên server
scp scripts/setup-docker-server.sh root@116.118.48.208:/tmp/

# SSH và chạy setup
ssh root@116.118.48.208
bash /tmp/setup-docker-server.sh
```

### 2️⃣ Cấu hình .env

```bash
# Trên server
cd /var/www/innerbright

# Tạo .env file
nano .env

# Paste và sửa các giá trị:
POSTGRES_PASSWORD=your_password
PGADMIN_EMAIL=admin@innerbright.vn
PGADMIN_PASSWORD=your_password
REDIS_PASSWORD=your_password
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=your_password
NEXTAUTH_URL=https://innerbright.vn
NEXTAUTH_SECRET=$(openssl rand -base64 32)
GOOGLE_CLIENT_ID=your_id
GOOGLE_CLIENT_SECRET=your_secret
SMTP_USER=info@innerbright.vn
SMTP_PASSWORD=your_app_password
```

### 3️⃣ Deploy từ local

```bash
# Copy .env.docker.example thành .env và chỉnh sửa
cp .env.docker.example .env
nano .env

# Deploy!
./scripts/deploy-docker-innerbright.sh
```

### 4️⃣ Run migrations (lần đầu)

```bash
ssh root@116.118.48.208
cd /var/www/innerbright
docker compose exec innerbright-web bun run db:push
```

### 5️⃣ Setup SSL

```bash
# Trên server
sudo certbot --nginx -d innerbright.vn -d www.innerbright.vn
```

### 6️⃣ Cấu hình DNS

Trỏ domain về IP `116.118.48.208`

---

## 📊 Monitoring

```bash
# Xem logs
docker compose logs -f

# Check status
docker compose ps

# Health check
curl http://localhost:3005/api/health
```

---

## 🔧 Commands thường dùng

```bash
# Deploy lại
./scripts/deploy-docker-innerbright.sh

# Restart website
docker compose restart innerbright-web

# Xem logs
docker compose logs -f innerbright-web

# Backup database
docker compose exec postgres pg_dump -U postgres innerv2core > backup.sql
```

---

## 🌐 URLs

- Website: https://innerbright.vn
- PgAdmin: http://116.118.48.208:5050
- MinIO: http://116.118.48.208:9001

---

✅ **Done! Xem file DOCKER_DEPLOY_GUIDE.md để biết thêm chi tiết.**
