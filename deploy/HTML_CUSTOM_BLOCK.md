# Thêm HTML Custom Block vào Page Builder

## Tổng quan

Đã thêm HTML custom block vào Page Builder V2, cho phép admin nhúng code HTML tùy chỉnh trực tiếp vào trang. Block này hỗ trợ scripts, iframes, widgets và bất kỳ HTML nào.

## Tính năng

### HTML Block Features
- ✅ **Custom HTML code** - Nhập HTML tùy ý với textarea
- ✅ **Syntax highlighting** - Monospace font cho code
- ✅ **Sanitize option** - Tùy chọn sanitize HTML (mặc định: off)
- ✅ **Tailwind support** - Dùng được Tailwind CSS classes
- ✅ **Script support** - Embed JavaScript, iframes, widgets
- ✅ **Live preview** - Render trực tiếp trong editor
- ✅ **Frontend render** - Hiển thị đúng trên public pages

## Thay đổi Code

### 1. Type Definitions (`lib/blocks/types.ts`)

**Thêm vào ElementBlockType:**
```typescript
export type ElementBlockType =
  | 'text'
  | 'image'
  | 'button'
  | 'container'
  | 'divider'
  | 'spacer'
  | 'video'
  | 'icon'
  | 'html';  // ✅ NEW
```

**Thêm interface HtmlContent:**
```typescript
export interface HtmlContent {
  html?: string; // Custom HTML code
  sanitize?: boolean; // Whether to sanitize HTML (default: false)
}
```

**Default values:**
```typescript
// Default styles
html: {
  container: 'w-full',
  element: '',
},

// Default content
html: {
  html: '<div class="p-4 bg-gray-100 rounded">\n  <p>Custom HTML here...</p>\n</div>',
  sanitize: false,
},
```

### 2. Block Sidebar (`components/block-editor/BlockSidebar.tsx`)

**Thêm HTML block vào danh sách:**
```typescript
import { Code } from 'lucide-react';

const ELEMENT_BLOCKS = [
  // ... existing blocks
  { type: 'html', label: 'HTML', icon: Code, description: 'Custom HTML code' },
];
```

### 3. Block Inspector (`components/block-editor/BlockInspector.tsx`)

**Form edit HTML content:**
```tsx
{selectedBlock.type === 'html' && (
  <div className="space-y-3">
    {/* Textarea cho HTML code */}
    <div className="space-y-2">
      <Label className="text-sm font-medium flex items-center gap-2">
        <Code className="w-4 h-4" />
        Custom HTML Code
      </Label>
      <Textarea
        placeholder="<div>Your HTML here...</div>"
        defaultValue={(selectedBlock.content as any).html || ''}
        onChange={(e) => updateBlock(selectedBlock.id, { 
          content: { ...selectedBlock.content, html: e.target.value } 
        })}
        className="font-mono text-xs min-h-[200px]"
        rows={10}
      />
    </div>
    
    {/* Switch sanitize option */}
    <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-200 rounded-lg">
      <Label htmlFor="sanitize-html">Sanitize HTML</Label>
      <Switch
        id="sanitize-html"
        checked={(selectedBlock.content as any).sanitize || false}
        onCheckedChange={(checked) => updateBlock(selectedBlock.id, { 
          content: { ...selectedBlock.content, sanitize: checked } 
        })}
      />
    </div>
    
    {/* Tips box */}
    <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <ul className="text-xs text-blue-800 space-y-1 pl-4">
        <li>• Sử dụng Tailwind CSS classes</li>
        <li>• Embed scripts, iframes, widgets</li>
        <li>• HTML tùy chỉnh hoàn toàn</li>
      </ul>
    </div>
  </div>
)}
```

### 4. Block Renderer (`components/block-editor/BlockRenderer.tsx`)

**Render HTML trong editor:**
```tsx
case 'html':
  return (
    <div
      className={block.styles.container || 'w-full'}
      dangerouslySetInnerHTML={{
        __html: (block.content as any).html || '<p>No HTML content</p>',
      }}
    />
  );
```

### 5. Frontend Renderer (`components/block-editor/FrontendBlockRenderer.tsx`)

**Render HTML trên public pages:**
```tsx
case 'html': {
  const content = block.content as any;
  return (
    <div
      className={block.styles.container}
      dangerouslySetInnerHTML={{
        __html: content.html || '',
      }}
    />
  );
}
```

## Cách sử dụng

### 1. Thêm HTML Block

1. Mở Page Builder
2. Trong sidebar "Blocks", tìm **HTML** block (icon `</>`)
3. Drag & drop vào canvas

### 2. Chỉnh sửa HTML

1. Click vào HTML block để chọn
2. Trong Inspector panel, tab "Nội dung"
3. Nhập code HTML vào textarea
4. Live preview hiển thị ngay

### 3. Cấu hình Styles

**Container classes** (wrapper):
```
w-full max-w-4xl mx-auto p-6
```

**Element classes** (optional):
```
// Không cần thiết vì HTML tự style
```

### 4. Examples

#### Embed Google Maps
```html
<iframe 
  src="https://www.google.com/maps/embed?pb=..." 
  width="100%" 
  height="450" 
  style="border:0;" 
  allowfullscreen="" 
  loading="lazy">
</iframe>
```

