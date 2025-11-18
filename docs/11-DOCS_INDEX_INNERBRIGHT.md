# 📚 InnerBright Deployment - Documentation Index

Tài liệu hướng dẫn deploy InnerBright.vn lên server 116.118.48.208 với Docker

---

## 🎯 Quick Links

### 🚀 Getting Started
**Bắt đầu deploy ngay?** → [`INNERBRIGHT_DEPLOY_QUICK_START.md`](./INNERBRIGHT_DEPLOY_QUICK_START.md)

**Cần overview?** → [`README_INNERBRIGHT.md`](./README_INNERBRIGHT.md)

**Checklist đầy đủ?** → [`DEPLOYMENT_CHECKLIST_INNERBRIGHT.md`](./DEPLOYMENT_CHECKLIST_INNERBRIGHT.md)

---

## 📖 Documentation Structure

### 1. Quick Start Guide ⚡
**File**: `INNERBRIGHT_DEPLOY_QUICK_START.md`

**Nội dung**:
- Deploy trong 3 bước
- Lần deploy đầu tiên
- Setup Nginx & SSL
- Monitoring & Management
- Troubleshooting

**Dành cho**: Deploy nhanh, người mới

---

### 2. README Overview 📋
**File**: `README_INNERBRIGHT.md`

**Nội dung**:
- Thông tin hệ thống
- Quick start
- Cấu trúc files
- Management script
- Các scripts chính
- Thao tác thường dùng
- Infrastructure services
- URLs & endpoints

**Dành cho**: Reference tổng quan, lookup nhanh

---

### 3. Deployment Checklist ✅
**File**: `DEPLOYMENT_CHECKLIST_INNERBRIGHT.md`

**Nội dung**:
- Pre-deployment checklist
- Initial server setup
- Deployment steps
- Post-deployment verification
- Security checklist
- Monitoring setup
- Maintenance tasks
- Emergency commands

**Dành cho**: Deploy theo checklist, đảm bảo không bỏ sót

---

### 4. Deployment Summary 📦
**File**: `DEPLOYMENT_SUMMARY_INNERBRIGHT.md`

**Nội dung**:
- Tổng quan công việc đã làm
- Kiến trúc hệ thống
- Deployment flow
- Key features
- Performance optimizations
- Security measures
- Usage instructions
- Common issues

**Dành cho**: Hiểu tổng thể, technical details

---

### 5. Docker Deploy Guide 🐳
**File**: `DOCKER_DEPLOY_GUIDE.md`

**Nội dung**:
- Tổng quan Docker deployment
- Kiến trúc hệ thống
- Chuẩn bị
- Cài đặt ban đầu
- Deploy ứng dụng
- Quản lý & Monitoring
- Troubleshooting

**Dành cho**: Chi tiết về Docker, infrastructure

---

## 🛠️ Scripts & Tools

### Deployment Scripts

#### 1. Main Deployment Script
**File**: `scripts/deploy-docker-innerbright.sh`

**Chức năng**:
- Validate .env file
- Sync code to server
- Build Docker image
- Upload to server
- Deploy infrastructure
- Deploy website
- Health checks

**Usage**: `./scripts/deploy-docker-innerbright.sh`

---

#### 2. Health Check Script
**File**: `scripts/check-innerbright-health.sh`

**Chức năng**:
- Check Docker status
- Check containers
- Test health endpoint
- Show resource usage
- Show logs

**Usage**: `./scripts/check-innerbright-health.sh`

---

#### 3. Management Script (Recommended) ⭐
**File**: `scripts/manage-innerbright.sh`

**Chức năng**:
- Interactive menu
- Deploy
- Health check
- View logs
- Restart services
- SSH to server
- Database backup
- Docker cleanup
- Resource monitoring

**Usage**: `./scripts/manage-innerbright.sh`

---

#### 4. Nginx Setup Script
**File**: `scripts/setup-nginx-innerbright.sh`

**Chức năng**:
- Install Nginx & Certbot
- Configure Nginx
- Setup SSL certificate
- Configure firewall

**Usage**: 
```bash
scp nginx.innerbright.conf scripts/setup-nginx-innerbright.sh root@116.118.48.208:/var/www/innerbright/
ssh root@116.118.48.208
cd /var/www/innerbright
bash setup-nginx-innerbright.sh
```

---

### Configuration Files

#### 1. Environment File
**File**: `.env.innerbright`

**Description**: Template cho production environment variables

**Usage**: 
```bash
cp .env.innerbright .env.innerbright.local
nano .env.innerbright.local
```

---

#### 2. Nginx Configuration
**File**: `nginx.innerbright.conf`

**Description**: Nginx reverse proxy config với SSL

**Usage**: Automatically used by `setup-nginx-innerbright.sh`

---

