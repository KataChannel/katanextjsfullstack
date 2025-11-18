# 📦 Tổng Hợp Deploy InnerBright với Docker

## 🎯 Tổng quan

Hệ thống deploy InnerBright.vn lên server 116.118.48.208 sử dụng **Docker** với 2 phần:

### **Phần 1: Infrastructure (Cơ sở hạ tầng)**
- PostgreSQL Database (port 5432)
- Redis Cache (port 6379)
- MinIO Object Storage (port 9000, 9001)
- PgAdmin Database UI (port 5050)

### **Phần 2: Application (Ứng dụng)**
- Next.js Website với Bun (port 3005)
- Nginx Reverse Proxy (port 80, 443)
- SSL Certificate (Certbot)

---

## 📁 Files đã tạo

### 1. Docker Configuration

#### `docker-compose.infrastructure.yml`
- Infrastructure services: PostgreSQL, Redis, MinIO, PgAdmin
- Network: innerbright-network
- Volumes: postgres_data, redis_data, minio_data, pgadmin_data
- Health checks cho tất cả services
- MinIO auto-create bucket "innerbright"

#### `docker-compose.yml`
- Next.js application container
- Kết nối với infrastructure services
- Environment variables configuration
- Health check endpoint
- Volume mount cho uploads

#### `Dockerfile`
- Multi-stage build (deps → builder → runner)
- Stage 1: Install dependencies với Bun
- Stage 2: Build Next.js application
- Stage 3: Production runtime (slim image)
- Non-root user (nextjs:nodejs)
- Standalone output optimization
- Health check built-in

#### `.dockerignore`
- Exclude node_modules, .next, .git
- Exclude .env files và logs
- Exclude documentation và scripts

#### `.env.docker.example`
- Template cho tất cả environment variables
- PostgreSQL, Redis, MinIO configs
- NextAuth và OAuth settings
- SMTP configuration

### 2. Scripts

#### `scripts/deploy-docker-innerbright.sh`
- Automated deployment script
- Rsync code lên server
- Copy .env file
- Remote execution via SSH
- Start infrastructure
- Build và deploy website
- Show status và logs

#### `scripts/setup-docker-server.sh`
- One-time server setup
- Install Docker & Docker Compose
- Install Nginx & Certbot
- Create directories
- Configure firewall (UFW)
- Setup Nginx configuration
- Create Docker network

### 3. Application Files

#### `app/api/health/route.ts`
- Health check endpoint
- Return status, timestamp, service name
- Used by Docker health checks

#### `next.config.ts` (Updated)
- Added: `output: 'standalone'` cho Docker
- Added: MinIO hostname trong remotePatterns
- Optimized for production deployment

### 4. Documentation

#### `DOCKER_DEPLOY_GUIDE.md`
- Comprehensive deployment guide
- Architecture diagram
- Step-by-step instructions
- Management commands
- Troubleshooting section
- Maintenance tasks

#### `DOCKER_QUICK_START.md`
- Quick reference guide
- 6-step deployment process
- Essential commands only
- URLs reference

---

## 🏗️ Kiến trúc Docker

```
┌──────────────────────────────────────────┐
│          Host: 116.118.48.208             │
├──────────────────────────────────────────┤
│                                           │
│  ┌────────────────────────────────────┐  │
│  │   Nginx (Host)                     │  │
│  │   - Port 80 (HTTP)                 │  │
│  │   - Port 443 (HTTPS/SSL)           │  │
│  └─────────────┬──────────────────────┘  │
│                │                          │
│  ┌─────────────▼──────────────────────┐  │
│  │   Docker Network                   │  │
│  │   innerbright-network              │  │
│  │                                    │  │
│  │  ┌──────────────────────────────┐ │  │
│  │  │  innerbright-web             │ │  │
│  │  │  (Next.js + Bun)             │ │  │
│  │  │  Port: 3005                  │ │  │
│  │  └──────────┬───────────────────┘ │  │
│  │             │                      │  │
│  │  ┌──────────▼──────┐  ┌─────────┐ │  │
│  │  │  postgres       │  │  redis  │ │  │
│  │  │  Port: 5432     │  │  :6379  │ │  │
│  │  └─────────────────┘  └─────────┘ │  │
│  │                                    │  │
│  │  ┌─────────────┐  ┌──────────┐   │  │
│  │  │  minio      │  │ pgadmin  │   │  │
│  │  │  :9000/9001 │  │  :5050   │   │  │
│  │  └─────────────┘  └──────────┘   │  │
│  └────────────────────────────────────┘  │
│                                           │
└──────────────────────────────────────────┘
```

