# 🚀 Deploy Scripts - Quick Reference

## 📁 Files

```
kataseo/
├── quick-deploy-new.sh          # Full deployment (build Docker image)
├── super-quick-deploy.sh         # Quick restart (git push + rebuild)
├── DEPLOY_GUIDE.md              # Chi tiết hướng dẫn deploy
└── deploy/                      # Old deploy scripts (deprecated)
```

---

## ⚡ Quick Start

### Deploy Code Mới (Recommended)

```bash
./quick-deploy-new.sh
```

**Includes all latest features:**
- ✅ Tiptap Text Block (Notion-like)
- ✅ Container Background Settings
- ✅ Homepage Settings với Combobox
- ✅ Block Templates V2
- ✅ All bug fixes

---

### Super Quick Deploy (Small changes)

```bash
./super-quick-deploy.sh
```

**Use for:**
- UI tweaks
- Component updates
- Bug fixes
- No dependency changes

---

## 📊 Comparison

| Feature | quick-deploy-new.sh | super-quick-deploy.sh |
|---------|--------------------|-----------------------|
| Build Docker | ✅ Local | ✅ Server |
| Export/Transfer | ✅ Yes | ❌ No |
| Time | ~10-15 min | ~3-5 min |
| Use Case | Major updates | Small changes |
| Dependencies | Handles all | Server must have |
| Rollback | Easy | Harder |

---

## 🎯 When to Use Each

### quick-deploy-new.sh
- ✅ First time deploy
- ✅ Dockerfile changes
- ✅ New dependencies
- ✅ Database schema changes
- ✅ Major feature updates
- ✅ Production deploy

### super-quick-deploy.sh
- ✅ Component updates
- ✅ Style changes
- ✅ Text/content updates
- ✅ Bug fixes (code only)
- ✅ Dev/staging deploy

---

## 🔧 Setup Requirements

### Local Machine
```bash
# Docker installed
docker --version

# SSH access to server
ssh root@116.118.48.208

# Git configured
git config --list
```

### Server Requirements
```bash
# Docker & Docker Compose
docker --version
docker compose version

# Environment file
/root/.env.innerbright

# Network
innerv2core-network

# Volume directories
/root/innerbright/public/uploads
/root/innerbright/public/icons
```

---

## 📝 Workflow Examples

### Example 1: Deploy New Feature

```bash
# 1. Develop locally
bun run dev:innerbright

# 2. Test feature
# ... test in browser

# 3. Commit code
git add .
git commit -m "feat: add new feature"
git push

# 4. Deploy
./quick-deploy-new.sh
# Enter commit message or press Enter

# 5. Verify
curl https://innerbright.vn/api/health
```

---

### Example 2: Fix UI Bug

```bash
# 1. Fix bug locally
# ... edit component

# 2. Test
bun run dev:innerbright

# 3. Quick deploy
./super-quick-deploy.sh
# Enter: "fix: button alignment"

# 4. Done!
```

---

## 🐛 Troubleshooting

### Script won't run
```bash
# Make executable
chmod +x quick-deploy-new.sh
chmod +x super-quick-deploy.sh

# Check syntax
bash -n quick-deploy-new.sh
```

### Docker build fails
```bash
# Clean cache
docker system prune -a

# Check Dockerfile
cat Dockerfile

# Build manually
docker build -t innerbright-web:latest .
```

### SSH connection fails
```bash
# Test connection
ssh root@116.118.48.208

# Check SSH config
cat ~/.ssh/config

# Use verbose mode
ssh -v root@116.118.48.208
```

### Container won't start
```bash
# SSH to server
ssh root@116.118.48.208

# Check logs
docker logs innerbright-web --tail 100

# Check env
cat /root/.env.innerbright

# Manual start
docker run -d --name innerbright-web ...
```

---

## 📖 Full Documentation

For detailed guide, see: **[DEPLOY_GUIDE.md](./DEPLOY_GUIDE.md)**

Contents:
- 🎯 2 Deployment Methods
- 📝 Step-by-Step Instructions
- 🔧 Troubleshooting Guide
- 🔄 Rollback Procedures
- 📊 Post-Deploy Checks
- 📋 Deployment Checklist
- 🚨 Emergency Contacts
- 🎓 Tips & Best Practices

---

## 🎉 Success!

After successful deploy:

```
✅ Deploy Hoàn Tất!
============================================
📝 Features Deployed:
  ✓ Tiptap Text Block
  ✓ Container Background Settings
  ✓ Homepage Settings
  
🌐 Website: https://innerbright.vn
🔧 Admin: https://innerbright.vn/admin

📊 Check logs:
  ssh root@116.118.48.208 'docker logs -f innerbright-web'
```

---

## 📞 Need Help?

1. Check **DEPLOY_GUIDE.md**
2. Review error logs
3. Try rollback
4. Contact DevOps team

---

**Happy Deploying! 🚀**