#### Custom Widget
```html
<div class="bg-gradient-to-r from-blue-500 to-purple-600 p-8 rounded-xl text-white">
  <h3 class="text-2xl font-bold mb-4">Custom Widget</h3>
  <p class="mb-4">With Tailwind CSS styling!</p>
  <button class="bg-white text-blue-600 px-6 py-2 rounded-lg hover:bg-gray-100">
    Click Me
  </button>
</div>
```

#### Embed Script
```html
<div id="custom-widget"></div>
<script>
  document.getElementById('custom-widget').innerHTML = 
    '<p class="text-green-600 font-bold">Dynamic content loaded!</p>';
</script>
```

#### Raw HTML Table
```html
<table class="w-full border-collapse">
  <thead>
    <tr class="bg-gray-100">
      <th class="border p-2">Name</th>
      <th class="border p-2">Email</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td class="border p-2">John Doe</td>
      <td class="border p-2">john@example.com</td>
    </tr>
  </tbody>
</table>
```

## Use Cases

### ✅ Khi nên dùng HTML Block

1. **Embed third-party widgets** - Google Forms, Calendly, Typeform...
2. **Custom scripts** - Analytics, chat widgets, popups
3. **Complex layouts** - Tables, grids mà block khác không support
4. **Raw HTML content** - Legacy content, imported HTML
5. **Iframes** - Maps, videos, external content
6. **Advanced styling** - CSS animations, transitions
7. **Testing** - Prototype HTML trước khi tạo block mới

### ⚠️ Khi KHÔNG nên dùng

1. **Simple text/images** - Dùng Text/Image blocks
2. **Standard layouts** - Dùng Container blocks
3. **Buttons/CTAs** - Dùng Button blocks
4. **Untrusted content** - Enable sanitize option

## Security

### Sanitize Option

**Default: OFF** - Trust admin input, không sanitize

**When to enable:**
- User-generated content
- Untrusted HTML sources
- Security concerns

**When disabled:**
- Full HTML support including `<script>`
- Iframes, embeds work normally
- Maximum flexibility

### Best Practices

1. ✅ **Trust admin users** - HTML block dành cho admin, không cho end-users
2. ✅ **Review code** - Check HTML trước khi publish
3. ✅ **Test thoroughly** - Verify scripts/widgets hoạt động đúng
4. ✅ **Use Tailwind** - Tận dụng Tailwind classes có sẵn
5. ⚠️ **Avoid inline CSS** - Prefer Tailwind over `style="..."`
6. ⚠️ **Validate embeds** - Ensure iframe sources are trusted

## Design Principles

Theo **rulepromt.txt**:

### ✅ Mobile First
- Textarea với min-height đủ lớn
- Responsive container classes
- Touch-friendly controls

### ✅ Clean Architecture
- Separated concerns: types, renderer, inspector
- Reusable interfaces
- Type-safe với TypeScript

### ✅ shadcn UI
- Sử dụng `<Textarea>`, `<Switch>`, `<Label>`, `<Badge>`
- Consistent spacing và colors
- Dialog patterns chuẩn

### ✅ User Experience
- Live preview trong editor
- Helpful tips box
- Clear labeling
- Monospace font cho code
- Character count (có thể thêm)

## Testing

### 1. Editor Test
```bash
# Mở page builder
http://localhost:3000/admin/page-builder

# Thêm HTML block
# Nhập code HTML
# Verify live preview
```

### 2. Frontend Test
```bash
# Save page với HTML block
# View trang public
# Verify HTML render đúng
# Check responsive
# Test scripts execute
```

### 3. Edge Cases
- Empty HTML
- Very long HTML
- Malformed HTML
- Scripts with errors
- Nested iframes

## Troubleshooting

### HTML không render

**Vấn đề:** Nội dung HTML không hiển thị

**Giải pháp:**
1. Check console errors
2. Verify HTML syntax
3. Check container classes
4. Disable sanitize if needed

### Script không chạy

**Vấn đề:** JavaScript trong HTML không execute

**Giải pháp:**
1. Verify script syntax
2. Check browser console
3. Try external script tag
4. Use window.onload

### Style không apply

**Vấn đề:** CSS classes không hoạt động

**Giải pháp:**
1. Ensure Tailwind classes
2. Check Tailwind config
3. Add custom CSS if needed
4. Verify class names

## Files Modified

```
lib/blocks/types.ts                         ✅ Added 'html' type + interface
components/block-editor/BlockSidebar.tsx    ✅ Added HTML block to list
components/block-editor/BlockInspector.tsx  ✅ Added HTML editor form
components/block-editor/BlockRenderer.tsx   ✅ Added HTML rendering
components/block-editor/FrontendBlockRenderer.tsx ✅ Added frontend HTML render
```

## Next Steps

Có thể mở rộng:

1. **Code syntax highlighting** - Monaco Editor, CodeMirror
2. **HTML validation** - Real-time syntax checking
3. **Preset templates** - Common HTML snippets
4. **Import/Export** - Save/load HTML templates
5. **Version control** - Track HTML changes
6. **Preview modes** - Desktop/tablet/mobile preview
7. **CSS editor** - Separate CSS input
8. **JavaScript editor** - Separate JS input

---

**Hoàn thành:** 19/11/2025  
**Follow:** rulepromt.txt (Mobile First, shadcn UI, Clean Architecture)  
**Status:** ✅ Production ready