---

## 🚀 Quy trình Deploy

### Lần đầu tiên (Full Setup)

```bash
# 1. Setup server (trên server)
scp scripts/setup-docker-server.sh root@116.118.48.208:/tmp/
ssh root@116.118.48.208
bash /tmp/setup-docker-server.sh

# 2. Configure .env (trên server)
cd /var/www/innerbright
nano .env  # Paste và chỉnh sửa từ .env.docker.example

# 3. Deploy từ local
cp .env.docker.example .env
nano .env  # Chỉnh sửa
./scripts/deploy-docker-innerbright.sh

# 4. Run migrations (trên server)
ssh root@116.118.48.208
cd /var/www/innerbright
docker compose exec innerbright-web bun run db:push

# 5. Setup SSL (trên server)
sudo certbot --nginx -d innerbright.vn -d www.innerbright.vn

# 6. Configure DNS
# Trỏ innerbright.vn và www.innerbright.vn về 116.118.48.208
```

### Lần sau (Update code)

```bash
# Từ local, chạy 1 lệnh duy nhất:
./scripts/deploy-docker-innerbright.sh
```

---

## 📊 Container Services

| Service | Container | Port | Description |
|---------|-----------|------|-------------|
| **Website** | innerbright-web | 3005 | Next.js application |
| **Database** | innerbright-postgres | 5432 | PostgreSQL 15 |
| **Cache** | innerbright-redis | 6379 | Redis 7 |
| **Storage** | innerbright-minio | 9000, 9001 | MinIO object storage |
| **DB Admin** | innerbright-pgadmin | 5050 | PgAdmin 4 web UI |
| **Proxy** | nginx (host) | 80, 443 | Nginx reverse proxy |

---

## 🔧 Environment Variables

### Required Variables (trong .env)

```bash
# Database
POSTGRES_PASSWORD=secure_password

# Redis
REDIS_PASSWORD=secure_password

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=secure_password

# NextAuth
NEXTAUTH_URL=https://innerbright.vn
NEXTAUTH_SECRET=generated_secret_32_chars

# OAuth
GOOGLE_CLIENT_ID=your_client_id
GOOGLE_CLIENT_SECRET=your_client_secret

# SMTP
SMTP_USER=info@innerbright.vn
SMTP_PASSWORD=gmail_app_password

# PgAdmin
PGADMIN_EMAIL=admin@innerbright.vn
PGADMIN_PASSWORD=secure_password
```

---

## 🎯 Features & Optimizations

### Docker Features
- ✅ Multi-stage build (giảm image size)
- ✅ Non-root user (security)
- ✅ Health checks (auto-restart khi unhealthy)
- ✅ Persistent volumes (data không mất khi restart)
- ✅ Docker network isolation
- ✅ Resource limits (prevent OOM)
- ✅ Standalone Next.js output (optimized)

### Infrastructure Features
- ✅ PostgreSQL với health check
- ✅ Redis với password protection
- ✅ MinIO auto-create bucket
- ✅ PgAdmin web interface
- ✅ Nginx reverse proxy
- ✅ SSL/TLS với Certbot
- ✅ Firewall configuration

### Application Features
- ✅ Bun runtime (fast)
- ✅ Next.js 16 standalone
- ✅ Prisma ORM
- ✅ NextAuth authentication
- ✅ File uploads với MinIO
- ✅ Health check endpoint
- ✅ Production optimizations

---

## 📝 Common Commands

### Deployment
```bash
# Deploy từ local
./scripts/deploy-docker-innerbright.sh

# Deploy chỉ infrastructure
ssh root@116.118.48.208
cd /var/www/innerbright
docker compose -f docker-compose.infrastructure.yml up -d

# Deploy chỉ website
docker compose up -d --build
```

