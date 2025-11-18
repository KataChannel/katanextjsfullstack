# ✅ InnerBright Deployment Checklist

## 📋 Pre-Deployment

### 1. Chuẩn Bị Local
- [ ] Clone/Pull code mới nhất từ repository
- [ ] Copy file `.env.innerbright` thành `.env.innerbright.local`
- [ ] Cập nhật các giá trị trong `.env.innerbright.local`:
  - [ ] `NEXTAUTH_SECRET` - Generate mới: `openssl rand -base64 32`
  - [ ] `POSTGRES_PASSWORD` - Đổi password mạnh
  - [ ] `REDIS_PASSWORD` - Đổi password mạnh
  - [ ] `MINIO_ROOT_PASSWORD` - Đổi password mạnh
  - [ ] `PGADMIN_PASSWORD` - Đổi password mạnh
  - [ ] `SMTP_PASSWORD` - Gmail App Password
  - [ ] `GOOGLE_CLIENT_ID` - Từ Google Cloud Console
  - [ ] `GOOGLE_CLIENT_SECRET` - Từ Google Cloud Console
- [ ] Test build local: `bun run build`

### 2. Server Access
- [ ] Test SSH connection: `ssh root@116.118.48.208`
- [ ] Kiểm tra disk space: `df -h`
- [ ] Kiểm tra memory: `free -h`

---

## 🏗️ Initial Server Setup (Chỉ lần đầu)

### 1. Install Docker & Docker Compose
```bash
# Copy script lên server
scp scripts/setup-docker-server.sh root@116.118.48.208:/tmp/

# SSH và chạy script
ssh root@116.118.48.208
bash /tmp/setup-docker-server.sh
```

**Checklist:**
- [ ] Docker installed
- [ ] Docker Compose installed
- [ ] Docker service running
- [ ] Created directory: `/var/www/innerbright`
- [ ] Created Docker network: `innerbright-network`

### 2. Setup Nginx & SSL
```bash
# Copy files lên server
scp nginx.innerbright.conf root@116.118.48.208:/var/www/innerbright/
scp scripts/setup-nginx-innerbright.sh root@116.118.48.208:/var/www/innerbright/

# SSH và chạy script
ssh root@116.118.48.208
cd /var/www/innerbright
bash setup-nginx-innerbright.sh
```

**Checklist:**
- [ ] Nginx installed
- [ ] Nginx config created: `/etc/nginx/sites-available/innerbright.vn`
- [ ] Site enabled: `/etc/nginx/sites-enabled/innerbright.vn`
- [ ] Nginx test passed: `sudo nginx -t`
- [ ] Certbot installed
- [ ] SSL certificate obtained
- [ ] SSL auto-renewal configured

### 3. DNS Configuration
- [ ] Point A record `innerbright.vn` to `116.118.48.208`
- [ ] Point A record `www.innerbright.vn` to `116.118.48.208`
- [ ] Verify DNS: `dig innerbright.vn`
- [ ] Wait for DNS propagation (15-30 minutes)

---

## 🚀 Deployment

### 1. Deploy Application
```bash
# Từ local machine
./scripts/deploy-docker-innerbright.sh
```

**Checklist:**
- [ ] .env file validated
- [ ] Code synced to server
- [ ] Docker image built
- [ ] Image uploaded to server
- [ ] Infrastructure started (PostgreSQL, Redis, MinIO, PgAdmin)
- [ ] Website deployed
- [ ] Containers running

### 2. Database Setup (Lần đầu)
```bash
# SSH vào server
ssh root@116.118.48.208
cd /var/www/innerbright

# Run migrations
docker compose exec innerbright-web bun run db:push

# Verify database
docker compose exec postgres psql -U postgres -d innerv2core -c "\dt"
```

**Checklist:**
- [ ] Prisma migrations completed
- [ ] Database tables created
- [ ] No migration errors

### 3. Seed Data (Optional)
```bash
# Create admin user
docker compose exec innerbright-web bun run db:seed

# Seed menus
docker compose exec innerbright-web bun run seed:menus:innerbright
```

**Checklist:**
- [ ] Admin user created
- [ ] Default menus created
- [ ] Initial data seeded

---

## ✅ Post-Deployment Verification

### 1. Health Checks
```bash
# Run health check script
./scripts/check-innerbright-health.sh
```

**Verify:**
- [ ] All containers running
- [ ] Website container healthy
- [ ] PostgreSQL responding
- [ ] Redis responding
- [ ] MinIO responding
- [ ] Health endpoint responding: `http://116.118.48.208:3005/api/health`

### 2. Website Testing
**Test URLs:**
- [ ] http://116.118.48.208:3005 - Direct access works
- [ ] http://innerbright.vn - HTTP redirects to HTTPS
- [ ] https://innerbright.vn - Website loads
- [ ] https://www.innerbright.vn - WWW prefix works
- [ ] https://innerbright.vn/admin - Admin panel accessible

**Test Features:**
- [ ] Homepage loads correctly
- [ ] Navigation menu works
- [ ] Images load properly
- [ ] Forms work
- [ ] Admin login works
- [ ] Google OAuth works (if configured)

