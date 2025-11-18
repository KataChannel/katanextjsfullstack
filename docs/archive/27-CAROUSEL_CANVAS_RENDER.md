# Cập nhật Carousel Block Render trong Canvas

## Tổng quan
Đã hoàn thành việc render carousel block trong canvas của Block Editor với preview đầy đủ, mobile-first và thông tin slide.

## Thay đổi

### **SortableBlockRenderer.tsx** ✅
**File**: `components/block-editor/SortableBlockRenderer.tsx`

#### Thêm case 'carousel' vào renderContent()

**2 trạng thái render**:

#### 1. **Empty State** (Chưa có slides)
Hiển thị khi `slides.length === 0`:

```tsx
<div className="w-full h-[400px] md:h-[500px] bg-linear-to-r from-blue-900 to-blue-600 rounded-lg">
  <svg icon> // Icon hình ảnh
  <p>Carousel Block</p>
  <p>Chọn block và thêm slides trong Inspector</p>
  <div>Autoplay info</div>
</div>
```

**Tính năng**:
- Gradient background xanh dương
- Icon SVG hình ảnh (outline)
- Text hướng dẫn tiếng Việt
- Hiển thị thông tin autoplay & interval
- Responsive height: 400px mobile, 500px desktop

#### 2. **Preview State** (Có slides)
Hiển thị slide đầu tiên với đầy đủ content:

**Layout**:
```
┌─────────────────────────────────────┐
│ [Background Image]                   │
│   [Blue Gradient Overlay]            │
│                                      │
│   CÂU CHUYỆN (orange)                │
│   Về INNERBRIGHT (white, large)      │
│   Description text...                │
│   [Badge: Label | Highlight]         │
│                                      │
│   ● ─ ○ ○  (dots)      [3 slides]   │
└─────────────────────────────────────┘
```

**Các phần tử**:

1. **Background Image**
   - `position: absolute, inset-0`
   - `bg-cover bg-center`
   - Dynamic `backgroundImage` từ `firstSlide.image`

2. **Gradient Overlay**
   - `bg-linear-to-r from-blue-900/90 via-blue-800/70 to-transparent`
   - Tạo contrast cho text màu trắng

3. **Content Preview**
   - **Title**: Text màu cam `text-orange-400`, font-bold
   - **Subtitle**: Text trắng lớn, font-bold
   - **Description**: Text gray-200, line-clamp-2 (tối đa 2 dòng)
   - **Badge**: Background blue-600/80 với backdrop-blur
     - Hiển thị badge + badgeHighlight (nếu có)

4. **Dots Indicator** (Bottom center)
   - Active dot: `w-8 h-2 bg-white` (dài hơn)
   - Inactive dots: `w-2 h-2 bg-white/50`
   - Hiển thị tổng số slides

5. **Info Badge** (Top right)
   - Background: `bg-black/60 backdrop-blur-sm`
   - Hiển thị: Số slides + autoplay info
   - Format: "3 slides • Auto 5000ms"

## Responsive Design

### Mobile First ✅
- Height: `h-[400px]` (mobile) → `md:h-[500px]` (desktop)
- Text size: `text-2xl` (mobile) → `md:text-3xl` (desktop)
- Subtitle: `text-3xl` → `md:text-4xl`
- Description: `text-sm` → `md:text-base`
- Padding: `px-8` responsive cho content

### Breakpoints
- **Mobile**: < 768px - Height 400px, smaller text
- **Desktop**: ≥ 768px - Height 500px, larger text

## UX/UI Features

### Visual Feedback ✅
1. **Empty state**: Hướng dẫn rõ ràng + icon
2. **Preview realistic**: Giống carousel thật trên frontend
3. **Info badge**: Hiển thị metadata (số slides, autoplay)
4. **Dots indicator**: Visualize số lượng slides
5. **Line clamp**: Description không quá dài

### Color Scheme
- **Background gradient**: Blue 900 → 800 (opacity)
- **Title**: Orange 400 (brand color)
- **Subtitle**: White (high contrast)
- **Description**: Gray 200 (softer)
- **Badge**: Blue 600/80 (semi-transparent)

### Typography
- **Title**: 2xl-3xl, bold, orange
- **Subtitle**: 3xl-4xl, bold, white
- **Description**: sm-base, normal, gray
- **Badge**: sm, normal/bold

