# Quản Lý Menu Multi-Domain

## Tổng Quan
Cập nhật trang `/admin/menus` hỗ trợ quản lý menu cho 6 domains riêng biệt. Admin có thể chọn domain và thực hiện CRUD (Create, Read, Update, Delete) menu cho từng domain.

## Tính Năng Mới

### 1. Domain Selector
- **Combobox chọn domain** ngay trên header
- 6 domains: Taza Group, Taza Skin, Timona, HDerma, Elasome, InnerBright
- Badge hiển thị số lượng menu của domain đang chọn
- Auto-reload khi đổi domain

### 2. Multi-Database Support
- API sử dụng `getPrisma(domain)` thay vì singleton `prisma`
- Header `x-domain` được gửi kèm mọi request
- Mỗi domain có database riêng với menu độc lập

### 3. CRUD Menu Theo Domain
- **Tạo**: Menu mới được lưu vào database của domain đang chọn
- **Đọc**: Hiển thị danh sách menu của domain đang chọn
- **Sửa**: Cập nhật menu trong database của domain đó
- **Xóa**: Xóa menu khỏi database của domain đó

## File Đã Cập Nhật

### 1. API Route: `app/api/admin/menus/route.ts`

**Thay đổi:**
```typescript
// Trước
import { prisma } from '@/lib/prisma';
const menus = await prisma.menu.findMany(...);

// Sau
import { getPrisma } from '@/lib/prisma';
import { headers } from 'next/headers';

const headersList = await headers();
const domain = headersList.get('x-domain') || 'innerbright.vn';
const prisma = await getPrisma(domain);
const menus = await prisma.menu.findMany(...);
```

**Áp dụng cho:**
- `GET` - Lấy danh sách menu
- `POST` - Tạo menu mới
- `PUT` - Cập nhật menu
- `DELETE` - Xóa menu

### 2. Admin Page: `app/admin/menus/page.tsx`

**Thêm state:**
```typescript
const [selectedDomain, setSelectedDomain] = useState("innerbright.vn");

const DOMAIN_OPTIONS = [
  { value: "tazagroup.vn", label: "Taza Group" },
  { value: "tazaskin.vn", label: "Taza Skin" },
  { value: "timona.vn", label: "Timona" },
  { value: "hderma.vn", label: "HDerma" },
  { value: "elasome.vn", label: "Elasome" },
  { value: "innerbright.vn", label: "InnerBright" },
];
```

**Thêm domain vào headers:**
```typescript
const res = await fetch("/api/admin/menus", {
  method: "GET",
  headers: {
    "x-domain": selectedDomain,
  },
});
```

**UI mới:**
- Combobox chọn domain trên header
- Badge hiển thị `{menus.length} menu`
- Auto-reload khi đổi domain (useEffect dependency)

## Sử Dụng

### 1. Truy Cập Trang
```
1. Login admin: katachanneloffical@gmail.com
2. Vào /admin/menus
3. Giao diện hiển thị domain selector và danh sách menu
```

### 2. Chọn Domain
```
1. Click vào Combobox "Chọn Domain"
2. Chọn domain muốn quản lý (VD: InnerBright)
3. Danh sách menu tự động load từ database của domain đó
4. Badge hiển thị số lượng menu: "20 menu"
```

### 3. Thêm Menu Mới
```
1. Chọn domain muốn thêm menu
2. Click "Thêm menu"
3. Điền form:
   - Tên menu: "Về chúng tôi"
   - URL: "/ve-chung-toi"
   - Icon: "Home" (optional)
   - Thứ tự: 10
   - Menu cha: Không có (tùy chọn)
   - Tick "Hiển thị menu"
4. Click "Tạo menu"
5. Menu được lưu vào database của domain đang chọn
```

### 4. Sửa Menu
```
1. Chọn domain có menu cần sửa
2. Click icon Edit (✏️) trên menu
3. Dialog hiện với data pre-fill
4. Sửa các field cần thiết
5. Click "Cập nhật"
6. Menu được update trong database của domain đó
```

### 5. Xóa Menu
```
1. Chọn domain có menu cần xóa
2. Click icon Delete (🗑️)
3. Confirm dialog hiện
4. Click "Xóa menu"
5. Menu bị xóa khỏi database của domain đó
```

### 6. Toggle Hiện/Ẩn
```
1. Click icon Eye/EyeOff (👁️)
2. Menu toggle giữa published = true/false
3. Published = false → Menu không hiển thị ở frontend
```

### 7. Reorder Menu
```
1. Click ArrowUp (↑) hoặc ArrowDown (↓)
2. Menu swap thứ tự với menu trên/dưới
3. Order number được cập nhật trong database
```

## Luồng Hoạt Động

### 1. Chọn Domain và Load Menu
```
User chọn domain "innerbright.vn"
  → setSelectedDomain("innerbright.vn")
  → useEffect trigger
  → fetchMenus()
  → GET /api/admin/menus?domain=innerbright.vn
  → API: getPrisma("innerbright.vn")
  → Database: innerbright.menu.findMany()
  → Response: Menu[] (20 items)
  → setMenus(data)
  → UI render table
```

