# Fix: HTML Custom Block - Arbitrary Values Tailwind CSS

**Ngày:** 19/11/2025  
**Trạng thái:** ⚠️ Giải thích & Hướng dẫn

## Vấn đề

Class `text-[#FFB340]` (arbitrary value) **KHÔNG hoạt động** trong HTML Custom Block trên http://localhost:3005/ve-innerbright

## Nguyên nhân

**Tailwind CSS v4 không hỗ trợ arbitrary values trong dynamic HTML:**

- Arbitrary values như `text-[#FFB340]` cần **compile lúc build time**
- HTML inject qua `dangerouslySetInnerHTML` **không được scan**
- → Classes không được compile → không có CSS tương ứng

**Standard classes vẫn work:**
- `text-blue-500`, `bg-gray-900` → ✅ Hoạt động
- Vì đã compile sẵn trong Tailwind core

## Giải pháp (BEST)

### Sử dụng Custom CSS trong Website Settings

**Bước 1:** Admin → Website Settings → Advanced Tab → Custom CSS

**Bước 2:** Thêm custom classes:

```css
/* Brand Colors */
.text-brand-orange { color: #FFB340; }
.bg-brand-orange { background-color: #FFB340; }
.border-brand-orange { border-color: #FFB340; }

.text-brand-dark { color: #2C3E50; }
.bg-brand-dark { background-color: #2C3E50; }

/* Hover States */
.hover\:bg-brand-orange:hover { background-color: #FFB340; }
.hover\:text-brand-orange:hover { color: #FFB340; }
```

**Bước 3:** Sử dụng trong HTML Block:

```html
<!-- ✅ HOẠT ĐỘNG -->
<div class="bg-brand-dark p-8 rounded-xl">
  <h3 class="text-brand-orange text-3xl font-bold mb-4">
    Tiêu đề với custom color
  </h3>
  <p class="text-white text-lg mb-6">
    Nội dung
  </p>
  <button class="bg-brand-orange hover:bg-brand-orange/90 text-white px-6 py-3 rounded-lg transition">
    Button
  </button>
</div>
```

## Template CSS - Copy & Paste

```css
/* ========================================
   BRAND COLORS - InnerBright
   ======================================== */

/* Primary - Orange */
.text-brand-primary { color: #FFB340; }
.bg-brand-primary { background-color: #FFB340; }
.border-brand-primary { border-color: #FFB340; }

/* Secondary - Dark */
.text-brand-secondary { color: #2C3E50; }
.bg-brand-secondary { background-color: #2C3E50; }
.border-brand-secondary { border-color: #2C3E50; }

/* Accent - Blue */
.text-brand-accent { color: #3498DB; }
.bg-brand-accent { background-color: #3498DB; }
.border-brand-accent { border-color: #3498DB; }

/* Hover States */
.hover\:bg-brand-primary:hover { background-color: #FFB340; }
.hover\:text-brand-primary:hover { color: #FFB340; }
.hover\:bg-brand-secondary:hover { background-color: #2C3E50; }
.hover\:text-brand-secondary:hover { color: #2C3E50; }

/* Opacity Variants */
.bg-brand-primary\/90 { background-color: rgba(255, 179, 64, 0.9); }
.bg-brand-primary\/80 { background-color: rgba(255, 179, 64, 0.8); }

/* Gradients */
.bg-gradient-brand {
  background: linear-gradient(135deg, #FFB340 0%, #FF8C00 100%);
}
```

## Ưu điểm giải pháp này

✅ Hoạt động 100%  
✅ Tái sử dụng được  
✅ Consistent branding  
✅ Dễ maintain  
✅ Kết hợp với Tailwind standard classes  
✅ Responsive & hover effects  

## Alternative (không khuyến khích)

**Inline styles:**

```html
<div style="color: #FFB340; background-color: #2C3E50;">
  Text
</div>
```

❌ Không responsive  
❌ Không có hover effects  
❌ Code dài, khó maintain  

## Kết luận

**Đây KHÔNG phải bug** - Tailwind CSS v4 hoạt động đúng thiết kế.

**Giải pháp đúng:** Define custom CSS classes cho brand colors → Sử dụng như standard Tailwind classes.

**Workflow:**
1. Website Settings → Custom CSS → Paste brand colors
2. Save Changes
3. Dùng `.text-brand-primary` thay vì `text-[#FFB340]`
4. ✅ Done!

---

**Status:** ⚠️ Not a bug - Design limitation  
**Workaround:** ✅ Custom CSS classes (recommended)  
**Documentation:** docs/23-HTML_BLOCK_ARBITRARY_VALUES.md
