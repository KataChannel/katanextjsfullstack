# Fix Pages V2 Styles Not Rendering on Frontend

## Vấn đề (Issue)

Khi chỉnh sửa page trong admin/pages-v2/edit, các thuộc tính styles (container classes, element classes) không được render ra đúng cách ở frontend khi xem page.

## Nguyên nhân (Root Cause)

Component `BlocksV2Renderer` trong file `app/(public)/[slug]/page.tsx` không áp dụng đầy đủ các thuộc tính `styles` từ block editor:

1. **Thiếu áp dụng styles cho nhiều loại block**: text, image, button, carousel, video, icon, divider, spacer
2. **Container block** - chỉ render `styles.container` mà không xử lý `styles.element` và `content.background`
3. **Không có fallback styles** - khi không có custom styles, không dùng default styles
4. **Không support đầy đủ các block types** - thiếu video, icon, divider, spacer

## Giải pháp (Solution)

### 1. Cập nhật BlocksV2Renderer

File: `app/(public)/[slug]/page.tsx`

**Các thay đổi chính:**

#### A. Text Block
- Áp dụng `styles.element` hoặc `styles.container`
- Support multiple HTML tags (h1-h6, p, div, span)
- Fallback về prose classes nếu không có custom styles

```tsx
case 'text':
  const textContent = block.content?.text || block.content || '';
  const textTag = block.content?.tag || 'div';
  const textStyles = block.styles?.element || block.styles?.container || '';
  
  // Render with appropriate tag based on textTag
  // Supports: h1, h2, h3, h4, h5, h6, p, div, span
```

#### B. Image Block
- Áp dụng `styles.container` cho figure wrapper
- Áp dụng `styles.element` cho img tag

```tsx
case 'image':
  const imageContainerStyles = block.styles?.container || '';
  const imageStyles = block.styles?.element || 'w-full h-auto rounded-lg';
```

#### C. Button Block
- Áp dụng `styles.container` cho div wrapper
- Áp dụng `styles.element` cho button/link
- Fallback về default variant styles

```tsx
case 'button':
  const buttonContainerStyles = block.styles?.container || '';
  const buttonStyles = block.styles?.element || '';
```

#### D. Container Block
- Áp dụng `styles.container` cho outer div
- Áp dụng `styles.element` cho inner wrapper (nếu có)
- Xử lý `content.background` để apply background color/image

```tsx
case 'container':
  const containerStyles = block.styles?.container || '';
  const containerElementStyles = block.styles?.element || '';
  const containerBg = block.content?.background || '';
  
  // Combine all classes
  const containerClassNames = [
    containerStyles,
    containerBg,
  ].filter(Boolean).join(' ');
```

#### E. Carousel Block
- Wrap carousel component với div có `styles.element` hoặc `styles.container`

```tsx
case 'carousel':
  const carouselStyles = block.styles?.element || block.styles?.container || '';
  return (
    <div className={carouselStyles || 'w-full'}>
      <CarouselBlock ... />
    </div>
  );
```

#### F. Heading Block
- Áp dụng `styles.element` hoặc `styles.container`
- Fallback về default heading styles based on level

```tsx
case 'heading':
  const headingStyles = block.styles?.element || block.styles?.container || '';
  const defaultHeadingStyles = {
    1: 'text-4xl font-bold my-4',
    2: 'text-3xl font-bold my-4',
    // ... etc
  };
```

#### G. HTML Custom Block
- Giữ nguyên logic hiện tại (đã hoạt động đúng)
- Container có Tailwind classes, HTML content bên trong

```tsx
case 'html':
  const htmlContainerStyles = block.styles?.container || 'w-full';
  return (
    <div className={htmlContainerStyles}>
      <div dangerouslySetInnerHTML={{ __html: htmlContent }} />
    </div>
  );
```

#### H. Thêm các block types mới

**Video Block:**
```tsx
case 'video':
  const videoContainerStyles = block.styles?.container || 'relative w-full my-8';
  const videoStyles = block.styles?.element || 'w-full aspect-video';
```

**Icon Block:**
```tsx
case 'icon':
  const iconStyles = block.styles?.element || block.styles?.container || 'text-gray-900';
```

