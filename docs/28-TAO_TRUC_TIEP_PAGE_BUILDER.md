# CẬP NHẬT: TẠO TRỰC TIẾP PAGE BUILDER

**Tính năng tạo Page Builder ngay từ đầu**

---

## 🎯 VẤN ĐỀ

**Trước đây:**
- Không thể tạo trực tiếp Page Builder
- Phải tạo Page/Post bình thường trước
- Sau đó mới click "Edit Builder" để chuyển sang builder mode
- ❌ Workflow dài dòng, không trực quan

**Bây giờ:**
- ✅ Tạo trực tiếp Page Builder chỉ với 2 click
- ✅ Dialog chọn loại: Page, Post, hoặc Page Builder
- ✅ Tự động redirect đến Page Builder sau khi tạo
- ✅ Workflow nhanh, trực quan

---

## 🚀 TÍNH NĂNG MỚI

### **1. Dialog Chọn Loại Content**

Khi click nút **"Tạo nội dung"**, hiện Dialog với 3 lựa chọn:

```
┌─────────────────────────────────────────────┐
│  Tạo nội dung mới                          │
│  Chọn loại nội dung bạn muốn tạo           │
├─────────────────────────────────────────────┤
│                                             │
│  📄  Page (Content)                         │
│      Trang tĩnh với TipTap editor          │
│                                             │
│  📝  Post (Blog)                            │
│      Bài viết blog với excerpt             │
│                                             │
│  🎨  Page Builder (Visual)                 │
│      Editor visual kéo thả                 │
│                                             │
└─────────────────────────────────────────────┘
```

### **2. Tạo Page Builder Workflow**

```
1. Click "Tạo nội dung"
   ↓
2. Dialog hiện ra → Click "Page Builder (Visual)"
   ↓
3. Form tạo Page Builder:
   - Tiêu đề (*)
   - Slug (*)
   - SEO: Meta Title, Description, Keywords
   - Không có TipTap Editor (thay bằng placeholder)
   ↓
4. Click "Tạo & Mở Builder"
   ↓
5. Tự động redirect → /admin/page-builder/{id}
   ↓
6. Bắt đầu thiết kế visual!
```

---

## 📝 CODE CHANGES

### **1. Content Management Page**

**File:** `app/admin/content/page.tsx`

#### **Thêm Dialog Component:**
```tsx
function CreateContentDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Tạo nội dung mới</DialogTitle>
          <DialogDescription>
            Chọn loại nội dung bạn muốn tạo
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-3 py-4">
          {/* 3 options: Page, Post, Page Builder */}
          <Link href="/admin/content/new?type=page&mode=content">...</Link>
          <Link href="/admin/content/new?type=post&mode=content">...</Link>
          <Link href="/admin/content/new?mode=builder&type=page">...</Link>
        </div>
      </DialogContent>
    </Dialog>
  );
}
```

#### **State Management:**
```tsx
const [showCreateDialog, setShowCreateDialog] = useState(false);
```

#### **Button Click:**
```tsx
<Button onClick={() => setShowCreateDialog(true)}>
  <Plus className="mr-2 h-4 w-4" />
  Tạo nội dung
</Button>
```

---

### **2. Content Edit/Create Page**

**File:** `app/admin/content/[id]/page.tsx`

#### **Thêm Mode State:**
```tsx
const [contentMode, setContentMode] = useState<"content" | "builder">(
  (searchParams.get("mode") as "content" | "builder") || "content"
);
```

#### **Form Data:**
```tsx
interface ContentData {
  // ... existing fields
  mode?: "content" | "builder"; // NEW
}
```

#### **Mode Switcher UI:**
```tsx
{isNewContent && (
  <div className="flex gap-2">
    <Button
      variant={contentMode === "content" && contentType === "page" ? "default" : "outline"}
      onClick={() => {
        setContentMode("content");
        setContentType("page");
      }}
    >
      📄 Page
    </Button>
    <Button
      variant={contentMode === "content" && contentType === "post" ? "default" : "outline"}
      onClick={() => {
        setContentMode("content");
        setContentType("post");
      }}
    >
      📝 Post
    </Button>
    <Button
      variant={contentMode === "builder" ? "default" : "outline"}
      onClick={() => {
        setContentMode("builder");
        setContentType("page");
      }}
    >
      🎨 Builder
    </Button>
  </div>
)}
```

#### **Conditional Content Editor:**
```tsx
<div className="space-y-2">
  <Label htmlFor="content">Nội dung</Label>
  {contentMode === "builder" ? (
    <div className="border border-dashed rounded-md p-8 text-center space-y-3">
      <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
        🎨
      </div>
      <div>
        <p className="font-medium">Page Builder Mode</p>
        <p className="text-sm text-muted-foreground">
          Sau khi tạo, bạn sẽ được chuyển sang Page Builder để thiết kế visual
        </p>
      </div>
    </div>
  ) : (
    <TiptapEditor ... />
  )}
</div>
```

