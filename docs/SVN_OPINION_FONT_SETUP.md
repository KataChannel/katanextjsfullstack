# SVN-Opinion Font Integration - InnerBright.vn

## 📝 Tổng quan

Đã tích hợp font **SVN-Opinion** từ thư mục `public/font` cho domain **innerbright.vn**.

## ✅ Files đã cập nhật

### 1. `/lib/fonts.ts` - Font Definition (NEW)
Định nghĩa font SVN-Opinion với đầy đủ font weights:

```typescript
import localFont from "next/font/local";

export const svnOpinion = localFont({
  src: [
    { path: "../../public/font/TTF/SVN-Opinion Thin.ttf", weight: "100" },
    { path: "../../public/font/TTF/SVN-Opinion XLight.ttf", weight: "200" },
    { path: "../../public/font/TTF/SVN-Opinion Light.ttf", weight: "300" },
    { path: "../../public/font/TTF/SVN-Opinion Regular.ttf", weight: "400" },
    { path: "../../public/font/TTF/SVN-Opinion Medium.ttf", weight: "500" },
    { path: "../../public/font/TTF/SVN-Opinion SemiBold.ttf", weight: "600" },
    { path: "../../public/font/TTF/SVN-Opinion Bold.ttf", weight: "700" },
    { path: "../../public/font/TTF/SVN-Opinion XBold.ttf", weight: "800" },
    // + italic variants
  ],
  variable: "--font-svn-opinion",
  display: "swap",
});
```

**Font weights available:**
- 100 (Thin)
- 200 (XLight)
- 300 (Light)
- 400 (Regular)
- 500 (Medium)
- 600 (SemiBold)
- 700 (Bold)
- 800 (XBold)

### 2. `/app/layout.tsx` - Root Layout
Cập nhật để apply font dựa trên domain:

```typescript
import { svnOpinion } from "@/lib/fonts";

// Trong RootLayout component
const isInnerbrightDomain = domain === "innerbright.vn" || domain === "innerbright";
const fontVariables = isInnerbrightDomain
  ? `${svnOpinion.variable} ${geistMono.variable}`
  : `${geistSans.variable} ${geistMono.variable}`;

return (
  <html lang="vi">
    <body className={`${fontVariables} antialiased`}>
      {children}
    </body>
  </html>
);
```

**Logic:**
- Domain `innerbright.vn` hoặc `innerbright` → SVN-Opinion
- Các domains khác → Geist Sans (mặc định)

### 3. `/app/globals.css` - Global Styles
Cập nhật font stack và thêm utility class:

```css
@theme inline {
  --font-sans: var(--font-svn-opinion), var(--font-geist-sans);
  /* fallback to Geist if SVN-Opinion not loaded */
}

/* Utility class */
.font-svn-opinion {
  font-family: var(--font-svn-opinion), ui-sans-serif, system-ui, sans-serif;
}
```

## 🎨 Cách sử dụng

### Automatic (Domain-based)
Font SVN-Opinion tự động apply cho **innerbright.vn**:

```tsx
// Tất cả text trong innerbright.vn sẽ dùng SVN-Opinion
<div className="text-lg font-medium">
  Tiêu đề với SVN-Opinion Medium
</div>
```

### Manual Override
Sử dụng utility class cho specific elements:

```tsx
<div className="font-svn-opinion">
  Text với SVN-Opinion font
</div>
```

### Font Weights
```tsx
<p className="font-thin">Thin (100)</p>
<p className="font-extralight">XLight (200)</p>
<p className="font-light">Light (300)</p>
<p className="font-normal">Regular (400)</p>
<p className="font-medium">Medium (500)</p>
<p className="font-semibold">SemiBold (600)</p>
<p className="font-bold">Bold (700)</p>
<p className="font-extrabold">XBold (800)</p>
```

### Italic
```tsx
<p className="italic">SVN-Opinion Italic</p>
<p className="font-bold italic">SVN-Opinion Bold Italic</p>
```

## 📁 Font Files Structure

```
public/font/
├── OTF/
│   ├── SVN-Opinion Thin.otf
│   ├── SVN-Opinion Light.otf
│   ├── SVN-Opinion Regular.otf
│   ├── SVN-Opinion Medium.otf
│   ├── SVN-Opinion SemiBold.otf
│   ├── SVN-Opinion Bold.otf
│   ├── SVN-Opinion XBold.otf
│   └── ... (italic variants)
└── TTF/ ✅ BEING USED
    ├── SVN-Opinion Thin.ttf
    ├── SVN-Opinion Light.ttf
    ├── SVN-Opinion Regular.ttf
    ├── SVN-Opinion Medium.ttf
    ├── SVN-Opinion SemiBold.ttf
    ├── SVN-Opinion Bold.ttf
    ├── SVN-Opinion XBold.ttf
    └── ... (italic variants)
```

**Note:** Sử dụng TTF vì compatibility tốt hơn và file size nhỏ hơn.

## 🚀 Performance

### Font Loading Strategy
- `display: "swap"` - Show fallback font immediately, swap to SVN-Opinion when loaded
- Local fonts → Faster load, no external requests
- All weights preloaded → Consistent rendering

### File Sizes
- Total TTF fonts: ~3.0MB (16 files)
- Lazy loading: Only weights used are downloaded
- Optimized with Next.js font optimization

## ✅ Testing

### Test domain innerbright.vn:
```bash
# Check if font is applied
curl http://localhost:3005 -H "x-hostname: innerbright.vn" | grep "font-svn-opinion"

# Browser DevTools
# Network → Filter "font" → Should see SVN-Opinion*.ttf files
# Computed styles → font-family should include "SVN-Opinion"
```

### Expected Result:
- Domain `innerbright.vn` → SVN-Opinion font
- Domain `kataseo.com` → Geist Sans (default)
- Domain `tazagroup.vn` → Geist Sans (default)

## 🐛 Troubleshooting

### Font không hiển thị:
1. Check font files exist: `ls public/font/TTF/`
2. Check console errors (404 font files)
3. Hard refresh: Ctrl+Shift+R
4. Clear Next.js cache: `rm -rf .next`

### Font bị fallback:
1. Check domain logic trong layout.tsx
2. Verify `x-hostname` header
3. Check font variable trong body className

### Performance issues:
1. Reduce number of font weights if not needed
2. Use `font-display: swap` (already set)
3. Preload critical fonts in `<head>`

## 📊 Domain Font Mapping

| Domain | Font | File Location |
|--------|------|---------------|
| innerbright.vn | SVN-Opinion | `/public/font/TTF/` |
| kataseo.com | Geist Sans | Google Fonts |
| tazagroup.vn | Geist Sans | Google Fonts |
| localhost (any) | Depends on x-hostname | - |

## 🎯 Future Enhancements

1. **Font Subsetting**: Extract only Vietnamese characters
2. **WOFF2 Conversion**: Better compression (50-60% smaller)
3. **Dynamic Loading**: Load weights on-demand
4. **Per-page Fonts**: Different fonts per landing page
5. **Admin UI**: Font selector in website settings

---

**Implemented**: 21/11/2025
**Domain**: innerbright.vn
**Font Family**: SVN-Opinion (16 variants)
**Status**: ✅ Active
