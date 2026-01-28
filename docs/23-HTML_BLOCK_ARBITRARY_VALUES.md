# Fix: HTML Custom Block Không Nhận Arbitrary Values Tailwind CSS

**Ngày:** 19/11/2025  
**Trạng thái:** ⚠️ Giải thích & Workaround

## Vấn đề

HTML custom block render nhưng **không nhận arbitrary values** của Tailwind CSS như `text-[#FFB340]`.

### Ví dụ không hoạt động

```html
<!-- ❌ KHÔNG HOẠT ĐỘNG -->
<div class="text-[#FFB340] bg-[#2C3E50]">
  Text với custom color
</div>
```

**Kết quả:** Không có style nào được áp dụng ❌

## Nguyên nhân

### Tailwind CSS v4 hoạt động như thế nào

1. **Build time compilation:**
   - Tailwind scan toàn bộ source files (JSX, TSX, HTML)
   - Compile các classes được tìm thấy thành CSS
   - Purge (loại bỏ) các classes không dùng

2. **Arbitrary values (`text-[#FFB340]`):**
   - Cần được **compile lúc build time**
   - Phải xuất hiện **trực tiếp trong source code**
   - Không hoạt động với dynamic strings hoặc `dangerouslySetInnerHTML`

3. **HTML trong HTML Custom Block:**
   - HTML string được inject qua `dangerouslySetInnerHTML`
   - **Không được Tailwind scan** lúc build time
   - Arbitrary values không được compile → không có CSS tương ứng

### Tại sao standard Tailwind classes vẫn work?

```html
<!-- ✅ HOẠT ĐỘNG -->
<div class="text-blue-500 bg-gray-900">
  Standard Tailwind classes
</div>
```

**Vì sao work:**
- `text-blue-500`, `bg-gray-900` là **predefined classes**
- Đã được compile sẵn trong Tailwind core CSS
- Có trong bộ nhớ CSS ngay từ đầu

## Giải pháp

### ✅ Giải pháp 1: Custom CSS (RECOMMENDED)

**Sử dụng Custom CSS trong Website Settings:**

#### Bước 1: Thêm Custom CSS

Vào **Admin → Website Settings → Advanced Tab → Custom CSS:**

```css
/* Define custom colors */
.text-brand-orange {
  color: #FFB340;
}

.bg-brand-dark {
  background-color: #2C3E50;
}

.text-brand-blue {
  color: #3498DB;
}

.border-brand-orange {
  border-color: #FFB340;
}

/* Hover variants */
.hover\:text-brand-orange:hover {
  color: #FFB340;
}

.hover\:bg-brand-orange:hover {
  background-color: #FFB340;
}
```

#### Bước 2: Sử dụng trong HTML Block

```html
<!-- ✅ HOẠT ĐỘNG -->
<div class="bg-brand-dark p-8 rounded-xl">
  <h3 class="text-brand-orange text-3xl font-bold mb-4">
    Tiêu đề với custom color
  </h3>
  <p class="text-white text-lg mb-6">
    Nội dung với màu trắng
  </p>
  <button class="bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-3 rounded-lg transition">
    Button
  </button>
</div>
```

**Ưu điểm:**
- ✅ Hoạt động 100%
- ✅ Tái sử dụng được colors
- ✅ Consistent branding
- ✅ Dễ maintain và update

### ✅ Giải pháp 2: Inline Styles

**Dùng style attribute trực tiếp:**

```html
<!-- ✅ HOẠT ĐỘNG (nhưng không best practice) -->
<div style="background-color: #2C3E50; padding: 2rem; border-radius: 0.75rem;">
  <h3 style="color: #FFB340; font-size: 1.875rem; font-weight: bold; margin-bottom: 1rem;">
    Tiêu đề
  </h3>
  <p style="color: white; font-size: 1.125rem; margin-bottom: 1.5rem;">
    Nội dung
  </p>
  <button style="background-color: #FFB340; color: white; padding: 0.75rem 1.5rem; border-radius: 0.5rem; border: none; cursor: pointer;">
    Button
  </button>
</div>
```

**Nhược điểm:**
- ⚠️ Code dài và khó đọc
- ⚠️ Không responsive
- ⚠️ Không có hover effects
- ⚠️ Không consistent

### ✅ Giải pháp 3: CSS Variables (ADVANCED)

**Define CSS variables và dùng Tailwind:**

#### Trong Custom CSS:

