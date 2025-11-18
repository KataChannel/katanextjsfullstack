# 📚 Documentation Index

Tài liệu tổng hợp cho dự án Multi-Domain CMS với Next.js + Prisma + Bun.

## 🚀 Getting Started

- **[Quick Start Guide](./QUICK_START.md)** - Setup và chạy dự án trong 5 phút ⚡
- **[Environment Variables](./ENVIRONMENT.md)** - Cấu hình biến môi trường
- **[Troubleshooting](./TROUBLESHOOTING.md)** - Giải quyết các vấn đề thường gặp

## 📖 Core Features

### 1. [Multi-Domain System](./MULTI_DOMAIN.md)
- 6 domains với database isolation
- Port-based development routing
- Automatic domain detection

### 2. [Page Builder](./PAGE_BUILDER.md)
- Drag & drop interface
- 8 block types với templates
- Real-time preview & keyboard shortcuts

### 3. [Authentication & Authorization](./AUTHENTICATION.md)
- NextAuth with JWT strategy
- Role-based permissions (admin, manager, editor)
- Middleware protection & session management

### 4. [Content Management](./CONTENT_MANAGEMENT.md)
- Pages & Posts với Tiptap editor kiểu Notion
- SEO optimization & media management
- Slash commands & keyboard shortcuts

### 5. [Menu System](./MENU_SYSTEM.md)
- Multi-level menus (unlimited depth)
- Domain-specific menus
- Position-based rendering (header, footer, sidebar)

## �️ Development Guides

### Setup & Configuration
- **[Add New Domain](./ADD_DOMAIN.md)** - Step-by-step guide to add domain
- **[Environment Setup](./ENVIRONMENT.md)** - Complete env variables reference

## 🐳 Deployment

### Docker Deployment
- [Deployment Success Summary](../deploy/DEPLOYMENT_SUCCESS.md)
- [Scripts Documentation](../deploy/SCRIPTS_README.md)

All deployment scripts are in `/deploy` folder:
- `build-docker-local.sh` - Build Docker image locally (fast)
- `quick-deploy.sh` - One-command deployment to production
- `fix-bugs.sh` - Interactive debugging & container management

### Deployment Workflow
```bash
# 1. Build locally (faster than building on server)
cd /deploy
./build-docker-local.sh

# 2. Deploy to production
./quick-deploy.sh

# 3. Verify deployment
docker ps | grep innerbright-web
curl http://116.118.48.208:3005/api/health
```

## 🆘 Troubleshooting

- **[Troubleshooting Guide](./TROUBLESHOOTING.md)** - Solutions for common issues

### Quick Fixes
- **Login Issues**: Check NEXTAUTH_SECRET and JWT strategy
- **Database Connection**: Verify DATABASE_URL and PostgreSQL status
- **Port Conflicts**: Use `lsof -i :PORT` to find conflicts
- **Docker Issues**: Check logs with `docker logs container-name`

## 📝 Historical Documentation

Old documentation files (150+ files) are still in `/docs/` folder:
- Files with numeric prefixes (1-18) are development logs
- Reference if needed for historical context
- Will be archived in future cleanup

## 🔗 Quick Links

### For Developers
- **[Quick Start](./QUICK_START.md)** → Setup in 5 minutes ⚡
- **[Add Domain](./ADD_DOMAIN.md)** → Add new domain step-by-step
- **[Troubleshooting](./TROUBLESHOOTING.md)** → Solve common problems
- **[Environment](./ENVIRONMENT.md)** → Configure env variables

### For Content Managers
- **[Content Management](./CONTENT_MANAGEMENT.md)** → Create pages & posts
- **[Page Builder](./PAGE_BUILDER.md)** → Build custom pages visually
- **[Menu System](./MENU_SYSTEM.md)** → Manage navigation menus

### For DevOps
- **[Deployment Scripts](../deploy/)** → Docker deployment tools
- **[Multi-Domain](./MULTI_DOMAIN.md)** → Understanding multi-domain architecture

---

**📌 Note**: This is the main documentation hub. All essential docs are linked here. Historical docs (150+ files) will be archived in future.
- [Database Connection](./TROUBLESHOOTING.md#database)
- [Deployment Issues](./TROUBLESHOOTING.md#deployment)

---

**Last Updated:** 2025-11-19
**Version:** 2.0
