# Menu Position Feature - Quản lý Menu theo Vị trí

**Ngày:** 2025-01-XX  
**Tác giả:** AI Assistant  
**Loại:** Feature Implementation

---

## 📋 Tổng quan

Hệ thống menu đã được nâng cấp để hỗ trợ quản lý menu theo **vị trí hiển thị** (position), cho phép phân loại menu theo từng khu vực trên website: Header, Footer, Admin Sidebar, và Sidebar phụ.

### Lợi ích:
- ✅ Tự động lọc menu theo vị trí hiển thị
- ✅ Quản lý tách biệt menu public và menu admin
- ✅ Dễ dàng mở rộng cho các vị trí mới
- ✅ Tích hợp với hệ thống multi-domain

---

## 🎯 Các vị trí menu

### 1. **HEADER** (Navigation chính)
- Hiển thị: Header component
- Mục đích: Menu điều hướng chính trên website
- API: `GET /api/menus?position=HEADER`

### 2. **FOOTER** 
- Hiển thị: Footer component
- Mục đích: Liên kết ở footer (About, Contact, Terms...)
- API: `GET /api/menus?position=FOOTER`

### 3. **ADMIN** (Admin Sidebar)
- Hiển thị: Admin sidebar component
- Mục đích: Menu quản trị trong trang admin
- API: `GET /api/admin/menus?position=ADMIN`

### 4. **SIDEBAR** (Sidebar phụ)
- Hiển thị: Các widget sidebar (nếu có)
- Mục đích: Menu phụ cho sidebar
- API: `GET /api/menus?position=SIDEBAR`

---

## 🔧 Thay đổi Database

### Schema Update (prisma/schema.prisma)

```prisma
enum MenuPosition {
  HEADER
  FOOTER
  ADMIN
  SIDEBAR
}

model Menu {
  id          String       @id @default(cuid())
  label       String
  url         String
  icon        String?
  order       Int          @default(0)
  published   Boolean      @default(true)
  position    MenuPosition @default(HEADER) // ✅ NEW
  parentId    String?
  parent      Menu?        @relation("MenuToMenu", fields: [parentId], references: [id])
  children    Menu[]       @relation("MenuToMenu")
  domainId    String
  domain      Domain       @relation(fields: [domainId], references: [id], onDelete: Cascade)
  
  @@index([domainId])
  @@index([published])
  @@index([position]) // ✅ NEW INDEX
  @@index([order])
}
```

### Migration
```bash
npx prisma migrate dev --name add_menu_position
npx prisma generate
```

---

## 📡 API Updates

### 1. Public Menu API (`/api/menus/route.ts`)

**GET Request - Lấy menu theo position**

```typescript
// Before
const menus = await prisma.menu.findMany({
  where: { domainId, published: true }
});

// After
const position = searchParams.get('position');
const menus = await prisma.menu.findMany({
  where: { 
    domainId, 
    published: true,
    ...(position && { position }) // ✅ Filter by position
  }
});
```

**Usage:**
```bash
GET /api/menus?position=HEADER
GET /api/menus?position=FOOTER
```

### 2. Admin Menu API (`/api/admin/menus/route.ts`)

**POST Request - Tạo menu mới**

```typescript
const { label, url, icon, order, published, position, parentId } = await req.json();

const newMenu = await prisma.menu.create({
  data: {
    label,
    url,
    icon,
    order,
    published,
    position: position || 'HEADER', // ✅ Default to HEADER
    parentId,
    domainId
  }
});
```

**PUT Request - Cập nhật menu**

```typescript
const updatedMenu = await prisma.menu.update({
  where: { id: menuId },
  data: {
    label,
    url,
    icon,
    order,
    published,
    position, // ✅ Update position
    parentId
  }
});
```

---

## 🎨 Frontend Components

### 1. Header Component (`components/header.tsx`)

**Fetch HEADER menus only:**

```typescript
const [menus, setMenus] = useState<MenuItem[]>([]);

useEffect(() => {
  const fetchMenus = async () => {
    const response = await fetch('/api/menus?position=HEADER'); // ✅ Position filter
    if (response.ok) {
      const data = await response.json();
      setMenus(data);
    }
  };
  fetchMenus();
}, []);
```

