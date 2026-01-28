# Cập nhật Menu System - Multi Domain

## 🎯 Mục tiêu
Cập nhật hệ thống menu trong database cho tất cả domains với cấu trúc menu admin hiện tại và menu public header.

## 📋 Menu Structure

### InnerBright Admin Menu - 11 items
```
1. Dashboard → /admin
2. Quản lý Nội dung → /admin/content
3. Page Builder → /admin/page-builder
4. Block Templates → /admin/block-templates
5. Thư viện Media → /admin/media
6. Analytics → /admin/analytics
7. Cài đặt SEO → /admin/seo-settings
8. Website Settings → /admin/website-settings
9. Quản lý Menu → /admin/menus
10. Quyền Menu → /admin/menu-permissions
11. Người dùng → /admin/users
```

### InnerBright Public Menu (Header) - 9 items
```
1. Về InnerBright → /innerbright
2. NLP → /nlp
3. Time Line Therapy® → /time-line-therapy
4. Đào tạo doanh nghiệp → /dao-tao-doanh-nghiep
5. Khai vấn cá nhân → /khai-van-ca-nhan
6. Khoá học → /khoa-hoc
7. Bộ thẻ NLP → /bo-the-nlp
8. Thư viện → /thu-vien
9. Liên hệ → /lien-he
```

### TazaGroup (tazagroup.vn) - 7 items
```
1. Trang chủ → /
2. Giới thiệu → /gioi-thieu
3. Dịch vụ → /dich-vu
4. Sản phẩm → /san-pham
5. Bảng giá → /bang-gia
6. Tin tức → /tin-tuc
7. Liên hệ → /lien-he
```

### TazaSkin (tazaskinclinic.com) - 7 items
```
1. Trang chủ → /
2. Về chúng tôi → /ve-chung-toi
3. Dịch vụ → /dich-vu
4. Công nghệ → /cong-nghe
5. Chuyên gia → /chuyen-gia
6. Blog → /blog
7. Đặt lịch → /dat-lich
```

### Timona (timona.edu.vn) - 7 items
```
1. Trang chủ → /
2. Giới thiệu → /gioi-thieu
3. Khóa học → /khoa-hoc
4. Giảng viên → /giang-vien
5. Thư viện → /thu-vien
6. Tin tức → /tin-tuc
7. Liên hệ → /lien-he
```

### HDerma (hderma.vn) - 7 items
```
1. Trang chủ → /
2. Về HDerma → /ve-hderma
3. Liệu trình → /lieu-trinh
4. Sản phẩm → /san-pham
5. Khuyến mãi → /khuyen-mai
6. Câu chuyện → /cau-chuyen
7. Liên hệ → /lien-he
```

### Elasome (elasome.com) - 7 items
```
1. Trang chủ → /
2. Về Elasome → /ve-elasome
3. Sản phẩm → /san-pham
4. Công nghệ → /cong-nghe
5. Hướng dẫn → /huong-dan
6. Đại lý → /dai-ly
7. Liên hệ → /lien-he
```

## 📦 Files Modified

### 1. API Route - Multi-domain Support
**File**: `app/api/menus/route.ts`
- ✅ Updated to use `getPrisma(domain)` thay vì `prisma`
- ✅ Lấy domain từ `x-domain` header
- ✅ Support menu permissions filtering

### 2. Seed Scripts
**File**: `scripts/seed-all-menus.ts`
- ✅ Seed menu cho tất cả 6 domains
- ✅ Tự động xóa menu cũ và tạo mới
- ✅ Console log chi tiết

**File**: `scripts/seed-innerbright-menus.ts`
- ✅ Seed riêng cho InnerBright domain
- ✅ 9 menu items theo design

### 3. Admin Menu Seed Script
**File**: `scripts/seed-admin-menus.ts`
- ✅ Seed admin menu cho InnerBright
- ✅ 11 admin menu items từ admin-sidebar.tsx
- ✅ Order từ 100+ để phân biệt với public menus
- ✅ Identified bằng URL bắt đầu `/admin`

### 4. Show Menu Script
**File**: `scripts/show-menus.ts`
- ✅ Hiển thị menu structure từ database
- ✅ Phân loại public và admin menus
- ✅ Show icons, status, URLs

### 5. Package.json Scripts
**Added**:
```json
"seed:menus": "bun scripts/seed-all-menus.ts"
"seed:menus:innerbright": "bun scripts/seed-innerbright-menus.ts"
"seed:admin-menus": "bun scripts/seed-admin-menus.ts"
```

## 🚀 Usage

### Seed tất cả public menus (all domains)
```bash
bun run seed:menus
```

### Seed public menus cho InnerBright
```bash
bun run seed:menus:innerbright
```

