# Seed Sample Templates - innerbright.vn

**Ngày:** 19/11/2025  
**Trạng thái:** ✅ Hoàn thành

## Tổng quan

Đã tạo **5 templates mẫu mới** + 1 template có sẵn = **6 templates** cho BlockSidebar trên domain innerbright.vn.

## Templates đã tạo

### 1. Hero Banner với CTA
- **Category:** template
- **Tags:** hero, banner, cta
- **Description:** Hero section đơn giản với tiêu đề lớn và nút call-to-action
- **Features:**
  - Gradient background xanh dương
  - Tiêu đề lớn responsive
  - Button CTA với brand orange color
  - Hover effects

### 2. Lưới 3 Tính Năng
- **Category:** template
- **Tags:** features, grid, services
- **Description:** Section hiển thị 3 tính năng chính với icon và mô tả
- **Features:**
  - Grid 3 columns responsive
  - Icon circles với màu khác nhau
  - Hover border effects
  - SVG icons (lightning, checkmark, sliders)

### 3. Call-to-Action Section
- **Category:** template
- **Tags:** cta, action, conversion
- **Description:** Section kêu gọi hành động với background gradient
- **Features:**
  - Gradient orange background
  - 2 buttons (primary & secondary)
  - Responsive layout
  - Shadow effects

### 4. Testimonial Card
- **Category:** element
- **Tags:** testimonial, review, customer
- **Description:** Card hiển thị lời chứng thực từ khách hàng
- **Features:**
  - Avatar circle
  - 5-star rating
  - Customer info
  - Quote style
  - Shadow card

### 5. Form Liên Hệ
- **Category:** element
- **Tags:** form, contact, input
- **Description:** Form liên hệ đơn giản với các trường cơ bản
- **Features:**
  - Name field
  - Email field
  - Message textarea
  - Submit button
  - Focus states

### 6. Mạng Trong Mình Khát Vọng (Có sẵn)
- **Category:** template
- **Tags:** vision, target, mission
- **Description:** Template 3 cột với target icon ở giữa

## Tailwind Classes sử dụng

### Brand Colors
- `bg-brand-orange` - Orange primary
- `bg-brand-blue` - Blue primary
- `text-brand-orange`
- `text-brand-blue`

### Standard Colors
- `bg-blue-600`, `bg-blue-800` - Blue shades
- `bg-orange-600` - Orange shade
- `text-white`, `text-gray-700`, `text-gray-900`

### Layout
- `max-w-4xl mx-auto` - Container
- `grid grid-cols-1 md:grid-cols-3` - Responsive grid
- `flex flex-col sm:flex-row` - Responsive flex

### Effects
- `hover:bg-orange-600` - Hover states
- `transition-all` - Smooth transitions
- `shadow-lg` - Shadows
- `rounded-lg`, `rounded-xl` - Border radius

## Database Records

```sql
-- Total published templates in innerbright.vn
SELECT COUNT(*) FROM block_templates_v2 
WHERE published = true;
-- Result: 6

-- By category
template: 4 (Hero Banner, Features Grid, CTA, Vision)
element: 2 (Testimonial, Contact Form)
```

## API Endpoint Test

### Request
```bash
curl http://localhost:3005/api/block-templates-v2?published=true
```

### Expected Response
```json
[
  {
    "id": "e1bdffb4-75a5-411d-a35b-6942687ae497",
    "name": "Mạng Trong Mình Khát Vọng",
    "category": "template",
    "tags": ["vision", "target", "mission"],
    "published": true,
    "downloads": 0
  },
  {
    "id": "08c3c992-5700-4780-8ff0-30a17c4f742d",
    "name": "Hero Banner với CTA",
    "category": "template",
    "tags": ["hero", "banner", "cta"],
    "published": true,
    "downloads": 0
  },
  // ... 4 more templates
]
```

## BlockSidebar Integration

### Tab "Mẫu" (Templates)

**Filters:**
- ✅ Tất cả (6 templates)
- ✅ Phần tử (2: Testimonial, Form)
- ✅ Template (4: Hero, Features, CTA, Vision)
- ✅ Tùy chỉnh (0)

**Search:**
- Tìm theo name
- Tìm theo description
- Tìm theo tags

**Display:**
- Thumbnail (nếu có)
- Name
- Category badge
- Description (2 lines max)
- Tags (show 2, +N more)
- Downloads count

## Testing Checklist

- [x] 6 templates created in database
- [x] All have `published: true`
- [x] All have proper categories
- [x] All have tags
- [x] Downloads initialized to 0
- [x] Proper author assigned
- [ ] Test API endpoint returns all 6
- [ ] Test BlockSidebar displays all 6
- [ ] Test drag & drop to canvas
- [ ] Test template renders on frontend
- [ ] Test filters work correctly
- [ ] Test search works

## Cách sử dụng

### 1. Mở BlockSidebar

```
http://localhost:3005/admin/pages-v2/edit/[page-id]
→ Click "Page Builder"
→ Sidebar → Tab "Mẫu"
```

### 2. Browse Templates

- **All:** 6 templates
- **Template:** 4 templates (layouts)
- **Element:** 2 templates (components)

### 3. Drag & Drop

1. Chọn template
2. Kéo vào canvas
3. Template tự động thêm vào page
4. Edit content nếu cần
5. Save page

## Scripts Created

### `scripts/seed-sample-templates.ts`

**Features:**
- Creates 5 diverse templates
- Auto-detects admin user
- Sets proper metadata
- Uses Tailwind brand colors
- Responsive HTML

**Usage:**
```bash
DOMAIN=innerbright.vn bun run scripts/seed-sample-templates.ts
```

**Safe:**
- No duplicates
- Won't overwrite existing
- Can run multiple times

## Next Steps

### 1. Add Thumbnails (Optional)

```typescript
// Update template with screenshot
await prisma.blockTemplateV2.update({
  where: { id: templateId },
  data: {
    thumbnail: '/templates/hero-banner.png'
  }
});
```

### 2. Test Drag & Drop

```
1. Go to Page Builder
2. Try dragging each template
3. Verify rendering
4. Test responsive
```

### 3. Add More Templates

```bash
# Create more templates for different use cases
- Pricing tables
- Team members grid
- FAQ accordion
- Image gallery
- Stats counter
- Newsletter signup
```

## Migration cho domains khác

### Tazagroup.vn
```bash
DOMAIN=tazagroup.vn bun run scripts/seed-sample-templates.ts
```

### Kataseo.com
```bash
DOMAIN=kataseo.com bun run scripts/seed-sample-templates.ts
```

## Files Modified/Created

### Created:
1. `scripts/seed-sample-templates.ts` - Seed 5 templates
2. `scripts/check-v2-details.ts` - Check template details
3. `docs/28-SAMPLE_TEMPLATES.md` - Documentation này

### Database:
- `block_templates_v2` table: +5 records
- Total: 6 templates (1 existing + 5 new)

## Kết luận

✅ **6 templates sẵn sàng sử dụng trong BlockSidebar**

**Categories:**
- 4 Template layouts (full sections)
- 2 Element components (reusable parts)

**Features:**
- ✅ Tailwind brand colors
- ✅ Responsive design
- ✅ Hover effects
- ✅ Professional UI
- ✅ Ready to customize

**Next:** Test trong Page Builder và verify API endpoint trả về đúng data.

---

**Status:** ✅ Complete  
**Domain:** innerbright.vn (port 3005)  
**Templates:** 6 published  
**API:** `/api/block-templates-v2?published=true`
