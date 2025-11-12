# CẤU HÌNH MULTI-DOMAIN VÀ DEPLOYMENT - TỔNG HỢP

**Ngày hoàn thành:** 12/11/2025  
**Hệ thống:** Next.js 16 Multi-Domain với 5 Domains

---

## 🎯 TỔNG QUAN

Đã hoàn thành việc cấu hình hệ thống multi-domain cho **5 domains** với database riêng biệt, hỗ trợ đầy đủ cả **Development** và **Production** environment.

---

## 📊 THỐNG KÊ

### Files đã tạo/cập nhật: **15 files**

#### Files Cấu Hình (7 files):
1. ⭐ `lib/domain-config.ts` - Cấu hình tập trung cho 5 domains
2. ⭐ `lib/domain-helpers.ts` - Server-side helpers
3. ⭐ `lib/domain-hooks.ts` - Client-side React hooks
4. ⭐ `middleware.ts` - Domain detection middleware
5. `lib/database.ts` - Database manager (updated)
6. `lib/prisma.ts` - Prisma client (updated)
7. `lib/seo.ts` - SEO helpers (updated)

#### Files Deployment (3 files):
8. ⭐ `scripts/setup-server.sh` - Setup server lần đầu
9. ⭐ `scripts/deploy-production.sh` - Deploy/update code
10. ⭐ `scripts/backup-databases.sh` - Backup databases

#### Files Configuration (2 files):
11. `next.config.ts` - Next.js config (updated)
12. `.env.example` - Environment template (updated)
13. `package.json` - Scripts shortcuts (updated)

#### Files Documentation (2 files):
14. ⭐ `DEPLOYMENT_GUIDE.md` - Hướng dẫn deployment chi tiết
15. ⭐ `docs/MULTI_DOMAIN_USAGE_EXAMPLES.md` - Ví dụ sử dụng

---

## 🌐 DOMAINS CONFIGURATION

| Domain | Database | Port Dev | Description |
|--------|----------|----------|-------------|
| **tazagroup.vn** | tazagroupvn | 3000 | Taza Group - Nâng tầm giá trị phụ nữ Việt |
| **tazaskinclinic.com** | tazaskinclinic | 3001 | Taza Skin Clinic - Chuyên gia thẩm mỹ |
| **timona.edu.vn** | timona | 3002 | Timona Academy - Đào tạo thẩm mỹ |
| **hderma.vn** | hderma | 3003 | H.Derma - Khai phá vẻ đẹp riêng |
| **elasome.com** | elasome | 3004 | Elasome - Giải pháp chăm sóc da |

**Database Server:** 116.118.49.243:13003

---

## 🏗️ KIẾN TRÚC HỆ THỐNG

```
┌─────────────────────────────────────────────────────────┐
│                      INTERNET                           │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        │   5 Domains (DNS)       │
        │  - tazagroup.vn         │
        │  - tazaskinclinic.com   │
        │  - timona.edu.vn        │
        │  - hderma.vn            │
        │  - elasome.com          │
        └────────────┬────────────┘
                     │
        ┌────────────┴────────────┐
        │   Nginx (Port 80/443)   │
        │   - SSL/TLS             │
        │   - Reverse Proxy       │
        └────────────┬────────────┘
                     │
        ┌────────────┴────────────┐
        │  Next.js App (Port 3000)│
        │  - Middleware           │
        └────────────┬────────────┘
                     │
        ┌────────────┴────────────┐
        │   Domain Detection      │
        │   - Hostname parsing    │
        │   - Port mapping        │
        └────────────┬────────────┘
                     │
        ┌────────────┴────────────┐
        │  Database Selection     │
        │  - Prisma Client Cache  │
        └────────────┬────────────┘
                     │
        ┌────────────┴────────────┐
        │  PostgreSQL (5 DBs)     │
        │  116.118.49.243:13003   │
        └─────────────────────────┘
```

---

## ✨ TÍNH NĂNG CHÍNH