#### 3. Docker Compose Files
**Files**: 
- `docker-compose.yml` - Main application
- `docker-compose.infrastructure.yml` - Infrastructure services
- `Dockerfile` - Next.js image với Bun

**Description**: Container configuration

---

## 🎓 Learning Path

### Beginner Path
1. Read: `INNERBRIGHT_DEPLOY_QUICK_START.md`
2. Follow: Quick Start (3 steps)
3. Use: `./scripts/manage-innerbright.sh`
4. Reference: `README_INNERBRIGHT.md` when needed

### Advanced Path
1. Read: `DEPLOYMENT_SUMMARY_INNERBRIGHT.md`
2. Review: `DOCKER_DEPLOY_GUIDE.md`
3. Study: Docker Compose files
4. Customize: Scripts for specific needs

### Production Deployment Path
1. Read: `DEPLOYMENT_CHECKLIST_INNERBRIGHT.md`
2. Prepare: All items in pre-deployment
3. Execute: Follow checklist step-by-step
4. Verify: Post-deployment verification
5. Monitor: Set up monitoring

---

## 🔍 Quick Search

### "How do I...?"

**...deploy for the first time?**
→ `INNERBRIGHT_DEPLOY_QUICK_START.md` → Section "Lần Deploy Đầu Tiên"

**...update code?**
→ `INNERBRIGHT_DEPLOY_QUICK_START.md` → Section "Re-deploy"

**...check if everything is running?**
→ Run: `./scripts/check-innerbright-health.sh`

**...view logs?**
→ Run: `./scripts/manage-innerbright.sh` → Option 3

**...restart the website?**
→ Run: `./scripts/manage-innerbright.sh` → Option 4

**...backup database?**
→ Run: `./scripts/manage-innerbright.sh` → Option 7

**...setup Nginx and SSL?**
→ `INNERBRIGHT_DEPLOY_QUICK_START.md` → Section "Setup Nginx & SSL"

**...troubleshoot issues?**
→ `INNERBRIGHT_DEPLOY_QUICK_START.md` → Section "Troubleshooting"
→ `DEPLOYMENT_SUMMARY_INNERBRIGHT.md` → Section "Common Issues & Solutions"

**...understand the architecture?**
→ `DEPLOYMENT_SUMMARY_INNERBRIGHT.md` → Section "Kiến Trúc Hệ Thống"

**...secure the deployment?**
→ `DEPLOYMENT_CHECKLIST_INNERBRIGHT.md` → Section "Security Checklist"

---

## 📱 Contact & Support

### Quick Commands
```bash
# Deploy
./scripts/deploy-docker-innerbright.sh

# Health Check
./scripts/check-innerbright-health.sh

# Management Menu
./scripts/manage-innerbright.sh

# SSH to Server
ssh root@116.118.48.208
```

### Important URLs
- Website: https://innerbright.vn
- Admin: https://innerbright.vn/admin
- PgAdmin: http://116.118.48.208:5050
- MinIO: http://116.118.48.208:9001
- Health: http://116.118.48.208:3005/api/health

---

## 📌 Tips

💡 **Tip 1**: Sử dụng `manage-innerbright.sh` cho tất cả operations thường dùng

💡 **Tip 2**: Luôn run health check sau mỗi deployment

💡 **Tip 3**: Backup database trước khi làm bất kỳ thay đổi quan trọng

💡 **Tip 4**: Monitor logs trong 24h đầu sau deployment

💡 **Tip 5**: Giữ file `.env` an toàn, đừng commit vào git

---

## 🎯 Recommended Workflow

### First Time Deployment
```
1. Read: INNERBRIGHT_DEPLOY_QUICK_START.md
2. Prepare: .env.innerbright.local
3. Run: ./scripts/deploy-docker-innerbright.sh
4. Setup: Nginx & SSL (on server)
5. Verify: ./scripts/check-innerbright-health.sh
6. Test: All features on website
```

### Regular Updates
```
1. Pull: Latest code
2. Run: ./scripts/deploy-docker-innerbright.sh
3. Check: ./scripts/check-innerbright-health.sh
4. Monitor: Logs for errors
```

### Maintenance
```
1. Weekly: Run health check
2. Weekly: Clean Docker (prune)
3. Weekly: Backup database
4. Monthly: Update dependencies
5. Monthly: Review security
```

---

**Ready to deploy?** Start here: [`INNERBRIGHT_DEPLOY_QUICK_START.md`](./INNERBRIGHT_DEPLOY_QUICK_START.md)

**Need help?** Check: [`README_INNERBRIGHT.md`](./README_INNERBRIGHT.md)

**Want checklist?** Follow: [`DEPLOYMENT_CHECKLIST_INNERBRIGHT.md`](./DEPLOYMENT_CHECKLIST_INNERBRIGHT.md)

---

*Last Updated: November 18, 2025*
