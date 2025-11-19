# 🚀 Quick Deploy Guide - Deploy Code Mới

**Ngày:** 19/11/2025  
**Server:** 116.118.48.208  
**Domain:** innerbright.vn

---

## 📦 Code Mới Được Deploy

### Features
✅ **Tiptap Text Block** - Notion-like editor cho text blocks  
✅ **Container Background** - Background màu/hình cho containers  
✅ **Homepage Settings** - Set page làm trang chủ  
✅ **Block Templates V2** - 6 sample templates  
✅ **All Bug Fixes** - Latest updates  

---

## 🎯 2 Cách Deploy

### Option 1: Quick Deploy (Khuyến nghị)
**Full build Docker image mới**

```bash
./quick-deploy-new.sh
```

**Khi nào dùng:**
- Deploy lần đầu
- Thay đổi Dockerfile
- Thay đổi dependencies (package.json)
- Thay đổi lớn (database schema, config)

**Thời gian:** ~10-15 phút

**Steps:**
1. Nhập commit message (hoặc Enter để skip)
2. Build Docker image
3. Export & upload to server
4. Deploy trên server
5. Health check
6. Done!

---

### Option 2: Super Quick Deploy
**Git push & Docker Compose rebuild**

```bash
./super-quick-deploy.sh
```

**Khi nào dùng:**
- Sửa code nhỏ (components, pages, styles)
- Bug fixes
- UI updates
- KHÔNG thay đổi dependencies

**Thời gian:** ~3-5 phút

**Steps:**
1. Nhập commit message
2. Git push
3. Server pull & rebuild
4. Health check
5. Done!

---

## 📝 Chi Tiết Từng Script

### quick-deploy-new.sh

```bash
#!/bin/bash
# Full deployment với Docker build local

[1/6] Git Commit (optional)
[2/6] Build Docker Image
[3/6] Export Image
[4/6] Transfer to Server  
[5/6] Deploy on Server
[6/6] Health Check
```

**Features:**
- ✅ Build image với latest code
- ✅ Export & transfer optimized
- ✅ Auto cleanup old images
- ✅ Health check API & homepage
- ✅ Memory limit: 768MB
- ✅ Auto restart policy
- ✅ Volume mounts cho uploads

**Output:**
```
✅ Deploy Hoàn Tất!
============================================
📝 Features Deployed:
  ✓ Tiptap Text Block
  ✓ Container Background Settings
  ✓ Homepage Settings
  
🌐 Website: https://innerbright.vn
🔧 Admin: https://innerbright.vn/admin
```

---

### super-quick-deploy.sh

```bash
#!/bin/bash
# Git push & restart on server

[1/3] Git Push
[2/3] Pull & Rebuild on Server
[3/3] Testing
```

**Features:**
- ✅ Git push to origin
- ✅ Server auto pull latest
- ✅ Docker Compose rebuild
- ✅ Quick health check

**Yêu cầu:**
- Code đã được commit
- Server có `/var/www/innerbright`
- Server có `docker-compose.yml`

---

## 🔧 Troubleshooting

### Issue 1: Build Failed

**Error:** Docker build failed

**Solution:**
```bash
# Check Docker daemon
docker ps

# Clean Docker cache
docker system prune -a

# Rebuild
./quick-deploy-new.sh
```

---

### Issue 2: Transfer Failed

**Error:** SCP connection failed

**Solution:**
```bash
# Test SSH connection
ssh root@116.118.48.208

# Check SSH key
ls -la ~/.ssh/

# Retry deploy
./quick-deploy-new.sh
```

---

### Issue 3: Container Won't Start

**Error:** Container failed to start

**Solution:**
```bash
# SSH to server
ssh root@116.118.48.208

# Check logs
docker logs innerbright-web --tail 100

# Check env file
cat /root/.env.innerbright

# Restart manually
docker stop innerbright-web
docker rm innerbright-web
docker run -d ... (copy from script)
```

---

### Issue 4: Website Not Responding

**Error:** 502 Bad Gateway

**Solution:**
```bash
# SSH to server
ssh root@116.118.48.208

# Check container status
docker ps | grep innerbright

# Check logs
docker logs innerbright-web -f

# Restart container
docker restart innerbright-web

# Check nginx
docker ps | grep nginx
docker logs nginx-proxy
```

---

## 📊 Post-Deploy Checks

### 1. Homepage
```bash
curl https://innerbright.vn/
# Should return 200
```

### 2. API Health
```bash
curl https://innerbright.vn/api/health
# Should return {"status":"ok"}
```

### 3. Admin Panel
```bash
curl https://innerbright.vn/admin
# Should return 200 or 307 (redirect to login)
```

### 4. Database Connection
```bash
# SSH to server
ssh root@116.118.48.208

# Check logs for database errors
docker logs innerbright-web | grep -i "database\|prisma"
```

### 5. Check Memory
```bash
# SSH to server
ssh root@116.118.48.208

# Check container memory
docker stats innerbright-web --no-stream
```