### Development Features
✅ **Port-based routing** - Mỗi domain chạy trên port riêng (3000-3004)  
✅ **Auto domain detection** - Tự động nhận diện domain từ port  
✅ **Hot reload** - Full support cho development  
✅ **Type safety** - TypeScript trong toàn bộ codebase  

### Production Features
✅ **Domain-based routing** - Tự động routing theo domain thật  
✅ **Database isolation** - Mỗi domain có database riêng  
✅ **Prisma client caching** - Performance cao với connection pooling  
✅ **SSL/TLS support** - HTTPS cho tất cả domains  
✅ **SEO optimization** - Metadata riêng cho từng domain  
✅ **Auto backup** - Daily backup tất cả databases  

### Developer Experience
✅ **Helper functions** - Server & client helpers sẵn có  
✅ **React hooks** - Custom hooks cho client components  
✅ **Deployment scripts** - Tự động hóa deployment  
✅ **Comprehensive docs** - Tài liệu đầy đủ với examples  

---

## 🚀 CÁCH SỬ DỤNG

### Development

```bash
# Chạy domain cụ thể
bun run dev:tazagroup   # Port 3000 - tazagroup.vn
bun run dev:tazaskin    # Port 3001 - tazaskinclinic.com
bun run dev:timona      # Port 3002 - timona.edu.vn
bun run dev:hderma      # Port 3003 - hderma.vn
bun run dev:elasome     # Port 3004 - elasome.com

# Hoặc chạy với port tùy chọn
bun dev -- -p 3001
```

### Production Deployment

#### Cách 1: Tự động (Script)

```bash
# Setup server lần đầu (chỉ chạy 1 lần)
sudo bash scripts/setup-server.sh

# Deploy/update code (chạy mỗi khi update)
./scripts/deploy-production.sh
```

#### Cách 2: Thủ công

```bash
# Pull code
git pull origin webseo_dev3_alldomain

# Install & build
bun install
bun run db:generate
bun run build

# Reload app
pm2 reload multidomain-app
```

---

## 📝 VÍ DỤ CODE

### Server Component

```tsx
import { getCurrentDomainConfig } from '@/lib/domain-helpers';

export default async function Page() {
  const config = await getCurrentDomainConfig();
  
  return (
    <div>
      <h1>{config.siteName}</h1>
      <p>{config.description}</p>
      <p>Hotline: {config.hotline}</p>
    </div>
  );
}
```

### Client Component

```tsx
'use client';
import { useDomainInfo } from '@/lib/domain-hooks';

export function Header() {
  const { domain, hostname } = useDomainInfo();
  return <div>Domain: {domain}</div>;
}
```

### Database Query

```tsx
import { getPrisma } from '@/lib/prisma';

export default async function PostsPage() {
  const prisma = await getPrisma();
  const posts = await prisma.post.findMany();
  // Tự động query từ database của domain hiện tại
}
```

---

## 🔧 CẤU HÌNH NGINX (Production)

```nginx
upstream nextjs_app {
    server 127.0.0.1:3000;
    keepalive 64;
}

server {
    listen 443 ssl http2;
    server_name tazagroup.vn www.tazagroup.vn;
    
    ssl_certificate /etc/letsencrypt/live/tazagroup.vn/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/tazagroup.vn/privkey.pem;
    
    location / {
        proxy_pass http://nextjs_app;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}

# Repeat cho các domains khác...
```

---

## 🗄️ DATABASE STRUCTURE

Tất cả databases share cùng schema nhưng data độc lập:

```
PostgreSQL Server: 116.118.49.243:13003
├── tazagroupvn (Database 1)
├── tazaskinclinic (Database 2)
├── timona (Database 3)
├── hderma (Database 4)
└── elasome (Database 5)
```

Mỗi database có:
- Users table
- Posts table
- Pages table
- Media table
- Analytics data
- ...

---

## 📚 TÀI LIỆU THAM KHẢO

1. **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Hướng dẫn deployment chi tiết
   - Setup server
   - Nginx configuration
   - SSL/TLS setup
   - PM2 process management
   - Backup & restore

