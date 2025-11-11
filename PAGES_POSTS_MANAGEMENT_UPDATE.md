# CẬP NHẬT QUẢN LÝ NỘI DUNG - TRANG VÀ BÀI VIẾT

## Tổng Quan
Cập nhật admin pages-management và posts-management với đầy đủ chức năng editor: **content editor, SEO fields, metadata, excerpt** và giao diện tab tổ chức logic.

## Các Trang Chưa Được Tạo Trong Database

### 1. Trang Về Chúng Tôi (`/pages/ve-chung-toi`)
- **Slug:** `ve-chung-toi`
- **Trạng thái:** ✅ Đã seed vào database
- **Quản lý từ:** Admin panel `/admin/pages-management`
- **Công khai tại:** `/pages/ve-chung-toi`

### 2. Trang Dịch Vụ (`/pages/dich-vu`)
- **Slug:** `dich-vu`
- **Trạng thái:** ✅ Đã seed vào database
- **Quản lý từ:** Admin panel `/admin/pages-management`
- **Công khai tại:** `/pages/dich-vu`

### 3. Trang Liên Hệ (`/pages/lien-he`)
- **Slug:** `lien-he`
- **Trạng thái:** ✅ Đã seed vào database
- **Quản lý từ:** Admin panel `/admin/pages-management`
- **Công khai tại:** `/pages/lien-he` (cũng có `/lien-he` redirect)

## Các Nâng Cấp Chi Tiết

### 1. Pages Management (`/app/admin/pages-management/page.tsx`)

#### Trước:
- Chỉ hiển thị title, slug, publish status
- Form tạo/sửa chỉ có 2 fields: title, slug
- Không hỗ trợ content editor

#### Sau:
```
✅ Tabs Layout:
   - Tab 1: Thông tin chung
   - Tab 2: SEO
   
✅ Thông tin chung:
   - Tiêu đề (title)
   - URL Slug (slug)
   - Nội dung (content) - textarea
   
✅ SEO:
   - Meta Title (max 60 ký tự, counter)
   - Meta Description (max 160 ký tự, counter)
   - Meta Keywords (từ khóa phân cách dấu phẩy)
   
✅ Hành động:
   - Tạo trang mới
   - Sửa trang (load full data vào form)
   - Xóa trang
   - Publish/Unpublish
```

**FormData Structure:**
```typescript
{
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}
```

### 2. Posts Management (`/app/admin/posts-management/page.tsx`)

#### Trước:
- Chỉ hiển thị title, slug
- Form chỉ có title, slug
- Không hỗ trợ content/excerpt

#### Sau:
```
✅ Tabs Layout:
   - Tab 1: Thông tin chung
   - Tab 2: SEO
   
✅ Thông tin chung:
   - Tiêu đề (title)
   - URL Slug (slug)
   - Mô tả ngắn (excerpt) - textarea 2 rows
   - Nội dung (content) - textarea 4 rows
   
✅ SEO:
   - Meta Title (max 60 ký tự, counter)
   - Meta Description (max 160 ký tự, counter)
   - Meta Keywords (từ khóa phân cách dấu phẩy)
   
✅ Hành động:
   - Tạo bài viết mới
   - Sửa bài viết (load full data)
   - Xóa bài viết
   - Publish/Unpublish
```

**FormData Structure:**
```typescript
{
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  metaTitle: string;
  metaDescription: string;
  metaKeywords: string;
}
```

## Cải Tiến UX/UI

### 1. Dialog Layout
- **Before:** Nội dung không cuộn, có thể bị cut off
- **After:** 
  - Border-top separator trước buttons
  - Nút Hủy/Tạo ngang hàng, căn phải
  - Padding đồng nhất pt-4

### 2. Form Fields
- **Input validation:** maxLength cho meta fields
- **Character counters:** 
  - Meta Title: X/60
  - Meta Description: X/160
- **Placeholder text:** Hướng dẫn cụ thể cho mỗi field

### 3. Tab Navigation
- **Grid layout:** 2 columns (Thông tin chung | SEO)
- **Active indicator:** Shadcn UI triggerStyles
- **Content:** ScrollArea tích hợp trong tabs

## Database Integration

### API Endpoints (Existing)
```
GET/POST /api/pages
PUT /api/pages/[id]
DELETE /api/pages/[id]

GET/POST /api/posts
PUT /api/posts/[id]
DELETE /api/posts/[id]
```

