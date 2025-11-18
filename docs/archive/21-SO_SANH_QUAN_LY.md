# SO SÁNH CÁC MODULE QUẢN LÝ

**Ngày:** 12/11/2025  
**Phân tích:** 3 module quản lý chính

---

## 📊 TỔNG QUAN

Hệ thống có 3 module quản lý nội dung chính:

| Module | Route | Chức năng chính | Trạng thái |
|--------|-------|-----------------|------------|
| **Pages Management** | `/admin/pages-management` | Quản lý trang tĩnh (Content + Builder) | ✅ Active |
| **Posts Management** | `/admin/posts-management` | Quản lý bài viết blog | ✅ Active |
| **Page Builder** | `/admin/page-builder` | Visual builder tạo trang | ✅ Active |
| Page Builder List | `/admin/page-builder-list` | ⚠️ DEPRECATED → Redirect to pages-management | 🔄 Redirect |

---

## 1️⃣ PAGES MANAGEMENT

**Route:** `/admin/pages-management`  
**File:** `app/admin/pages-management/page.tsx`

### 🎯 MÔ TẢ
Module **THỐNG NHẤT** để quản lý tất cả các trang tĩnh của website, bao gồm:
- Trang tạo bằng **Content Editor** (text-based)
- Trang tạo bằng **Visual Builder** (drag & drop)

### ✨ TÍNH NĂNG CHÍNH

#### **Quản lý 2 loại trang:**
1. **Content Pages** (không có `blocks`)
   - Tạo/sửa bằng form text editor
   - Phù hợp: Về chúng tôi, Chính sách, Liên hệ
   - Edit trực tiếp trong list

2. **Builder Pages** (có `blocks`)
   - Tạo bằng Page Builder visual
   - Chứa elements drag & drop
   - Edit → chuyển sang Page Builder editor

#### **Dashboard Statistics:**
- 📊 Tổng số trang
- 👁️ Published pages
- 🔒 Draft pages
- 📝 Content pages (text)
- 🎨 Builder pages (visual)

#### **Chức năng:**
- ✅ Tạo trang content mới (form dialog)
- ✅ Edit content pages inline
- ✅ Edit builder pages → redirect to `/admin/page-builder/[id]`
- ✅ Toggle publish/unpublish
- ✅ Delete pages
- ✅ Filter theo loại (All / Content / Builder)
- ✅ Preview pages
- ✅ SEO fields (metaTitle, metaDescription, metaKeywords)

#### **UI/UX:**
- Card grid layout (3 columns)
- Visual indicators khác biệt:
  - Content: 📄 Green gradient background
  - Builder: 🎨 Blue/Purple gradient + element count
- Badge: Content/Builder
- Statistics cards với icons
- Filter tabs

### 📝 FIELDS
```typescript
{
  id: string
  title: string
  slug: string
  published: boolean
  content?: string          // For content pages
  blocks?: any             // For builder pages (JSON)
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  createdAt: string
  updatedAt: string
}
```

### 🔗 INTEGRATION
- Liên kết với Page Builder qua nút "Page Builder"
- Edit builder pages → `/admin/page-builder/[id]`
- Preview → `/pages/[slug]`

---

## 2️⃣ POSTS MANAGEMENT

**Route:** `/admin/posts-management`  
**File:** `app/admin/posts-management/page.tsx`

### 🎯 MÔ TẢ
Module quản lý **bài viết blog** - nội dung có tính thời sự, cập nhật thường xuyên.

### ✨ TÍNH NĂNG CHÍNH

#### **Quản lý Blog Posts:**
- ✅ Tạo bài viết mới
- ✅ Edit bài viết
- ✅ Delete bài viết
- ✅ Toggle publish/draft
- ✅ SEO optimization
- ✅ Excerpt (mô tả ngắn)
- ✅ Author tracking

#### **Thông tin hiển thị:**
- 📝 Title & Slug
- 👤 Author (name/email)
- 📅 Ngày tạo/cập nhật
- 🔵/⚪ Status: Live/Draft

#### **UI/UX:**
- Card grid layout (2 columns)
- Simple & clean design
- No statistics dashboard
- Direct CRUD operations

### 📝 FIELDS
```typescript
{
  id: string
  title: string
  slug: string
  published: boolean
  author: {
    name: string | null
    email: string
  }
  content?: string
  excerpt?: string         // Khác với Pages
  metaTitle?: string
  metaDescription?: string
  metaKeywords?: string
  createdAt: string
  updatedAt: string
}
```

