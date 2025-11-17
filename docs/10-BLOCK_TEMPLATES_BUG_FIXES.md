# Block Templates - Bug Fixes Update

## Ngày: 13/11/2025

## Vấn đề đã fix

### 1. Templates không hiển thị trong Page Builder
**Nguyên nhân:** 
- Format của elements trong seed cũ (`seed-block-templates.ts`) không match với cấu trúc `BuilderElement` của Page Builder
- Seed cũ dùng format: `styles`, `props` 
- Page Builder expect: `x`, `y`, `width`, `height`, `layout`, `style`, `states`, `animation`

**Giải pháp:**
- Tạo file seed mới `prisma/seed-block-templates-v2.ts` với format đúng
- Elements giờ có đầy đủ properties: position (x, y), size (width, height), style, states, animation
- Run seed: `bun prisma/seed-block-templates-v2.ts`

**Kết quả:**
- Template "Mạng Trong Mình Khát Vọng" hiển thị đúng với 17 elements
- Template "Hero Banner Đơn Giản" hiển thị đúng với 4 elements
- Elements được đặt ở vị trí (50, 50) để dễ nhìn thấy ngay khi add vào canvas

### 2. Không edit được elements trong Admin Page
**Nguyên nhân:**
- Admin page chỉ có form edit metadata (name, description, category)
- Không có UI để edit visual elements

**Giải pháp:**
- Thêm note hướng dẫn trong dialog edit template:
  ```
  💡 Để chỉnh sửa elements: Vào Page Builder, chọn tab "Templates", 
  click vào template này để add vào canvas, sau đó chỉnh sửa 
  và lưu lại làm template mới.
  ```
- Workflow: Admin page để quản lý metadata, Page Builder để edit visual

**Kết quả:**
- User hiểu rõ cách edit template elements
- Tách biệt rõ quản lý metadata vs visual editing

### 3. Elements add vào canvas nhưng không thấy
**Nguyên nhân:**
- Elements có position lớn (x: 350-830, y: 220-400) nằm ngoài viewport ban đầu
- Offset ngẫu nhiên làm elements càng xa hơn

**Giải pháp:**
- Tính bounding box của template (minX, minY)
- Offset để đặt template ở vị trí (50, 50) - top-left của canvas
- Code:
  ```typescript
  const minX = Math.min(...template.elements.map(el => el.x || 0));
  const minY = Math.min(...template.elements.map(el => el.y || 0));
  const offsetX = 50 - minX;
  const offsetY = 50 - minY;
  ```

**Kết quả:**
- Templates luôn hiển thị ở vị trí nhìn thấy được
- User không cần scroll hoặc zoom để tìm elements

### 4. Thiếu logging để debug
**Giải pháp:**
- Thêm console.log trong `handleAddTemplate`:
  - Template name và element count
  - Từng element được add với position
  - Success/error count
- Toast hiển thị số elements đã add: "Đã thêm template 'X' (15/17 elements)"

**Kết quả:**
- Dễ debug nếu có elements bị lỗi
- User biết chính xác có bao nhiêu elements được add

## Files đã thay đổi

### 1. `prisma/seed-block-templates-v2.ts` (NEW)
- Seed file mới với format đúng BuilderElement
- 2 templates: "Mạng Trong Mình Khát Vọng" (17 elements), "Hero Banner Đơn Giản" (4 elements)
- Elements có đầy đủ: id, type, name, x, y, width, height, content, layout, style, states, animation

### 2. `app/admin/block-templates/page.tsx`
**Changes:**
- Thêm note hướng dẫn edit elements trong dialog
- Hiển thị khi có selectedTemplate và elements.length > 0
- UI: Blue info box với icon 💡

### 3. `components/page-builder/ComponentSidebar.tsx`
**Changes:**
- Tính bounding box để center template
- Offset thông minh: đặt template ở (50, 50)
- Thêm console.log chi tiết
- Toast hiển thị progress: "X/Y elements"
- Try/catch cho từng element để tránh fail all nếu 1 element lỗi

## Template Structure

### Template: "Mạng Trong Mình Khát Vọng"

**Layout:**
```
┌─────────────────────────────────────┐
│      MẠNG TRONG MÌNH (Orange)       │
│        KHÁT VỌNG (Blue)             │
├─────────┬──────────┬────────────────┤
│ SỨ MỆNH │ TẦM NHÌN │ GIẢI TRÍ CỐT LÕI│
│ (Orange)│ (Orange) │    (Orange)    │
│         │          │                │
│ Text về │ Text về  │ • Hệ thống     │
│ sứ mệnh │ tầm nhìn │ • Hợp nhất     │
│         │          │ • Từ tế        │
└─────────┴──────────┴────────────────┘
```

**17 Elements:**
1. Heading "MẠNG TRONG MÌNH" (x: 350, y: 40)
2. Heading "KHÁT VỌNG" (x: 300, y: 100)
3. Container Left (x: 50, y: 220)
4. Heading "SỨ MỆNH" (x: 50, y: 220)
5. Text sứ mệnh (x: 50, y: 290)
6. Container Center (x: 440, y: 220)
7. Heading "TẦM NHÌN" (x: 440, y: 220)
8. Text tầm nhìn (x: 440, y: 290)
9. Container Right (x: 830, y: 220)
10. Heading "GIẢI TRÍ CỐT LÕI" (x: 830, y: 220)
11-13. Text bullets (x: 830, y: 290-370)

**Colors:**
- Orange: #fb923c (Headers)
- Blue: #2563eb (Main title)
- Gray: #374151 (Body text)

## Testing Checklist

- [x] Seed v2 chạy thành công
- [x] 2 templates được tạo trong database
- [x] Templates hiển thị trong admin page
- [x] Click template trong Page Builder → Elements được add vào canvas
- [x] Elements hiển thị ở vị trí nhìn thấy được (50, 50)
- [x] Console log chi tiết khi add template
- [x] Toast thông báo số elements đã add
- [x] Note hướng dẫn edit trong admin dialog
- [x] No compile errors

## Known Limitations

1. **No Visual Editor trong Admin:**
   - Admin page chỉ edit metadata
   - Phải dùng Page Builder để edit elements
   - Lý do: Tránh duplicate logic, Page Builder đã có đầy đủ UI

2. **Seed file cũ có lỗi:**
   - `prisma/seed-block-templates.ts` - deprecated
   - Dùng `prisma/seed-block-templates-v2.ts` thay thế

3. **No Template Preview:**
   - Admin page không có live preview của template
   - Chỉ có thumbnail URL (optional)
   - Future: Generate screenshot tự động

## Workflow sử dụng

### Tạo Template mới:
1. Vào Page Builder
2. Thiết kế layout
3. Click button "Template" trên toolbar
4. Điền form (name, description, category)
5. Save → Template xuất hiện trong admin page và Templates tab

### Sử dụng Template:
1. Vào Page Builder
2. Click tab "Templates" trong sidebar trái
3. Click vào template muốn dùng
4. Elements tự động add vào canvas tại (50, 50)
5. Edit và save page

### Quản lý Template:
1. Vào Admin → Block Templates
2. Edit metadata (name, description, category)
3. Toggle published status
4. Duplicate hoặc delete templates
5. Để edit elements: Load template trong Page Builder, edit, save as new

## Notes

- Elements position được preserve từ template
- Mỗi lần add template sẽ generate new IDs
- Templates không reference elements gốc (deep copy)
- Offset đảm bảo template luôn visible
- Console log giúp debug issues

---

**Status:** ✅ RESOLVED  
**Priority:** HIGH  
**Impact:** Templates giờ hoạt động đầy đủ và đúng như thiết kế