### Form Handling
```typescript
// Create
POST /api/pages { title, slug, content, metaTitle, ... }

// Update
PUT /api/pages/[id] { title, slug, content, metaTitle, ... }

// Delete
DELETE /api/pages/[id]

// Toggle Publish
PUT /api/pages/[id] { published: !current }
```

## Kiến Trúc Tuân Thủ

### 1. Clean Architecture ✅
- Separation of concerns: UI logic / API calls
- Helper functions: `resetForm()`
- State management: Independent form data

### 2. Mobile First ✅
- Responsive grid: 1 col mobile → 2 cols tablet
- Touch-friendly buttons: size="sm"
- Flexible tab layout

### 3. Shadcn UI ✅
- Components: Dialog, Tabs, Button, Input, Label
- Consistent styling
- Dark mode support

### 4. Tiếng Việt ✅
- Tất cả labels, placeholders bằng tiếng Việt
- Error messages, toast notifications (khi implement)
- Ngữ cảnh phù hợp

## TypeScript Validation
```
✅ /app/admin/pages-management/page.tsx - No errors
✅ /app/admin/posts-management/page.tsx - No errors
```

## Workflow Quản Lý Nội Dung

### Tạo Trang Mới:
1. Vào `/admin/pages-management`
2. Click "Tạo trang mới"
3. Điền Tab "Thông tin chung":
   - Tiêu đề: "Bộ sưu tập"
   - Slug: "bo-suu-tap"
   - Nội dung: HTML/text
4. Điền Tab "SEO" (optional)
5. Click "Tạo"
6. Page xuất hiện trong danh sách (Draft)
7. Click "Hiển thị" để publish
8. Xem công khai tại `/pages/bo-suu-tap`

### Sửa Trang Hiện Có:
1. Vào `/admin/pages-management`
2. Click "Sửa" trên card trang
3. Form auto-fill tất cả fields
4. Chỉnh sửa nội dung
5. Click "Cập nhật"
6. Thay đổi save ngay

### Tương Tự cho Posts:
- `/admin/posts-management` → Tạo/sửa/xóa bài viết
- Hiển thị công khai tại `/posts/[slug]`
- Liệt kê tại `/posts` (blog index)

## Tiếp Theo (To-Do)

### 1. Tiptap Editor Integration (Optional)
- Thay textarea bằng full WYSIWYG editor
- Import `TiptapEditor` component
- Rich formatting: bold, italic, headings, lists

### 2. Featured Image Upload
- Media upload endpoint
- Image preview trước publish
- OG image automatic generation

### 3. Draft Auto-save
- Save progress mỗi 30 giây
- Warning khi leaving form unsaved
- Draft indicator

### 4. Publish Schedule
- Lên lịch publish tương lai
- Calendar picker
- Auto-publish job

### 5. Revision History
- Track all edits
- Restore previous versions
- View change log

## Lưu Ý Quan Trọng

1. **Slug Validation:**
   - API kiểm tra slug unique
   - Format: lowercase, hyphens
   - Ví dụ: `ve-chung-toi`, `dich-vu`

2. **Content Restrictions:**
   - Title: Required, min 1 char
   - Slug: Required, regex pattern
   - Meta fields: Optional (auto-fall-back)

3. **SEO Best Practices:**
   - Meta Title: 50-60 ký tự tối ưu
   - Meta Description: 155-160 ký tự
   - Keywords: 3-5 từ khóa chính

## File Changes Summary
```
✅ /app/admin/pages-management/page.tsx
   - Thêm Tabs layout
   - Thêm SEO tab
   - Thêm content field
   - Form data structure mở rộng
   - UI improvements

✅ /app/admin/posts-management/page.tsx
   - Thêm Tabs layout
   - Thêm SEO tab
   - Thêm content, excerpt fields
   - Form data structure mở rộng
   - UI improvements

✅ prisma/seed.ts
   - Sẵn có 3 pages (Về chúng tôi, Dịch vụ, Liên hệ)
   - Sẵn có metadata cho tất cả

✅ /app/api/pages/route.ts
   - Support tất cả fields
   - Validation đầy đủ

✅ /app/api/posts/route.ts
   - Support tất cả fields
   - Pagination support
```

---
**Ngày cập nhật:** 11 tháng 11, 2025
**Trạng thái:** ✅ Hoàn tất
**Tuân thủ:** rulepromt.txt ✅