### 3. Performance Check
```bash
# Check resource usage
ssh root@116.118.48.208
docker stats
```

**Verify:**
- [ ] CPU usage < 80%
- [ ] Memory usage < 80%
- [ ] No container restarts
- [ ] Response time < 2s

### 4. Logs Review
```bash
# Check for errors
docker compose logs --tail=100 innerbright-web | grep -i error
```

**Verify:**
- [ ] No critical errors
- [ ] No database connection errors
- [ ] No authentication errors
- [ ] Application started successfully

---

## 🔐 Security Checklist

### Application Security
- [ ] All passwords changed from defaults
- [ ] NEXTAUTH_SECRET is unique and strong
- [ ] Google OAuth configured for correct domain
- [ ] SMTP credentials are secure
- [ ] .env file not committed to git
- [ ] File permissions correct: `.env` should be 600

### Server Security
- [ ] SSH key authentication enabled
- [ ] Root login disabled (recommended)
- [ ] Firewall configured (UFW)
- [ ] Only necessary ports open: 22, 80, 443
- [ ] SSL certificate valid
- [ ] HTTPS redirect working
- [ ] Security headers configured in Nginx

### Database Security
- [ ] PostgreSQL password is strong
- [ ] PostgreSQL not exposed to internet (only Docker network)
- [ ] PgAdmin password is strong
- [ ] Regular backups configured

---

## 📊 Monitoring Setup

### 1. Setup Log Rotation
```bash
ssh root@116.118.48.208

# Create logrotate config
sudo nano /etc/logrotate.d/innerbright
```

Add:
```
/var/log/nginx/innerbright.vn.*.log {
    daily
    missingok
    rotate 14
    compress
    delaycompress
    notifempty
    create 0640 www-data adm
    sharedscripts
    postrotate
        systemctl reload nginx > /dev/null
    endscript
}
```

**Checklist:**
- [ ] Log rotation configured
- [ ] Nginx logs rotating

### 2. Setup Backup Cron Job
```bash
# Edit crontab
crontab -e

# Add daily backup at 2 AM
0 2 * * * cd /var/www/innerbright && docker compose exec -T postgres pg_dump -U postgres innerv2core | gzip > backups/auto-backup-$(date +\%Y\%m\%d).sql.gz

# Add weekly cleanup (keep last 30 days)
0 3 * * 0 find /var/www/innerbright/backups -name "auto-backup-*.sql.gz" -mtime +30 -delete
```

**Checklist:**
- [ ] Backup cron job configured
- [ ] Backup directory exists: `/var/www/innerbright/backups`
- [ ] Test backup manually
- [ ] Cleanup cron job configured

### 3. SSL Auto-Renewal
```bash
# Verify certbot renewal timer
sudo systemctl status certbot.timer

# Test renewal
sudo certbot renew --dry-run
```

**Checklist:**
- [ ] Certbot timer active
- [ ] Dry-run test successful
- [ ] Renewal will happen automatically

---

## 🔄 Maintenance Tasks

### Daily
- [ ] Check website is accessible
- [ ] Monitor error logs
- [ ] Check resource usage

### Weekly
- [ ] Review access logs
- [ ] Check disk space
- [ ] Verify backups
- [ ] Clean up Docker: `docker system prune -f`

### Monthly
- [ ] Update Docker images
- [ ] Review security
- [ ] Test restore from backup
- [ ] Check SSL certificate expiry

---

## 🆘 Emergency Contacts & Commands

### Quick Fixes

**Website down:**
```bash
ssh root@116.118.48.208
cd /var/www/innerbright
docker compose restart innerbright-web
```

**Database issues:**
```bash
docker compose restart postgres
sleep 10
docker compose restart innerbright-web
```

**Out of memory:**
```bash
docker system prune -f
docker compose restart
```

**Rollback deployment:**
```bash
# Use previous Docker image
docker images
docker tag innerbright-web:previous innerbright-web:latest
docker compose up -d
```

### Important URLs
- Website: https://innerbright.vn
- PgAdmin: http://116.118.48.208:5050
- MinIO: http://116.118.48.208:9001
- Health: http://116.118.48.208:3005/api/health

### Important Commands
```bash
# View logs
./scripts/manage-innerbright.sh  # Option 3

# Health check
./scripts/check-innerbright-health.sh

# Restart website
ssh root@116.118.48.208
cd /var/www/innerbright
docker compose restart innerbright-web

# Database backup
docker compose exec postgres pg_dump -U postgres innerv2core > backup.sql
```

---

## ✅ Deployment Complete!

Nếu tất cả items đã checked, deployment thành công! 🎉

**Next Steps:**
1. Monitor logs for first 24 hours
2. Test all critical features
3. Setup monitoring/alerting (optional)
4. Document any custom configurations
5. Share access with team members

**Remember:**
- Keep .env file secure
- Regular backups
- Monitor resource usage
- Update regularly
- Document changes

---

**Need Help?**
- Check: `INNERBRIGHT_DEPLOY_QUICK_START.md`
- Run: `./scripts/check-innerbright-health.sh`
- Review logs: `docker compose logs -f`
