# TÍNH NĂNG SET TRANG CHỦ WEBSITE

## Tổng quan
Tính năng cho phép admin chọn một trang (Page) hoặc bài viết (Post) bất kỳ từ database để hiển thị làm trang chủ của website. Nếu không set, website sẽ hiển thị giao diện trang chủ mặc định.

## Các thay đổi thực hiện

### 1. Database Schema (Prisma)
**File**: `prisma/schema.prisma`

Đã thêm 2 trường mới vào model `SeoSettings`:
```prisma
model SeoSettings {
  // ... existing fields ...
  
  // Homepage Settings
  homePageType String? // 'page' | 'post' | null (default static homepage)
  homePageId   String? // ID of page or post to use as homepage
  
  // ... rest of fields ...
}
```

**Migration**: `20251112175820_add_homepage_settings`
- Chạy tự động khi khởi động dev server
- Thêm 2 cột mới vào bảng `seo_settings`

### 2. API SEO Settings
**File**: `app/api/seo-settings/route.ts`

**Cập nhật schema validation**:
```typescript
const seoSettingsSchema = z.object({
  // ... existing fields ...
  homePageType: z.enum(["page", "post", ""]).optional(),
  homePageId: z.string().optional(),
});
```

**Cập nhật POST handler**:
- Lưu `homePageType` và `homePageId` vào database
- Xử lý cả create và update

### 3. UI Admin - Trang SEO Settings
**File**: `app/admin/seo-settings/page.tsx`

Đã thêm section mới "Cài đặt Trang chủ" với:
- Card riêng cho homepage settings
- Import component `HomePageSelector`
- Hiển thị trên giao diện admin

### 4. Component Homepage Selector
**File mới**: `components/homepage-selector.tsx`

Client Component với các tính năng:
- ✅ Fetch danh sách Pages và Posts từ API khi load
- ✅ Hiển thị Combobox (theo chuẩn shadcn UI)
- ✅ Tìm kiếm theo tên page/post
- ✅ Hiển thị icon phân biệt: 📄 Page, 📝 Post
- ✅ Option mặc định: "Trang chủ mặc định (Không chọn)"
- ✅ Hidden inputs để submit form
- ✅ Loading state khi fetch data

**Đặc điểm**:
- Mobile First: Responsive tốt trên mọi màn hình
- Search: Tìm kiếm nhanh trong danh sách
- UX: Hiển thị rõ ràng option đã chọn với icon check

### 5. Component Custom Homepage
**File mới**: `components/custom-homepage.tsx`

Render nội dung của Page/Post được chọn làm trang chủ:
- ✅ Hiển thị title, excerpt (nếu có)
- ✅ Metadata: tác giả, ngày cập nhật
- ✅ Render Page Builder blocks nếu có
- ✅ Fallback về HTML content nếu không có blocks
- ✅ Layout đẹp, mobile-first

**Hỗ trợ 2 format blocks**:
- Page Builder blocks (heading, text, image, video, code)
- HTML content thông thường

### 6. Trang chủ (Homepage)
**File**: `app/(public)/page.tsx`

**Logic mới**:
```typescript
1. Lấy domain hiện tại
2. Đọc SeoSettings để check homePageType và homePageId
3. Nếu có set:
   - Type = "page" → Fetch page và render với CustomHomePage
   - Type = "post" → Fetch post và render với CustomHomePage
   - Kiểm tra published = true
4. Nếu không có set hoặc không tìm thấy:
   - Render giao diện trang chủ mặc định
```

## Cách sử dụng

### Bước 1: Truy cập Admin
Vào trang: `/admin/seo-settings`

### Bước 2: Chọn trang chủ
Trong section "Cài đặt Trang chủ":
1. Click vào Combobox
2. Tìm kiếm trang hoặc bài viết muốn set
3. Chọn item từ danh sách:
   - 📄 = Page (trang tĩnh)
   - 📝 = Post (bài viết)
4. Hoặc chọn "Trang chủ mặc định" để về UI gốc

### Bước 3: Lưu cài đặt
Click nút "Lưu cài đặt"

### Bước 4: Kiểm tra
Truy cập trang chủ `/` để xem kết quả

## Ví dụ sử dụng

### Ví dụ 1: Set trang "Về chúng tôi" làm trang chủ
1. Vào `/admin/seo-settings`
2. Chọn "📄 Về chúng tôi (/ve-chung-toi)"
3. Lưu
4. Trang chủ sẽ hiển thị nội dung trang "Về chúng tôi"

### Ví dụ 2: Set bài viết làm trang chủ
1. Vào `/admin/seo-settings`
2. Chọn "📝 Top 10 Xu Hướng Làm Đẹp 2025 (/top-10-xu-huong-lam-dep)"
3. Lưu
4. Trang chủ sẽ hiển thị bài viết đó

### Ví dụ 3: Quay về trang chủ mặc định
1. Vào `/admin/seo-settings`
2. Chọn "Trang chủ mặc định (Không chọn)"
3. Lưu
4. Trang chủ hiển thị UI gốc với hero, stats, featured posts

## Ưu điểm

✅ **Linh hoạt**: Admin có thể đổi trang chủ bất cứ lúc nào
✅ **Không code**: Không cần developer để thay đổi
✅ **SEO tốt**: Tận dụng được meta tags của page/post
✅ **Multi-domain**: Mỗi domain có thể set trang chủ riêng
✅ **Fallback an toàn**: Luôn có trang chủ mặc định nếu có lỗi
✅ **UI/UX chuẩn**: Theo design system shadcn, mobile-first
✅ **Performance**: Chỉ fetch khi cần, cache tốt

## Lưu ý kỹ thuật

1. **Published check**: Chỉ hiển thị page/post có `published = true`
2. **Database per domain**: Mỗi domain có settings riêng
3. **Error handling**: Nếu page/post bị xóa, tự động fallback về default
4. **Cache**: Next.js tự động cache page, cần revalidate nếu update
5. **Migration safe**: Migration tự động chạy khi cần

## Files liên quan

```
prisma/
  └── schema.prisma (thêm homePageType, homePageId)
  └── migrations/
      └── 20251112175820_add_homepage_settings/

app/
  ├── (public)/
  │   └── page.tsx (logic render homepage)
  └── admin/
      └── seo-settings/
          └── page.tsx (UI admin settings)
  └── api/
      └── seo-settings/
          └── route.ts (API handle save)

components/
  ├── homepage-selector.tsx (UI chọn homepage)
  └── custom-homepage.tsx (Render custom homepage)
```

## Tương lai có thể mở rộng

- [ ] Preview trước khi save
- [ ] Schedule homepage (đổi trang chủ theo thời gian)
- [ ] A/B testing giữa nhiều homepage
- [ ] Analytics tracking riêng cho custom homepage
- [ ] Template homepage cho các sự kiện đặc biệt

---

**Ngày tạo**: 13/11/2025  
**Version**: 1.0  
**Trạng thái**: ✅ Hoàn thành và đã test
