# Bổ sung Carousel cho Page Builder

## Tóm tắt
Thêm component Carousel vào Page Builder với auto-play, dots navigation, arrows control. Đã thêm carousel vào trang InnerBright như thiết kế.

## Thay đổi chính

### 1. Store & Types (`lib/page-builder/store.ts`)
- Thêm `'carousel'` vào `ElementType`
- Interface mới: `CarouselSlide` (id, image, title, description, link, alt)
- Interface mới: `CarouselSettings` (slides, autoPlay, interval, showDots, showArrows, height)
- Thêm `carousel?: CarouselSettings` vào `BuilderElement`

### 2. Carousel Component (`components/page-builder/CarouselComponent.tsx`)
- Component React với auto-play timer
- Transitions smooth giữa slides (500ms)
- Dots indicator responsive (dots nhỏ → active dài hơn)
- Arrow controls (ẩn mobile, hiện hover desktop)
- Overlay gradient cho title/description
- Mobile First + Responsive design

### 3. Component Sidebar
- Thêm `ImagePlay` icon
- Template carousel với 3 slides mặc định
- Default: 1200x500px, auto-play 5s, show dots + arrows

### 4. Canvas Rendering
- Placeholder xanh với text "🎠 CAROUSEL"
- Border highlight khi select
- Hiển thị để drag/resize như element khác

### 5. Inspector Panel
- Tab mới "Carousel" (3 tabs: Style/Layout/Carousel)
- Settings:
  - Auto Play checkbox
  - Interval (ms) input
  - Chiều cao input
  - Show Dots checkbox
  - Show Arrows checkbox
  - Hiển thị số slides

### 6. Responsive Preview
- Render carousel thực tế với `CarouselComponent`
- Auto-play hoạt động trong preview
- Responsive theo breakpoint (mobile/tablet/desktop)

### 7. InnerBright Demo
- Script: `add-innerbright-carousel.ts`
- Page: `4a83da73-fdf0-467a-be5e-8906ee05c18c`
- 3 slides:
  1. "CÂU CHUYỆN về INNERBRIGHT"
  2. "CHƯƠNG TRÌNH ĐÀO TẠO"  
  3. "CHLOE QUÝ CHÂU - Bồi nhà đào tạo"
- Đã add thành công vào database innerv2core

## Giao diện

### Canvas (Editor)
```
┌─────────────────────────────────┐
│      🎠 CAROUSEL                │
│   (Blue placeholder box)        │
└─────────────────────────────────┘
```

### Preview (Actual)
```
┌─────────────────────────────────┐
│  [<]  Slide Image  [>]          │
│                                 │
│  Title                          │
│  Description                    │
│                                 │
│  ○ ● ○ (Dots)                  │
└─────────────────────────────────┘
```

## Packages
- `@radix-ui/react-switch@1.2.6` - Switch component cho toggle settings

## Files
- `lib/page-builder/store.ts` - Types & interfaces
- `components/page-builder/CarouselComponent.tsx` - NEW: Carousel component
- `components/page-builder/ComponentSidebar.tsx` - Added carousel template
- `components/page-builder/Canvas.tsx` - Added carousel placeholder
- `components/page-builder/Inspector.tsx` - Added carousel tab
- `components/page-builder/ResponsivePreview.tsx` - Render carousel
- `scripts/add-innerbright-carousel.ts` - NEW: Add demo carousel

## Kết quả
✅ Carousel component hoàn chỉnh với auto-play
✅ Responsive Mobile First design
✅ Dots + Arrows navigation
✅ Inspector settings đầy đủ
✅ Canvas placeholder để drag/resize
✅ Preview render carousel thực
✅ Đã thêm vào trang InnerBright (8 elements tổng)

---
**Ngày**: 13/11/2025