---

## 🔄 Rollback

Nếu deploy lỗi, rollback về version cũ:

### Method 1: Use Old Image

```bash
# SSH to server
ssh root@116.118.48.208

# List available images
docker images | grep innerbright-web

# Stop current
docker stop innerbright-web
docker rm innerbright-web

# Start old version
docker run -d \
    --name innerbright-web \
    --restart unless-stopped \
    --network innerv2core-network \
    -p 3005:3005 \
    --env-file /root/.env.innerbright \
    -v /root/innerbright/public/uploads:/app/public/uploads \
    -v /root/innerbright/public/icons:/app/public/icons \
    --memory="768m" \
    --memory-reservation="512m" \
    innerbright-web:<OLD_TAG>
```

### Method 2: Git Revert

```bash
# Revert local
git revert HEAD
git push origin webseo_dev3_alldomain

# Deploy old version
./super-quick-deploy.sh
```

---

## 📦 Backup Before Deploy

**Khuyến nghị:** Backup database trước khi deploy

```bash
# Backup database
ssh root@116.118.48.208 'docker exec innerbright-postgres pg_dump -U postgres innerbright > /root/backups/innerbright_$(date +%Y%m%d_%H%M%S).sql'

# Download backup (optional)
scp root@116.118.48.208:/root/backups/innerbright_*.sql ./backups/
```

---

## 🎯 Quick Commands Reference

### Deploy Commands
```bash
# Full deploy
./quick-deploy-new.sh

# Quick deploy
./super-quick-deploy.sh

# Check status on server
ssh root@116.118.48.208 'docker ps | grep innerbright'

# View logs
ssh root@116.118.48.208 'docker logs -f innerbright-web'

# Restart container
ssh root@116.118.48.208 'docker restart innerbright-web'
```

### Testing Commands
```bash
# Test homepage
curl -I https://innerbright.vn/

# Test API
curl https://innerbright.vn/api/health

# Test specific page
curl https://innerbright.vn/about

# Load test (basic)
ab -n 100 -c 10 https://innerbright.vn/
```

---

## 📋 Deployment Checklist

### Pre-Deploy
- [ ] Code đã test local
- [ ] Database migration OK (nếu có)
- [ ] Environment variables updated
- [ ] Backup database (khuyến nghị)
- [ ] Notify team (production)

### During Deploy
- [ ] Git commit/push successful
- [ ] Docker build successful
- [ ] Transfer to server OK
- [ ] Container started
- [ ] No errors in logs

### Post-Deploy
- [ ] Homepage loads (200)
- [ ] API health OK
- [ ] Admin panel accessible
- [ ] Test key features:
  - [ ] Tiptap text editor
  - [ ] Container backgrounds
  - [ ] Homepage settings
  - [ ] Block templates
- [ ] Check error logs
- [ ] Monitor for 5-10 minutes

---

## 🚨 Emergency Contacts

### Server Issues
- **SSH:** `ssh root@116.118.48.208`
- **Docker:** Check container status
- **Logs:** `docker logs innerbright-web`

### Database Issues
- **Postgres:** `docker exec innerbright-postgres psql -U postgres innerbright`
- **Backup:** `/root/backups/`

### Network Issues
- **Nginx:** `docker logs nginx-proxy`
- **DNS:** Check Cloudflare
- **SSL:** Check Let's Encrypt

---

## ✅ Success Indicators

Deploy thành công khi:

1. ✅ Script hoàn thành không lỗi
2. ✅ Container status: Up
3. ✅ Homepage: 200 OK
4. ✅ API health: {"status":"ok"}
5. ✅ Logs: Không có ERROR
6. ✅ Memory usage: < 600MB
7. ✅ Features hoạt động đúng

---

## 📚 Related Files

- `quick-deploy-new.sh` - Main deployment script
- `super-quick-deploy.sh` - Quick restart script
- `Dockerfile` - Docker build configuration
- `docker-compose.yml` - Container orchestration
- `.env.innerbright` - Environment variables (server)

---

## 🎓 Tips & Best Practices

1. **Test local trước:** `bun run dev:innerbright`
2. **Deploy off-peak hours:** Tránh giờ cao điểm
3. **Monitor logs:** Sau deploy 5-10 phút
4. **Backup trước:** Database backup is must
5. **Git tag releases:** `git tag v1.2.3`
6. **Document changes:** Update CHANGELOG
7. **Notify team:** Slack/Discord notification
8. **Rollback plan:** Luôn có plan B

---

## 📞 Support

**Issues?**
- Check logs: `docker logs innerbright-web`
- Check status: `docker ps`
- Restart: `docker restart innerbright-web`
- Rollback: Follow rollback guide above

**Still stuck?**
- Review this guide
- Check error messages
- SSH to server and investigate
- Contact DevOps team

---

**Last Updated:** 19/11/2025  
**Version:** 1.0.0  
**Status:** ✅ Production Ready