### Management
```bash
# Xem logs
docker compose logs -f
docker compose logs -f innerbright-web
docker compose logs -f postgres

# Check status
docker compose ps

# Restart services
docker compose restart innerbright-web
docker compose restart

# Stop/Start
docker compose down
docker compose up -d
```

### Database
```bash
# Connect PostgreSQL
docker compose exec postgres psql -U postgres -d innerv2core

# Backup
docker compose exec postgres pg_dump -U postgres innerv2core > backup.sql

# Restore
docker compose exec -T postgres psql -U postgres innerv2core < backup.sql

# Run migrations
docker compose exec innerbright-web bun run db:push
```

### Monitoring
```bash
# Health check
curl http://localhost:3005/api/health

# Container stats
docker stats

# Disk usage
docker system df
```

---

## 🌐 URLs

### Production
- **Website**: https://innerbright.vn
- **Admin**: https://innerbright.vn/admin

### Management
- **PgAdmin**: http://116.118.48.208:5050
- **MinIO Console**: http://116.118.48.208:9001
- **MinIO API**: http://116.118.48.208:9000

### Health
- **API Health**: http://116.118.48.208:3005/api/health

---

## ⚠️ Security Notes

1. **Environment Variables**
   - Không commit .env vào git
   - Sử dụng strong passwords
   - Generate NEXTAUTH_SECRET: `openssl rand -base64 32`

2. **Firewall**
   - Chỉ mở ports cần thiết
   - UFW configured automatically
   - Ports: 22, 80, 443, 3005, 5432, 6379, 9000, 9001, 5050

3. **SSL Certificate**
   - Auto-renewal enabled với Certbot
   - Kiểm tra: `sudo certbot renew --dry-run`

4. **Docker Security**
   - Non-root user trong containers
   - Network isolation
   - Resource limits
   - Health checks

---

## 🐛 Troubleshooting

### Container không start
```bash
docker compose logs innerbright-web
docker compose ps
docker compose down && docker compose up -d
```

### Database connection failed
```bash
docker compose exec postgres psql -U postgres -d innerv2core -c "SELECT 1;"
docker network inspect innerbright-network
```

### Port conflicts
```bash
sudo netstat -tulpn | grep -E "3005|5432|6379|9000"
sudo systemctl stop postgresql
sudo systemctl stop redis
```

### Nginx 502
```bash
docker compose ps innerbright-web
sudo nginx -t
sudo systemctl restart nginx
tail -f /var/www/innerbright/logs/nginx-error.log
```

### Out of memory
```bash
docker stats
docker system prune -a
```

---

## 📚 Documentation

- **Full Guide**: `DOCKER_DEPLOY_GUIDE.md` - Chi tiết đầy đủ
- **Quick Start**: `DOCKER_QUICK_START.md` - Hướng dẫn nhanh
- **This File**: `CAP_NHAT_DOCKER_DEPLOY.md` - Tổng hợp

---

## ✅ Deployment Checklist

### Pre-deployment
- [ ] Server setup completed
- [ ] .env file configured
- [ ] DNS records updated
- [ ] SSH access working

### Deployment
- [ ] Infrastructure running
- [ ] Website deployed
- [ ] Migrations executed
- [ ] Health check passing

### Post-deployment
- [ ] SSL certificate installed
- [ ] Website accessible via HTTPS
- [ ] Admin panel working
- [ ] File uploads working
- [ ] Database accessible via PgAdmin

### Monitoring
- [ ] Logs checked
- [ ] Container status verified
- [ ] Resource usage monitored
- [ ] Backup scheduled

---

## 🎉 Summary

Hệ thống deploy với Docker cho InnerBright đã hoàn tất với:

✅ **Infrastructure**: PostgreSQL, Redis, MinIO, PgAdmin  
✅ **Application**: Next.js với Bun, optimized Docker image  
✅ **Networking**: Nginx reverse proxy, SSL certificate  
✅ **Automation**: One-command deployment script  
✅ **Management**: Health checks, logs, monitoring  
✅ **Documentation**: Comprehensive guides  
✅ **Security**: Firewall, non-root containers, SSL  

**Ready for production deployment! 🚀**

---

**Next step**: Chạy `./scripts/deploy-docker-innerbright.sh` để deploy!
