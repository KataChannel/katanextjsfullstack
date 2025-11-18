# 📚 Deployment Scripts Guide

Các scripts để build, test và deploy InnerBright Docker image.

## 🎯 Quick Start

### Build và Deploy (One Command)
```bash
./build-and-deploy.sh
```
Script này sẽ:
1. Build image ở local
2. (Optional) Test image locally
3. Export và upload lên server
4. Deploy trên production

### Hoặc Step by Step

**1. Build Image**
```bash
./build-docker-local.sh
```

**2. (Optional) Test Local**
```bash
./test-docker-local.sh
# Test tại http://localhost:3006
# Nhấn Ctrl+C để stop
```

**3. Deploy to Server**
```bash
./quick-deploy.sh
```

## 📜 Script Details

### `build-docker-local.sh`
**Mục đích**: Build Docker image ở local để tối ưu tốc độ

**Output**:
- Docker image: `innerbright-web:latest`
- Build log: `build.log`
- Env file: `.env.production`

**Thời gian**: ~60 giây

### `test-docker-local.sh`
**Mục đích**: Test image trước khi deploy

**Features**:
- Run container ở port 3006
- Mount volumes cho uploads
- Follow logs real-time
- Dễ dàng stop với Ctrl+C

**Commands**:
```bash
# Start test
./test-docker-local.sh

# In another terminal
curl http://localhost:3006
curl http://localhost:3006/api/health
curl http://localhost:3006/admin

# Stop test (Ctrl+C hoặc)
docker stop innerbright-test && docker rm innerbright-test
```

### `quick-deploy.sh` ⭐
**Mục đích**: Deploy nhanh lên production

**Process**:
1. Export image (133MB compressed)
2. Upload via SCP (~4 seconds)
3. Load image trên server
4. Stop old container
5. Start new container
6. Verify deployment

**Thời gian**: ~30-40 giây total

**Network**: Container sẽ join `innerv2core-network`

### `build-and-deploy.sh`
**Mục đích**: All-in-one deployment script

**Steps**:
1. Copy .env.innerbright → .env.production
2. Build Docker image
3. (Optional) Test locally
4. Export to tar.gz
5. Transfer to server
6. Deploy via SSH
7. (Optional) Cleanup local files

**Interactive**: Hỏi confirm ở các bước quan trọng

### `fix-bugs.sh` 🛠️
**Mục đích**: Debug và monitor tools

**Menu Options**:

```
1) Kiểm tra container status
   - Container state
   - Health status
   
2) Xem logs (real-time)
   - Follow logs với docker logs -f
   
3) Xem logs (last 100 lines)
   - Quick view recent logs
   
4) Restart container
   - Graceful restart
   - Wait and verify
   
5) Check health endpoint
   - Test /api/health
   
6) Check database connection
   - Test Prisma connection
   - Query database
   
7) Check memory usage
   - Container resource stats
   
8) Fix container không start
   - Stop old containers
   - Check docker-compose.yml
   - Check env file
   - Check network
   - Start fresh container
   
9) Fix permission issues
   - Fix uploads directory
   - Fix icons directory
   - Restart container
```

**Usage**:
```bash
./fix-bugs.sh
# Nhập số 1-9 để chọn action
```

### `deploy-to-server.sh`
**Mục đích**: Deploy với docker-compose trên server (có thể fail với old docker-compose)

**Khuyến nghị**: Dùng `quick-deploy.sh` thay vì script này

## 🔧 Environment Files

### `.env.local`
Development environment cho local development

### `.env.innerbright`
Production environment cho InnerBright domain

**Key variables**:
```bash
DATABASE_URL=postgresql://postgres:***@116.118.48.208:5432/innerv2core
NEXTAUTH_URL=https://innerbright.vn
NEXTAUTH_SECRET=***
NEXT_PUBLIC_DOMAIN=innerbright.vn
```

### `.env.production`
Auto-generated từ `.env.innerbright` khi build

## 📊 Workflow Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    BUILD PHASE                          │
│  build-docker-local.sh                                  │
│  ├─ Copy .env.innerbright → .env.production            │
│  ├─ docker build (multi-stage)                         │
│  │  ├─ Stage 1: deps (install dependencies)           │
│  │  ├─ Stage 2: builder (build Next.js app)           │
│  │  └─ Stage 3: runner (final slim image)             │
│  └─ Output: innerbright-web:latest (374MB)             │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                    TEST PHASE (Optional)                │
│  test-docker-local.sh                                   │
│  ├─ docker run -p 3006:3005                            │
│  ├─ Test at http://localhost:3006                      │
│  └─ docker stop + rm when done                         │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                   DEPLOY PHASE                          │
│  quick-deploy.sh                                        │
│  ├─ docker save + gzip (133MB)                         │
│  ├─ scp to 116.118.48.208:/root/                       │
│  └─ SSH commands:                                       │
│     ├─ gunzip + docker load                            │
│     ├─ docker stop + rm old                            │
│     ├─ docker run new container                        │
│     │  ├─ Port: 3005:3005                              │
│     │  ├─ Network: innerv2core-network                 │
│     │  ├─ Volumes: uploads, icons                      │
│     │  └─ Env: /root/.env.innerbright                  │
│     └─ Verify: logs + health check                     │
└─────────────────────────────────────────────────────────┘
                          ↓
┌─────────────────────────────────────────────────────────┐
│                  MONITOR PHASE                          │
│  fix-bugs.sh                                            │
│  └─ Interactive debugging & monitoring tools           │
└─────────────────────────────────────────────────────────┘
```

## 🚨 Common Issues & Solutions

### Issue 1: Build fails
```bash
# Check build.log
cat build.log | grep -i error

# Try clean build
docker system prune -a
./build-docker-local.sh
```

### Issue 2: Cannot connect to server
```bash
# Test SSH connection
ssh root@116.118.48.208 'echo "Connected!"'

# Check server disk space
ssh root@116.118.48.208 'df -h'
```

### Issue 3: Container không start
```bash
./fix-bugs.sh
# Select option 8
```

### Issue 4: Database connection fails
```bash
# Check postgres is running
ssh root@116.118.48.208 'docker ps | grep postgres'

# Start postgres if needed
ssh root@116.118.48.208 'docker start 0722cb3694fe'

# Restart web container
ssh root@116.118.48.208 'docker restart innerbright-web'
```

## 📝 Best Practices

1. **Always build locally** để tránh tốn tài nguyên server
2. **Test locally trước** nếu có thay đổi quan trọng
3. **Check logs** sau mỗi deployment
4. **Backup database** trước khi migrate
5. **Use quick-deploy.sh** cho deployments thường xuyên

## 🔄 Update Workflow

Khi cần update application:

```bash
# 1. Make changes in code
git pull origin main

# 2. Build new image
./build-docker-local.sh

# 3. (Optional) Test locally
./test-docker-local.sh

# 4. Deploy to production
./quick-deploy.sh

# 5. Verify
curl http://116.118.48.208:3005/api/health
ssh root@116.118.48.208 'docker logs innerbright-web --tail 50'

# 6. Monitor
./fix-bugs.sh  # Option 2 for real-time logs
```

## 📞 Need Help?

```bash
# Check container status
./fix-bugs.sh → Option 1

# View logs
./fix-bugs.sh → Option 2 or 3

# Health check
curl http://116.118.48.208:3005/api/health

# SSH to server
ssh root@116.118.48.208

# Manual docker commands
docker ps | grep innerbright
docker logs innerbright-web
docker restart innerbright-web
docker exec -it innerbright-web sh
```

---

**Made with ❤️ for InnerBright deployment**