```css
:root {
  --brand-orange: #FFB340;
  --brand-dark: #2C3E50;
  --brand-blue: #3498DB;
}

/* Utility classes sử dụng variables */
.text-brand {
  color: var(--brand-orange);
}

.bg-brand-dark {
  background-color: var(--brand-dark);
}
```

#### Trong HTML Block:

```html
<!-- ✅ HOẠT ĐỘNG + FLEXIBLE -->
<div class="bg-brand-dark p-8 rounded-xl">
  <h3 class="text-brand text-3xl font-bold">
    Tiêu đề
  </h3>
  <p style="color: var(--brand-blue);" class="text-lg">
    Kết hợp Tailwind + CSS var
  </p>
</div>
```

**Ưu điểm:**
- ✅ Flexible
- ✅ Easy to update colors globally
- ✅ Mix với Tailwind classes

## Best Practices

### ✅ Recommended Approach

**1. Define Brand Colors trong Custom CSS:**

```css
/* Website Settings → Advanced → Custom CSS */

/* Brand Colors */
.text-primary {
  color: #FFB340; /* Brand orange */
}

.bg-primary {
  background-color: #FFB340;
}

.border-primary {
  border-color: #FFB340;
}

.text-secondary {
  color: #2C3E50; /* Brand dark */
}

.bg-secondary {
  background-color: #2C3E50;
}

/* Hover States */
.hover\:bg-primary:hover {
  background-color: #FFB340;
}

.hover\:text-primary:hover {
  color: #FFB340;
}

/* Focus States */
.focus\:ring-primary:focus {
  --tw-ring-color: #FFB340;
}
```

**2. Sử dụng trong HTML Block:**

```html
<div class="max-w-4xl mx-auto p-8">
  <!-- Hero Section -->
  <div class="bg-secondary text-white p-12 rounded-2xl mb-8">
    <h1 class="text-primary text-5xl font-bold mb-4">
      Welcome to InnerBright
    </h1>
    <p class="text-xl text-gray-300 mb-6">
      Chúng tôi mang đến giải pháp tốt nhất
    </p>
    <button class="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-lg font-semibold transition-all">
      Get Started
    </button>
  </div>

  <!-- Feature Cards -->
  <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
    <div class="bg-white p-6 rounded-lg shadow-lg border-t-4 border-primary">
      <h3 class="text-secondary text-xl font-bold mb-2">Feature 1</h3>
      <p class="text-gray-600">Description here</p>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-lg border-t-4 border-primary">
      <h3 class="text-secondary text-xl font-bold mb-2">Feature 2</h3>
      <p class="text-gray-600">Description here</p>
    </div>
    <div class="bg-white p-6 rounded-lg shadow-lg border-t-4 border-primary">
      <h3 class="text-secondary text-xl font-bold mb-2">Feature 3</h3>
      <p class="text-gray-600">Description here</p>
    </div>
  </div>
</div>
```

### ✅ Color Palette Template

**Copy-paste vào Custom CSS:**

```css
/* ========================================
   BRAND COLORS PALETTE
   ======================================== */

/* Primary Brand Colors */
.text-brand-primary { color: #FFB340; }
.bg-brand-primary { background-color: #FFB340; }
.border-brand-primary { border-color: #FFB340; }

.text-brand-secondary { color: #2C3E50; }
.bg-brand-secondary { background-color: #2C3E50; }
.border-brand-secondary { border-color: #2C3E50; }

.text-brand-accent { color: #3498DB; }
.bg-brand-accent { background-color: #3498DB; }
.border-brand-accent { border-color: #3498DB; }

/* Hover States */
.hover\:bg-brand-primary:hover { background-color: #FFB340; }
.hover\:text-brand-primary:hover { color: #FFB340; }

.hover\:bg-brand-secondary:hover { background-color: #2C3E50; }
.hover\:text-brand-secondary:hover { color: #2C3E50; }

.hover\:bg-brand-accent:hover { background-color: #3498DB; }
.hover\:text-brand-accent:hover { color: #3498DB; }

/* Opacity Variants */
.bg-brand-primary\/90 { background-color: rgba(255, 179, 64, 0.9); }
.bg-brand-primary\/80 { background-color: rgba(255, 179, 64, 0.8); }
.bg-brand-primary\/70 { background-color: rgba(255, 179, 64, 0.7); }

/* Gradients */
.bg-gradient-brand {
  background: linear-gradient(135deg, #FFB340 0%, #FF8C00 100%);
}

.bg-gradient-dark {
  background: linear-gradient(135deg, #2C3E50 0%, #1a252f 100%);
}
```

## So sánh các phương pháp

