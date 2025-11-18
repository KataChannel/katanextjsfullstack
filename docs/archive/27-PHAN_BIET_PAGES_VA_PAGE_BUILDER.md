# PHÂN BIỆT PAGES VÀ PAGE BUILDER

**Tài liệu phân tích sự khác biệt giữa 2 loại nội dung**

---

## 🎯 TÓM TẮT

Dự án hiện có **2 CÁCH** tạo nội dung cho Pages và Posts:

### 1️⃣ **CONTENT MODE** (Traditional Editor)
- Sử dụng **TipTap Editor** (Rich Text Editor giống Notion)
- Lưu nội dung vào field **`content`** (HTML string)
- Field **`blocks`** = `null`
- **Không có** giao diện visual kéo thả

### 2️⃣ **BUILDER MODE** (Visual Page Builder)
- Sử dụng **Ultra Page Builder** (Konva + Canvas)
- Lưu nội dung vào field **`blocks`** (JSON object)
- Field **`content`** có thể có hoặc không
- **Có** giao diện visual drag & drop

---

## 📊 BẢNG SO SÁNH CHI TIẾT

| Tiêu chí | **Content Mode** | **Builder Mode** |
|----------|------------------|------------------|
| **Editor** | TipTap Rich Text Editor | Ultra Page Builder (Konva Canvas) |
| **Data Storage** | `content` field (HTML) | `blocks` field (JSON) |
| **UI Type** | Text-based WYSIWYG | Visual Drag & Drop |
| **Components** | Inline text formatting | Container, Text, Heading, Button, Image, Video, Divider, Spacer |
| **Layout Control** | Limited (HTML/CSS) | Full control (X, Y, Width, Height, Styles) |
| **Responsive** | CSS-based | Canvas breakpoints + Mobile First |
| **Use Case** | Blog posts, articles, simple pages | Landing pages, complex layouts, visual designs |
| **Learning Curve** | Easy (like Word) | Medium (like Figma) |
| **Export** | HTML only | HTML + JSON blocks |
| **Route** | `/admin/content/[id]` | `/admin/page-builder/[id]` |

---

## 🗄️ DATABASE SCHEMA

### **Page Model**
```prisma
model Page {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  
  // 🔵 CONTENT MODE: HTML từ TipTap
  content     String?  @db.Text
  
  // 🟢 BUILDER MODE: JSON từ Page Builder
  blocks      Json?
  
  published   Boolean  @default(false)
  
  // SEO Fields
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?
  
  // ... other fields
}
```

### **Post Model**
```prisma
model Post {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  
  // 🔵 CONTENT MODE: HTML từ TipTap
  content     String?
  excerpt     String?
  
  // 🟢 BUILDER MODE: JSON từ Page Builder
  blocks      Json?
  
  published   Boolean  @default(false)
  
  // SEO Fields
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?
  
  // ... other fields
}
```

**✅ Cả Pages và Posts đều hỗ trợ CẢ 2 MODE!**

---

## 🔍 CÁCH PHÂN BIỆT

### **Trong Code:**
```typescript
// Check nếu là Builder Mode
if (page.blocks !== null && page.blocks !== undefined) {
  // → BUILDER MODE
  // Render bằng PageBuilderRenderer hoặc PageBlocksRenderer
} else {
  // → CONTENT MODE
  // Render bằng dangerouslySetInnerHTML với page.content
}
```

### **Trong UI (Content Management):**
```typescript
type PageType = "content" | "builder";

const pageType: PageType = item.blocks ? "builder" : "content";
```

### **Badge Hiển Thị:**
- 🎨 **Builder** badge → có `blocks` data
- 📝 **Content** badge → không có `blocks` data

---

## 📁 CẤU TRÚC BLOCKS JSON

### **New Format (Ultra Page Builder)**
```json
{
  "canvas": {
    "width": 1440,
    "height": 900,
    "zoom": 1,
    "snapToGrid": true,
    "gridSize": 12,
    "showGrid": false,
    "magneticAlignment": true,
    "selectedIds": []
  },
  "elements": [
    {
      "id": "hero-container",
      "type": "container",
      "x": 0,
      "y": 0,
      "width": 1440,
      "height": 600,
      "styles": {
        "background": "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        "display": "flex",
        "flexDirection": "column",
        "justifyContent": "center",
        "alignItems": "center",
        "gap": "32px",
        "padding": "64px"
      },
      "children": []
    },
    {
      "id": "hero-heading",
      "type": "heading",
      "x": 420,
      "y": 200,
      "width": 600,
      "height": 80,
      "content": "Welcome to Ultra Builder",
      "styles": {
        "fontSize": "56px",
        "fontWeight": "800",
        "color": "#ffffff",
        "textAlign": "center"
      },
      "children": []
    }
  ],
  "history": {
    "past": [],
    "future": []
  }
}
```

### **Old Format (Simple Blocks)**
```json
[
  {
    "id": "block-123",
    "type": "heading",
    "content": "Heading text"
  },
  {
    "id": "block-456",
    "type": "text",
    "content": "<p>Paragraph content</p>"
  },
  {
    "id": "block-789",
    "type": "image",
    "content": "https://image-url.jpg",
    "config": {
      "alt": "Image description",
      "caption": "Image caption"
    }
  }
]
```

**✅ Dự án hỗ trợ CẢ 2 FORMAT để tương thích ngược!**

---

## 🛣️ ROUTING & NAVIGATION

### **Content Mode:**
```
1. Tạo mới:
   /admin/content/new?type=page
   /admin/content/new?type=post

2. Chỉnh sửa:
   /admin/content/[id]
   → TipTap Editor
   → Tabs: Thông tin chung, SEO

3. Preview:
   /pages/[slug]  (for pages)
   /posts/[slug]  (for posts)
```

