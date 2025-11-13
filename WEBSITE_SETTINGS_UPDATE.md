# Cập Nhật Website Settings - Header & Footer

## Tổng Quan
Đã triển khai tính năng quản lý Website Settings cho phép tùy chỉnh header, footer, logo, menu và kiểm soát hiển thị header/footer cho từng trang.

## Thay Đổi Database

### 1. Model WebsiteSettings (Mới)
```prisma
model WebsiteSettings {
  id              String   @id @default(uuid())
  domain          String   @unique
  logo            String?
  logoAlt         String?
  headerHtml      String?  @db.Text
  navigationMenu  Json?    // Menu items động
  footerHtml      String?  @db.Text
  footerText      String?
  socialLinks     Json?    // Social media links
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
}
```

### 2. Cập Nhật Page & Post Models
Thêm 2 fields mới:
- `showHeader Boolean @default(true)` - Kiểm soát hiển thị header
- `showFooter Boolean @default(true)` - Kiểm soát hiển thị footer

## File Mới

### 1. API Route
**app/api/website-settings/route.ts**
- GET: Lấy settings theo domain
- POST: Cập nhật settings (upsert)

### 2. Admin Page
**app/admin/website-settings/page.tsx**
- Form quản lý logo, navigation menu, footer, social links
- UI mobile-first với shadcn components
- Drag & drop reorder cho menu items
- Real-time preview

### 3. Components
**components/page-layout-wrapper.tsx**
- Wrapper component cho conditional render header/footer
- Props: showHeader, showFooter

### 4. Seed Data
**prisma/seed-website-settings.ts**
- Seed navigation menu như hình (9 items)
- Logo placeholder
- Social links (Facebook, Instagram, YouTube)

## File Đã Cập Nhật

### 1. components/header.tsx
- Load navigation menu từ WebsiteSettings API
- Render logo động
- Menu items từ database thay vì hardcode
- Client component với useEffect

### 2. components/footer.tsx
- Load footer text & social links từ WebsiteSettings
- Hỗ trợ custom footerHtml
- Icon mapping cho social platforms
- Client component

### 3. app/(public)/[slug]/page.tsx
- Sử dụng PageLayoutWrapper
- Pass showHeader/showFooter props từ page/post data
- Conditional rendering cho từng trang

### 4. app/admin/content/[id]/page.tsx
- Thêm 2 checkboxes: "Hiển thị Header" và "Hiển thị Footer"
- Section "Tùy chọn hiển thị" với muted background
- Save/load showHeader, showFooter vào database

## Migration
```bash
bunx prisma migrate dev --name add_website_settings
bun prisma/seed-website-settings.ts
```

## Tính Năng

### Admin
1. **Quản lý Website Settings** (`/admin/website-settings`)
   - Cấu hình logo (URL + Alt text)
   - Quản lý navigation menu (thêm/xóa/sắp xếp)
   - Tùy chỉnh footer text
   - Quản lý social links

2. **Content Editor** (`/admin/content/[id]`)
   - Checkbox "Hiển thị Header"
   - Checkbox "Hiển thị Footer"
   - Áp dụng cho cả Page và Post

### Frontend
1. **Dynamic Header**
   - Logo từ WebsiteSettings
   - Navigation menu từ database
   - Responsive mobile menu

2. **Dynamic Footer**
   - Custom footer text
   - Social links động
   - Optional custom HTML

3. **Conditional Layout**
   - Trang có thể ẩn header/footer
   - Phù hợp cho landing pages
   - Kiểm soát từng trang riêng biệt

## Navigation Menu Mẫu
1. Về InnerBright
2. NLP
3. Time Line Therapy®
4. Đào tạo doanh nghiệp
5. Khái vận cá nhân
6. Khoá học
7. Bộ thẻ NLP
8. Thư viện
9. Liên hệ

## Kiến Trúc
- **Clean Architecture**: Separation of concerns giữa settings, components, layouts
- **Performance**: Client-side caching với useEffect, single API call
- **DX**: Type-safe với TypeScript interfaces
- **UX**: Mobile-first responsive design, loading states, toast notifications

## Best Practices Tuân Thủ
✅ Code Principal Engineer  
✅ Clean Architecture  
✅ Mobile First + Responsive  
✅ shadcn UI components  
✅ Giao diện tiếng Việt  
✅ Không testing (theo yêu cầu)  
✅ Không git (theo yêu cầu)  

## Sử Dụng

### 1. Cấu hình Website Settings
```
1. Truy cập /admin/website-settings
2. Upload logo hoặc nhập URL
3. Thêm/chỉnh sửa menu items
4. Cấu hình social links
5. Nhập footer text
6. Lưu
```

### 2. Tạo Landing Page không Header/Footer
```
1. Tạo page mới tại /admin/content/new?type=page
2. Bỏ chọn "Hiển thị Header"
3. Bỏ chọn "Hiển thị Footer"
4. Lưu
```

### 3. Tùy chỉnh Menu
```
1. Vào /admin/website-settings
2. Click "Thêm Menu"
3. Nhập Label và URL
4. Drag để sắp xếp thứ tự
5. Lưu cài đặt
```

## Kết Quả
- ✅ Header động với menu từ database
- ✅ Footer tùy chỉnh với social links
- ✅ Kiểm soát header/footer từng trang
- ✅ Admin UI hoàn chỉnh
- ✅ Mobile-first responsive
- ✅ Type-safe TypeScript
