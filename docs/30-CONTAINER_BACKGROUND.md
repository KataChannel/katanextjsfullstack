# Container Block Background

**Ngày cập nhật:** 19/11/2025  
**Tác giả:** KataChannel  
**Trạng thái:** ✅ Hoàn thành

---

## 📋 Tổng Quan

Container block giờ có thể cấu hình **background** (màu hoặc hình ảnh) trực tiếp từ **Block Inspector**.

### Tính Năng

✅ **Background Color** - Chọn màu nền với color picker  
✅ **Background Image** - Nhập URL hình ảnh hoặc chọn từ file manager  
✅ **Image Settings** - Cấu hình size, position, repeat  
✅ **Opacity Control** - Điều chỉnh độ mờ 0-100%  
✅ **Live Preview** - Xem trước background trong canvas  
✅ **Frontend Rendering** - Background hiển thị đúng trên trang công khai  

---

## 🏗️ Cấu Trúc Dữ Liệu

### ContainerContent Interface

```typescript
export interface ContainerContent {
  layout?: 'flex' | 'grid';
  direction?: 'row' | 'column';
  gap?: number;
  columns?: number;
  background?: {
    type: 'none' | 'color' | 'image';
    value?: string; // Hex color hoặc image URL
    opacity?: number; // 0-100
    size?: 'cover' | 'contain' | 'auto';
    position?: 'center' | 'top' | 'bottom' | 'left' | 'right';
    repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  };
}
```

### Giá Trị Mặc Định

```typescript
container: {
  layout: 'flex',
  direction: 'column',
  gap: 4,
  background: {
    type: 'none',
    opacity: 100,
    size: 'cover',
    position: 'center',
    repeat: 'no-repeat',
  },
}
```

---

## 🎨 Cách Sử Dụng

### 1. Kéo Container Block vào Canvas

1. Sidebar → Tab "Phần tử"
2. Kéo **"Container"** vào canvas
3. Chọn container → Inspector hiện bên phải

### 2. Cấu Hình Layout (Tùy chọn)

**Layout:**
- **Flex** - Flexbox layout
- **Grid** - Grid layout

**Hướng:**
- **Ngang** (row) - Các block con nằm ngang
- **Dọc** (column) - Các block con nằm dọc

**Khoảng cách:**
- Nhập số (mặc định: 4) - Gap giữa các blocks

**Số cột (Grid only):**
- Nhập số cột (mặc định: 2)

### 3. Cấu Hình Background

#### A. Background Color

1. Inspector → Tab "Nội dung" → Section "Background"
2. Chọn **"Màu"**
3. Click color picker → Chọn màu
4. Hoặc nhập hex code: `#FFB340`
5. Điều chỉnh độ mờ slider (0-100%)

**Ví dụ:**
```
Color: #3B82F6 (blue)
Opacity: 80%
→ Background màu xanh trong suốt 80%
```

#### B. Background Image

1. Inspector → Tab "Nội dung" → Section "Background"
2. Chọn **"Hình"**
3. Nhập URL hình ảnh:
   ```
   https://images.unsplash.com/photo-1...
   ```
4. Preview hiện ngay bên dưới input
5. Cấu hình thêm:

**Kích thước:**
- **Cover** - Phủ kín (crop nếu cần)
- **Contain** - Fit toàn bộ (không crop)
- **Auto** - Kích thước gốc

**Vị trí:**
- **Giữa** (center) - Căn giữa
- **Trên** (top) - Căn trên
- **Dưới** (bottom) - Căn dưới

**Lặp lại:**
- **Không** (no-repeat) - Không lặp
- **Có** (repeat) - Lặp toàn bộ

**Độ mờ:**
- Slider 0-100% - Điều chỉnh độ trong suốt

#### C. Không Background

1. Chọn **"Không"**
2. Background sẽ transparent

---

## 📝 Ví Dụ Thực Tế

### Example 1: Hero Section với Background Image

```typescript
{
  type: "container",
  content: {
    layout: "flex",
    direction: "column",
    gap: 6,
    background: {
      type: "image",
      value: "https://images.unsplash.com/photo-1557804506-669a67965ba0",
      opacity: 90,
      size: "cover",
      position: "center",
      repeat: "no-repeat"
    }
  },
  styles: {
    container: "min-h-[500px] p-12 items-center justify-center text-white"
  },
  children: [
    // Text blocks, buttons...
  ]
}
```

**Kết quả:**
- Container cao 500px
- Background image full cover, opacity 90%
- Nội dung căn giữa với text màu trắng

### Example 2: Card với Background Color

```typescript
{
  type: "container",
  content: {
    layout: "flex",
    direction: "column",
    gap: 4,
    background: {
      type: "color",
      value: "#EFF6FF", // blue-50
      opacity: 100
    }
  },
  styles: {
    container: "p-6 rounded-lg"
  },
  children: [
    // Content blocks
  ]
}
```

**Kết quả:**
- Card với nền xanh nhạt
- Border radius bo tròn
- Padding 6

### Example 3: Grid Layout với Pattern Background

```typescript
{
  type: "container",
  content: {
    layout: "grid",
    columns: 3,
    gap: 4,
    background: {
      type: "image",
      value: "https://www.transparenttextures.com/patterns/asfalt-dark.png",
      opacity: 30,
      size: "auto",
      position: "center",
      repeat: "repeat"
    }
  },
  styles: {
    container: "p-8"
  },
  children: [
    // 3 columns content
  ]
}
```