### 🆚 SO VỚI PAGES
- ❌ Không có Builder integration
- ✅ Có `excerpt` field (tóm tắt bài viết)
- ✅ Có `author` tracking
- ❌ Không có filter/statistics
- 📱 Simpler interface

---

## 3️⃣ PAGE BUILDER

**Route:** `/admin/page-builder`  
**File:** `app/admin/page-builder/page.tsx`

### 🎯 MÔ TẢ
**Ultra Builder MVP** - Visual drag & drop page builder với công nghệ hiện đại.

### 🚀 TECHNOLOGY STACK
- **React 19** + TypeScript
- **Konva** - Canvas rendering
- **Yoga** - Flexbox layout engine
- **Framer Motion** - Animations
- **Tailwind CSS** - Styling

### ✨ TÍNH NĂNG CHÍNH

#### **Visual Builder Interface:**
1. **Component Sidebar (Left)**
   - Palette các components có sẵn
   - Drag & drop components

2. **Canvas (Center)**
   - Visual editing workspace
   - Grid system
   - Snap to grid
   - Zoom controls

3. **Inspector (Right)**
   - Properties editor cho selected element
   - Style controls
   - Layout options

#### **Core Features:**
- ✅ Drag & drop components
- ✅ Visual editing
- ✅ Grid system với snap
- ✅ Zoom in/out
- ✅ Responsive breakpoints
- ✅ Live preview mode
- ✅ Export to HTML
- ✅ Element count tracking

#### **Breakpoints:**
- 📱 Mobile
- 📱 Tablet
- 💻 Desktop

### 📝 DATA STRUCTURE
```typescript
{
  canvas: {
    elements: Record<string, Element>
    currentBreakpoint: 'mobile' | 'tablet' | 'desktop'
    zoom: number
    snapToGrid: boolean
    gridSize: number
  }
}
```

### 🔧 WORKFLOW
1. Tạo mới từ Pages Management (tạo Builder page)
2. Hoặc edit existing builder page → `/admin/page-builder/[id]`
3. Drag & drop elements
4. Style & configure
5. Preview responsive
6. Export HTML
7. Save (lưu vào `blocks` field của Page)

---

## 📊 SO SÁNH TỔNG QUAN

| Tiêu chí | Pages Management | Posts Management | Page Builder |
|----------|------------------|------------------|--------------|
| **Mục đích** | Trang tĩnh (Content + Builder) | Blog posts | Visual builder |
| **Loại nội dung** | Static pages | Dynamic blog | Visual components |
| **Editor** | Form + Visual Builder | Form only | Drag & Drop Canvas |
| **Statistics** | ✅ 5 metrics | ❌ None | ✅ Element count |
| **Filter** | ✅ All/Content/Builder | ❌ None | N/A |
| **Author** | ❌ No | ✅ Yes | N/A |
| **Excerpt** | ❌ No | ✅ Yes | N/A |
| **Blocks/Elements** | ✅ Yes (JSON) | ❌ No | ✅ Yes (Konva) |
| **SEO Fields** | ✅ Yes | ✅ Yes | N/A (inherit from Page) |
| **Preview** | ✅ `/pages/[slug]` | ❌ No | ✅ Built-in |
| **Export** | ❌ No | ❌ No | ✅ HTML Export |
| **UI Complexity** | Medium | Simple | Complex |
| **Grid Layout** | 3 columns | 2 columns | 3-panel editor |

---

## 🔄 WORKFLOW TÍCH HỢP

### **Tạo trang Content:**
```
Pages Management → Tạo content → Form dialog → Save → Display in list
```

### **Tạo trang Builder:**
```
Pages Management → "Page Builder" button 
  → Page Builder → Design 
  → Export → Save to database (blocks field)
  → Hiển thị trong Pages Management với badge "Builder"
```

### **Edit trang Builder:**
```
Pages Management → Card "Builder" 
  → "Edit Builder" button 
  → /admin/page-builder/[id] 
  → Design → Save
```

### **Viết blog post:**
```
Posts Management → Tạo bài viết → Form dialog → Save → Publish
```

---

## 🎯 PHÂN BIỆT KHI NÀO DÙNG GÌ

### ✅ Dùng **Pages Management - Content** khi:
- Tạo trang tĩnh đơn giản (text-based)
- Nội dung ít thay đổi
- Không cần layout phức tạp
- VD: Chính sách bảo mật, Điều khoản, Liên hệ

