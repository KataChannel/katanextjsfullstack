# Block Templates Feature - Tính năng Templates cho Page Builder

## Tổng quan

Tính năng Block Templates cho phép lưu các block/layout trong Page Builder thành templates có thể tái sử dụng trên nhiều pages khác nhau. Tính năng này giúp:

- **Tăng tốc thiết kế**: Sử dụng lại các block đã thiết kế sẵn
- **Đồng nhất giao diện**: Giữ nhất quán thiết kế trên nhiều trang
- **Quản lý tập trung**: Admin có thể tạo và quản lý templates cho toàn hệ thống

## Cấu trúc Database

### BlockTemplate Model

```prisma
model BlockTemplate {
  id          String   @id @default(uuid())
  name        String
  description String?
  thumbnail   String?
  elements    Json     // Array of page builder elements
  category    String   @default("general")
  published   Boolean  @default(true)
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  @@map("block_templates")
}
```

**Các trường chính:**
- `name`: Tên template (bắt buộc)
- `description`: Mô tả ngắn gọn về template
- `thumbnail`: URL hình ảnh preview (optional)
- `elements`: Mảng JSON chứa các page builder elements
- `category`: Danh mục template (general, hero, content, cta, testimonial, pricing, footer)
- `published`: Trạng thái hiển thị public (true/false)
- `authorId`: ID người tạo template

## API Endpoints

### 1. Admin API - CRUD Operations

**GET /api/admin/block-templates**
- Lấy danh sách tất cả templates (cần quyền admin)
- Response: Array of templates với thông tin author

**POST /api/admin/block-templates**
- Tạo template mới (cần quyền admin)
- Body: `{ name, description?, thumbnail?, elements, category?, published? }`
- Validation: `name` và `elements` là required

**PUT /api/admin/block-templates**
- Cập nhật template theo ID (cần quyền admin)
- Body: `{ id, name, description?, thumbnail?, elements, category?, published? }`

**DELETE /api/admin/block-templates?id=xxx**
- Xóa template theo ID (cần quyền admin)
- Query param: `id`

### 2. Public API

**GET /api/block-templates**
- Lấy danh sách templates đã published
- Không cần authentication
- Dùng cho Page Builder để hiển thị templates tab

## Seed Data

Hệ thống đã có 2 templates mẫu:

### 1. Mạng Trong Mình Khát Vọng
Template 3 cột hiển thị Sứ mệnh - Tầm nhìn - Giải trí cốt lõi:

```bash
bun prisma/seed-block-templates.ts
```