### 2. Footer Component (`components/footer.tsx`)

**Fetch FOOTER menus:**

```typescript
const [footerMenus, setFooterMenus] = useState<MenuItem[]>([]);

useEffect(() => {
  const fetchFooterMenus = async () => {
    const response = await fetch('/api/menus?position=FOOTER'); // ✅ Footer menus
    if (response.ok) {
      const data = await response.json();
      setFooterMenus(data);
    }
  };
  fetchFooterMenus();
}, []);

// Render dynamic footer links
<ul className="space-y-2">
  {footerMenus
    .filter(menu => !menu.parentId)
    .sort((a, b) => a.order - b.order)
    .map((menu) => (
      <li key={menu.id}>
        <Link href={menu.url} className="hover:underline">
          {menu.label}
        </Link>
      </li>
    ))}
</ul>
```

### 3. Admin Sidebar (`components/admin-sidebar.tsx`)

**Dynamic ADMIN menus with fallback:**

```typescript
const [adminMenus, setAdminMenus] = useState<MenuItem[]>([]);
const [useDefaultMenu, setUseDefaultMenu] = useState(true);

useEffect(() => {
  const fetchAdminMenus = async () => {
    try {
      const response = await fetch('/api/admin/menus?position=ADMIN'); // ✅ Admin menus
      if (response.ok) {
        const data = await response.json();
        if (data && data.length > 0) {
          setAdminMenus(data);
          setUseDefaultMenu(false); // ✅ Use dynamic menus
        }
      }
    } catch (error) {
      console.error('Error fetching admin menus:', error);
      // Keep using default hardcoded menu
    }
  };
  fetchAdminMenus();
}, []);

// Compute menuItems based on data
const menuItems = useDefaultMenu 
  ? defaultMenuItems // Fallback to hardcoded
  : adminMenus.map(menu => ({
      title: menu.label,
      icon: LayoutDashboard, // Default icon
      href: menu.url,
      exact: false
    }));
```

---

## 🖥️ Admin UI Updates

### 1. Position Selector (Combobox)

**Form state interface:**

```typescript
interface Menu {
  id: string;
  label: string;
  url: string;
  icon: string | null;
  order: number;
  published: boolean;
  position: string; // ✅ NEW
  parentId: string | null;
}

const [formData, setFormData] = useState({
  label: "",
  url: "",
  icon: "",
  order: 0,
  published: true,
  position: "HEADER", // ✅ Default position
  parentId: "",
});
```

**Position options:**

```typescript
const POSITION_OPTIONS = [
  { value: "HEADER", label: "Header (Navigation chính)" },
  { value: "FOOTER", label: "Footer" },
  { value: "ADMIN", label: "Admin Sidebar" },
  { value: "SIDEBAR", label: "Sidebar phụ" }
];
```

**Combobox UI:**

```tsx
<div className="space-y-2">
  <Label htmlFor="position">Vị trí menu *</Label>
  <Combobox
    options={POSITION_OPTIONS}
    value={formData.position}
    onValueChange={(value: string) => setFormData({ ...formData, position: value })}
    placeholder="Chọn vị trí menu"
    searchPlaceholder="Tìm vị trí..."
    emptyText="Không tìm thấy vị trí"
  />
</div>
```

### 2. Table Column

**Display position badge:**

```tsx
<td className="px-4 py-3">
  <Badge variant="outline" className="text-xs">
    {POSITION_OPTIONS.find(p => p.value === menu.position)?.label || menu.position}
  </Badge>
</td>
```

Table columns order:
1. STT
2. Tên menu
3. URL
4. **Vị trí** ✅ NEW
5. Trạng thái
6. Thứ tự
7. Hành động

---

## 🔄 Seed Scripts Update

### Update seed-all-menus.ts

```typescript
const menus = [
  { 
    label: 'Trang chủ', 
    url: '/', 
    order: 0, 
    position: 'HEADER' // ✅ Add position
  },
  { 
    label: 'Về chúng tôi', 
    url: '/about', 
    order: 1, 
    position: 'HEADER'
  },
  { 
    label: 'Liên hệ', 
    url: '/contact', 
    order: 2, 
    position: 'FOOTER' // ✅ Footer menu
  }
];
```

