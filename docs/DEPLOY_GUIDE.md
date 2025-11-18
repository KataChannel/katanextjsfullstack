# 🚀 Quy Trình Deploy InnerBright.vn

Hướng dẫn deploy ứng dụng Next.js lên production server sau khi code/dev xong.

## 📋 Mục Lục

1. [Tổng Quan](#tổng-quan)
2. [Chuẩn Bị](#chuẩn-bị)
3. [Quy Trình Deploy](#quy-trình-deploy)
4. [Scripts Có Sẵn](#scripts-có-sẵn)
5. [Troubleshooting](#troubleshooting)

---

## Tổng Quan

### Thông Tin Server

| Thông tin | Giá trị |
|-----------|---------|
| **Server** | 116.118.48.208 |
| **Domain** | innerbright.vn |
| **User** | root |
| **App Directory** | /var/www/innerbright |
| **Container** | innerbright-web |
| **Port** | 3005 (internal), 443 (HTTPS) |
| **Database** | innerv2core (PostgreSQL) |
| **Branch** | webseo_dev3_alldomain |

### Kiến Trúc

```
┌─────────────────┐
│   Developer     │
│   (Local PC)    │
└────────┬────────┘
         │ git push
         ↓
┌─────────────────┐
│   GitHub        │
│   Repository    │
└────────┬────────┘
         │ git pull
         ↓
┌─────────────────────────────────────┐
│  Production Server (116.118.48.208) │
│  ┌───────────────────────────────┐  │
│  │ Nginx (Port 443)              │  │
│  │ SSL: Let's Encrypt            │  │
│  └──────────┬────────────────────┘  │
│             │ reverse proxy          │
│             ↓                        │
│  ┌───────────────────────────────┐  │
│  │ Docker Container              │  │
│  │ - innerbright-web:latest      │  │
│  │ - Node.js 20 Alpine           │  │
│  │ - Next.js 16 (Port 3005)      │  │
│  └──────────┬────────────────────┘  │
│             │                        │
│             ↓                        │
│  ┌───────────────────────────────┐  │
│  │ PostgreSQL (innerv2core)      │  │
│  │ Redis, MinIO, PgAdmin         │  │
│  └───────────────────────────────┘  │
└─────────────────────────────────────┘
```

---

## Chuẩn Bị

### 1. Yêu Cầu Local

```bash
# SSH access to server
ssh root@116.118.48.208

# Git configured
git config --global user.name "Your Name"
git config --global user.email "your@email.com"

# Make scripts executable
chmod +x scripts/deploy-*.sh scripts/rollback-*.sh
```

### 2. Kiểm Tra Trước Khi Deploy

```bash
# ✅ Đảm bảo code chạy tốt local
bun run dev

# ✅ Build thành công local
bun run build

# ✅ Không có lỗi TypeScript
bun run type-check

# ✅ Lint code
bun run lint

# ✅ Test migration (nếu có thay đổi schema)
bun run db:push
```

---

## Quy Trình Deploy

### 🚀 Option 1: Full Deploy (Recommended)

**Khi nào dùng:**
- Deploy lần đầu
- Có thay đổi quan trọng
- Cần backup database
- Deploy production

**Script:** `deploy-innerbright.sh`

```bash
./scripts/deploy-innerbright.sh
```

**Các bước thực hiện:**

1. ✅ **Git Operations**
   - Kiểm tra uncommitted changes
   - Commit nếu cần
   - Push code lên GitHub

2. ✅ **Pre-deployment Checks**
   - Kiểm tra kết nối server
   - Kiểm tra disk space
   - Cảnh báo nếu disk > 85%

3. ✅ **Backup Database**
   - Tạo backup PostgreSQL
   - Lưu vào `backups/YYYYMMDD_HHMMSS/`
   - Compress với gzip

4. ✅ **Pull Latest Code**
   - Stash local changes (nếu có)
   - Pull từ branch `webseo_dev3_alldomain`
   - Show latest commit

5. ✅ **Build Docker Image**
   - Build multi-stage Dockerfile
   - Stage 1: Install dependencies
   - Stage 2: Build Next.js
   - Stage 3: Production runtime

6. ✅ **Stop Old Container**
   - Graceful shutdown
   - Remove old container

7. ✅ **Start New Container**
   - Start với docker-compose
   - Wait for health check (max 60s)
   - Verify container healthy

8. ✅ **Health Checks**
   - Test HTTP endpoint (port 3005)
   - Test HTTPS endpoint (innerbright.vn)
   - Check response codes

9. ✅ **Cleanup**
   - Prune old images (>24h)
   - Show disk usage

10. ✅ **Show Logs**
    - Display last 30 log lines
    - Show deployment summary

**Thời gian:** ~5-10 phút (tùy build time)

**Output mẫu:**

```
============================================
🚀 InnerBright.vn Deployment
============================================

Server:    root@116.118.48.208
Directory: /var/www/innerbright
Container: innerbright-web
Branch:    webseo_dev3_alldomain

Continue with deployment? (y/n): y

============================================
📝 Step 1: Git Operations
============================================
▶ Current directory: /mnt/chikiet/kata2025/kataseo
▶ Pushing to remote repository...
✅ Code pushed successfully

============================================
🔍 Step 2: Pre-deployment Checks
============================================
▶ Checking server connectivity...
✅ Server is reachable
▶ Checking disk space on server...
Disk usage: 45%
  Free: 15G / 25G

============================================
💾 Step 3: Backup Current Database
============================================
▶ Creating database backup...
Backing up database to: backups/20251118_143000
✅ Database backed up: backups/20251118_143000/database.sql.gz
-rw-r--r-- 1 root root 2.1M Nov 18 14:30 backups/20251118_143000/database.sql.gz
✅ Database backup completed

============================================
📥 Step 4: Pull Latest Code
============================================
Current directory: /var/www/innerbright
Current branch: webseo_dev3_alldomain
Pulling latest code from webseo_dev3_alldomain...
✅ Latest commit:
abc1234 fix: middleware routing issue
✅ Code pulled successfully

============================================
🔨 Step 5: Build Docker Image
============================================
Building Docker image...
[+] Building 120.5s (22/22) FINISHED
✅ Docker image built successfully
innerbright-web  latest  def5678  2 minutes ago  250MB
✅ Docker image built

============================================
🛑 Step 6: Stop Old Container
============================================
Stopping old container...
✅ Old container stopped
✅ Old container stopped

============================================
🚀 Step 7: Start New Container
============================================
Starting new container...
Waiting for container to be healthy...
Attempt 1/30: Status = starting
Attempt 5/30: Status = healthy
✅ Container is healthy
✅ New container started

============================================
🏥 Step 8: Health Checks
============================================
▶ Checking container status...
Container status:
NAME              IMAGE                    STATUS
innerbright-web   innerbright-web:latest   Up 10 seconds (healthy)

Container health:
Health: healthy

▶ Testing HTTP endpoint...
✅ HTTP endpoint OK (status: 200)
▶ Testing HTTPS endpoint...
✅ HTTPS endpoint OK (status: 200)

============================================
🧹 Step 9: Cleanup
============================================
Cleaning up old Docker images...
Deleted Images:
deleted: sha256:xyz...
Total reclaimed space: 1.2GB

Disk usage after cleanup:
  Used: 11G / 25G (44%)
✅ Cleanup completed

============================================
📋 Step 10: Recent Logs
============================================
▲ Next.js 16.0.1
- Local:        http://localhost:3005
- Network:      http://0.0.0.0:3005

✓ Starting...
✓ Ready in 219ms

============================================
✅ Deployment Summary
============================================

Deployment completed successfully!

📊 Application Info:
  URL:       https://innerbright.vn
  Direct:    http://116.118.48.208:3005
  Admin:     https://innerbright.vn/admin

🐳 Docker Info:
innerbright-web   innerbright-web:latest   Up 2 minutes (healthy)

📚 Useful Commands:
  View logs:     ssh root@116.118.48.208 'docker logs -f innerbright-web'
  Restart:       ssh root@116.118.48.208 'cd /var/www/innerbright && docker compose restart innerbright-web'
  Shell:         ssh root@116.118.48.208 'docker exec -it innerbright-web sh'
  Status:        ssh root@116.118.48.208 'cd /var/www/innerbright && docker compose ps'
  Backup list:   ssh root@116.118.48.208 'ls -lh /var/www/innerbright/backups/'

⚡ Performance Test:
  HTTP response time:
real    0m0.014s
user    0m0.002s
sys     0m0.002s

  HTTPS response time:
real    0m0.056s
user    0m0.010s
sys     0m0.004s

✅ All done! 🎉
```

---

### ⚡ Option 2: Quick Deploy (Fast)

**Khi nào dùng:**
- Changes nhỏ (CSS, text, minor fixes)
- Không thay đổi dependencies
- Không thay đổi database schema
- Development/testing

**Script:** `deploy-innerbright-quick.sh`

```bash
./scripts/deploy-innerbright-quick.sh
```

**Đặc điểm:**
- ⚡ Nhanh (~2-3 phút)
- 🚫 **KHÔNG** backup database
- ✅ Auto commit với timestamp
- ✅ Pull và rebuild trên server

**Lưu ý:** Chỉ dùng khi chắc chắn không cần rollback!

---

### 🔄 Option 3: Rollback

**Khi nào dùng:**
- Deploy bị lỗi
- Cần quay về version cũ
- Database corrupted

**Script:** `rollback-innerbright.sh`

```bash
./scripts/rollback-innerbright.sh
```

**Các bước:**

1. List available backups
2. Choose backup timestamp (hoặc 'latest')
3. Confirm rollback
4. Restore database from backup
5. Checkout old git commit
6. Rebuild container
7. Test endpoints

**Output mẫu:**

```bash
🔄 Rollback innerbright.vn
==================================

📋 Available backups:
drwxr-xr-x 2 root root 4096 Nov 18 14:30 20251118_143000
drwxr-xr-x 2 root root 4096 Nov 18 12:15 20251118_121500
drwxr-xr-x 2 root root 4096 Nov 17 16:45 20251117_164500

Enter backup timestamp (YYYYMMDD_HHMMSS) or 'latest': latest
Using latest backup: 20251118_143000

Rollback to 20251118_143000? (y/n): y

🔄 Rolling back database...
✅ Database restored

🔄 Rolling back code...
Checking out commit: abc1234
✅ Code rolled back

🔨 Rebuilding container...
✅ Container rebuilt

🧪 Testing...
{
  "status": "ok",
  "timestamp": "2025-11-18T07:35:00.000Z",
  "service": "innerbright-web"
}

✅ Rollback successful!
```

---

## Scripts Có Sẵn

### Deploy Scripts

| Script | Mục đích | Thời gian | Backup |
|--------|----------|-----------|--------|
| `deploy-innerbright.sh` | Full deployment với backup | 5-10 min | ✅ Yes |
| `deploy-innerbright-quick.sh` | Quick deploy không backup | 2-3 min | ❌ No |
| `rollback-innerbright.sh` | Rollback về version cũ | 3-5 min | N/A |

### Database Scripts

| Script | Mục đích |
|--------|----------|
| `backup-domain.sh` | Backup database to JSON |
| `restore-domain.sh` | Restore database from JSON |
| `restore-remote.sh` | Restore database to remote server |

### Utility Scripts

| Script | Mục đích |
|--------|----------|
| `5killport.sh` | Kill process on specific port |
| `6fix-file-watchers.sh` | Fix file watcher limit |
| `create-admin.sh` | Create admin user |

---

## Troubleshooting

### ❌ Issue 1: Build Failed

**Triệu chứng:**
```
ERROR: failed to build: process "/bin/sh -c npm ci" did not complete successfully
```

**Giải pháp:**

```bash
# 1. Update package-lock.json locally
npm install --package-lock-only

# 2. Push changes
git add package-lock.json
git commit -m "fix: update package-lock.json"
git push

# 3. Deploy again
./scripts/deploy-innerbright.sh
```

---

### ❌ Issue 2: Container Unhealthy

**Triệu chứng:**
```
Container failed to become healthy after 60 seconds
```

**Giải pháp:**

```bash
# 1. Check container logs
ssh root@116.118.48.208 'docker logs innerbright-web --tail 100'

# 2. Check if port is in use
ssh root@116.118.48.208 'netstat -tlnp | grep 3005'

# 3. Restart container manually
ssh root@116.118.48.208 'cd /var/www/innerbright && docker compose restart innerbright-web'

# 4. If still fails, check database connection
ssh root@116.118.48.208 'docker exec innerbright-postgres psql -U postgres -c "\l"'
```

---

### ❌ Issue 3: HTTPS Not Working

**Triệu chứng:**
```
HTTPS endpoint failed (status: 502)
```

**Giải pháp:**

```bash
# 1. Check Nginx status
ssh root@116.118.48.208 'systemctl status nginx'

# 2. Test Nginx config
ssh root@116.118.48.208 'nginx -t'

# 3. Check Nginx logs
ssh root@116.118.48.208 'tail -50 /var/log/nginx/innerbright.vn.error.log'

# 4. Restart Nginx
ssh root@116.118.48.208 'systemctl restart nginx'

# 5. Verify middleware.ts exists in container
ssh root@116.118.48.208 'docker exec innerbright-web ls -la /app/middleware.ts'
```

---

### ❌ Issue 4: Database Migration Failed

**Triệu chứng:**
```
Error: Migration failed to apply cleanly to shadow database
```

**Giải pháp:**

```bash
# 1. Check migration status
ssh root@116.118.48.208 'docker exec innerbright-web npx prisma migrate status'

# 2. Reset shadow database (CAUTION!)
ssh root@116.118.48.208 'docker exec innerbright-web npx prisma migrate resolve --rolled-back "migration_name"'

# 3. Apply migrations
ssh root@116.118.48.208 'docker exec innerbright-web npx prisma migrate deploy'

# 4. If all else fails, restore from backup
./scripts/rollback-innerbright.sh
```

---

### ❌ Issue 5: Out of Disk Space

**Triệu chứng:**
```
⚠️  High disk usage: 92%
```

**Giải pháp:**

```bash
# 1. Check disk usage
ssh root@116.118.48.208 'df -h'

# 2. Clean Docker resources
ssh root@116.118.48.208 'docker system prune -af --volumes'

# 3. Remove old backups (keep last 10)
ssh root@116.118.48.208 '
cd /var/www/innerbright/backups
ls -t | tail -n +11 | xargs rm -rf
'

# 4. Clean logs
ssh root@116.118.48.208 'journalctl --vacuum-time=7d'

# 5. Check large files
ssh root@116.118.48.208 'du -sh /var/www/innerbright/* | sort -hr | head -10'
```

---

## Best Practices

### ✅ Trước Khi Deploy

- [ ] Test thoroughly locally
- [ ] Run `bun run build` successful
- [ ] No TypeScript errors
- [ ] Git commit với message rõ ràng
- [ ] Check server disk space > 20% free
- [ ] Thông báo team về deployment

### ✅ Trong Khi Deploy

- [ ] Monitor logs realtime
- [ ] Check health endpoints sau deploy
- [ ] Verify features work correctly
- [ ] Test admin panel access
- [ ] Check response times

### ✅ Sau Khi Deploy

- [ ] Document changes in changelog
- [ ] Update team về status
- [ ] Monitor error logs for 30 minutes
- [ ] Keep backup for 30 days
- [ ] Test critical user flows

---

## Emergency Contacts

**Server Issues:**
- Provider: Viettel IDC
- Support: support@viettelidc.com.vn

**DNS Issues:**
- Domain registrar: Check domain panel
- DNS propagation: https://dnschecker.org

**SSL Issues:**
- Let's Encrypt: Renew every 90 days
- Certbot logs: `/var/log/letsencrypt/`

---

## Monitoring

### Check Application Status

```bash
# Container status
ssh root@116.118.48.208 'docker ps | grep innerbright'

# Resource usage
ssh root@116.118.48.208 'docker stats innerbright-web --no-stream'

# Logs (live)
ssh root@116.118.48.208 'docker logs -f innerbright-web'

# Health check
curl https://innerbright.vn/api/health
```

### Performance Metrics

```bash
# Response time test
./scripts/test-performance.sh

# SSL check
echo | openssl s_client -connect innerbright.vn:443 2>/dev/null | openssl x509 -noout -dates

# Uptime check
ssh root@116.118.48.208 'uptime'
```

---

## Changelog Template

Khi deploy, cập nhật file `CHANGELOG.md`:

```markdown
## [Version] - YYYY-MM-DD

### Added
- New feature description

### Changed
- Updated functionality

### Fixed
- Bug fix description

### Deployment
- Deployed by: [Name]
- Deployed at: [Timestamp]
- Build time: [Duration]
- Status: ✅ Success
```

---

## Tài Liệu Tham Khảo

- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [Nginx Configuration](https://nginx.org/en/docs/)
- [Let's Encrypt](https://letsencrypt.org/docs/)
- [PostgreSQL Backup](https://www.postgresql.org/docs/current/backup.html)

---

**Last Updated:** 2025-11-18  
**Maintained By:** Development Team  
**Version:** 1.0.0