#### **Create Logic with Builder Support:**
```tsx
if (contentMode === "builder") {
  dataToSend.blocks = {
    canvas: {
      width: 1440,
      height: 900,
      zoom: 1,
      snapToGrid: true,
      gridSize: 12,
      showGrid: false,
      magneticAlignment: true,
      selectedIds: [],
      currentBreakpoint: 'desktop',
      elements: [],
    },
    elements: [],
    history: {
      past: [],
      future: [],
    },
  };
  delete dataToSend.content;
}

// After successful create
if (contentMode === "builder") {
  router.push(`/admin/page-builder/${newId}`);
} else {
  router.push("/admin/content");
}
```

---

## 🎨 UX IMPROVEMENTS

### **1. Dynamic Save Button Text:**
```tsx
<Button onClick={handleSave} disabled={saving}>
  <Save className="mr-2 h-4 w-4" />
  {saving 
    ? "Đang lưu..." 
    : displayMode === "builder" 
      ? "Tạo & Mở Builder" 
      : "Lưu"
  }
</Button>
```

### **2. Dynamic Page Title:**
```tsx
<h1>
  {isNewContent 
    ? `Tạo ${displayMode === "builder" ? "Page Builder" : displayType === "page" ? "trang" : "bài viết"} mới`
    : `Chỉnh sửa ${displayMode === "builder" ? "Page Builder" : displayType === "page" ? "trang" : "bài viết"}`
  }
</h1>
```

### **3. Dynamic Description:**
```tsx
<p>
  {isNewContent 
    ? displayMode === "builder" 
      ? "Tạo trang mới với Page Builder visual editor"
      : "Điền thông tin để tạo nội dung mới"
    : "Cập nhật thông tin nội dung"
  }
</p>
```

---

## 🔗 ROUTES

### **URL Patterns:**
```
Create Page (Content):
/admin/content/new?type=page&mode=content

Create Post (Content):
/admin/content/new?type=post&mode=content

Create Page Builder:
/admin/content/new?mode=builder&type=page
```

### **Query Parameters:**
- `type`: `"page"` | `"post"`
- `mode`: `"content"` | `"builder"`

---

## ✅ THEO RULEPROMT.TXT

✅ **Mobile First + Responsive**
- Dialog responsive
- Form responsive
- Mobile-friendly buttons

✅ **Giao diện tiếng Việt**
- Tất cả labels tiếng Việt
- Descriptions rõ ràng

✅ **shadcn UI Dialog chuẩn**
- Header, Content, scrollable
- Close button
- Overlay backdrop

✅ **Clean Architecture**
- Component tách biệt (CreateContentDialog)
- State management rõ ràng
- Mode-based logic

✅ **User Experience**
- 1-click access
- Clear visual distinction
- Intuitive workflow

---

## 🎯 TESTING CHECKLIST

### **Test Tạo Page Builder:**
```
1. ✅ Click "Tạo nội dung"
2. ✅ Dialog hiện ra
3. ✅ Click "Page Builder (Visual)"
4. ✅ Form hiện placeholder thay vì TipTap
5. ✅ Điền Title: "Test Landing Page"
6. ✅ Slug auto-generate: "test-landing-page"
7. ✅ Click "Tạo & Mở Builder"
8. ✅ Redirect đến /admin/page-builder/{id}
9. ✅ Canvas trống với empty blocks structure
10. ✅ Bắt đầu thiết kế!
```

### **Test Tạo Page/Post Bình Thường:**
```
1. ✅ Click "Tạo nội dung"
2. ✅ Click "Page (Content)" hoặc "Post (Blog)"
3. ✅ TipTap Editor hiển thị
4. ✅ Điền content
5. ✅ Click "Lưu"
6. ✅ Redirect về /admin/content
```

---

## 📊 BENEFITS

### **Trước:**
```
Create Page → Fill Info → Save 
→ Back to List → Find Page → Click "Edit Builder" 
→ Redirect to Page Builder
= 6 STEPS
```

### **Sau:**
```
Click "Tạo nội dung" → Click "Page Builder" 
→ Fill Info → Click "Tạo & Mở Builder"
= 3 STEPS
```

**🎉 Giảm 50% số bước!**

---

## 🔧 FILES CHANGED

1. ✅ `app/admin/content/page.tsx`
   - Added CreateContentDialog component
   - Added showCreateDialog state
   - Updated button to open dialog

2. ✅ `app/admin/content/[id]/page.tsx`
   - Added contentMode state
   - Added mode field to ContentData interface
   - Added mode switcher UI
   - Added conditional content editor
   - Added builder mode create logic
   - Added redirect logic based on mode

---

## 📚 RELATED DOCS

- `docs/27-PHAN_BIET_PAGES_VA_PAGE_BUILDER.md` - Phân biệt Pages vs Builder
- `docs/16-HUONG_DAN_PAGEBUILDER.md` - Hướng dẫn Page Builder
- `docs/22-HUONG_DAN_CONTENT_MANAGEMENT.md` - Hướng dẫn Content Management

---

**📅 Ngày cập nhật:** 13/11/2025  
**👤 Tác giả:** AI Assistant  
**🎯 Mục đích:** Bổ sung tính năng tạo trực tiếp Page Builder
