# Update Pages V2 Editor - Fullscreen Mode

**Ngày:** 17/11/2025  
**Status:** ✅ COMPLETED

---

## 🎯 Cập nhật

Cập nhật pages-v2 editor (new & edit) theo rulepromt.txt:
- ✅ Fullscreen mode
- ✅ Mobile First + Responsive
- ✅ Giao diện tiếng Việt
- ✅ Dialog với header, footer, scrollable content

---

## 📦 Pages đã cập nhật

### 1. **New Page** (`/admin/pages-v2/new`)

**Before:**
```tsx
<>
  <div className="h-14 bg-white border-b">
    // Header
  </div>
  <BlockEditor />
</>
```

**After:**
```tsx
<div className="fixed inset-0 z-50 bg-background flex flex-col">
  {/* Header - Sticky */}
  <div className="h-14 bg-background border-b shrink-0">
    // Responsive header
  </div>
  
  {/* Editor - Fullscreen */}
  <div className="flex-1 overflow-hidden">
    <BlockEditor />
  </div>
  
  {/* Dialog - Mobile First */}
  <Dialog>
    <DialogHeader className="border-b pb-4" />
    <div className="flex-1 overflow-y-auto p-4" />
    <DialogFooter className="border-t pt-4" />
  </Dialog>
</div>
```

### 2. **Edit Page** (`/admin/pages-v2/edit/[id]`)

**Before:**
```tsx
<>
  <div className="h-14">Header</div>
  <BlockEditor />
</>
```

**After:**
```tsx
<div className="fixed inset-0 z-50 bg-background flex flex-col">
  <div className="h-14 shrink-0">Responsive Header</div>
  <div className="flex-1 overflow-hidden">
    <BlockEditor />
  </div>
</div>
```

---

## 🎨 Design Updates

### Fullscreen Layout
```tsx
<div className="fixed inset-0 z-50 bg-background flex flex-col">
  {/* Header: shrink-0 */}
  {/* Editor: flex-1 overflow-hidden */}
</div>
```

**Benefits:**
- ✅ Full viewport height
- ✅ No scroll on outer container
- ✅ Editor gets maximum space
- ✅ z-50 ensures top layer

### Mobile First Header
```tsx
// Desktop: Full text
<span className="hidden sm:inline">Quay lại</span>

// Mobile: Icon only
<ArrowLeft className="w-4 h-4" />

// Responsive gaps
<div className="gap-2 sm:gap-4">
```

**Breakpoints:**
- `sm:` (640px+) - Hiện text
- `< 640px` - Chỉ icons
- `min-w-0` + `truncate` - Ngăn overflow

### Dialog Layout (Theo rulepromt.txt #12)
```tsx
<DialogContent className="max-w-2xl max-h-[90vh] flex flex-col">
  {/* Header - Fixed */}
  <DialogHeader className="border-b pb-4">
    <DialogTitle>Tiêu đề</DialogTitle>
  </DialogHeader>
  
  {/* Content - Scrollable */}
  <div className="flex-1 overflow-y-auto p-4">
    // Form fields
  </div>
  
  {/* Footer - Fixed */}
  <DialogFooter className="border-t pt-4">
    <Button>Lưu</Button>
  </DialogFooter>
</DialogContent>
```

---

## 🌐 Tiếng Việt UI

### New Page Dialog
- "Save New Page" → "Lưu trang mới"
- "Page Title" → "Tiêu đề trang *"
- "URL Slug" → "URL Slug *"
- "Save as Draft" → "Lưu bản nháp"
- "Saving..." → "Đang lưu..."

### Edit Page Header
- "Back" → "Quay lại"
- "Settings" → "Cài đặt"
- "View Live" → "Xem live"
- "Preview" → "Xem trước"
- "Publish" → "Xuất bản"
- "Unpublish" → "Ẩn"
- "Published" → "Đã xuất bản"
- "Draft" → "Bản nháp"

