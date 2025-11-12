# CẤU HÌNH MULTI-DOMAIN CHO HỆ THỐNG

**Ngày cập nhật:** 12/11/2025  
**Tác giả:** GitHub Copilot

## 📋 TỔNG QUAN

Hệ thống đã được cấu hình để hỗ trợ **5 domains** với database riêng biệt cho từng domain. Hỗ trợ đầy đủ cả môi trường **Development** (localhost) và **Production** (domain thật).

## 🌐 DANH SÁCH DOMAINS

| # | Domain | Database | Port Dev | Mô tả |
|---|--------|----------|----------|-------|
| 1 | **tazagroup.vn** | tazagroupvn | 3000 | Taza Group - Nâng tầm giá trị phụ nữ Việt |
| 2 | **tazaskinclinic.com** | tazaskinclinic | 3001 | Taza Skin Clinic - Chuyên gia thẩm mỹ |
| 3 | **timona.edu.vn** | timona | 3002 | Timona Academy - Đào tạo thẩm mỹ |
| 4 | **hderma.vn** | hderma | 3003 | H.Derma - Khai phá vẻ đẹp riêng |
| 5 | **elasome.com** | elasome | 3004 | Elasome - Giải pháp chăm sóc da |

## 📁 CÁC FILE ĐÃ TẠO/CẬP NHẬT

### 1. **lib/domain-config.ts** (MỚI) ⭐
File cấu hình tập trung cho tất cả các domains:
- ✅ Thông tin database cho từng domain
- ✅ Mô tả, địa chỉ, hotline, email
- ✅ Cấu hình SEO (siteName, siteTitle)
- ✅ Mapping port development với domain
- ✅ Helper functions: `getDomainConfig()`, `getDatabaseUrl()`, `getBaseUrl()`

**Ví dụ sử dụng:**
```typescript
import { getDomainConfig } from '@/lib/domain-config';

// Lấy config từ hostname
const config = getDomainConfig('localhost:3001');
// => trả về config của tazaskinclinic.com

console.log(config.database);  // URL database
console.log(config.hotline);   // 19002664
console.log(config.email);     // info@tazaskinclinic.com
```

### 2. **lib/domain-helpers.ts** (MỚI) ⭐
Server-side helpers để sử dụng trong Server Components:
- ✅ `getCurrentDomainConfig()` - Lấy config hiện tại
- ✅ `getCurrentHostname()` - Lấy hostname
- ✅ `getCurrentDomain()` - Lấy domain (clean)
- ✅ `getCurrentSiteName()` - Lấy site name
- ✅ `isDomain()` - Check domain cụ thể
- ✅ `getContactInfo()` - Lấy thông tin liên hệ
- ✅ `getSEOMetadata()` - Lấy SEO metadata

### 3. **lib/domain-hooks.ts** (MỚI) ⭐
Client-side hooks cho Client Components:
- ✅ `useDomainInfo()` - Hook lấy domain info
- ✅ `useIsDomain()` - Hook check domain
- ✅ `useBaseUrl()` - Hook lấy base URL
- ✅ `useCurrentPath()` - Hook lấy current path
- ✅ `useFullUrl()` - Hook build full URL

### 4. **lib/database.ts** (CẬP NHẬT)
Đã được refactor để sử dụng `domain-config.ts`:
- ✅ Tự động phát hiện domain từ hostname
- ✅ Hỗ trợ localhost:port mapping
- ✅ Cache Prisma clients cho performance
- ✅ Cleanup connections khi shutdown

### 5. **lib/prisma.ts** (CẬP NHẬT)
Cập nhật để tương thích với multi-domain:
- ✅ Sử dụng hostname thay vì domain
- ✅ Lấy từ headers `x-hostname` hoặc `host`
- ✅ Fallback về localhost:3000 khi build

### 6. **lib/seo.ts** (CẬP NHẬT)
Thêm domain-aware SEO functions:
- ✅ `generateDomainSEOMetadata()` - Tự động lấy domain metadata
- ✅ `generateDomainOrganizationSchema()` - Organization schema theo domain

### 7. **middleware.ts** (MỚI) ⭐
Middleware để detect domain và inject headers:
- ✅ Phát hiện hostname từ request
- ✅ Set headers: `x-hostname`, `x-domain`, `x-site-name`
- ✅ Logging trong development mode
- ✅ Matcher exclude static files

### 8. **next.config.ts** (CẬP NHẬT)
Thêm cấu hình cho multi-domain:
- ✅ Comment rewrites sẵn sàng cho production
- ✅ Security headers
- ✅ Performance optimization

### 9. **.env.example** (CẬP NHẬT)
Template đầy đủ cho tất cả domains:
- ✅ Database URLs cho 5 domains
- ✅ Hướng dẫn development với port mapping
- ✅ Hướng dẫn production deployment
- ✅ OAuth và SMTP settings

### 10. **package.json** (CẬP NHẬT)
Thêm scripts cho từng domain:
- ✅ `dev:tazagroup` - Port 3000
- ✅ `dev:tazaskin` - Port 3001
- ✅ `dev:timona` - Port 3002
- ✅ `dev:hderma` - Port 3003
- ✅ `dev:elasome` - Port 3004

### 11. **docs/MULTI_DOMAIN_USAGE_EXAMPLES.md** (MỚI) ⭐
Tài liệu ví dụ sử dụng đầy đủ:
- ✅ Server Components examples
- ✅ Client Components examples
- ✅ Server Actions examples
- ✅ API Routes examples
- ✅ Database queries examples
- ✅ SEO & Metadata examples