### Seed admin menus cho InnerBright
```bash
bun run seed:admin-menus
```

### Show menu structure
```bash
bun scripts/show-menus.ts
```

### Hoặc chạy trực tiếp
```bash
bun scripts/seed-all-menus.ts
bun scripts/seed-innerbright-menus.ts
bun scripts/seed-admin-menus.ts
bun scripts/show-menus.ts
```

## 📊 Kết quả

### Tổng quan
- ✅ **6 domains** đã được cập nhật menu
- ✅ **44 menu items** tổng cộng
- ✅ Mỗi menu có icon (Lucide React)
- ✅ Sorted theo order field
- ✅ Published by default

### Per Domain
| Domain | Public Menus | Admin Menus | Total | Status |
|--------|--------------|-------------|-------|--------|
| innerbright.vn | 9 | 11 | 20 | ✅ |
| tazagroup.vn | 7 | - | 7 | ✅ |
| tazaskinclinic.com | 7 | - | 7 | ✅ |
| timona.edu.vn | 7 | - | 7 | ✅ |
| hderma.vn | 7 | - | 7 | ✅ |
| elasome.com | 7 | - | 7 | ✅ |

**Note**: Admin menus chỉ được seed cho InnerBright. Các domain khác có thể add sau nếu cần.

## 🎨 Menu Icons (Lucide React)

Các icon được sử dụng:
- `Home` - Trang chủ
- `Brain` - NLP
- `Clock` - Time Line Therapy
- `Building` - Đào tạo doanh nghiệp
- `Users` - Người dùng/Khai vấn
- `GraduationCap` - Khóa học
- `CreditCard` - Bộ thẻ
- `Library` - Thư viện
- `Mail/Phone` - Liên hệ
- `Info` - Giới thiệu
- `Sparkles` - Dịch vụ
- `Package` - Sản phẩm
- `FileText` - Blog/Tin tức

## 🔧 Technical Details

### Menu Types & Identification

**Public Menus** (Header Navigation):
- URL không bắt đầu với `/admin`
- Order: 1-99
- Display: Header component
- Example: `/nlp`, `/khoa-hoc`, `/lien-he`

**Admin Menus** (Admin Sidebar):
- URL bắt đầu với `/admin`
- Order: 100+
- Display: Admin sidebar component
- Example: `/admin`, `/admin/content`, `/admin/users`

### Database Schema
```prisma
model Menu {
  id        String  @id @default(uuid())
  label     String
  url       String
  icon      String?
  order     Int     @default(0)
  published Boolean @default(true)
  parentId  String?
  
  parent   Menu?  @relation("MenuHierarchy")
  children Menu[] @relation("MenuHierarchy")
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Note**: Không có field `type` riêng. Admin vs Public được identify bằng URL pattern.

### Multi-Database Architecture
- Mỗi domain có database riêng
- `getPrisma(domain)` để kết nối đúng database
- Proxy middleware inject `x-domain` header
- API routes sử dụng domain từ header

## 📝 Next Steps

### 1. Tạo Pages cho Menu URLs
Cần tạo các page tương ứng với menu URLs:

**InnerBright**:
- [ ] `/innerbright` - ✅ Đã có (Page Builder)
- [ ] `/nlp`
- [ ] `/time-line-therapy`
- [ ] `/dao-tao-doanh-nghiep`
- [ ] `/khai-van-ca-nhan`
- [ ] `/khoa-hoc`
- [ ] `/bo-the-nlp`
- [ ] `/thu-vien`
- [ ] `/lien-he` - ✅ Đã có

**Các domain khác**: Tương tự cần tạo pages

### 2. Menu Permissions (Optional)
Nếu cần restrict menu theo user role:
```bash
# Admin panel: /admin/menu-permissions
```

### 3. Test Menu Display
```bash
# Test từng domain
http://localhost:3000  # TazaGroup
http://localhost:3001  # TazaSkin
http://localhost:3002  # Timona
http://localhost:3003  # HDerma
http://localhost:3004  # Elasome
http://localhost:3005  # InnerBright
```

### 4. Submenu Support (Future)
Schema đã support submenu qua `parentId`:
- Có thể tạo nested menu
- Dropdown menu trên header
- Tree structure trong admin

## ✅ Status

**COMPLETED** ✅
- [x] Update API route với multi-domain support
- [x] Tạo seed script cho tất cả domains
- [x] Seed menu data vào database
- [x] Add npm scripts
- [x] Test menu display trên InnerBright

**TODO** 📋
- [ ] Tạo pages cho các menu URLs
- [ ] Test menu trên tất cả domains
- [ ] Configure menu permissions nếu cần
- [ ] Add submenu nếu cần

## 📅 Date
16/11/2025