### Update seed-admin-menus.ts

```typescript
const adminMenus = [
  { 
    label: 'Dashboard', 
    url: '/admin', 
    order: 0, 
    position: 'ADMIN' // ✅ Admin menu
  },
  { 
    label: 'Quản lý Nội dung', 
    url: '/admin/content', 
    order: 1, 
    position: 'ADMIN'
  }
];
```

---

## 📝 Testing Checklist

### 1. Database & API
- [x] Prisma schema có MenuPosition enum
- [x] Migration chạy thành công
- [x] Position field có index
- [x] API GET filter theo position
- [x] API POST/PUT lưu position

### 2. Frontend Components
- [x] Header fetch HEADER menus
- [x] Footer fetch FOOTER menus (dynamic)
- [x] Admin sidebar fetch ADMIN menus (với fallback)
- [x] Components hiển thị đúng menu

### 3. Admin UI
- [x] Form có Combobox chọn position
- [x] Table hiển thị cột Position
- [x] CRUD operations bao gồm position
- [x] Position options đầy đủ 4 loại

### 4. Multi-domain
- [ ] Test tạo menu HEADER cho domain1
- [ ] Test tạo menu FOOTER cho domain2
- [ ] Test tạo menu ADMIN cho domain3
- [ ] Verify position filter hoạt động cross-domain

### 5. Data Migration
- [ ] Update seed scripts với position
- [ ] Run seed cho tất cả domains
- [ ] Verify menus hiển thị đúng vị trí

---

## 🎯 Usage Examples

### 1. Tạo menu Header cho InnerBright

```
Domain: innerbright.com
Label: Sản phẩm
URL: /products
Position: HEADER
Published: Yes
```

### 2. Tạo menu Footer cho TazaSkin

```
Domain: tazaskin.com
Label: Chính sách bảo mật
URL: /privacy-policy
Position: FOOTER
Published: Yes
```

### 3. Tạo menu Admin cho TazaGroup

```
Domain: tazagroup.com
Label: Quản lý đơn hàng
URL: /admin/orders
Position: ADMIN
Published: Yes
```

---

## 🚀 Next Steps

### Optional Enhancements:
1. **Position Filter** - Thêm dropdown lọc menu theo position trong admin
2. **Icon Mapping** - Map icon string từ database sang Lucide icons
3. **Bulk Update** - Cập nhật position hàng loạt
4. **Position Stats** - Hiển thị thống kê menu theo position
5. **Drag & Drop** - Sắp xếp menu theo position với drag-drop

### Documentation Updates:
- [ ] Update HUONG_DAN_CONTENT_MANAGEMENT.md
- [ ] Update MULTI_DOMAIN_USAGE_EXAMPLES.md
- [ ] Create seed script examples

---

## 📌 Related Files

**Schema:**
- `prisma/schema.prisma`

**API:**
- `app/api/menus/route.ts`
- `app/api/admin/menus/route.ts`

**Components:**
- `components/header.tsx`
- `components/footer.tsx`
- `components/admin-sidebar.tsx`

**Admin:**
- `app/admin/menus/page.tsx`

**Scripts:**
- `scripts/seed-all-menus.ts`
- `scripts/seed-admin-menus.ts`

---

## ✅ Kết luận

Feature **Menu Position** đã được implement đầy đủ:

✅ **Database**: Schema + Migration + Index  
✅ **API**: Filter by position  
✅ **Frontend**: Header, Footer, Admin Sidebar  
✅ **Admin UI**: CRUD with position selector  
✅ **Multi-domain**: Compatible với hệ thống hiện tại  

**Kết quả:**
- Menu Header chỉ hiển thị HEADER menus
- Menu Footer chỉ hiển thị FOOTER menus (dynamic)
- Admin Sidebar có thể dùng ADMIN menus (với fallback)
- Admin page quản lý đầy đủ position cho mọi menu

---

**Status:** ✅ COMPLETED  
**Ready for:** Testing & Seed Data Update