| Phương pháp | Hoạt động | Responsive | Hover | Maintain | Recommended |
|-------------|-----------|------------|-------|----------|-------------|
| **Arbitrary values** `text-[#FFB340]` | ❌ | - | - | - | ❌ |
| **Custom CSS classes** `.text-brand-primary` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Inline styles** `style="color: #FFB340"` | ✅ | ❌ | ❌ | ❌ | ⚠️ |
| **CSS Variables** `var(--brand-orange)` | ✅ | ✅ | ✅ | ✅ | ✅ |
| **Standard Tailwind** `text-blue-500` | ✅ | ✅ | ✅ | ✅ | ✅ |

## Cách setup từ đầu

### Bước 1: Vào Website Settings

```
Admin → Website Settings → Advanced Tab
```

### Bước 2: Paste Brand Colors vào Custom CSS

```css
/* Brand Colors */
.text-brand-orange { color: #FFB340; }
.bg-brand-orange { background-color: #FFB340; }
.text-brand-dark { color: #2C3E50; }
.bg-brand-dark { background-color: #2C3E50; }

/* Hover states */
.hover\:bg-brand-orange:hover { background-color: #FFB340; }
.hover\:text-brand-orange:hover { color: #FFB340; }
```

### Bước 3: Save Website Settings

Click **Save Changes**

### Bước 4: Sử dụng trong HTML Block

```html
<div class="bg-brand-dark p-8">
  <h3 class="text-brand-orange text-2xl font-bold">
    Custom colors work!
  </h3>
</div>
```

### Bước 5: Preview & Test

- Canvas editor: Live preview
- Frontend: Refresh trang `/innerbright`
- Verify colors hiển thị đúng

## Tips & Tricks

### ✅ Naming Convention

```css
/* Semantic names - GOOD */
.text-brand-primary
.bg-brand-secondary
.border-brand-accent

/* Color names - OK */
.text-brand-orange
.bg-brand-dark
.border-brand-blue

/* Hex values - BAD */
.text-ffb340
.bg-2c3e50
```

### ✅ Organize Colors

```css
/* Group by purpose */

/* === BRAND IDENTITY === */
.text-brand-primary { color: #FFB340; }
.bg-brand-primary { background-color: #FFB340; }

/* === UI COLORS === */
.text-success { color: #10B981; }
.text-error { color: #EF4444; }
.text-warning { color: #F59E0B; }

/* === GRADIENTS === */
.bg-gradient-hero {
  background: linear-gradient(135deg, #FFB340 0%, #FF8C00 100%);
}
```

### ✅ Support Dark Mode

```css
/* Light mode */
.text-brand-primary { color: #FFB340; }

/* Dark mode */
.dark .text-brand-primary { color: #FFC670; }
```

## Lưu ý quan trọng

### ⚠️ Limitations

1. **Arbitrary values KHÔNG hoạt động:**
   - `text-[#FFB340]` ❌
   - `bg-[rgb(255,179,64)]` ❌
   - `w-[350px]` ❌

2. **Phải define trong Custom CSS:**
   - Thêm class mới nếu cần
   - Restart server sau khi update CSS
   - Clear browser cache

3. **Standard Tailwind vẫn preferred:**
   - Dùng `text-orange-400` thay vì custom nếu được
   - Chỉ custom khi cần exact brand colors

### ✅ Khi nào dùng Custom CSS

- ✅ Brand colors cố định (logo, identity)
- ✅ Colors lặp lại nhiều lần
- ✅ Cần maintain consistency
- ✅ Không có trong Tailwind palette

### ✅ Khi nào dùng Standard Tailwind

- ✅ Prototyping nhanh
- ✅ Colors gần giống có sẵn
- ✅ Không cần exact match
- ✅ Standard UI elements

## Kết luận

**Vấn đề:** Arbitrary values `text-[#FFB340]` không hoạt động trong HTML Custom Block

**Nguyên nhân:** Tailwind không compile dynamic HTML strings

**Giải pháp:** 
1. ✅ **Define custom CSS classes** (BEST)
2. ✅ CSS Variables (GOOD)
3. ⚠️ Inline styles (OK nhưng limited)

**Recommended workflow:**
1. Define brand colors trong Website Settings → Custom CSS
2. Sử dụng custom classes trong HTML Block
3. Kết hợp với standard Tailwind classes

---

**Status:** ⚠️ Not a bug - Expected behavior  
**Workaround:** ✅ Custom CSS classes  
**Follow:** rulepromt.txt (Clean Architecture, Best Practices)
