# 🔧 Tối ưu hóa Deploy cho Server Cấu hình Thấp

## 📊 Cấu hình Server
- **CPU**: 1 core
- **RAM**: 2GB
- **Disk**: 10GB
- **IP**: 116.118.48.208

## ⚡ Các Thay đổi Chính

### 1. Build trên Local Machine
**Vấn đề cũ**: Build Docker image trên server làm treo/lag server do thiếu tài nguyên

**Giải pháp mới**:
- Build image trên máy local (có cấu hình tốt hơn)
- Save image thành file tar.gz
- Upload lên server qua SCP
- Load image trên server (chỉ giải nén, không build)

**Lợi ích**:
- ✅ Server không bị quá tải
- ✅ Build nhanh hơn nhiều
- ✅ Giảm CPU/RAM usage trên server
- ✅ Không bị timeout

### 2. Resource Limits

Thêm giới hạn tài nguyên cho mỗi container:

#### Infrastructure Containers:
```yaml
postgres: 
  - Limit: 512MB
  - Reserved: 256MB

redis: 
  - Limit: 192MB
  - Reserved: 128MB
  - MaxMemory: 128MB với LRU policy

minio: 
  - Limit: 384MB
  - Reserved: 256MB

pgadmin: 
  - Limit: 256MB
  - Reserved: 128MB
```

#### Website Container:
```yaml
innerbright-web:
  - Limit: 768MB
  - Reserved: 512MB
```

**Tổng RAM sử dụng**: ~2GB (phù hợp với server 2GB RAM)

### 3. Sequential Service Startup

**Vấn đề cũ**: Start tất cả services cùng lúc → RAM spike

**Giải pháp mới**: Start từng service một với delay:
```bash
1. PostgreSQL (wait 10s)
2. Redis (wait 5s)
3. MinIO (wait 5s)
4. PgAdmin + MinIO Client
```

**Lợi ích**:
- ✅ Tránh RAM spike
- ✅ Services khởi động ổn định hơn
- ✅ Giảm nguy cơ crash

### 4. Image Cleanup

Tự động cleanup old Docker images sau mỗi lần deploy:
```bash
docker image prune -f
```

Giải phóng disk space cho server 10GB.

## 🚀 Quy trình Deploy Mới

### Trên Local Machine:
```bash
./scripts/deploy-docker-innerbright.sh
```

Script sẽ tự động:
1. ✅ Sync code lên server
2. ✅ Copy .env file
3. ✅ **Build Docker image trên local**
4. ✅ **Save image thành tar.gz**
5. ✅ **Upload tar.gz lên server**
6. ✅ SSH vào server và:
   - Load image từ tar.gz
   - Start infrastructure (sequential)
   - Deploy website container
   - Cleanup old images

### Thời gian Deploy:
- **Build local**: 2-3 phút (tùy máy)
- **Upload**: 1-2 phút (tùy internet)
- **Deploy trên server**: 1-2 phút
- **Tổng**: ~5-7 phút

## 📋 Files Đã Thay đổi

### 1. `scripts/deploy-docker-innerbright.sh`
- Thêm build local
- Thêm save/upload image
- Thêm sequential startup
- Thêm image cleanup
- Tối ưu error handling

### 2. `docker-compose.infrastructure.yml`
- Thêm resource limits cho tất cả services
- Tối ưu Redis với maxmemory policy
- Network name explicit

### 3. `docker-compose.yml`
- Đổi từ `build` sang `image: innerbright-web:latest`
- Thêm resource limits
- Tăng start_period từ 40s → 60s

## ⚠️ Lưu ý Quan trọng

### RAM Usage Monitor:
```bash
# Xem RAM usage
docker stats

# Xem memory của từng container
docker stats --no-stream --format "table {{.Container}}\t{{.MemUsage}}"
```

### Nếu Server vẫn lag:
1. **Giảm PgAdmin** (không cần thiết cho production):
   ```bash
   docker compose -f docker-compose.infrastructure.yml stop pgadmin
   ```
   Giải phóng ~256MB RAM

2. **Tắt Redis nếu không dùng**:
   ```bash
   docker compose -f docker-compose.infrastructure.yml stop redis
   ```
   Giải phóng ~192MB RAM

3. **Kiểm tra swap**:
   ```bash
   # Xem swap usage
   free -h
   
   # Tạo swap file nếu chưa có (2GB)
   sudo fallocate -l 2G /swapfile
   sudo chmod 600 /swapfile
   sudo mkswap /swapfile
   sudo swapon /swapfile
   ```

### Disk Space:
```bash
# Xem disk usage
df -h

# Xem Docker disk usage
docker system df

# Clean tất cả (cẩn thận!)
docker system prune -a --volumes
```

## 🎯 Optimization Tips

### 1. Disable unused features:
- Nếu không cần PgAdmin → comment trong compose file
- Nếu không cần Redis cache → comment trong compose file

### 2. Reduce MinIO memory:
Nếu ít file uploads, giảm MinIO xuống 256MB:
```yaml
minio:
  deploy:
    resources:
      limits:
        memory: 256M
```

### 3. Reduce website memory:
Nếu traffic thấp, giảm xuống 512MB:
```yaml
innerbright-web:
  deploy:
    resources:
      limits:
        memory: 512M
```

## 📊 Resource Allocation Summary

| Service | RAM Limit | RAM Reserved | Notes |
|---------|-----------|--------------|-------|
| PostgreSQL | 512MB | 256MB | Database |
| Redis | 192MB | 128MB | Cache (optional) |
| MinIO | 384MB | 256MB | File storage |
| PgAdmin | 256MB | 128MB | UI (optional) |
| Website | 768MB | 512MB | Next.js app |
| **Total** | **~2112MB** | **~1280MB** | Fits 2GB RAM |

### Headroom:
- Available: ~200-300MB
- System + Docker: ~200-300MB
- **Status**: ✅ Phù hợp với 2GB RAM

## ✅ Testing

Sau khi deploy, kiểm tra:

```bash
# 1. Xem tất cả containers running
docker ps

# 2. Xem RAM usage
docker stats --no-stream

# 3. Test website
curl http://localhost:3005/api/health

# 4. Xem logs
docker compose logs -f innerbright-web

# 5. Check disk space
df -h
docker system df
```

## 🚨 Troubleshooting

### Container bị OOM (Out of Memory):
```bash
# Xem logs
docker logs innerbright-postgres
docker logs innerbright-web

# Tăng memory limit (nếu có thể)
# Hoặc tắt services không cần thiết
```

### Disk đầy:
```bash
# Clean images
docker image prune -a -f

# Clean containers
docker container prune -f

# Clean volumes (cẩn thận - mất data!)
docker volume prune -f
```

### Server lag:
```bash
# Xem processes
htop

# Kill processes ngốn RAM
# Restart Docker
sudo systemctl restart docker
```

---

## 🎉 Kết luận

Với các tối ưu hóa này, hệ thống có thể chạy ổn định trên server 1CPU/2GB RAM:

✅ Build trên local → không quá tải server  
✅ Resource limits → không OOM  
✅ Sequential startup → không RAM spike  
✅ Auto cleanup → không đầy disk  
✅ Monitoring → dễ troubleshoot  

**Deploy ngay**: `./scripts/deploy-docker-innerbright.sh`
