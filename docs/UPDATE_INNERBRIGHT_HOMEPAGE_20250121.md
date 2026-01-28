# Cập nhật trang chủ innerbright.vn

## Ngày: 21/11/2025

## Thay đổi

### 1. Cấu hình database
- ✅ Đã cập nhật `WebsiteSettings` cho domain `innerbright.vn`
- ✅ Thiết lập `homeRedirect = '/innerbright'`
- ✅ Tự động redirect khi truy cập https://innerbright.vn

### 2. Cấu trúc database
```sql
UPDATE "WebsiteSettings" 
SET "homeRedirect" = '/innerbright',
    "siteName" = 'InnerBright Training & Coaching',
    "metaTitle" = 'InnerBright - Đào tạo NLP & Coaching chuyên nghiệp'
WHERE domain = 'innerbright.vn';
```

### 3. Luồng hoạt động
```
1. User truy cập: https://innerbright.vn/
   ↓
2. Middleware detect domain: innerbright.vn
   ↓
3. app/(public)/page.tsx load settings từ database
   ↓
4. Kiểm tra websiteSettings.homeRedirect
   ↓
5. Nếu có homeRedirect → redirect('/innerbright')
   ↓
6. User được redirect sang: https://innerbright.vn/innerbright
```

### 4. Files liên quan

#### `/prisma/seed.ts`
- Thêm section tạo settings cho innerbright.vn
- Đảm bảo khi chạy seed sẽ tự động tạo cấu hình

#### `/scripts/set-innerbright-homepage.ts` (NEW)
- Script độc lập để cập nhật homepage redirect
- Có thể chạy bất cứ lúc nào: 
  ```bash
  export $(cat .env.innerbright | grep DATABASE_URL | xargs)
  bun run scripts/set-innerbright-homepage.ts
  ```

#### `/app/(public)/page.tsx`
- Đã có sẵn logic xử lý homeRedirect (từ lần update trước)
- Lines 35-38: Kiểm tra và redirect

```typescript
if (websiteSettings?.homeRedirect && websiteSettings.homeRedirect.trim() !== '') {
  console.log('[Homepage] Redirecting to:', websiteSettings.homeRedirect);
  redirect(websiteSettings.homeRedirect);
}
```

### 5. Kết quả

✅ **Đã hoàn thành:** Domain innerbright.vn giờ sẽ tự động redirect sang `/innerbright`

📝 **Console logs khi truy cập:**
```
[Homepage] Domain: innerbright.vn
[Homepage] Website Settings: { homeRedirect: '/innerbright', ... }
[Homepage] Home Redirect: /innerbright
[Homepage] Redirecting to: /innerbright
```

### 6. Testing

**Test trên production:**
1. Truy cập: https://innerbright.vn
2. Sẽ tự động redirect sang: https://innerbright.vn/innerbright
3. Trang "Về InnerBright" sẽ hiển thị

**Kiểm tra database:**
```bash
# Connect to innerbright database
export $(cat .env.innerbright | grep DATABASE_URL | xargs)

# Query settings
bun prisma studio
# Hoặc check trong admin panel tại /admin/website-settings
```

### 7. Lưu ý

- ⚠️ Redirect chỉ áp dụng cho homepage (/)
- ⚠️ Các route khác vẫn hoạt động bình thường
- ⚠️ Nếu muốn tắt redirect, set `homeRedirect = null` hoặc `''`
- ⚠️ Priority: homeRedirect > homePageType/homePageId > default homepage

### 8. Admin Panel

Có thể thay đổi homepage redirect qua admin panel:
1. Truy cập: /admin/website-settings
2. Tìm field "Home Redirect URL"
3. Nhập: `/innerbright` hoặc bất kỳ URL nào
4. Lưu lại

## Triển khai

```bash
# 1. Pull code mới nhất
git pull origin webseo_dev3_alldomain

# 2. Chạy script cập nhật (nếu chưa có trong DB)
export $(cat .env.innerbright | grep DATABASE_URL | xargs)
bun run scripts/set-innerbright-homepage.ts

# 3. Restart server
# (Docker hoặc PM2 tùy cấu hình)
```

## Hoàn thành ✅

Domain **innerbright.vn** giờ đã được cấu hình redirect trang chủ sang **/innerbright**
