# 🚀 Next.js 16 Migration: middleware.ts → proxy.ts

## ✅ Đã hoàn thành

Migration từ `middleware.ts` sang `proxy.ts` theo chuẩn Next.js 16+.

---

## 📋 Các thay đổi

### 1. **Xóa file deprecated**
- ❌ **Deleted:** `middleware.ts`
- ✅ **Updated:** `proxy.ts` (đã merge tất cả logic)

### 2. **proxy.ts - Features**

```typescript
// ✅ Import domain config
import { getDomainConfig } from './lib/domain-config';

// ✅ Authentication & Authorization
- Admin routes protection
- Role-based access control (admin/manager/editor)
- Automatic redirect to login

// ✅ Multi-domain detection
- getDomainConfig(hostname)
- Headers: x-hostname, x-domain, x-site-name

// ✅ Security headers
- X-Frame-Options
- X-Content-Type-Options
- Referrer-Policy
```

### 3. **Scripts đã thêm**

```json
{
  "dev": "./scripts/dev-multi-domain.sh",      // Interactive menu
  "dev:tazagroup": "... -p 3000",              // Port 3000
  "dev:tazaskin": "... -p 3001",               // Port 3001
  "dev:timona": "... -p 3002",                 // Port 3002
  "dev:hderma": "... -p 3003",                 // Port 3003
  "dev:elasome": "... -p 3004",                // Port 3004
  "dev:all": "./scripts/dev-multi-domain.sh",  // Run all domains
  "verify": "./scripts/check-migration.sh"     // Verify migration
}
```

### 4. **.gitignore updated**

```gitignore
# deprecated files (Next.js 16+)
middleware.ts
middleware.js
```

---

## 🎯 Cách sử dụng

### **Option 1: Interactive Menu (Khuyến nghị)**
```bash
bun run dev
```

Menu sẽ hiện:
```
================================
  Multi-Domain Development
================================

Chọn domain để dev:

  1) TazaGroup      - http://localhost:3000 (tazagroup.vn)
  2) TazaSkin       - http://localhost:3001 (tazaskinclinic.com)
  3) Timona         - http://localhost:3002 (timona.edu.vn)
  4) HDerma         - http://localhost:3003 (hderma.vn)
  5) Elasome        - http://localhost:3004 (elasome.com)
  6) All domains    - Run all domains simultaneously
  0) Exit

Nhập lựa chọn [0-6]:
```

### **Option 2: Chạy domain cụ thể**
```bash
bun run dev:tazagroup  # Port 3000
bun run dev:tazaskin   # Port 3001
bun run dev:timona     # Port 3002
bun run dev:hderma     # Port 3003
bun run dev:elasome    # Port 3004
```

### **Option 3: Verify migration**
```bash
bun run verify
```

Output:
```
========================================
  Next.js 16 Migration Verification
========================================

1. Checking middleware.ts is deleted... PASSED
2. Checking proxy.ts exists... PASSED
3. Checking proxy.ts imports getDomainConfig... PASSED
4. Checking proxy.ts exports proxy function... PASSED
5. Checking .gitignore blocks middleware.ts... PASSED
6. Checking lib/domain-config.ts exists... PASSED
7. Checking for Next.js cache... PASSED

========================================
✅ All checks passed!
   Ready to run: bun run dev
========================================
```

---

## 🔧 Troubleshooting

### **Vẫn thấy lỗi "middleware" file convention is deprecated?**

1. **Xóa cache hoàn toàn:**
```bash
rm -rf .next .turbo node_modules/.cache
```

2. **Verify không còn middleware.ts:**
```bash
bun run verify
```

3. **Restart terminal và chạy lại:**
```bash
bun run dev
```

### **Lỗi "Both middleware file and proxy file are detected"?**

Nghĩa là vẫn còn `middleware.ts`:

```bash
# Force delete
rm -f middleware.ts middleware.js

# Clear cache
rm -rf .next .turbo

# Verify
bun run verify
```

---

## 📁 Files đã tạo/cập nhật

### **Đã tạo:**
1. `scripts/dev-multi-domain.sh` - Interactive dev menu
2. `scripts/check-migration.sh` - Migration verification
3. `scripts/verify-and-run.sh` - Verify + run dev server
4. `NEXT16_MIGRATION.md` - Tài liệu này

### **Đã cập nhật:**
1. `proxy.ts` - Merged middleware logic + domain config
2. `package.json` - Added new scripts
3. `.gitignore` - Block middleware.ts

### **Đã xóa:**
1. `middleware.ts` - Deprecated file

---

## 🎓 Technical Details

### **proxy.ts Structure:**

```typescript
// 1. Imports
import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getDomainConfig } from './lib/domain-config';

// 2. Helper: Get restricted routes per role
function getRestrictedRoutes(role: string): string[]

// 3. Main proxy function
export async function proxy(request: NextRequest) {
  // Authentication check
  const token = await getToken({ req: request });
  
  // Role-based access control
  if (isAdminRoute && !allowedRoles.includes(userRole)) {
    return redirect('/auth/unauthorized');
  }
  
  // Multi-domain detection
  const config = getDomainConfig(hostname);
  
  // Set headers
  requestHeaders.set('x-hostname', hostname);
  requestHeaders.set('x-domain', config.domain);
  requestHeaders.set('x-site-name', config.siteName);
  
  return NextResponse.next({ request: { headers } });
}

// 4. Matcher config
export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|...).*)',]
};
```

### **Domain Detection Flow:**

```
Request
  ↓
proxy(request)
  ↓
getDomainConfig(hostname)
  ↓
Check port mapping (3000→tazagroup.vn, 3001→tazaskin, ...)
  ↓
Return DomainConfig
  ↓
Set headers (x-domain, x-hostname, x-site-name)
  ↓
Continue to App
```

---

## ✨ Benefits

- ✅ **Next.js 16 compatible** - No more deprecation warnings
- ✅ **Multi-domain support** - 5 domains with port-based routing
- ✅ **Authentication** - Admin routes protection
- ✅ **Role-based access** - Admin/Manager/Editor permissions
- ✅ **Development workflow** - Interactive menu cho easy switching
- ✅ **Production ready** - Works with Nginx reverse proxy
- ✅ **Type-safe** - Full TypeScript support
- ✅ **Verified** - Automated verification script

---

## 🚀 Next Steps

1. **Test local development:**
```bash
bun run dev
# Choose option 1-5 to test each domain
```

2. **Test authentication:**
```bash
# Access http://localhost:3000/admin
# Should redirect to /auth/login
```

3. **Test multi-domain:**
```bash
# Run all domains simultaneously
bun run dev:all
```

4. **Deploy to production:**
```bash
# See DEPLOYMENT_GUIDE.md
# See DEPLOYMENT_PER_DOMAIN.md
```

---

**Status:** ✅ Migration hoàn tất - Ready for development & deployment!