## Integration với Block Editor

### Selectable & Draggable ✅
Carousel block có đầy đủ tính năng:
- Click để select → Ring blue
- Hover → Ring gray
- Drag handle (grip icon)
- Delete button khi selected
- Toolbar với type badge

### Inspector Integration ✅
Khi click vào carousel block:
- BlockInspector mở tab "Nội dung"
- Hiển thị carousel settings (autoplay, interval)
- Danh sách slides với thumbnail
- Nút thêm/sửa/xóa/di chuyển slides

## Data Flow

```
User drags carousel from sidebar
  → Block created with default content (1 slide)
  → Rendered in canvas (preview first slide)
  → User clicks block → Inspector opens
  → User edits slides → Canvas updates (re-renders preview)
  → Save → Carousel data saved to page
```

## Preview vs Production

### Canvas Preview (SortableBlockRenderer)
- Shows **first slide only** (static)
- Info badge with metadata
- Dots indicator (not interactive)
- No auto-play animation
- Optimized for editing experience

### Frontend Render (CarouselBlock)
- Shows **all slides** with transitions
- Auto-play with interval
- Interactive dots navigation
- Arrow buttons (desktop)
- Full carousel functionality

## Technical Details

### Conditional Rendering
```tsx
case 'carousel': {
  const slides = content?.slides || [];
  
  if (slides.length === 0) {
    return <EmptyState />; // Guide user to add slides
  }
  
  return <PreviewState firstSlide={slides[0]} />; // Show first slide
}
```

### Performance
- No carousel animation in canvas (saves performance)
- Only renders first slide (lightweight)
- Static preview (no React hooks)
- Efficient re-render on content update

### Accessibility
- SVG icon with proper stroke
- Semantic HTML structure
- Readable text colors (contrast)
- Clear visual hierarchy

## Tuân thủ Rules

### Mobile First ✅
- Height responsive: 400px → 500px
- Text size responsive
- Padding/spacing mobile-optimized

### Tailwind CSS ✅
- All styling via utility classes
- `bg-linear-to-r` (not bg-gradient-to-r)
- Consistent spacing scale
- Responsive modifiers (md:)

### Tiếng Việt ✅
- "Carousel Block"
- "Chọn block và thêm slides trong Inspector"
- "Tự động chuyển" / "Không tự động chuyển"
- "slides" (metadata text)

### Shadcn UI Consistency ✅
- Follows existing block styling patterns
- Uses same hover/select styles
- Integrates with toolbar system
- Matches color scheme

## Testing Checklist

✅ Kéo carousel từ sidebar → Block xuất hiện  
✅ Empty state hiển thị đúng (chưa có slides)  
✅ Thêm slide → Preview cập nhật (hiển thị slide đầu)  
✅ Click block → Inspector mở  
✅ Sửa slide content → Canvas re-render  
✅ Thêm nhiều slides → Dots indicator cập nhật  
✅ Bật/tắt autoplay → Info badge cập nhật  
✅ Responsive: Mobile 400px, Desktop 500px  
✅ Hover/Select styles hoạt động  
✅ Drag & drop carousel block  

## Files Modified

```
components/block-editor/
  SortableBlockRenderer.tsx    # CẬP NHẬT - Thêm carousel case
```

## Code Changes Summary

**Added carousel case** (~100 lines):
- Empty state with icon + guide text
- Preview state with first slide
- Background image + gradient overlay
- Content layout (title, subtitle, description, badge)
- Dots indicator (visual only)
- Info badge (top-right metadata)
- Responsive styling (mobile-first)

## Next Steps (Optional)

❌ **Interactive preview**: Click dots để xem slides khác (không cần thiết)  
❌ **Animation preview**: Auto-play trong canvas (tốn performance)  
❌ **Full carousel in canvas**: Render toàn bộ carousel (overkill)  

**Lý do không làm**:
- Canvas chỉ cần preview cơ bản
- User có thể test carousel trên frontend
- Performance > fancy preview

---

**Ngày hoàn thành**: 18/11/2025  
**Status**: ✅ Hoàn thành carousel canvas render  
**Tuân thủ**: rulepromt.txt - Mobile First, Responsive, Tiếng Việt
