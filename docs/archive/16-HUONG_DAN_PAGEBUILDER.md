# 🎨 Hướng dẫn sử dụng Page Builder với Dữ liệu mẫu

## 📊 Dữ liệu mẫu đã tạo

Đã tạo **3 pages mẫu** trong database:

### 1. Landing Page Demo
- **Slug:** `/pages/landing-page-demo`
- **Nội dung:** Hero section với heading, text, button và features container
- **Elements:** 5 components (Container, Heading, Text, Button, Container)
- **Grid:** 8px
- **Màu sắc:** Gradient xanh tím (#667eea → #764ba2)

### 2. Pricing Demo
- **Slug:** `/pages/pricing-demo`
- **Nội dung:** Pricing page với 3 pricing cards
- **Elements:** 4 components (Heading, 3 Containers for pricing cards)
- **Grid:** 8px
- **Highlight:** Card giữa có gradient background và border

### 3. Contact Demo
- **Slug:** `/pages/contact-demo`
- **Nội dung:** Contact page với form card
- **Elements:** 5 components (Containers, Heading, Text, Button)
- **Grid:** 12px
- **Background:** Light gray (#f7fafc)

---

## 🚀 Cách sử dụng

### 1. Xem danh sách Pages
```bash
# Truy cập page builder list
http://localhost:3000/admin/page-builder-list
```

Trang này hiển thị:
- ✅ Tổng số pages
- ✅ Số pages đã publish
- ✅ Số pages draft
- ✅ Grid cards với preview và actions

### 2. Chỉnh sửa Page
Từ danh sách, click **"Chỉnh sửa"** trên page bất kỳ:

```bash
# Edit landing page
http://localhost:3000/admin/page-builder/{pageId}
```

### 3. Tính năng Editor

#### Grid Controls Toolbar
- **Grid Size Selector:** 1px, 4px, 8px, 12px, 16px
- **Snap:** Bật/tắt snap to grid
- **Grid:** Hiện/ẩn grid lines
- **Magnetic:** Bật/tắt magnetic alignment

#### Keyboard Shortcuts
- `Ctrl + C` - Copy element
- `Ctrl + V` - Paste element
- `Ctrl + D` - Duplicate element
- `Delete` - Xóa element
- `Arrow keys` - Di chuyển element (1px steps)

#### Right-click Context Menu
- **Copy CSS** - Copy CSS của element
- **Duplicate** - Nhân đôi element
- **Delete** - Xóa element
- **Bring to Front** - Đưa lên trên cùng
- **Send to Back** - Đưa xuống dưới cùng

#### Toolbar Actions
- **Preview** - Xem preview responsive
- **Export HTML** - Export clean HTML + Tailwind
- **Lưu** - Lưu vào database

---

## 🎯 Workflow Demo

### Scenario 1: Edit Landing Page
1. Vào `/admin/page-builder-list`
2. Click "Chỉnh sửa" trên **Landing Page Demo**
3. Editor load với 5 elements sẵn có
4. Thử thay đổi:
   - Click hero heading → Inspector → đổi color
   - Right-click button → Duplicate
   - Drag button mới xuống dưới
   - Ctrl + Z để undo
5. Click **Lưu** để save vào database
6. Click **Preview** để xem responsive
7. Click **Export HTML** để download

### Scenario 2: Tạo Pricing Card mới
1. Edit **Pricing Demo**
2. Từ Sidebar, drag **Container** vào canvas
3. Inspector → Style tab:
   - Background: `#ffffff`
   - Border radius: `16px`
   - Padding: `40px`
4. Add **Heading** vào trong container
5. Add **Text** cho price
6. Add **Button** cho CTA
7. Right-click card → Copy CSS để reuse
8. Lưu page

### Scenario 3: Responsive Testing
1. Edit bất kỳ page nào
2. Click **Preview**
3. Toolbar hiện breakpoint selector:
   - 📱 Mobile (375px)
   - 📱 Tablet (768px)
   - 💻 Desktop (1024px)
4. Kiểm tra layout trên mỗi breakpoint

---

## 💾 Cấu trúc dữ liệu

### Database Schema
```typescript
model Page {
  id          String   @id
  title       String
  slug        String   @unique
  blocks      Json?    // ← Page builder data
  published   Boolean
  // ... other fields
}
```

### Blocks JSON Structure
```json
{
  "canvas": {
    "width": 1440,
    "height": 900,
    "zoom": 1,
    "snapToGrid": true,
    "gridSize": 8,
    "showGrid": true,
    "magneticAlignment": true,
    "selectedIds": []
  },
  "elements": [
    {
      "id": "hero-container",
      "type": "container",
      "x": 0,
      "y": 0,
      "width": 1440,
      "height": 600,
      "styles": {
        "background": "linear-gradient(...)",
        "display": "flex",
        "flexDirection": "column"
      },
      "children": []
    }
  ],
  "history": {
    "past": [],
    "future": []
  }
}
```

---

## 🔄 Tạo dữ liệu mẫu mới

### Chạy seed script
```bash
bun run db:seed-pagebuilder
```

Script sẽ:
1. ✅ Tạo user admin (`admin@pagebuilder.com`)
2. ✅ Tạo 3 pages mẫu với blocks JSON
3. ✅ Set published = true

### Custom seed data
Sửa file `prisma/seed-pagebuilder.ts`:

```typescript
const customPage = await prisma.page.upsert({
  where: { slug: 'my-custom-page' },
  create: {
    title: 'My Custom Page',
    slug: 'my-custom-page',
    published: true,
    authorId: admin.id,
    blocks: {
      canvas: {
        width: 1440,
        height: 900,
        zoom: 1,
        snapToGrid: true,
        gridSize: 8,
        showGrid: true,
        magneticAlignment: true,
        selectedIds: [],
      },
      elements: [
        // Your custom elements here
      ],
      history: { past: [], future: [] },
    },
  },
});
```

---

## 📝 API Endpoints

### GET /api/pages
Lấy danh sách tất cả pages

### GET /api/pages/[id]
Lấy chi tiết 1 page

### PUT /api/pages/[id]
Update page (bao gồm blocks)

```typescript
fetch(`/api/pages/${pageId}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    blocks: {
      canvas: { ... },
      elements: [ ... ],
    },
  }),
});
```

---

## ✨ Tính năng nâng cao

### 1. Version Control
- Undo/Redo với history tracking
- Store past/future states trong Zustand

### 2. Auto-save
Thêm auto-save sau mỗi 30s:

```typescript
useEffect(() => {
  const interval = setInterval(() => {
    handleSave();
  }, 30000);
  return () => clearInterval(interval);
}, []);
```

### 3. Collaboration
- Real-time sync với WebSocket
- Cursor tracking
- Lock elements đang edit

### 4. Templates
Tạo page từ template:

```typescript
const template = await prisma.page.findUnique({
  where: { slug: 'template-landing' },
});

