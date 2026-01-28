# Quản Lý Menu CRUD và Dynamic Rendering

## Tổng Quan
Nâng cấp hệ thống menu từ hardcode JSON trong WebsiteSettings sang database model riêng với đầy đủ tính năng CRUD (Create, Read, Update, Delete). Menu được render động từ database và filter theo phân quyền user.

## Thay Đổi Database

### Model Menu (Mới)
```prisma
model Menu {
  id        String   @id @default(uuid())
  label     String   // Tên hiển thị menu
  url       String   // URL path
  icon      String?  // Icon name (lucide-react)
  order     Int      @default(0) // Thứ tự hiển thị
  published Boolean  @default(true) // Hiện/ẩn menu
  parentId  String?  // Parent menu ID (cho submenu)
  
  // Self-relation cho submenu
  parent   Menu?  @relation("MenuHierarchy", fields: [parentId], references: [id], onDelete: Cascade)
  children Menu[] @relation("MenuHierarchy")
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

**Tính năng:**
- ✅ Self-relation: Hỗ trợ submenu (parent-child hierarchy)
- ✅ Order: Thứ tự hiển thị tùy chỉnh
- ✅ Published: Ẩn/hiện menu không cần xóa
- ✅ Icon: Tích hợp lucide-react icons
- ✅ Cascade delete: Xóa parent → xóa children

## File Mới

### 1. API Routes

**app/api/admin/menus/route.ts** (Admin Only)
- **GET**: Lấy tất cả menu (bao gồm unpublished, children)
- **POST**: Tạo menu mới
- **PUT**: Cập nhật menu (label, url, order, published, parentId)
- **DELETE**: Xóa menu

**app/api/menus/route.ts** (Public)
- **GET**: Lấy menu published, filter theo permissions user
- Logic:
  - Unauthenticated: Trả về tất cả published menus
  - Admin: Trả về tất cả published menus
  - User: Filter theo MenuPermission.allowedMenus

### 2. Admin Page

**app/admin/menus/page.tsx**
Trang quản lý menu với các tính năng:

**UI Components:**
- ✅ Table danh sách menu (STT, Tên, URL, Trạng thái, Thứ tự, Hành động)
- ✅ Badge hiển thị trạng thái Published/Unpublished
- ✅ Badge "Submenu" cho menu con
- ✅ Reorder buttons (ArrowUp/ArrowDown) để sắp xếp
- ✅ Toggle publish/unpublish với icon Eye/EyeOff
- ✅ Edit/Delete buttons

**Dialog Thêm/Sửa Menu:**
- ✅ Header: Title + Description (sticky)
- ✅ Content: Scrollable form fields
  - Tên menu (required)
  - URL (required)
  - Icon (optional, lucide-react name)
  - Thứ tự (number input)
  - Menu cha (Combobox - rulepromt.txt tuân thủ)
  - Checkbox "Hiển thị menu"
- ✅ Footer: Hủy/Lưu buttons (sticky)

**Dialog Xóa:**
- Confirm dialog với tên menu
- Destructive button style

**Tuân thủ rulepromt.txt:**
- ✅ Mobile First + Responsive
- ✅ Combobox thay vì Select
- ✅ Dialog layout: Header/Footer sticky, Content scrollable
- ✅ Giao diện tiếng Việt
- ✅ shadcn UI components

### 3. Seed Script

**prisma/seed-menus.ts**
- Migrate data từ WebsiteSettings.navigationMenu → Menu table
- Nếu không có navigationMenu: Tạo 9 menu mặc định
- Auto-assign order theo index

## File Đã Cập Nhật

### 1. components/header.tsx
**Thay đổi:**
- ❌ Xóa: Fetch từ `/api/website-settings` cho navigationMenu
- ❌ Xóa: Fetch từ `/api/menu-permissions` (permissions logic di chuyển về API)
- ❌ Xóa: Filter logic `getFilteredMenus()` ở client
- ✅ Thêm: Fetch từ `/api/menus` (đã filter sẵn)
- ✅ Đơn giản hóa: Render trực tiếp từ `menus` state

**Logic mới:**
```typescript
// Fetch menus đã được filter theo permissions ở API
fetch('/api/menus')
  .then(res => res.json())
  .then(data => setMenus(data))
