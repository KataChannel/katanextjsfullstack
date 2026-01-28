# Bổ sung tính năng Homepage Redirect Dynamic

## Tổng quan
Đã bổ sung tính năng redirect động khi truy cập trang chủ vào Website Settings, cho phép admin cấu hình để tự động chuyển hướng người dùng từ trang chủ sang một URL khác (ví dụ: `/innerbright`, `/khoa-hoc`).

## Các thay đổi

### 1. Database Schema (Prisma)
**File:** `prisma/schema.prisma`

Thêm trường mới vào model `WebsiteSettings`:
```prisma
homeRedirect String? // URL to redirect when accessing homepage (e.g., '/innerbright')
```

**Migration:** 
- Tạo migration: `20251119095819_add_home_redirect`
- Trường `homeRedirect` là optional (nullable)

### 2. Website Settings Form
**File:** `components/website-settings-form.tsx`

Thêm input field mới trong tab "SEO":
- **Label:** Homepage Redirect
- **Input:** Text field với placeholder `/innerbright`
- **Description:** "URL để redirect khi truy cập trang chủ (VD: /innerbright, /khoa-hoc). Để trống nếu không cần redirect."
- **Vị trí:** Sau field "Homepage ID", trước "Robots.txt"

### 3. Homepage Logic
**File:** `app/(public)/page.tsx`

Thêm logic kiểm tra và redirect:
```typescript
// Import redirect từ next/navigation
import { redirect } from "next/navigation";

// Thêm homeRedirect vào select
const websiteSettings = await prisma.websiteSettings.findUnique({
  where: { domain: domain || 'tazagroup.vn' },
  select: {
    homePageType: true,
    homePageId: true,
    homeRedirect: true, // ✅ Thêm field mới
  },
});

// Kiểm tra và redirect nếu có cấu hình
if (websiteSettings?.homeRedirect) {
  redirect(websiteSettings.homeRedirect);
}
```

## Cách sử dụng

1. **Vào Admin Panel:** `/admin/website-settings`
2. **Chọn tab "SEO"**
3. **Tìm field "Homepage Redirect"**
4. **Nhập URL cần redirect:** Ví dụ: `/innerbright` hoặc `/khoa-hoc`
5. **Lưu cài đặt**

Khi người dùng truy cập trang chủ (`/`), hệ thống sẽ tự động redirect họ đến URL đã cấu hình.

## Ưu điểm

- ✅ **Linh hoạt:** Admin có thể thay đổi redirect bất cứ lúc nào
- ✅ **Không cần code:** Không cần deploy lại khi thay đổi redirect
- ✅ **Multi-domain:** Mỗi domain có thể có redirect riêng
- ✅ **Optional:** Để trống nếu muốn giữ homepage mặc định
- ✅ **Clean Architecture:** Tách biệt logic redirect khỏi business logic

## Ví dụ sử dụng

**Trường hợp 1:** Website InnerBright muốn redirect trang chủ về trang "Về InnerBright"
- Vào Website Settings
- Nhập `homeRedirect`: `/innerbright`
- Lưu
- Kết quả: Người dùng truy cập `innerbright.vn` → Tự động chuyển sang `innerbright.vn/innerbright`

**Trường hợp 2:** Website muốn giữ homepage mặc định
- Để trống field `homeRedirect` hoặc xóa giá trị hiện tại
- Lưu
- Kết quả: Hiển thị homepage mặc định với carousel, bài viết, testimonials,...

## Technical Stack

- **Next.js 15:** Server Components với async/await
- **Prisma ORM:** Type-safe database access
- **PostgreSQL:** Database
- **TypeScript:** Type safety
- **Shadcn UI:** Component library (Form, Input, Label)

## Ngày hoàn thành
19/11/2025