### 12. **README.md** (CẬP NHẬT)
Cập nhật documentation chính:
- ✅ Multi-domain section
- ✅ Quick commands cho từng domain
- ✅ Architecture diagram
- ✅ Links to detailed docs

## 🚀 CÁCH SỬ DỤNG

### Development Mode

#### Chạy domain cụ thể:
```bash
# Taza Group (port 3000)
bun dev

# Taza Skin Clinic (port 3001)
bun dev -- -p 3001

# Timona Academy (port 3002)
bun dev -- -p 3002

# H.Derma (port 3003)
bun dev -- -p 3003

# Elasome (port 3004)
bun dev -- -p 3004
```

#### Truy cập:
- http://localhost:3000 → tazagroup.vn database
- http://localhost:3001 → tazaskinclinic.com database
- http://localhost:3002 → timona.edu.vn database
- http://localhost:3003 → hderma.vn database
- http://localhost:3004 → elasome.com database

### Production Mode

#### 1. Cấu hình .env:
```bash
NODE_ENV=production
NEXTAUTH_URL=https://tazagroup.vn
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:13003/tazagroupvn"
```

#### 2. Build:
```bash
bun run build
```

#### 3. Deploy:
- Deploy code lên server/hosting
- Point domain DNS về server
- Hệ thống tự động detect domain từ request headers

## 🔧 KIẾN TRÚC HỆ THỐNG

```
Request → Middleware → Domain Detection → Database Selection
   ↓
Headers được set:
- x-hostname: localhost:3001 hoặc tazaskinclinic.com
- x-domain: tazaskinclinic.com (domain thật)
- x-site-name: Taza Skin Clinic
   ↓
App Components → getPrisma() → Correct Database
```

## 📊 LUỒNG DỮ LIỆU

1. **Request đến** → Middleware nhận hostname
2. **Domain Config** → Map hostname → domain config
3. **Headers** → Inject vào request
4. **Database** → Select đúng database cho domain
5. **Response** → Trả về với data từ database phù hợp

## ⚙️ CẤU HÌNH CHI TIẾT

### Mapping Port → Domain (Development)
```typescript
const portMap = {
  '3000': 'tazagroup.vn',
  '3001': 'tazaskinclinic.com',
  '3002': 'timona.edu.vn',
  '3003': 'hderma.vn',
  '3004': 'elasome.com',
}
```

### Database URLs
Tất cả sử dụng cùng PostgreSQL server nhưng database khác nhau:
- Server: `116.118.49.243:13003`
- User: `postgres`
- Pass: `postgres`
- Databases: `tazagroupvn`, `tazaskinclinic`, `timona`, `hderma`, `elasome`

## 🎯 TÍNH NĂNG

✅ **Auto Domain Detection**: Tự động phát hiện domain từ request  
✅ **Database Isolation**: Mỗi domain có database riêng  
✅ **Port Mapping**: Dev dễ dàng với localhost:port  
✅ **Prisma Client Caching**: Performance cao với connection pooling  
✅ **SEO Ready**: Headers và metadata cho từng domain  
✅ **Type Safety**: Full TypeScript support  
✅ **Clean Architecture**: Code dễ maintain và scale  

## 📝 LƯU Ý

1. **Development**: Luôn chạy đúng port cho domain muốn test
2. **Production**: Đảm bảo DNS trỏ đúng về server
3. **Database**: Mỗi domain cần migration riêng
4. **Environment**: Check NODE_ENV trước khi deploy
5. **Caching**: Prisma clients được cache, restart để clear

## 🔐 BẢO MẬT

- ✅ Database credentials được bảo vệ trong .env
- ✅ Security headers đã được cấu hình
- ✅ CORS và CSP ready
- ✅ No sensitive data in logs (production)

## 📚 TÀI LIỆU THAM KHẢO

- `lib/domain-config.ts` - Domain configuration
- `middleware.ts` - Domain detection logic
- `lib/database.ts` - Database connection management
- `.env.example` - Environment variables template

## ✨ BEST PRACTICES

1. **Luôn sử dụng `getPrisma()`** trong server components
2. **Không hardcode domain** trong code
3. **Test trên nhiều ports** trước khi deploy
4. **Backup database** trước khi migration
5. **Monitor logs** trong production

---

**Hệ thống đã sẵn sàng cho cả Development và Production!** 🚀

## 🎉 TÓM TẮT

✅ **12 files** đã được tạo mới hoặc cập nhật  
✅ **5 domains** được cấu hình đầy đủ  
✅ **Port-based routing** cho development (3000-3004)  
✅ **Domain-based routing** cho production  
✅ **Automatic database switching** theo domain  
✅ **SEO-ready** với domain-specific metadata  
✅ **Type-safe** với TypeScript  
✅ **Full documentation** với examples  

### Quick Start Development

```bash
# Clone & install
git clone <repo>
cd kataseo
bun install

# Setup environment
cp .env.example .env

# Chạy domain cụ thể
bun run dev:tazaskin   # Port 3001

# Truy cập
http://localhost:3001
```

### Kiểm tra hoạt động

1. Chạy `bun run dev:tazaskin` (port 3001)
2. Mở browser tại `http://localhost:3001`
3. Check console logs để thấy domain detection: `tazaskinclinic.com`
4. Database tự động connect tới `tazaskinclinic` database

**Chúc mừng! Hệ thống multi-domain đã sẵn sàng!** 🎊
