# Cập Nhật Carousel Component

## Tổng Quan
Đã thêm carousel component cho page builder với thiết kế giống hình mẫu, hỗ trợ mobile-first và responsive.

## Các File Đã Tạo/Cập Nhật

### 1. Component Carousel (`components/carousel.tsx`)
- **Tính năng:**
  - Auto-play với interval tùy chỉnh
  - Navigation arrows (ẩn trên mobile)
  - Dots indicator ở dưới
  - Responsive: mobile-first design
  - Gradient overlay từ trái sang phải
  - Hỗ trợ nhiều slides với transitions mượt mà

- **Props:**
  - `slides`: Mảng các slide với image, title, subtitle, description, badge
  - `autoplay`: Tự động chuyển slide (mặc định: true)
  - `interval`: Thời gian giữa các slide (mặc định: 5000ms)

### 2. Script Thêm Dữ Liệu (`scripts/add-carousel-to-page.ts`)
- Thêm carousel block vào đầu page "Về InnerBright" (ID: 4a83da73-fdf0-467a-be5e-8906ee05c18c)
- Cấu trúc dữ liệu:
  ```typescript
  {
    type: 'carousel',
    content: {
      autoplay: true,
      interval: 5000,
      slides: [
        {
          id: 'slide-1',
          image: '/images/carousel-1.jpg',
          title: 'CÂU CHUYỆN',
          subtitle: 'Về INNERBRIGHT',
          description: '...',
          badge: 'Bởi nhà đào tạo',
          badgeHighlight: 'CHLOE QUÝ CHÂU'
        }
      ]
    }
  }
  ```

### 3. Cập Nhật Renderers
- **BlocksV2Renderer** (`app/(public)/[slug]/page.tsx`): Thêm case 'carousel'
- **PageBlocksRenderer** (`components/custom-homepage.tsx`): Thêm case 'carousel'

## Thiết Kế Responsive

### Mobile (< 768px)
- Height: 500px
- Text size nhỏ hơn
- Ẩn navigation arrows
- Chỉ hiển thị dots navigation
- Badge hiển thị dạng cột (flex-col)

### Desktop (≥ 768px)
- Height: 600px
- Text size lớn hơn
- Hiển thị navigation arrows
- Badge hiển thị dạng hàng (flex-row)
- Dots navigation lớn hơn

## Màu Sắc & Styling
- **Background**: Blue gradient overlay (blue-900/90 → blue-800/70 → transparent)
- **Title**: Orange-400 (CÂU CHUYỆN)
- **Subtitle**: White, size lớn (Về INNERBRIGHT)
- **Badge**: Blue-600 với backdrop blur
- **Dots**: White với animation width khi active

## Sử Dụng
1. Carousel đã được thêm vào page "Về InnerBright"
2. Truy cập: http://localhost:3005/ve-innerbright
3. Carousel sẽ tự động chạy với 3 slides mẫu

## Lưu Ý
- **Hình ảnh**: Hiện đang dùng placeholder `/images/carousel-1.jpg`, cần thay bằng URL thực
- **PWA Ready**: Component hỗ trợ touch gestures trên mobile
- **Performance**: Sử dụng CSS transitions thay vì JavaScript animations
- **Accessibility**: Có aria-labels cho navigation buttons

## Tuân Thủ Rule Prompt
✅ Mobile-first design  
✅ Responsive với breakpoints  
✅ Shadcn UI styling  
✅ Tiếng Việt  
✅ Clean Architecture  
✅ Performance optimized (CSS transitions)  
✅ PWA-ready  
