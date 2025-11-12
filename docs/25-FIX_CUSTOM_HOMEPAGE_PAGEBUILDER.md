# Fix: Custom Homepage with Page Builder Not Displaying

## 🐛 Bug Report
**Issue**: Khi chọn page `/ve-innerbright` (sử dụng Page Builder với carousel) làm trang chủ, trang chủ `/` không hiển thị đúng - carousel không xuất hiện.

## 🔍 Root Cause Analysis

### 1. **Domain Extraction Issue**
- **Problem**: Trong `app/(public)/page.tsx`, code sử dụng `extractDomain(hostname)` để lấy domain
- **Result**: Khi chạy trên `localhost:3005`, hàm `extractDomain()` trả về `"localhost"` thay vì `"innerbright.vn"`
- **Impact**: Query đến sai database (localhost database thay vì innerbright.vn database)

### 2. **Wrong SEO Settings**
- Database `localhost` có SEO settings riêng, trỏ đến page "Dịch Vụ" (không có blocks)
- Database `innerbright.vn` có SEO settings đúng, trỏ đến page "Về InnerBright" (có carousel)

## ✅ Solution

### Fixed File: `app/(public)/page.tsx`

**Before:**
```typescript
const headersList = await headers();
const hostname = headersList.get("x-hostname") || "";
const domain = extractDomain(hostname); // ❌ Returns "localhost" for localhost:3005
```

**After:**
```typescript
const headersList = await headers();
const domain = headersList.get("x-domain") || ''; // ✅ Gets correct domain from proxy middleware
```

### Why This Works

1. **Proxy Middleware** (`proxy.ts`) already handles domain mapping:
   - Uses `getDomainConfig(hostname)` to map `localhost:3005` → `innerbright.vn`
   - Sets `x-domain` header với domain đã map

2. **Domain Config** (`lib/domain-config.ts`):
   ```typescript
   const portMap: Record<string, string> = {
     '3000': 'tazagroup.vn',
     '3001': 'tazaskinclinic.com',
     '3002': 'timona.edu.vn',
     '3003': 'hderma.vn',
     '3004': 'elasome.com',
     '3005': 'innerbright.vn', // ✅ Correct mapping
   };
   ```

3. **Result**: 
   - `localhost:3005` → `innerbright.vn`
   - Loads correct database
   - Gets correct SEO settings
   - Renders correct page with Page Builder carousel

## 🧪 Testing

### Test Script: `scripts/check-domains.ts`
```bash
bun scripts/check-domains.ts
```

**Output:**
```
Domain: innerbright.vn
  ✅ SEO Settings exist
    homePageType: page
    homePageId: 4a83da73-fdf0-467a-be5e-8906ee05c18c
    Page: Về InnerBright (/ve-innerbright)

Domain: localhost
  ✅ SEO Settings exist
    homePageType: page
    homePageId: 047f4dc7-2071-4081-9f2e-2c10cc1720cc
    Page: Dịch Vụ (/dich-vu)
```

### Verification
1. Start dev server: `PORT=3005 bun run next dev --port 3005`
2. Visit: `http://localhost:3005`
3. ✅ Homepage shows carousel from "Về InnerBright" page
4. ✅ Carousel auto-plays with 3 slides
5. ✅ Dots navigation works
6. ✅ Arrow controls work

## 📦 Related Files

### Modified:
- ✅ `app/(public)/page.tsx` - Use `x-domain` header instead of `extractDomain()`
- ✅ `components/custom-homepage.tsx` - Remove debug console.logs

### Created:
- ✅ `scripts/check-domains.ts` - Debug script to check SEO settings
- ✅ `scripts/check-homepage.ts` - Verify homepage configuration
- ✅ `scripts/set-homepage.ts` - Set homepage programmatically
- ✅ `public/images/innerbright/slide-1.jpg` - Carousel placeholder image
- ✅ `public/images/innerbright/slide-2.jpg` - Carousel placeholder image
- ✅ `public/images/innerbright/slide-3.jpg` - Carousel placeholder image

## 🎯 Key Learnings

1. **Always use proxy-provided headers** in multi-tenant apps
   - `x-domain` - Mapped domain name
   - `x-hostname` - Original hostname  
   - `x-site-name` - Site name

2. **Don't duplicate domain extraction logic**
   - Proxy middleware already handles it
   - Reuse via headers, don't re-implement

3. **Test with correct port mapping**
   - Each domain has assigned port (3000-3005)
   - Port determines which database to use

## 🚀 Status

✅ **FIXED** - Custom homepage with Page Builder carousel now displays correctly on public site.

## 📅 Date
13/11/2025