### **Builder Mode:**
```
1. Tạo mới:
   a) Tạo page/post thông thường trước
   b) Sau đó click "Edit Builder"

2. Chỉnh sửa:
   /admin/page-builder/[id]
   → Ultra Page Builder Canvas
   → Sidebars: Components, Inspector
   → Toolbar: Save, Export, Preview

3. Preview:
   /pages/[slug]  (for pages)
   /posts/[slug]  (for posts)
   → Render với PageBuilderRenderer
```

---

## 🎨 COMPONENTS

### **Content Mode Components:**
```
TipTap Editor:
├── Bold, Italic, Underline
├── Headings (H1-H6)
├── Lists (Bullet, Numbered)
├── Links
├── Images
├── Code blocks
├── Blockquotes
└── Tables
```

### **Builder Mode Components:**
```
Ultra Page Builder:
├── Container (Layout wrapper)
├── Text (Paragraph with styles)
├── Heading (H1-H6 with level prop)
├── Button (CTA với styles)
├── Image (Upload/URL với alt)
├── Video (Embed iframe)
├── Divider (HR separator)
└── Spacer (Empty space)
```

---

## 📝 USE CASES

### **Nên dùng CONTENT MODE khi:**
✅ Tạo blog posts (bài viết dài)  
✅ Tạo trang About, Contact đơn giản  
✅ Nội dung text-heavy  
✅ Cần editor nhanh giống Word/Notion  
✅ Không cần layout phức tạp  

### **Nên dùng BUILDER MODE khi:**
✅ Tạo landing pages  
✅ Tạo homepage với sections phức tạp  
✅ Cần kiểm soát layout chính xác (px-level)  
✅ Tạo pricing pages, feature pages  
✅ Cần responsive design chi tiết  
✅ Cần export HTML  

---

## 🔄 MIGRATION PATH

### **Từ Content → Builder:**
```typescript
// 1. Tạo page với content mode
const page = await prisma.page.create({
  data: {
    title: "My Page",
    slug: "my-page",
    content: "<p>HTML content</p>",
    blocks: null, // ← Content mode
  }
});

// 2. Chuyển sang builder mode
const updatedPage = await prisma.page.update({
  where: { id: page.id },
  data: {
    blocks: {
      canvas: { ... },
      elements: [ ... ],
    },
    // content vẫn giữ nguyên (optional)
  }
});
```

### **Từ Builder → Content:**
```typescript
// Có thể export HTML từ builder rồi paste vào content
const page = await prisma.page.update({
  where: { id: page.id },
  data: {
    content: exportToHTML(blocks.elements),
    blocks: null, // ← Xóa blocks để về content mode
  }
});
```

---

## 🎯 BEST PRACTICES

### **1. Tách biệt rõ ràng:**
```typescript
// ❌ BAD: Vừa có content vừa có blocks
{
  content: "<p>HTML</p>",
  blocks: { elements: [...] }
}

// ✅ GOOD: Chỉ 1 trong 2
// Option 1: Content mode
{
  content: "<p>HTML</p>",
  blocks: null
}

// Option 2: Builder mode
{
  content: null, // hoặc empty string
  blocks: { elements: [...] }
}
```

### **2. Kiểm tra trước khi render:**
```typescript
async function renderContent(content: any, type: 'page' | 'post') {
  // 1. Check for new format builder (elements array)
  if (content.blocks?.elements) {
    return <PageBuilderRenderer elements={content.blocks.elements} />;
  }
  
  // 2. Check for old format builder (array of blocks)
  if (content.blocks && Array.isArray(content.blocks)) {
    return <PageBlocksRenderer blocks={content.blocks} />;
  }
  
  // 3. Fallback to content mode (HTML)
  if (content.content) {
    return (
      <div dangerouslySetInnerHTML={{ __html: content.content }} />
    );
  }
  
  // 4. Empty state
  return <p>Không có nội dung</p>;
}
```

### **3. UI Labels:**
```typescript
// Badge hiển thị type
{item.blocks ? (
  <Badge variant="secondary">
    <Palette className="w-3 h-3 mr-1" />
    Builder
  </Badge>
) : (
  <Badge variant="outline">
    <FileText className="w-3 h-3 mr-1" />
    Content
  </Badge>
)}
```

---

## 🚀 KẾT LUẬN

### **TL;DR:**

| | Content Mode | Builder Mode |
|---|---|---|
| **Field** | `content` (HTML) | `blocks` (JSON) |
| **Editor** | TipTap | Ultra Page Builder |
| **Route** | `/admin/content/[id]` | `/admin/page-builder/[id]` |
| **Best for** | Blog posts, articles | Landing pages, layouts |

**✅ CẢ 2 MODE đều hợp lệ và được hỗ trợ đầy đủ!**

**✅ Có thể chuyển đổi qua lại giữa 2 mode!**

**✅ Database schema đã thiết kế để hỗ trợ cả 2 mode!**

---

## 📚 RELATED DOCS

- `docs/16-HUONG_DAN_PAGEBUILDER.md` - Hướng dẫn Page Builder
- `docs/22-HUONG_DAN_CONTENT_MANAGEMENT.md` - Hướng dẫn Content Management
- `docs/19-PAGE_BUILDER_UI_UPDATE.md` - UI Page Builder
- `docs/9-POSTS_PAGE_BUILDER_FIX.md` - Posts hỗ trợ Builder

---

**📅 Ngày tạo:** 13/11/2025  
**👤 Tác giả:** AI Assistant  
**🎯 Mục đích:** Phân tích và làm rõ sự khác biệt giữa Pages và Page Builder