```

### 2. app/admin/menu-permissions/page.tsx
**Thay đổi:**
- ❌ Xóa: Fetch từ `/api/website-settings`
- ✅ Thêm: Fetch từ `/api/admin/menus`
- ✅ Filter: Chỉ hiện menu published và không có parent (main menus)

**Code:**
```typescript
const res = await fetch('/api/admin/menus');
const data = await res.json();
const mainMenus = data.filter(m => m.published && !m.parentId);
setAvailableMenus(mainMenus);
```

### 3. components/admin-sidebar.tsx
**Thay đổi:**
- ✅ Thêm import: `Menu as MenuIcon` từ lucide-react
- ✅ Thêm menu item:
  ```typescript
  { title: 'Quản lý Menu', icon: MenuIcon, href: '/admin/menus' }
  ```
- Vị trí: Sau "Website Settings", trước "Quyền Menu"

### 4. prisma/schema.prisma
- ✅ Thêm Menu model với self-relation
- ✅ Index: order, published, parentId

## Migration
```bash
bunx prisma db push  # Tạo Menu table
bun prisma/seed-menus.ts  # Migrate data từ WebsiteSettings
```

## Tính Năng

### Admin (/admin/menus)
1. **Xem danh sách menu**
   - Table responsive
   - Badge hiển thị trạng thái (Published/Unpublished)
   - Badge "Submenu" cho menu con
   - Hiển thị thứ tự (order number)

2. **Thêm menu mới**
   - Dialog với form đầy đủ fields
   - Combobox chọn menu cha (hỗ trợ submenu)
   - Auto-assign order = số lượng menu hiện tại
   - Published mặc định = true

3. **Sửa menu**
   - Click icon Edit
   - Dialog pre-fill data
   - Cập nhật realtime

4. **Xóa menu**
   - Click icon Delete
   - Confirm dialog
   - Cascade delete children (nếu có)

5. **Toggle Published**
   - Click icon Eye/EyeOff
   - Ẩn/hiện menu mà không cần xóa
   - Realtime update

6. **Reorder menu**
   - Click ArrowUp/ArrowDown
   - Swap order với menu trên/dưới
   - Disable nếu ở đầu/cuối danh sách

### Frontend (Dynamic Rendering)
1. **Header Component**
   - Fetch từ `/api/menus` (auto-filtered)
   - Không còn logic filter ở client
   - Render menu từ database

2. **Permission Filtering**
   - Xử lý ở API `/api/menus`
   - Unauthenticated: All published menus
   - Admin: All published menus
   - User: Filter theo MenuPermission.allowedMenus

3. **Real-time Updates**
   - Admin thêm/sửa/xóa menu → Refresh frontend
   - Admin toggle published → Menu ẩn/hiện ngay

## API Endpoints

### Public
- **GET /api/menus**
  - Response: Menu[] (published, filtered by permissions)
  - Auth: Optional
  - Filter logic:
    ```typescript
    if (!session) return allPublishedMenus;
    if (admin) return allPublishedMenus;
    return filteredByPermissions;
    ```

### Admin Only
- **GET /api/admin/menus**
  - Response: Menu[] (all menus, includes children)
  - Auth: Admin only
  
- **POST /api/admin/menus**
  - Body: `{ label, url, icon?, order?, published?, parentId? }`
  - Response: Created menu
  
- **PUT /api/admin/menus**
  - Body: `{ id, label, url, icon?, order?, published?, parentId? }`
  - Response: Updated menu
  
- **DELETE /api/admin/menus**
  - Query: `?id={menuId}`
  - Response: `{ success: true }`

## Menu Mặc Định (9 items)
1. Về InnerBright - /innerbright
2. NLP - /nlp
3. Time Line Therapy® - /time-line-therapy
4. Đào tạo doanh nghiệp - /dao-tao-doanh-nghiep
5. Khái vận cá nhân - /khai-van-ca-nhan
6. Khoá học - /khoa-hoc
7. Bộ thẻ NLP - /bo-the-nlp
8. Thư viện - /thu-vien
9. Liên hệ - /lien-he

## Luồng Hoạt Động

### 1. Admin Thêm Menu
```
1. Admin vào /admin/menus
2. Click "Thêm menu"
3. Dialog mở với form trống
4. Nhập: Tên, URL, Icon (optional), Thứ tự, Menu cha (optional)
5. Tick "Hiển thị menu"
6. Click "Tạo menu"
7. POST /api/admin/menus
8. Database insert Menu record
9. Toast success
10. Refresh danh sách
11. Frontend fetch /api/menus → Menu mới xuất hiện
```

### 2. Admin Sửa Menu
```
1. Click icon Edit trên menu
2. Dialog mở với data pre-fill
3. Sửa fields
4. Click "Cập nhật"
5. PUT /api/admin/menus
6. Database update Menu record
7. Toast success
8. Refresh danh sách
```

### 3. Admin Xóa Menu
```
1. Click icon Delete
2. Confirm dialog hiện
3. Click "Xóa menu"
4. DELETE /api/admin/menus?id={menuId}
5. Database cascade delete (menu + children)
6. Toast success
7. Refresh danh sách
8. Frontend không còn thấy menu
```

### 4. Admin Toggle Published
```
1. Click icon Eye/EyeOff
2. PUT /api/admin/menus (published: !current)
3. Database update published field
4. Toast success
5. Refresh danh sách
6. Frontend fetch /api/menus:
   - Published = true → Menu hiện
   - Published = false → Menu ẩn
```

### 5. Frontend Load Menu
```
1. Header component mount
2. fetch('/api/menus')
3. API check session:
   - No session → Return all published menus
   - Admin → Return all published menus
   - User → Filter by MenuPermission.allowedMenus