2. **[MULTI_DOMAIN_CONFIG.md](./MULTI_DOMAIN_CONFIG.md)** - Cấu hình multi-domain
   - Domain configuration
   - Architecture overview
   - File structure
   - Best practices

3. **[docs/MULTI_DOMAIN_USAGE_EXAMPLES.md](./docs/MULTI_DOMAIN_USAGE_EXAMPLES.md)** - Ví dụ sử dụng
   - Server components
   - Client components
   - API routes
   - Database queries
   - SEO & metadata

4. **[README.md](./README.md)** - Documentation chính

---

## 🎯 CHECKLIST DEPLOYMENT

### Pre-deployment
- [ ] Code đã commit và push lên repository
- [ ] .env file đã được cấu hình đúng
- [ ] Database connection đã test thành công
- [ ] Build local thành công (`bun run build`)

### Server Setup (Lần đầu)
- [ ] Server đã được provision (VPS/Dedicated)
- [ ] SSH access đã được setup
- [ ] Firewall đã mở port 80, 443, 22
- [ ] Run `scripts/setup-server.sh` thành công

### DNS Configuration
- [ ] Tất cả 5 domains point về server IP
- [ ] DNS propagation đã complete (check với `dig`)
- [ ] WWW subdomain đã được cấu hình

### SSL/TLS
- [ ] Certbot đã install
- [ ] SSL certificates đã được tạo cho tất cả domains
- [ ] Auto-renewal đã được setup

### Application
- [ ] PM2 đang chạy application
- [ ] Application accessible qua tất cả domains
- [ ] Database connection working
- [ ] Logs không có errors

### Monitoring & Backup
- [ ] PM2 monitoring đang hoạt động
- [ ] Backup cron job đã được setup
- [ ] Alert/notification system (optional)

---

## 🔒 BẢO MẬT

### Đã implement:
✅ SSL/TLS encryption cho tất cả domains  
✅ Environment variables protection  
✅ SQL injection prevention (Prisma ORM)  
✅ XSS protection (React auto-escaping)  
✅ Security headers (Nginx + Next.js)  
✅ Database credentials trong .env  
✅ No sensitive data in logs  

### Khuyến nghị thêm:
- Rate limiting cho API endpoints
- CORS configuration
- CSP (Content Security Policy)
- Regular security updates
- Firewall rules (UFW/iptables)

---

## 📊 PERFORMANCE

### Optimizations:
- ✅ Prisma client connection pooling
- ✅ Prisma client caching per domain
- ✅ Next.js image optimization
- ✅ Gzip compression (Nginx)
- ✅ Static file caching
- ✅ PM2 cluster mode
- ✅ HTTP/2 support

### Monitoring:
```bash
# PM2 monitoring
pm2 monit

# Check memory/CPU
pm2 status

# Application logs
pm2 logs multidomain-app
```

---

## 🆘 TROUBLESHOOTING

### Domain không load
```bash
# Check DNS
dig tazagroup.vn

# Check Nginx
sudo nginx -t
sudo systemctl status nginx

# Check application
pm2 status
pm2 logs
```

### Database connection error
```bash
# Test connection
psql -h 116.118.49.243 -p 13003 -U postgres -d tazagroupvn

# Check .env
cat .env | grep DATABASE_URL
```

### SSL certificate issues
```bash
# Renew certificates
sudo certbot renew

# Check certificate status
sudo certbot certificates
```

---

## 📞 SUPPORT

**Repository:** https://github.com/KataChannel/katanextjsfullstack  
**Branch:** webseo_dev3_alldomain  
**Documentation:** Xem các file .md trong repository

---

## ✅ KẾT LUẬN

Hệ thống multi-domain đã được cấu hình hoàn chỉnh với:

- ✅ **15 files** mới/cập nhật
- ✅ **5 domains** được hỗ trợ đầy đủ
- ✅ **Development & Production** environments
- ✅ **Automatic deployment** scripts
- ✅ **Comprehensive documentation**
- ✅ **Best practices** architecture

**Hệ thống sẵn sàng để deploy production!** 🚀

---

**Hoàn thành:** 12/11/2025 ✨