**Divider Block:**
```tsx
case 'divider':
  const dividerStyles = block.styles?.element || block.styles?.container || 'border-t border-gray-300 my-4';
```

**Spacer Block:**
```tsx
case 'spacer':
  const spacerHeight = block.content?.height || '2rem';
  const spacerStyles = block.styles?.element || block.styles?.container || '';
```

#### I. Default Case (Unknown Blocks)
- Áp dụng `styles.element` hoặc `styles.container` cho unknown block types
- Fallback về 'my-4' nếu không có styles

```tsx
default:
  const unknownBlockStyles = block.styles?.element || block.styles?.container || '';
  return (
    <div className={unknownBlockStyles || 'my-4'}>
      <div dangerouslySetInnerHTML={{ __html: content }} />
    </div>
  );
```

## Cách test (Testing)

1. Mở trang admin: `/admin/pages-v2/edit/4a83da73-fdf0-467a-be5e-8906ee05c18c`
2. Chọn một block bất kỳ trong canvas
3. Mở Inspector panel (bên phải)
4. Tab "Styles":
   - Nhập Container Classes: `bg-blue-100 p-8 rounded-lg`
   - Nhập Element Classes: `text-red-600 font-bold text-2xl`
5. Click "Save" ở toolbar
6. Mở trang frontend để xem: `/{slug}` hoặc preview mode
7. Kiểm tra xem các classes đã được áp dụng chưa bằng cách:
   - Inspect element trong browser DevTools
   - Xem background color, padding, text color có đúng không

## Kết quả (Result)

✅ Tất cả các thuộc tính styles từ Block Editor đã được áp dụng đúng ở frontend
✅ Support đầy đủ cho tất cả block types: carousel, text, image, button, container, heading, html, video, icon, divider, spacer
✅ Có fallback styles hợp lý cho từng loại block
✅ Container block xử lý đúng cả container, element và background properties

## Files thay đổi (Changed Files)

- `app/(public)/[slug]/page.tsx` - Function `BlocksV2Renderer`

## Ngày fix

2025-11-19

---

## Update: Fix Container Background Color/Image Not Rendering

### Vấn đề mới phát hiện

Container block với background color (VD: `#e7bb40`) hoặc background image không được render ra frontend. Background được lưu dưới dạng object:

```js
{
  type: 'color' | 'image' | 'none',
  value: '#e7bb40' hoặc URL image,
  opacity: 100,
  size: 'cover',
  position: 'center',
  repeat: 'no-repeat'
}
```

Nhưng code cũ chỉ lấy `block.content?.background` và cho vào className (sai).

### Giải pháp

Xử lý background bằng inline styles thay vì className:

```tsx
case 'container':
  const containerBg = block.content?.background || {};
  const containerInlineStyles: React.CSSProperties = {};
  
  if (containerBg.type === 'color' && containerBg.value) {
    containerInlineStyles.backgroundColor = containerBg.value;
    if (containerBg.opacity !== undefined && containerBg.opacity !== 100) {
      containerInlineStyles.opacity = containerBg.opacity / 100;
    }
  } else if (containerBg.type === 'image' && containerBg.value) {
    containerInlineStyles.backgroundImage = `url(${containerBg.value})`;
    containerInlineStyles.backgroundSize = containerBg.size || 'cover';
    containerInlineStyles.backgroundPosition = containerBg.position || 'center';
    containerInlineStyles.backgroundRepeat = containerBg.repeat || 'no-repeat';
    if (containerBg.opacity !== undefined && containerBg.opacity !== 100) {
      containerInlineStyles.opacity = containerBg.opacity / 100;
    }
  }
  
  return (
    <div 
      className={containerStyles || 'w-full'}
      style={Object.keys(containerInlineStyles).length > 0 ? containerInlineStyles : undefined}
    >
      ...
    </div>
  );
```

### Test case

1. Vào trang: `http://localhost:3005/ve-innerbright`
2. Container với background color `#e7bb40` sẽ hiển thị đúng màu vàng
3. Container với background image sẽ hiển thị hình ảnh với size/position đúng

✅ **Fixed**: Container background color và image đã render đúng với inline styles