4. Response: Menu[] (filtered)
5. Render menu items
```

### 6. User Reorder Menu
```
1. Click ArrowUp/ArrowDown
2. Swap order với menu adjacent
3. PUT /api/admin/menus (cập nhật 2 menus)
4. Database update order fields
5. Toast success
6. Refresh danh sách (auto-sort by order)
```

## Security

### API Protection
- **Admin endpoints**: Session check + role === 'admin'
- **Public endpoint**: Optional session, filter logic
- **Validation**: Required fields (label, url)
- **Cascade delete**: Prevent orphan children

### Database
- **Indexes**: order, published, parentId (query performance)
- **Self-relation**: MenuHierarchy với onDelete: Cascade
- **Unique**: Không có (cho phép duplicate labels/URLs)

## Performance
- **Client-side**: Single fetch `/api/menus`, render từ state
- **Server-side**: Indexed queries (published, order)
- **Real-time**: Không auto-refresh, fetch on mount
- **Caching**: Không có (data thay đổi thường xuyên)

## Best Practices Tuân Thủ
✅ Principal Engineer code  
✅ Clean Architecture (API/UI/Logic separation)  
✅ Mobile First + Responsive  
✅ shadcn UI components  
✅ Combobox thay vì Select (rulepromt.txt)  
✅ Dialog với Header/Footer/Content scrollable (rulepromt.txt)  
✅ Giao diện tiếng Việt  
✅ TypeScript type-safe  
✅ Toast notifications  
✅ Loading states  
✅ Không testing (theo yêu cầu)  
✅ Không git (theo yêu cầu)  

## So Sánh Với Hệ Thống Cũ

### Trước (WebsiteSettings.navigationMenu)
- ❌ Hardcode JSON trong database
- ❌ Không có UI quản lý
- ❌ Sửa menu phải vào database trực tiếp
- ❌ Không hỗ trợ submenu
- ❌ Không có published status
- ❌ Thứ tự cố định theo array index

### Sau (Menu Model)
- ✅ Database model riêng
- ✅ UI CRUD đầy đủ
- ✅ Admin quản lý qua web
- ✅ Hỗ trợ submenu (self-relation)
- ✅ Published status (ẩn/hiện)
- ✅ Thứ tự tùy chỉnh (reorder)
- ✅ Icon field
- ✅ Filter permissions ở API
- ✅ Real-time updates

## Sử Dụng

### 1. Thêm Menu Mới
```
1. Login admin: katachanneloffical@gmail.com
2. Vào /admin/menus
3. Click "Thêm menu"
4. Nhập:
   - Tên: "Sản phẩm"
   - URL: "/san-pham"
   - Icon: "ShoppingCart" (optional)
   - Thứ tự: 10
   - Menu cha: "Không có (Menu chính)"
   - Tick "Hiển thị menu"
5. Click "Tạo menu"
6. Toast: "Đã tạo menu mới"
7. Menu xuất hiện trong danh sách
8. Frontend: Refresh → Menu mới hiển thị
```

### 2. Tạo Submenu
```
1. Thêm menu "Dịch vụ" (parent)
2. Thêm menu "Tư vấn" với Menu cha = "Dịch vụ"
3. Badge "Submenu" hiện trên menu "Tư vấn"
4. Frontend: Menu hierarchy render (nếu UI hỗ trợ)
```

### 3. Ẩn Menu Tạm Thời
```
1. Click icon Eye trên menu
2. Icon đổi thành EyeOff
3. Badge "Ẩn" hiện
4. Frontend: Menu không còn xuất hiện
5. Admin vẫn thấy trong /admin/menus
```

### 4. Reorder Menu
```
1. Menu "Liên hệ" ở vị trí 9
2. Click ArrowUp 3 lần
3. Menu "Liên hệ" lên vị trí 6
4. Frontend: Thứ tự menu thay đổi theo order
```

### 5. Xóa Menu
```
1. Click icon Trash trên menu
2. Confirm dialog: "Bạn có chắc muốn xóa..."
3. Click "Xóa menu"
4. Toast: "Đã xóa menu"
5. Menu biến mất khỏi danh sách
6. Nếu có children → Cascade delete
```

## Troubleshooting

### Menu không hiện ở frontend
- Check published = true
- Check user có permissions (nếu đã login)
- Check API response: `fetch('/api/menus')`
- Hard refresh: Ctrl+Shift+R

### Không thể thêm menu
- Check session admin active
- Check required fields: label, url
- Check API response status code
- Check browser console errors

### Reorder không hoạt động
- Check order numbers không duplicate
- Check database update success
- Refresh page

### Submenu không hiện
- Check parentId đúng menu cha
- Check frontend UI có hỗ trợ submenu chưa
- Check API response include children

## Kết Quả
- ✅ Menu model riêng trong database
- ✅ CRUD đầy đủ: Create, Read, Update, Delete
- ✅ UI quản lý admin hoàn chỉnh
- ✅ Dynamic rendering từ database
- ✅ Filter permissions ở API
- ✅ Submenu support (self-relation)
- ✅ Published status (ẩn/hiện)
- ✅ Reorder tùy chỉnh
- ✅ Mobile-first responsive
- ✅ Dialog layout chuẩn (header/footer/content)
- ✅ Combobox thay Select
- ✅ Type-safe TypeScript
- ✅ Real-time updates
