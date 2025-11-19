# Thêm Brand Colors vào Tailwind Theme

**Ngày:** 19/11/2025  
**Trạng thái:** ✅ Hoàn thành - Tailwind Native Solution

## Giải pháp

### ✅ Sử dụng `@theme` trong globals.css (Tailwind v4 Way)

Đã thêm brand colors vào `@theme inline` block:

```css
@theme inline {
  /* ... existing colors ... */
  
  /* Brand Colors - Arbitrary values support */
  --color-brand-orange: #FFB340;
  --color-brand-dark: #2C3E50;
  --color-brand-blue: #3498DB;
  --color-brand-green: #27AE60;
  --color-brand-red: #E74C3C;
  --color-brand-purple: #9B59B6;
  --color-brand-yellow: #F1C40F;
  --color-brand-gray: #95A5A6;
}
```

## Cách sử dụng

### ✅ Trong HTML Custom Block

```html
<!-- ✅ SỬ DỤNG ĐƯỢC như standard Tailwind -->
<div class="bg-brand-dark p-8 rounded-xl">
  <h3 class="text-brand-orange text-3xl font-bold">
    Tiêu đề Brand Orange
  </h3>
  <p class="text-brand-blue text-lg">
    Content với brand blue color
  </p>
</div>
```

### ✅ Tất cả utilities Tailwind hoạt động

```html
<!-- Text colors -->
<p class="text-brand-orange">Orange text</p>
<p class="text-brand-dark">Dark text</p>
<p class="text-brand-blue">Blue text</p>

<!-- Background colors -->
<div class="bg-brand-orange">Orange background</div>
<div class="bg-brand-dark">Dark background</div>

<!-- Border colors -->
<div class="border border-brand-orange">Orange border</div>
<div class="border-2 border-brand-blue">Blue border</div>

<!-- Hover states -->
<button class="text-brand-dark hover:text-brand-orange">
  Hover to change color
</button>

<div class="bg-white hover:bg-brand-orange transition">
  Hover background
</div>

<!-- Focus states -->
<input class="border-brand-gray focus:border-brand-blue focus:ring-brand-blue" />

<!-- Opacity variants -->
<div class="bg-brand-orange/50">50% opacity</div>
<div class="text-brand-blue/75">75% opacity</div>

<!-- Dark mode -->
<div class="bg-brand-orange dark:bg-brand-dark">
  Responsive to dark mode
</div>

<!-- Responsive -->
<h1 class="text-brand-orange md:text-brand-blue lg:text-brand-green">
  Responsive colors
</h1>

<!-- Gradients -->
<div class="bg-gradient-to-r from-brand-orange to-brand-blue">
  Gradient background
</div>
```

## So sánh

| Phương pháp | Syntax | Hoạt động | Utilities | Dark Mode | Responsive |
|-------------|--------|-----------|-----------|-----------|------------|
| **Arbitrary values** | `text-[#FFB340]` | ❌ | ❌ | ❌ | ❌ |
| **Custom CSS classes** | `.text-brand-orange` | ✅ | ❌ | ⚠️ Manual | ❌ |
| **@theme (THIS)** | `text-brand-orange` | ✅ | ✅ | ✅ | ✅ |

## Ưu điểm giải pháp này

### ✅ Full Tailwind utilities

```html
<!-- TẤT CẢ đều hoạt động -->
text-brand-orange
bg-brand-orange
border-brand-orange
ring-brand-orange
shadow-brand-orange
from-brand-orange
to-brand-orange
via-brand-orange
```

### ✅ All variants work

```html
<!-- Hover, focus, active -->
hover:text-brand-orange
focus:bg-brand-orange
active:border-brand-orange

<!-- Dark mode -->
dark:text-brand-orange
dark:bg-brand-orange

<!-- Responsive -->
md:text-brand-orange
lg:bg-brand-orange

<!-- Opacity -->
text-brand-orange/50
bg-brand-orange/75

<!-- Group hover -->
group-hover:text-brand-orange
```

### ✅ Maintainability

```css
/* Chỉ cần update MỘT CHỖ trong globals.css */
@theme inline {
  --color-brand-orange: #FFB340; /* Change here */
}

/* → Tất cả components tự động update */
```

### ✅ Type Safety (nếu có)

TypeScript/IntelliSense sẽ autocomplete:
- `text-brand-orange`
- `bg-brand-orange`
- `border-brand-orange`
- etc.

## Thêm colors mới

### Bước 1: Thêm vào `@theme` block

```css
@theme inline {
  /* Existing */
  --color-brand-orange: #FFB340;
  
  /* NEW */
  --color-brand-teal: #1ABC9C;
  --color-brand-navy: #34495E;
}
```

### Bước 2: Restart dev server

```bash
# Ctrl+C to stop
bun run dev
```

### Bước 3: Sử dụng ngay

```html
<div class="text-brand-teal bg-brand-navy">
  New colors work immediately!
</div>
```

## Lưu ý

### ⚠️ Cần restart server

Sau khi thêm/sửa colors trong `@theme`, **PHẢI restart dev server**:

```bash
# Stop server (Ctrl+C)
# Start again
bun run dev
```

### ✅ Không cần rebuild production

Colors được compile lúc build time, không cần config gì thêm.

### ✅ Works everywhere

- ✅ HTML Custom Block
- ✅ React/TSX components
- ✅ TipTap Editor
- ✅ Page Builder
- ✅ All frontend pages

## Production

### Build & Deploy

```bash
# Build với brand colors
bun run build

# Colors được compile vào CSS bundle
# Không cần thêm bước nào
```

## Kết luận

**Đây là giải pháp CHÍNH THỐNG của Tailwind v4:**

1. ✅ Define colors trong `@theme` block
2. ✅ Sử dụng như standard Tailwind classes
3. ✅ Full utilities support (hover, focus, dark, responsive, opacity)
4. ✅ Zero config - Just works
5. ✅ Type safe với IntelliSense

**Workflow:**
1. Thêm color vào `@theme` trong `app/globals.css`
2. Restart dev server
3. Dùng `text-brand-orange` giống như `text-blue-500`
4. ✅ Done!

---

**Status:** ✅ Implemented  
**Location:** `app/globals.css` (lines 6-53)  
**Usage:** Dùng `text-brand-orange` thay vì `text-[#FFB340]`