const newPage = await prisma.page.create({
  data: {
    ...template,
    id: undefined,
    slug: 'new-landing',
    blocks: template.blocks, // Clone blocks
  },
});
```

---

## 🎨 Customization

### Thêm Component mới
1. Update `BuilderElement` type trong `store.ts`
2. Add render case trong `Canvas.tsx`
3. Add component vào `ComponentSidebar.tsx`

### Custom Grid Sizes
Update `GridSize` type trong `store.ts`:

```typescript
export type GridSize = 1 | 4 | 8 | 12 | 16 | 24 | 32;
```

### Custom Breakpoints
Update `Breakpoint` type trong `store.ts`:

```typescript
export type Breakpoint = 
  | { name: 'Mobile'; width: 375; height: 667 }
  | { name: 'Tablet'; width: 768; height: 1024 }
  | { name: 'Desktop'; width: 1440; height: 900 }
  | { name: 'Custom'; width: number; height: number };
```

---

## 🐛 Troubleshooting

### Page không load elements
Kiểm tra structure của `blocks` trong database:

```sql
SELECT id, title, blocks FROM pages WHERE slug = 'landing-page-demo';
```

### Elements không hiển thị
1. Check console errors
2. Verify `blocks.elements` là array
3. Check element types có match với render cases

### Save không hoạt động
1. Check API endpoint `/api/pages/[id]` exists
2. Verify request body format
3. Check Prisma client connection

---

## 📚 Resources

- **Page Builder Store:** `lib/page-builder/store.ts`
- **Canvas Component:** `components/page-builder/Canvas.tsx`
- **Editor Component:** `components/page-builder/PageBuilderEditor.tsx`
- **Seed Script:** `prisma/seed-pagebuilder.ts`

---

## 🎉 Next Steps

1. ✅ Test edit các pages mẫu
2. ✅ Thử keyboard shortcuts và context menu
3. ✅ Export HTML và kiểm tra output
4. 🔄 Tạo pages mới từ blank canvas
5. 🔄 Implement auto-save
6. 🔄 Add more atomic components
7. 🔄 Implement templates system

**Chúc bạn build pages thành công! 🚀**