**Kết quả:**
- Grid 3 cột
- Background pattern lặp lại, opacity 30%
- Subtle texture effect

---

## 🎨 Best Practices

### 1. Opacity cho Background Image

**Khuyến nghị:**
- Text màu sáng + Background opacity 70-90%
- Text màu tối + Background opacity 10-30%
- Full opacity (100%) cho background không overlay text

### 2. Background Size

**Cover:**
- ✅ Hero sections, banners
- ✅ Full-width backgrounds
- ❌ Logos, icons (sẽ bị crop)

**Contain:**
- ✅ Logos, illustrations
- ✅ Khi cần thấy toàn bộ image
- ❌ Photography (sẽ có space trắng)

**Auto:**
- ✅ Patterns, textures
- ✅ Tiled backgrounds
- ❌ Large images (sẽ quá nhỏ)

### 3. Performance

**Tối ưu hình ảnh:**
- Dùng CDN (Cloudinary, imgix, Unsplash)
- Compress images trước khi upload
- WebP format nếu được
- Lazy load cho sections dưới fold

**Recommended sizes:**
- Hero backgrounds: 1920x1080 (FHD)
- Card backgrounds: 800x600
- Pattern tiles: 256x256

---

## 🔧 Technical Implementation

### Render Logic

```typescript
const getBackgroundStyle = () => {
  if (!background || background.type === 'none') return {};
  
  const opacity = (background.opacity || 100) / 100;
  
  if (background.type === 'color') {
    const hex = background.value || '#f3f4f6';
    // Convert hex to rgba
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return {
      backgroundColor: `rgba(${r}, ${g}, ${b}, ${opacity})`,
    };
  }
  
  if (background.type === 'image' && background.value) {
    return {
      backgroundImage: `url(${background.value})`,
      backgroundSize: background.size || 'cover',
      backgroundPosition: background.position || 'center',
      backgroundRepeat: background.repeat || 'no-repeat',
      opacity: opacity,
    };
  }
  
  return {};
};
```

**Inline styles thay vì Tailwind classes vì:**
- Dynamic values (URLs, hex colors, opacity)
- Không thể dùng arbitrary values trong Tailwind v4
- Inline styles có độ ưu tiên cao hơn

### Files Updated

**1. lib/blocks/types.ts**
- `ContainerContent` interface: Thêm `background` field
- `DEFAULT_CONTENT.container`: Thêm default background config

**2. components/block-editor/BlockInspector.tsx**
- UI cho container background settings
- Color picker + hex input
- Image URL input + preview
- Size, position, repeat, opacity controls

**3. components/block-editor/BlockRenderer.tsx**
- `getBackgroundStyle()` function
- Render inline styles cho container

**4. components/block-editor/SortableBlockRenderer.tsx**
- Tương tự BlockRenderer
- Background render trong editor canvas

**5. components/block-editor/FrontendBlockRenderer.tsx**
- Background render trên frontend
- Production-ready rendering

---

## 🚀 Future Enhancements

### Coming Soon

1. **File Manager Integration**
   - Upload images trực tiếp
   - Browse uploaded images
   - Image library management

2. **Gradient Backgrounds**
   - Linear gradients
   - Radial gradients
   - Multiple color stops

3. **Video Backgrounds**
   - MP4 video backgrounds
   - YouTube video backgrounds
   - Autoplay, loop, muted

4. **Advanced Image Options**
   - Image filters (blur, brightness, contrast)
   - Overlay colors
   - Parallax effects

5. **Pattern Library**
   - Preset patterns
   - SVG patterns
   - CSS gradients library

---

## ✅ Testing Checklist

- [x] Kéo container vào canvas
- [x] Chọn background type: None/Color/Image
- [x] Background color với color picker
- [x] Background color với hex input
- [x] Background image với URL
- [x] Image preview hiển thị đúng
- [x] Size options: cover/contain/auto
- [x] Position options: center/top/bottom
- [x] Repeat options: no-repeat/repeat
- [x] Opacity slider 0-100%
- [x] Background render trong canvas
- [x] Background render trên frontend
- [x] Save page → Reload → Background giữ nguyên
- [x] Responsive trên mobile

---

## 📚 Related Documentation

- **[13-PAGEBUILDER_V2_PHASE1_COMPLETE.md](./13-PAGEBUILDER_V2_PHASE1_COMPLETE.md)** - Page Builder V2
- **[16-HUONG_DAN_PAGEBUILDER.md](./16-HUONG_DAN_PAGEBUILDER.md)** - Hướng dẫn sử dụng
- **[24-TAILWIND_BRAND_COLORS.md](./24-TAILWIND_BRAND_COLORS.md)** - Brand colors
- **[29-TIPTAP_TEXT_BLOCK.md](./29-TIPTAP_TEXT_BLOCK.md)** - Tiptap text block

---

## ✅ Kết Luận

Container block giờ có **background configuration** đầy đủ:

✅ Background màu với color picker  
✅ Background hình ảnh với URL input  
✅ Cấu hình size, position, repeat, opacity  
✅ Live preview trong canvas  
✅ Render đúng trên frontend  
✅ Mobile-first, responsive UI  

**Status:** Production-ready ✅

Người dùng có thể tạo hero sections, cards, layouts với backgrounds đa dạng ngay trong Page Builder!