### 2. Tạo Menu Mới
```
User click "Thêm menu"
  → Dialog mở
  → User fill form
  → Click "Tạo menu"
  → POST /api/admin/menus?domain=innerbright.vn
  → Body: { label, url, icon, order, published, parentId }
  → API: getPrisma("innerbright.vn")
  → Database: innerbright.menu.create(data)
  → Response: Created menu
  → Toast: "Đã tạo menu mới"
  → fetchMenus() → Reload danh sách
```

### 3. Sửa Menu
```
User click Edit icon
  → setSelectedMenu(menu)
  → Dialog mở với pre-fill data
  → User sửa fields
  → Click "Cập nhật"
  → PUT /api/admin/menus?domain=innerbright.vn
  → Body: { id, label, url, icon, order, published, parentId }
  → API: getPrisma("innerbright.vn")
  → Database: innerbright.menu.update({ where: { id } })
  → Toast: "Đã cập nhật menu"
  → fetchMenus() → Reload
```

### 4. Xóa Menu
```
User click Delete icon
  → setSelectedMenu(menu)
  → Confirm dialog mở
  → Click "Xóa menu"
  → DELETE /api/admin/menus?domain=innerbright.vn&id={menuId}
  → API: getPrisma("innerbright.vn")
  → Database: innerbright.menu.delete({ where: { id } })
  → Cascade delete children (nếu có)
  → Toast: "Đã xóa menu"
  → fetchMenus() → Reload
```

## Database Structure

### Menu Schema
```prisma
model Menu {
  id        String   @id @default(uuid())
  label     String   // Tên hiển thị
  url       String   // URL path
  icon      String?  // Icon name (lucide-react)
  order     Int      @default(0)
  published Boolean  @default(true)
  parentId  String?  // Parent menu ID (submenu)
  
  parent   Menu?  @relation("MenuHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children Menu[] @relation("MenuHierarchy")
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

### Database Per Domain
- `tazagroup.vn` → `postgresql://...db_tazagroup`
- `tazaskin.vn` → `postgresql://...db_tazaskin`
- `timona.vn` → `postgresql://...db_timona`
- `hderma.vn` → `postgresql://...db_hderma`
- `elasome.vn` → `postgresql://...db_elasome`
- `innerbright.vn` → `postgresql://...db_innerbright`

## Tuân Thủ RulePromt.txt

✅ **Clean Architecture**: API tách biệt, sử dụng getPrisma factory pattern  
✅ **Performance**: Fetch menu theo domain, không load tất cả  
✅ **Mobile First**: Giao diện responsive, domain selector adaptive  
✅ **Combobox**: Dùng Combobox thay vì Select (theo rule 11)  
✅ **Dialog Layout**: Header/Footer sticky, Content scrollable  
✅ **Tiếng Việt**: Toàn bộ UI và toast message tiếng Việt  
✅ **shadcn UI**: Sử dụng components từ shadcn  
✅ **Type-safe**: TypeScript strict mode  

## Thống Kê

### Số Lượng Menu (Sau Seed)
| Domain | Public Menus | Admin Menus | Tổng |
|--------|--------------|-------------|------|
| InnerBright | 9 | 11 | 20 |
| Taza Group | 7 | 0 | 7 |
| Taza Skin | 6 | 0 | 6 |
| Timona | 6 | 0 | 6 |
| HDerma | 7 | 0 | 7 |
| Elasome | 8 | 0 | 8 |
| **Tổng** | **44** | **11** | **54** |

## Scripts Hỗ Trợ

```bash
# Seed menu cho tất cả domains (44 menus)
bun seed:all-menus

# Seed menu cho InnerBright (9 public menus)
bun seed:innerbright

# Seed admin menu cho InnerBright (11 admin menus)
bun seed:admin-menus

# Hiển thị cấu trúc menu trong database
bun show:menus
```

## Kết Quả

✅ **Multi-Domain Support**: API hỗ trợ 6 domains riêng biệt  
✅ **Domain Selector**: Combobox chọn domain trực quan  
✅ **CRUD Per Domain**: Thêm/sửa/xóa menu theo từng domain  
✅ **Real-time Update**: Auto-reload khi đổi domain  
✅ **Type-safe**: TypeScript + Prisma typed queries  
✅ **Mobile Responsive**: Giao diện tối ưu mobile-first  
✅ **Clean UI**: shadcn components, dialog layout chuẩn  
✅ **Performance**: Chỉ load menu của domain đang chọn  

## Lưu Ý

1. **Default Domain**: Khi vào trang lần đầu, mặc định chọn InnerBright
2. **Admin Only**: Trang này chỉ dành cho role admin
3. **x-domain Header**: Bắt buộc gửi kèm mọi API request
4. **Auto-reload**: useEffect tự động fetch khi selectedDomain thay đổi
5. **Badge Counter**: Hiển thị số lượng menu real-time
6. **Parent Menu**: Combobox chỉ hiển thị menu cha (không có parentId)
7. **Cascade Delete**: Xóa menu cha sẽ xóa luôn menu con

## Tham Khảo

- Prisma Multi-Database: `lib/database.ts`
- Menu Seeding: `scripts/seed-all-menus.ts`
- Admin Menu Seeding: `scripts/seed-admin-menus.ts`
- Menu Display: `scripts/show-menus.ts`
- Menu API: `app/api/menus/route.ts`
- Menu Permissions: `app/api/admin/menu-permissions/route.ts`
