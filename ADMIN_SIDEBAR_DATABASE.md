# Admin Sidebar - Database Integration

**Date:** 17/11/2025
**Status:** ✅ Complete

## Objective

Cập nhật admin sidebar để lấy menu từ database thay vì hardcoded, cho phép quản lý menu admin qua giao diện `/admin/menus`.

## Changes

### 1. Updated Admin Sidebar Component

**File:** `components/admin-sidebar.tsx`

**Key Changes:**

1. **Added Icon Mapping:**
```tsx
const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  FileText,
  Layout,
  Image,
  Settings,
  BarChart3,
  Users,
  Menu: MenuIcon,
  Shield,
  Globe,
  Blocks,
  Palette,
};
```

2. **Dynamic Icon Loading:**
```tsx
const menuItems = useDefaultMenu ? defaultMenuItems : adminMenus.map(menu => ({
  title: menu.label,
  icon: menu.icon ? (iconMap[menu.icon] || LayoutDashboard) : LayoutDashboard,
  href: menu.url,
  exact: menu.url === '/admin'
}));
```

3. **Better Error Handling:**
- Console warning khi không có menu trong database
- Fallback to default menu nếu fetch fails
- Clear error messages

### 2. Updated API Endpoint

**File:** `app/api/admin/menus/route.ts`

**Added Position Filter:**
```tsx
const position = searchParams.get('position');

const menus = await prisma.menu.findMany({
  where: position ? { position: position as any } : undefined,
  orderBy: { order: 'asc' },
  include: {
    parent: true,
    children: true,
  },
});
```

**Usage:**
- `GET /api/admin/menus` - Lấy tất cả menu
- `GET /api/admin/menus?position=ADMIN` - Lấy menu admin sidebar
- `GET /api/admin/menus?position=HEADER` - Lấy menu header
- `GET /api/admin/menus?position=FOOTER` - Lấy menu footer

### 3. Created Admin Menu Seed Script

**File:** `scripts/seed-admin-menu.ts`

**Purpose:** Tạo menu admin cho innerbright.vn database

**Menu Items Created (11 items):**
1. Dashboard (`/admin`)
2. Quản lý Nội dung (`/admin/content`)
3. Pages V2 (`/admin/pages-v2`)
4. Block Templates (`/admin/block-templates`)
5. Thư viện Media (`/admin/media`)
6. Analytics (`/admin/analytics`)
7. Cài đặt SEO (`/admin/seo-settings`)
8. Website Settings (`/admin/website-settings`)
9. Quản lý Menu (`/admin/menus`)
10. Quyền Menu (`/admin/menu-permissions`)
11. Người dùng (`/admin/users`)

**Run Script:**
```bash
bun run scripts/seed-admin-menu.ts
```

### 4. Created Verification Script

**File:** `scripts/verify-admin-menu.ts`

**Purpose:** Kiểm tra menu admin đã được tạo đúng chưa

**Run Script:**
```bash
bun run scripts/verify-admin-menu.ts
```

**Output Example:**
```
🔍 Verifying Admin Menu for InnerBright...
📍 Domain: innerbright.vn

📊 Total Admin Menus: 11

1. Dashboard
   URL: /admin
   Icon: LayoutDashboard
   Order: 1
   Published: ✅
...
```

## Database Schema

```prisma
model Menu {
  id        String     @id @default(cuid())
  label     String
  url       String
  icon      String?
  order     Int        @default(0)
  published Boolean    @default(true)
  position  MenuPosition // HEADER, FOOTER, ADMIN, SIDEBAR
  parentId  String?
  parent    Menu?      @relation("MenuToMenu", fields: [parentId], references: [id])
  children  Menu[]     @relation("MenuToMenu")
  createdAt DateTime   @default(now())
  updatedAt DateTime   @updatedAt
}

enum MenuPosition {
  HEADER
  FOOTER
  ADMIN
  SIDEBAR
}
```

## Features

### ✅ Implemented

1. **Dynamic Menu Loading:**
   - Fetch từ database thay vì hardcoded
   - Auto-detect position (ADMIN)
   - Icon mapping từ string name

2. **Fallback Mechanism:**
   - Default menu nếu database empty
   - Error handling
   - Console warnings

3. **Icon Support:**
   - 11 icons được map
   - Extensible iconMap
   - Default fallback: LayoutDashboard

4. **Order Control:**
   - Menus sắp xếp theo `order` field
   - Có thể thay đổi thứ tự qua `/admin/menus`

5. **Publish Control:**
   - Chỉ hiển thị menu có `published: true`
   - Có thể ẩn/hiện menu qua UI

## Usage

### For Developers

**Seed Admin Menu (first time setup):**
```bash
bun run scripts/seed-admin-menu.ts
```

**Verify Menu:**
```bash
bun run scripts/verify-admin-menu.ts
```