### ✅ Dùng **Pages Management - Builder** khi:
- Cần design custom, phức tạp
- Landing pages với layout đặc biệt
- Marketing pages
- VD: Homepage, Product pages, Campaign pages

### ✅ Dùng **Posts Management** khi:
- Viết blog/tin tức
- Nội dung cập nhật thường xuyên
- Cần tracking tác giả
- Cần excerpt/summary
- VD: Blog articles, News, Updates

### ✅ Dùng **Page Builder** khi:
- Thiết kế visual từ đầu
- Cần drag & drop components
- Preview responsive
- Export HTML standalone
- Build prototypes nhanh

---

## 🏗️ KIẾN TRÚC HIỆN TẠI

```
┌─────────────────────────────────────────┐
│        PAGES MANAGEMENT (Hub)           │
│  ┌──────────────┐    ┌──────────────┐  │
│  │   Content    │    │   Builder    │  │
│  │   Pages      │    │   Pages      │  │
│  │  (Text Form) │    │ (Visual)     │  │
│  └──────────────┘    └───────┬──────┘  │
│                              │          │
└──────────────────────────────┼──────────┘
                               │
                    ┌──────────▼──────────┐
                    │   PAGE BUILDER      │
                    │  (Ultra Builder)    │
                    │  Konva + Yoga       │
                    └─────────────────────┘

┌─────────────────────────────────────────┐
│        POSTS MANAGEMENT                 │
│      (Blog/News Articles)               │
│        - Text Editor Only               │
│        - No Builder Integration         │
└─────────────────────────────────────────┘
```

---

## 🔮 RECOMMENDATIONS

### 1. **Hợp nhất Page Builder List**
✅ **ĐÃ HOÀN THÀNH** - Đã redirect về Pages Management

### 2. **Cải thiện Posts Management**
💡 **ĐỀ XUẤT:**
- Thêm statistics dashboard giống Pages
- Thêm filter: Published/Draft
- Thêm category/tags
- Thêm featured image
- Thêm preview trước khi publish

### 3. **Tích hợp Page Builder vào Posts**
💡 **ĐỀ XUẤT:**
- Cho phép posts cũng dùng visual builder
- Hybrid editor: Rich text + Visual blocks
- Tương tự WordPress Gutenberg

### 4. **Chuẩn hóa UI/UX**
💡 **ĐỀ XUẤT:**
- Áp dụng statistics cards cho Posts
- Unified dialog layout (header/content/footer)
- Consistent card design
- Same grid system (3 cols)

---

## 📈 METRICS

### **Pages:**
- Total: Động (Content + Builder)
- Published: Trạng thái live
- Draft: Chưa publish
- Content: Text-based pages
- Builder: Visual pages

### **Posts:**
- Chỉ hiển thị list
- Không có statistics tổng hợp
- Cần bổ sung metrics

### **Page Builder:**
- Element count (số lượng components)
- Grid status
- Zoom level
- Current breakpoint

---

## 🎨 UI/UX COMPARISON

### **Pages Management:**
- 🌈 Color-coded cards (Green/Blue)
- 📊 Statistics dashboard prominent
- 🔍 Filter tabs
- 💎 Premium feel

### **Posts Management:**
- 🎯 Simple & clean
- 📋 List-focused
- ⚡ Quick actions
- 🚀 Lightweight

### **Page Builder:**
- 🎨 Full-screen canvas
- 🛠️ Tool-focused
- 💻 Pro editor feel
- 🎭 Creative workspace

---

## 🔑 KẾT LUẬN

### **Pages Management** = **HUB CHÍNH**
- Quản lý tất cả trang tĩnh
- Tích hợp builder & content
- Dashboard & statistics
- **Vai trò:** Content management hub

### **Posts Management** = **BLOG ENGINE**
- Quản lý blog riêng biệt
- Simple & focused
- Author tracking
- **Vai trò:** Blog/News publishing

### **Page Builder** = **CREATIVE TOOL**
- Visual design tool
- Standalone & powerful
- Export capability
- **Vai trò:** Design system

---

**Tóm lại:** Hệ thống hiện tại đã tách biệt rõ ràng giữa **Static Pages** (Pages Management), **Blog Content** (Posts Management), và **Visual Design Tool** (Page Builder). Kiến trúc hợp lý, cần cải thiện thêm Posts Management và chuẩn hóa UI/UX.

**Status:** ✅ Working well, 💡 Room for improvement