### Edit Settings Dialog
- "Page Settings" → "Cài đặt trang"
- "Update page metadata and SEO settings" → "Cập nhật metadata và SEO cho trang"
- "Meta Title (SEO)" → "Meta Title (SEO)"
- "Leave empty to use page title" → "Để trống để sử dụng tiêu đề trang"
- "Brief description..." → "Mô tả ngắn gọn cho công cụ tìm kiếm"
- "Save Settings" → "Lưu cài đặt"

### Loading States
- "Loading page..." → "Đang tải trang..."
- "Page not found" → "Không tìm thấy trang"
- "Back to Pages" → "Quay lại danh sách"

---

## 📱 Responsive Behavior

### Header (Desktop)
```
[← Quay lại] [Tạo trang mới | Block Editor V2] ... [⚙️ Cài đặt] [👁 Xem trước] [Xuất bản]
```

### Header (Mobile)
```
[←] [Tạo trang...] ... [⚙️] [👁] [Xuất bản]
```

### Dialog (Desktop)
```
┌─────────────────────────────┐
│ Header (fixed)              │
├─────────────────────────────┤
│                             │
│ Content (scrollable)        │
│                             │
├─────────────────────────────┤
│ Footer (fixed)      [Lưu]  │
└─────────────────────────────┘
```

### Dialog (Mobile)
```
Full width, max-h-90vh
Grid: 2 cols → 1 col
```

---

## 🎯 Features

### Fullscreen Editor
- ✅ `fixed inset-0` - Full viewport
- ✅ `z-50` - Top layer
- ✅ `flex-col` - Vertical layout
- ✅ Header: `shrink-0` - Fixed height
- ✅ Editor: `flex-1 overflow-hidden` - Fill space

### Responsive Header
- ✅ Mobile: Icons only
- ✅ Desktop: Icons + Text
- ✅ Truncate long titles
- ✅ Responsive gaps: `gap-2 sm:gap-4`

### Dialog Best Practices
- ✅ Header: Fixed với border-b
- ✅ Content: Scrollable với overflow-y-auto
- ✅ Footer: Fixed với border-t
- ✅ Max height: `max-h-[90vh]`
- ✅ Flex layout: `flex flex-col`

---

## 📝 Files đã sửa

1. ✅ `app/admin/pages-v2/new/page.tsx`
   - Fullscreen layout
   - Vietnamese UI
   - Dialog header/footer/content

2. ✅ `app/admin/pages-v2/edit/[id]/page.tsx`
   - Fullscreen layout
   - Responsive header
   - Vietnamese UI
   - Settings dialog với proper layout

---

## 🚀 Testing

### New Page
```bash
# 1. Truy cập
http://localhost:3005/admin/pages-v2/new

# 2. Check fullscreen
- Editor chiếm full height
- Header sticky top
- No outer scroll

# 3. Test mobile
- Resize < 640px
- Check icons only
- Dialog responsive
```

### Edit Page
```bash
# 1. Truy cập
http://localhost:3005/admin/pages-v2/edit/[id]

# 2. Test buttons
- Settings dialog
- Preview link
- Publish toggle

# 3. Test responsive
- Mobile: Icons only
- Desktop: Icons + Text
- Truncate long titles
```

### Dialog Layout
```bash
# 1. Open save/settings dialog
# 2. Add nhiều content
# 3. Verify:
   - Header fixed
   - Content scrollable
   - Footer fixed
   - No outer scroll
```

---

## ✅ Checklist

- [x] Fullscreen layout với `fixed inset-0`
- [x] Mobile First responsive header
- [x] Dialog theo rulepromt.txt #12
- [x] Tất cả UI tiếng Việt
- [x] Loading states tiếng Việt
- [x] Truncate long titles
- [x] Responsive gaps và spacing
- [x] z-index proper layering
- [x] No TypeScript errors
- [x] No console errors

---

**Status:** ✅ COMPLETED - Editor fullscreen với responsive mobile first