**Update Menu:**
1. Go to `/admin/menus`
2. Select position: "Admin Sidebar"
3. Add/Edit/Delete menu items
4. Changes reflect immediately in sidebar

### For Users

**Manage Admin Menu:**
1. Login as admin
2. Go to `/admin/menus`
3. Filter by position: "Admin Sidebar"
4. Add new menu:
   - Label: "New Feature"
   - URL: "/admin/new-feature"
   - Icon: "Settings"
   - Position: "Admin Sidebar"
   - Order: 12
5. Save

**Reorder Menu:**
1. Go to `/admin/menus`
2. Use Up/Down arrows
3. Menu reorders automatically

**Hide/Show Menu:**
1. Click Eye icon
2. Menu hidden from sidebar immediately

## Icon List

Available icons for admin menu:

| Icon Name | Component | Usage |
|-----------|-----------|-------|
| LayoutDashboard | LayoutDashboard | Dashboard |
| FileText | FileText | Content, Posts |
| Layout | Layout | Pages, Layouts |
| Image | Image | Media, Gallery |
| Settings | Settings | Settings |
| BarChart3 | BarChart3 | Analytics, Stats |
| Users | Users | Users, Roles |
| Menu | MenuIcon | Menus |
| Shield | Shield | Permissions |
| Globe | Globe | Website Settings |
| Blocks | Blocks | Block Templates |
| Palette | Palette | Page Builder |

**Add New Icon:**
```tsx
// 1. Import in admin-sidebar.tsx
import { NewIcon } from 'lucide-react';

// 2. Add to iconMap
const iconMap: Record<string, LucideIcon> = {
  // ... existing icons
  NewIcon,
};

// 3. Use in menu
{
  label: 'New Feature',
  icon: 'NewIcon', // ← String name
  // ...
}
```

## Testing

### Test Cases

**TC1: Load Menu from Database**
1. ✅ Sidebar loads menu từ `/api/admin/menus?position=ADMIN`
2. ✅ 11 menu items hiển thị đúng thứ tự
3. ✅ Icons hiển thị đúng
4. ✅ Links hoạt động

**TC2: Fallback to Default**
1. ✅ Delete all admin menus: `await prisma.menu.deleteMany({ where: { position: 'ADMIN' } })`
2. ✅ Reload page → Hiển thị default menu
3. ✅ Console warning: "No admin menus found..."

**TC3: Add New Menu**
1. ✅ Go to `/admin/menus`
2. ✅ Add menu với position "Admin Sidebar"
3. ✅ Save → Menu xuất hiện trong sidebar
4. ✅ Click → Navigate đúng

**TC4: Hide Menu**
1. ✅ Go to `/admin/menus`
2. ✅ Click Eye icon (hide)
3. ✅ Reload sidebar → Menu không hiển thị
4. ✅ Click Eye icon again (show) → Menu xuất hiện

**TC5: Reorder Menu**
1. ✅ Go to `/admin/menus`
2. ✅ Use Up/Down arrows
3. ✅ Reload sidebar → Thứ tự đã thay đổi

## Benefits

1. **Flexible:** Admin có thể tùy chỉnh menu không cần code
2. **Multi-Domain:** Mỗi domain có menu riêng
3. **Maintainable:** Không cần update code khi thêm feature mới
4. **User-Friendly:** Quản lý qua UI thay vì edit code
5. **Consistent:** Sử dụng cùng hệ thống với public menu

## Migration Path

### Old Way (Hardcoded)
```tsx
const defaultMenuItems = [
  { title: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
  // ... hardcoded list
];
```

### New Way (Database)
```tsx
// 1. Seed database
bun run scripts/seed-admin-menu.ts

// 2. Component auto-loads
const adminMenus = await fetch('/api/admin/menus?position=ADMIN');

// 3. Manage via UI
Go to /admin/menus
```

## Notes

- **First Time Setup:** Run seed script để tạo menu ban đầu
- **Default Menu:** Vẫn giữ làm fallback nếu database empty
- **Icon String:** Lưu tên icon dạng string, map sang component khi render
- **Position:** Mỗi menu có 1 position: HEADER, FOOTER, ADMIN, SIDEBAR
- **Order:** Sắp xếp theo field `order` (ascending)
- **Published:** Chỉ hiển thị menu có `published: true`

## Future Enhancements

1. **Icon Picker UI:** Dropdown chọn icon trong form thay vì type tay
2. **Permission Control:** Hiển thị menu theo role (admin, editor, viewer)
3. **Nested Menus:** Support submenu trong admin sidebar
4. **Menu Groups:** Group menus theo category (Content, Settings, Users)
5. **Hot Reload:** WebSocket để update menu realtime
6. **Import/Export:** Export menu config to JSON, import từ template
