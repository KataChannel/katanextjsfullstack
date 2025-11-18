# ✅ Deploy Checklist - InnerBright.vn

Quick checklist để đảm bảo deployment thành công.

## 📋 Pre-Deployment

- [ ] Code đã test kỹ trên local (`bun run dev`)
- [ ] Build thành công (`bun run build`)
- [ ] Không có TypeScript errors (`bun run type-check`)
- [ ] Commit code với message rõ ràng
- [ ] Push lên GitHub

## 🚀 Deployment

### Option 1: Full Deploy (Recommended)

```bash
./scripts/deploy-innerbright.sh
```

**Khi nào dùng:**
- ✅ Deploy lần đầu
- ✅ Có thay đổi quan trọng  
- ✅ Production deployment
- ✅ Cần backup database

**Thời gian:** 5-10 phút

### Option 2: Quick Deploy

```bash
./scripts/deploy-innerbright-quick.sh
```

**Khi nào dùng:**
- ✅ Changes nhỏ (CSS, text)
- ✅ Không thay đổi dependencies
- ✅ Không thay đổi database
- ⚠️  **KHÔNG** backup database

**Thời gian:** 2-3 phút

## ✅ Post-Deployment

### 1. Kiểm tra status

```bash
./scripts/status-innerbright.sh
```

### 2. Test các endpoints

- [ ] https://innerbright.vn ✅
- [ ] https://innerbright.vn/admin ✅
- [ ] https://innerbright.vn/api/health ✅

### 3. Kiểm tra logs

```bash
ssh root@116.118.48.208 'docker logs -f innerbright-web'
```

Tìm:
- [ ] Không có errors
- [ ] "Ready in XXms" message
- [ ] Không có cảnh báo domain

### 4. Test performance

```bash
# HTTPS should be < 100ms
time curl -s https://innerbright.vn/api/health

# Admin panel loads
curl -I https://innerbright.vn/admin
```

### 5. Test chức năng chính

- [ ] Login vào admin panel
- [ ] View pages list
- [ ] Create/edit content
- [ ] Media upload works
- [ ] Public pages render correctly

## 🔄 Nếu có vấn đề

### Rollback

```bash
./scripts/rollback-innerbright.sh
```

Chọn:
- `latest` - Backup mới nhất
- Hoặc specific timestamp

### View logs

```bash
# Container logs
ssh root@116.118.48.208 'docker logs --tail 100 innerbright-web'

# Nginx logs
ssh root@116.118.48.208 'tail -50 /var/log/nginx/innerbright.vn.error.log'

# Database logs
ssh root@116.118.48.208 'docker logs innerbright-postgres --tail 50'
```

### Restart container

```bash
ssh root@116.118.48.208 'cd /var/www/innerbright && docker compose restart innerbright-web'
```

## 📊 Quick Commands

```bash
# Status check
./scripts/status-innerbright.sh

# Deploy (full)
./scripts/deploy-innerbright.sh

# Deploy (quick)
./scripts/deploy-innerbright-quick.sh

# Rollback
./scripts/rollback-innerbright.sh

# View logs
ssh root@116.118.48.208 'docker logs -f innerbright-web'

# Restart
ssh root@116.118.48.208 'cd /var/www/innerbright && docker compose restart innerbright-web'

# SSH to server
ssh root@116.118.48.208

# Container shell
ssh root@116.118.48.208 'docker exec -it innerbright-web sh'
```

## 🎯 Decision Tree

```
Có thay đổi DB schema?
├─ YES → Full deploy + backup
└─ NO → Thay đổi dependencies?
    ├─ YES → Full deploy
    └─ NO → Chỉ CSS/text?
        ├─ YES → Quick deploy
        └─ NO → Full deploy (safe choice)
```

## 📝 Notes

- **Backup:** Full deploy tự động backup database
- **Rollback:** Giữ backup 30 ngày
- **Monitoring:** Theo dõi logs 30 phút sau deploy
- **Notify:** Thông báo team trước khi deploy production

## 🆘 Emergency

Nếu site down:

1. **Rollback ngay:**
   ```bash
   ./scripts/rollback-innerbright.sh
   ```

2. **Check container:**
   ```bash
   ssh root@116.118.48.208 'docker ps | grep innerbright'
   ```

3. **Check database:**
   ```bash
   ssh root@116.118.48.208 'docker exec innerbright-postgres pg_isready'
   ```

4. **Check Nginx:**
   ```bash
   ssh root@116.118.48.208 'systemctl status nginx'
   ```

5. **Contact team** nếu vẫn không fix được

## ✅ Success Criteria

Deployment thành công khi:

- ✅ Container status: healthy
- ✅ HTTP response: 200
- ✅ HTTPS response: 200  
- ✅ Admin panel accessible
- ✅ No errors in logs
- ✅ Response time < 100ms
- ✅ All features working

---

**Last Updated:** 2025-11-18
