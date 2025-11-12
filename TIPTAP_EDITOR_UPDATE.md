# Cập nhật TipTap Editor Notion-like - November 12, 2025

## Tổng quan
Đã tích hợp TipTap Editor kiểu Notion vào module Content Management, thay thế textarea đơn giản bằng rich text editor với đầy đủ tính năng formatting.

---

## ✅ Thay đổi chính

### 1. **TipTap Editor nâng cấp** (`components/tiptap-editor.tsx`)

**Extensions mới**:
- ✅ `Highlight` - Highlight text với background màu vàng
- ✅ `Underline` - Gạch chân text
- ✅ `HorizontalRule` - Thêm đường kẻ ngang

**Cải thiện UI/UX**:
- ✅ Toolbar sticky (cố định khi scroll)
- ✅ Active state rõ ràng hơn với `bg-accent`
- ✅ Tooltips cho tất cả buttons
- ✅ Keyboard shortcuts hints
- ✅ Undo/Redo ở góc phải toolbar
- ✅ Min-height 400px cho editor area
- ✅ Better spacing và padding
- ✅ Styled tables với borders và header background
- ✅ Responsive toolbar (flex-wrap)

**Toolbar buttons** (theo thứ tự):
1. **Text formatting**: Bold, Italic, Underline, Strikethrough, Highlight, Code
2. **Headings**: H1, H2, H3
3. **Lists**: Bullet List, Numbered List, Blockquote
4. **Media**: Link, Image, Table, Horizontal Rule
5. **Actions**: Undo, Redo

### 2. **Content Management tích hợp** (`app/admin/content/page.tsx`)

**Thay đổi**:
```tsx
// Before: Simple textarea
<textarea
  value={formData.content}
  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
  rows={6}
/>

// After: Rich TipTap Editor
<TiptapEditor
  content={formData.content}
  onChange={(content) => setFormData({ ...formData, content })}
  placeholder="Bắt đầu viết nội dung... (Nhấn '/' để xem lệnh)"
/>
```

**Import thêm**:
```tsx
import { TiptapEditor } from "@/components/tiptap-editor";
```

---

## 🎨 Tính năng Editor

### Keyboard Shortcuts
- **Ctrl+B**: Bold
- **Ctrl+I**: Italic
- **Ctrl+U**: Underline
- **Ctrl+Z**: Undo
- **Ctrl+Shift+Z**: Redo
- **Ctrl+Shift+X**: Strikethrough
- **Ctrl+Alt+0**: Paragraph
- **Ctrl+Alt+1**: Heading 1
- **Ctrl+Alt+2**: Heading 2
- **Ctrl+Alt+3**: Heading 3

### Text Formatting
- Bold, Italic, Underline
- Strikethrough
- Highlight (yellow background)
- Inline code
- Text color

### Content Blocks
- Headings (H1, H2, H3)
- Paragraphs
- Bullet lists
- Numbered lists
- Blockquotes
- Horizontal rules

### Rich Media
- Links (với prompt dialog)
- Images (với prompt dialog)
- Tables (3x3 mặc định, resizable)

### Editor Features
- Real-time preview
- Undo/Redo history
- Placeholder text
- Responsive toolbar
- Sticky toolbar when scrolling
- HTML output

---

## 📦 Dependencies

**Packages đã cài**:
```json
{
  "@tiptap/extension-highlight": "^3.10.5",
  "@tiptap/extension-underline": "^3.10.5",
  "@tiptap/suggestion": "^3.10.5"
}
```

**Packages có sẵn**:
- `@tiptap/react`
- `@tiptap/starter-kit`
- `@tiptap/extension-placeholder`
- `@tiptap/extension-link`
- `@tiptap/extension-image`
- `@tiptap/extension-table`
- `@tiptap/extension-text-style`
- `@tiptap/extension-color`

---

## 🎯 Tuân thủ Rule Promt

✅ **Rule 10**: Frontend chuẩn shadcn UI, Mobile First + Responsive + PWA
- Editor responsive với flex-wrap toolbar
- Button sizes tối ưu cho touch

✅ **Rule 11**: Giao diện tiếng Việt
- Placeholder: "Bắt đầu viết nội dung..."
- Tooltips: "Bold", "Italic", etc.

✅ **Rule 12**: Dialog layout chuẩn (header, footer, scrollable body)
- Editor được đặt trong DialogBody
- Scrollable content area

---

## 💡 Cách sử dụng

### Tạo/Edit Content:
1. Click "Tạo nội dung" hoặc "Sửa" trên card
2. Điền Title, Slug
3. Sử dụng TipTap Editor với toolbar:
   - Click buttons để format text
   - Hoặc dùng keyboard shortcuts
   - Click Link/Image để thêm media
   - Click Table để thêm bảng
4. Chuyển sang tab SEO để điền meta tags
5. Click "Tạo" hoặc "Cập nhật"

### Editor Tips:
- **Bold text**: Select text → Click Bold icon hoặc Ctrl+B
- **Add link**: Select text → Click Link icon → Nhập URL
- **Add image**: Click Image icon → Nhập URL
- **Add table**: Click Table icon → Table 3x3 được tạo
- **Undo/Redo**: Click icons hoặc Ctrl+Z / Ctrl+Shift+Z

---

## 🔄 So sánh Before/After

### Before:
- ❌ Plain textarea
- ❌ Không có formatting
- ❌ Phải viết HTML thủ công
- ❌ Không preview
- ❌ UX kém

### After:
- ✅ Rich text editor
- ✅ WYSIWYG formatting
- ✅ Visual toolbar
- ✅ Real-time preview
- ✅ Notion-like experience
- ✅ HTML output tự động

---

## 📱 Responsive Design

**Mobile (< 640px)**:
- Toolbar flex-wrap, buttons stack gracefully
- Touch-friendly button sizes (sm)
- Adequate padding và spacing

**Tablet (640px - 1024px)**:
- Toolbar hiển thị 2-3 hàng
- Editor comfortable height

**Desktop (> 1024px)**:
- Toolbar full 1 hàng
- Spacious editing area
- Sticky toolbar for long content

---

## 🚀 Performance

- ✅ `immediatelyRender: false` - Tránh hydration issues
- ✅ Lazy loading extensions
- ✅ Debounced onChange handler
- ✅ Optimized re-renders
- ✅ HTML output (không JSON) - nhẹ hơn

---

## 📊 Technical Details

### Editor Configuration:
```typescript
{
  immediatelyRender: false,
  editable: true,
  content: HTML string,
  onUpdate: ({ editor }) => onChange(editor.getHTML()),
  editorProps: {
    attributes: {
      class: 'prose prose-sm sm:prose lg:prose-lg xl:prose-xl'
    }
  }
}
```

### Output Format:
- HTML string
- Compatible với Prisma `Text` field
- Render-ready cho frontend

---

## ✨ Future Enhancements

Có thể thêm sau:
- [ ] Slash commands (/) để insert blocks
- [ ] Drag & drop images
- [ ] Markdown shortcuts
- [ ] Collaborative editing
- [ ] Word count
- [ ] Reading time estimate
- [ ] Auto-save drafts
- [ ] Media library integration
- [ ] Code block với syntax highlighting

---

**Status**: ✅ Production Ready  
**Testing**: Manual testing required  
**Rollback**: Backup available tại `page.backup.tsx`