**Layout:**
- Container chính: Grid 3 columns, max-width 1200px, centered
- **Cột trái (Sứ mệnh)**: 
  - Heading màu cam (#fb923c)
  - Text content với line-height 1.8
- **Cột giữa (Tầm nhìn)**:
  - Icon target màu xanh (#2563eb)
  - Heading chính màu xanh
  - Text content
- **Cột phải (Giải trí cốt lõi)**:
  - Heading màu cam
  - 3 bullet points (Hệ thống, Hợp nhất, Từ tế)

### 2. Hero Banner Đơn Giản
Template hero section cơ bản với heading, text, button.

## Admin Page - Quản lý Templates

**URL:** `/admin/block-templates`

### Tính năng chính:

1. **Grid Layout hiển thị templates**
   - Preview thumbnail hoặc placeholder icon
   - Badges: Published status + Category
   - Tên, mô tả, số lượng elements
   - Tác giả và số elements

2. **Actions trên mỗi template:**
   - **Toggle Publish** (Icon Eye/EyeOff): Ẩn/hiện template
   - **Duplicate** (Icon Copy): Tạo bản sao template
   - **Edit** (Icon Pencil): Sửa thông tin
   - **Delete** (Icon Trash2): Xóa template

3. **Dialog Thêm/Sửa Template**
   - Form theo chuẩn rulepromt.txt:
     - Header có title + description
     - Body scrollable với các fields
     - Footer có nút Hủy và Lưu
   - Fields:
     - Tên template (required)
     - Mô tả
     - URL Thumbnail
     - Danh mục (Combobox, không dùng Select)
     - Checkbox Published
   - Categories: Chung, Hero Section, Nội dung, CTA, Đánh giá, Bảng giá, Footer

4. **Dialog Xác nhận Xóa**
   - Hiển thị tên template
   - Warning không thể hoàn tác

### Responsive Design (Mobile First)
- Grid: 1 column (mobile) → 2 columns (tablet) → 3 columns (desktop)
- Card preview height: 48 (12rem)
- Hover effects: shadow-lg transition

## Page Builder Integration

### 1. ComponentSidebar - Templates Tab

**File:** `components/page-builder/ComponentSidebar.tsx`

**Cấu trúc Tabs:**
```tsx
<Tabs defaultValue="components">
  <TabsList>
    <TabsTrigger value="components">Components</TabsTrigger>
    <TabsTrigger value="templates">
      Templates
      <Badge>{templates.length}</Badge>
    </TabsTrigger>
  </TabsList>
</Tabs>
```

**Templates Tab Features:**
- Fetch templates từ `/api/block-templates` khi mount
- Hiển thị loading state
- Empty state với icon Blocks khi chưa có templates
- Grid cards với:
  - Preview thumbnail hoặc placeholder
  - Badge số lượng elements
  - Tên template
  - Mô tả (line-clamp-2)
- Click card → Add tất cả elements vào canvas với offset ngẫu nhiên
- Toast notification khi thêm thành công

**handleAddTemplate Logic:**
```typescript
const handleAddTemplate = (template: any) => {
  // Tạo offset ngẫu nhiên để tránh chồng lên nhau
  const offsetX = Math.random() * 100;
  const offsetY = Math.random() * 100;
  
  // Thêm từng element vào canvas
  template.elements.forEach((element, index) => {
    const newElement = {
      ...element,
      id: `${element.type}-${Date.now()}-${index}`,
      x: element.x + offsetX,
      y: element.y + offsetY,
    };
    addElement(newElement);
  });
};
```

### 2. Save as Template Button

**File:** `components/page-builder/PageBuilderEditor.tsx`

**Button Location:** Toolbar, sau Export button, trước Save button
- Icon: Blocks
- Label: "Template"
- Visible: Desktop only (hidden lg:flex)

**Dialog Lưu Template:**
```tsx
<Dialog>
  <DialogHeader>
    <DialogTitle>Lưu làm Template</DialogTitle>
    <DialogDescription>
      {selectedIds.length > 0
        ? `Lưu ${selectedIds.length} element đã chọn`
        : `Lưu tất cả ${Object.keys(elements).length} elements`}
    </DialogDescription>
  </DialogHeader>
  
  <DialogContent>
    <Input label="Tên template" required />
    <Input label="Mô tả" />
    <Combobox label="Danh mục" options={CATEGORIES} />
    
    <div className="bg-muted p-4">
      <ul>
        <li>• {x} elements sẽ được lưu</li>
        <li>• Template công khai sau khi lưu</li>
        <li>• Có thể chỉnh sửa trong quản lý templates</li>
      </ul>
    </div>
  </DialogContent>
  
  <DialogFooter>
    <Button variant="outline">Hủy</Button>
    <Button>Lưu template</Button>
  </DialogFooter>
</Dialog>
```

**handleSaveAsTemplate Logic:**
- Nếu có selectedIds: Lưu chỉ các elements được select
- Nếu không: Lưu tất cả elements trong canvas
- POST tới `/api/admin/block-templates`
- Toast success/error
- Reset form và đóng dialog sau khi thành công

## Admin Sidebar

**File:** `components/admin-sidebar.tsx`

Thêm menu item mới:
```typescript
{
  title: 'Block Templates',
  icon: Blocks,
  href: '/admin/block-templates'
}
```

**Vị trí:** Sau "Page Builder", trước "Thư viện Media"

## Workflow Sử dụng

### 1. Tạo Template từ Page Builder
1. Vào Page Builder của một page
2. Thiết kế layout/block mong muốn
3. (Optional) Select các elements cần lưu
4. Click button "Template" trên toolbar
5. Điền thông tin:
   - Tên template (VD: "Hero Banner Sản phẩm")
   - Mô tả (VD: "Banner hero với nút CTA cho trang sản phẩm")
   - Chọn category (VD: "Hero Section")
6. Click "Lưu template"

### 2. Sử dụng Template trong Page khác
1. Vào Page Builder của page mới
2. Click tab "Templates" trong sidebar trái
3. Browse danh sách templates
4. Click vào template muốn dùng
5. Template được thêm vào canvas
6. Chỉnh sửa content theo nhu cầu
7. Save page

### 3. Quản lý Templates
1. Vào Admin → Block Templates
2. Xem danh sách tất cả templates
3. Actions:
   - **Ẩn/Hiện**: Toggle published status
   - **Tạo bản sao**: Duplicate template
   - **Chỉnh sửa**: Update tên, mô tả, category
   - **Xóa**: Xóa template không dùng nữa

## Design Patterns Tuân thủ

### 1. Mobile First
- Grid layout responsive: 1 → 2 → 3 columns
- Buttons với icon-only mobile, text+icon desktop
- Sidebar overlay mobile, fixed desktop

### 2. Shadcn UI Components
- Card, Button, Badge, Input, Label
- Dialog với cấu trúc header/content/footer
- Combobox (không dùng Select theo rulepromt.txt)
- Tabs cho ComponentSidebar

### 3. Dialog Layout (rulepromt.txt)
```tsx
<DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
  <DialogHeader className="border-b pb-4">
    {/* Title + Description */}
  </DialogHeader>
  
  <div className="flex-1 overflow-y-auto p-4 space-y-4">
    {/* Scrollable form fields */}
  </div>
  
  <DialogFooter className="border-t pt-4">
    {/* Actions buttons */}
  </DialogFooter>
</DialogContent>
```

### 4. Toast Notifications
- Success: "Đã lưu template thành công!"
- Error: "Lỗi khi lưu template"
- Info: "Đã thêm template 'Tên template'"

## Testing Checklist

- [x] Database migration thành công
- [x] Seed data tạo 2 templates
- [x] API endpoints hoạt động (CRUD + public)
- [x] Admin page hiển thị danh sách templates
- [x] Dialog thêm/sửa/xóa templates
- [x] Toggle published status
- [x] Duplicate templates
- [x] Page Builder sidebar tab Templates
- [x] Click template → Thêm vào canvas
- [x] Button "Lưu làm template" trong Page Builder
- [x] Dialog save template với validation
- [x] Lưu selected elements hoặc all elements
- [x] Admin sidebar menu link
- [ ] Test responsive mobile/tablet/desktop
- [ ] Test với nhiều templates (pagination nếu cần)

## File Changes Summary

### Files Created:
1. `prisma/schema.prisma` - BlockTemplate model
2. `prisma/seed-block-templates.ts` - Seed script
3. `app/api/admin/block-templates/route.ts` - Admin API CRUD
4. `app/api/block-templates/route.ts` - Public API
5. `app/admin/block-templates/page.tsx` - Admin management page
6. `BLOCK_TEMPLATES_FEATURE.md` - Documentation này

### Files Modified:
1. `components/page-builder/ComponentSidebar.tsx`
   - Thêm Tabs layout
   - Thêm Templates tab với fetch & display logic
   - Thêm handleAddTemplate function

2. `components/page-builder/PageBuilderEditor.tsx`
   - Import Blocks icon, Dialog components, Combobox
   - Thêm state cho save template dialog
   - Thêm CATEGORIES constant
   - Thêm handleSaveAsTemplate function
   - Thêm button "Template" vào toolbar
   - Thêm Dialog save template

3. `components/admin-sidebar.tsx`
   - Import Blocks icon
   - Thêm Block Templates menu item

## Tech Stack

- **Next.js 15**: App Router, Server/Client Components
- **Prisma**: ORM với PostgreSQL
- **Shadcn UI**: Component library
- **Zustand**: State management (Page Builder store)
- **Sonner**: Toast notifications
- **Lucide Icons**: Icon library

## Future Enhancements

1. **Thumbnail Auto-generation**
   - Tự động tạo screenshot của template khi lưu
   - Dùng html2canvas hoặc Puppeteer

2. **Category Management**
   - Admin có thể tạo categories tùy chỉnh
   - Model Category riêng

3. **Template Marketplace**
   - Share templates giữa các projects
   - Import/Export templates

4. **Version History**
   - Lưu lịch sử thay đổi templates
   - Rollback về version cũ

5. **Template Preview**
   - Preview full page với template trước khi add
   - Modal với iframe rendering

6. **Search & Filter**
   - Tìm kiếm templates theo tên
   - Filter theo category, author
   - Sort theo created date, popularity

7. **Template Analytics**
   - Thống kê số lần sử dụng
   - Templates phổ biến nhất

## Notes

- Templates lưu **deep copy** của elements, không reference
- Elements IDs được regenerate khi add vào canvas để tránh duplicate
- Offset ngẫu nhiên khi add để tránh chồng lên nhau hoàn toàn
- Admin có thể tạo templates từ Page Builder hoặc admin page
- Published templates hiển thị trong Page Builder sidebar
- Unpublished templates chỉ admin nhìn thấy trong quản lý

---

**Ngày tạo:** 13/11/2025  
**Version:** 1.0.0  
**Tác giả:** KataChannel Admin System
