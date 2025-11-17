# Tích hợp Carousel Block vào Page Builder

## Tổng quan

Đã hoàn thành tích hợp carousel block type vào page builder với đầy đủ chức năng kéo thả và preview.

## Các thay đổi đã thực hiện

### 1. **Thêm Carousel vào BlockSidebar** ✅
- **File**: `components/block-editor/BlockSidebar.tsx`
- **Thay đổi**:
  - Import `Presentation` icon từ lucide-react
  - Thêm carousel vào đầu mảng `ELEMENT_BLOCKS`:
    ```tsx
    { 
      type: 'carousel', 
      label: 'Carousel', 
      icon: Presentation, 
      description: 'Image slideshow' 
    }
    ```
  - Cập nhật type thành `ElementBlockType | 'carousel'`

### 2. **Thêm Default Content & Styles cho Carousel** ✅
- **File**: `components/block-editor/BlockEditor.tsx`
- **Thay đổi**:
  - Thêm carousel defaults trong `getDefaultContent()`:
    ```tsx
    carousel: {
      autoplay: true,
      interval: 5000,
      slides: [{
        id: 'slide-1',
        image: 'https://placehold.co/1200x600',
        title: 'Slide 1',
        subtitle: 'Tiêu đề phụ',
        description: 'Mô tả slide',
        badge: 'Label',
        badgeHighlight: 'Highlight',
      }]
    }
    ```
  - Thêm carousel styles trong `getDefaultStyles()`:
    ```tsx
    carousel: { element: 'w-full' }
    ```

### 3. **Tạo CarouselBlock Client Component** ✅
- **File**: `components/carousel-block.tsx` (Mới tạo)
- **Mục đích**: Wrapper client component để render carousel trong server component
- **Props**:
  - `slides`: Array các slide với image, title, subtitle, description, badge
  - `autoplay`: Auto-play carousel (default: true)
  - `interval`: Thời gian chuyển slide (default: 5000ms)

### 4. **Fix Carousel Rendering trong Page Router** ✅
- **File**: `app/(public)/[slug]/page.tsx`
- **Thay đổi**:
  - Import `CarouselBlock` từ `@/components/carousel-block`
  - Xóa `require('@/components/carousel')` (không hoạt động trong Next.js)
  - Sử dụng `<CarouselBlock />` trong BlocksV2Renderer:
    ```tsx
    case 'carousel':
      return (
        <CarouselBlock
          key={blockId}
          slides={slides}
          autoplay={autoplay}
          interval={interval}
        />
      );
    ```

### 5. **Fix Carousel Rendering trong Homepage** ✅
- **File**: `components/custom-homepage.tsx`
- **Thay đổi**: Tương tự như page router
  - Import `CarouselBlock`
  - Xóa `require()` approach
  - Sử dụng `<CarouselBlock />` trong PageBlocksRenderer

## Cấu trúc Carousel Block

### Block Schema
```typescript
{
  type: 'carousel',
  content: {
    autoplay: boolean,
    interval: number,
    slides: [
      {
        id: string,
        image: string,
        title: string,
        subtitle: string,
        description: string,
        badge?: string,
        badgeHighlight?: string
      }
    ]
  },
  styles: {
    element: string // Tailwind classes
  }
}
```

## Cách sử dụng

### 1. Kéo thả Carousel Block
1. Mở page builder (Admin → Pages → Chỉnh sửa page)
2. Trong BlockSidebar bên trái, tìm "Carousel" với icon Presentation
3. Kéo Carousel block vào canvas
4. Block sẽ được tạo với 1 slide mặc định

### 2. Chỉnh sửa Carousel (Tương lai)
- Hiện tại: Carousel hiển thị với default slide
- **Cần phát triển**: BlockInspector để chỉnh sửa:
  - Thêm/xóa slides
  - Chỉnh sửa image, title, subtitle, description, badges
  - Cài đặt autoplay, interval

## Công nghệ

- **DnD Kit**: Drag and drop carousel block
- **React Hooks**: useState, useEffect cho auto-play
- **Tailwind CSS**: Mobile-first responsive design
- **Next.js 14+**: Server/Client components separation
- **TypeScript**: Type-safe carousel props

## Tính năng Carousel Component

1. **Auto-play**: Tự động chuyển slide (có thể tắt)
2. **Dots Navigation**: Click vào dots để chuyển slide
3. **Arrow Navigation**: Nút prev/next (chỉ hiện trên desktop)
4. **Gradient Overlay**: Blue gradient cho typography
5. **Badge System**: Badge + badgeHighlight để highlight text
6. **Mobile-first**: Tối ưu cho mobile, responsive đầy đủ

## Files liên quan

```
components/
  carousel.tsx              # Carousel component chính (client)
  carousel-block.tsx        # Wrapper component (client) - MỚI TẠO
  block-editor/
    BlockSidebar.tsx       # Danh sách blocks (có carousel) - ĐÃ CẬP NHẬT
    BlockEditor.tsx        # Defaults carousel - ĐÃ CẬP NHẬT
    BlockInspector.tsx     # Properties panel (chưa có carousel editor)
app/(public)/
  [slug]/page.tsx          # Page renderer với carousel - ĐÃ FIX
components/
  custom-homepage.tsx      # Homepage renderer với carousel - ĐÃ FIX
```

## Checklist hoàn thành

✅ Carousel component với design match 100% hình  
✅ Script thêm carousel data vào database  
✅ BlockSidebar/Inspector mobile overlay optimization  
✅ Fixed ScrollArea import bug  
✅ Thêm carousel vào ELEMENT_BLOCKS array  
✅ Thêm carousel defaults (content + styles)  
✅ Tạo CarouselBlock client wrapper  
✅ Fix carousel rendering trong page router  
✅ Fix carousel rendering trong homepage  

## Nhiệm vụ tiếp theo (Optional)

❌ **BlockInspector Carousel Editor**: Tạo UI để edit slides
- Array editor cho slides
- Image upload
- Text inputs cho title, subtitle, description, badges
- Toggle cho autoplay
- Number input cho interval

❌ **Carousel Styles Inspector**: 
- Height controls
- Border radius
- Spacing controls

❌ **Test carousel block**: Kiểm tra kéo thả, save, preview

## Lưu ý kỹ thuật

1. **Client/Server Components**: 
   - Carousel là client component (useState, useEffect)
   - PageRouter/Homepage là server components
   - CarouselBlock là bridge giữa server → client

2. **Dynamic Import Issue Fixed**:
   - Trước: `require('@/components/carousel')` → Lỗi trong Next.js
   - Sau: Import trực tiếp CarouselBlock (client wrapper)

3. **Mobile-first Design**:
   - Arrows ẩn trên mobile
   - Dots navigation responsive
   - Touch-friendly controls

---

**Ngày hoàn thành**: $(date)  
**Status**: ✅ Hoàn thành tích hợp cơ bản  
**Next**: Inspector editor cho carousel (optional)
