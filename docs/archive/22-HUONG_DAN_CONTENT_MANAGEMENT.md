# HƯỚNG DẪN SỬ DỤNG CONTENT MANAGEMENT

**Module quản lý nội dung thống nhất**

---

## 🎯 TỔNG QUAN

**Content Management** là module **ALL-IN-ONE** để quản lý:
- ✅ Pages (trang tĩnh)
- ✅ Posts (blog)
- ✅ Builder Pages (visual)

Trước đây bạn phải vào **3 màn hình khác nhau**, giờ chỉ cần **1 màn hình duy nhất**!

---

## 🚀 TRUY CẬP

### Cách 1: Qua Sidebar
```
Admin Panel (bên trái) 
  → Click "Quản lý Nội dung"
```

### Cách 2: URL trực tiếp
```
https://yoursite.com/admin/content
```

### Cách 3: Từ routes cũ (tự động redirect)
```
/admin/pages-management  → redirect → /admin/content
/admin/posts-management  → redirect → /admin/content
```

---

## 📊 DASHBOARD

Khi vào màn hình, bạn sẽ thấy:

### **Statistics Cards (6 metrics):**
```
┌────────────┬────────────┬────────────┬────────────┬────────────┬────────────┐
│  Tổng số   │ Published  │   Draft    │   Pages    │   Posts    │  Builder   │
│     45     │     32     │     13     │     15     │     20     │     10     │
└────────────┴────────────┴────────────┴────────────┴────────────┴────────────┘
```

### **Filter Tabs:**
```
[ Tất cả (45) ] [ Pages (15) ] [ Posts (20) ] [ Builder (10) ]
```

### **Content Grid:**
```
┌────────────┐  ┌────────────┐  ┌────────────┐
│  Builder   │  │    Post    │  │    Page    │
│  Page #1   │  │   Blog #1  │  │   About    │
│  [Edit]    │  │   [Edit]   │  │   [Edit]   │
└────────────┘  └────────────┘  └────────────┘
```

---

## ✏️ TẠO NỘI DUNG MỚI

### **Bước 1: Click nút "Tạo nội dung"**
Ở góc trên bên phải màn hình

### **Bước 2: Chọn loại**
Dialog hiện ra với 2 lựa chọn:
```
┌─────────────────────────────────┐
│  [ Page ] [ Post ]              │
└─────────────────────────────────┘
```

### **Bước 3: Điền thông tin**

#### Tab "Thông tin chung":
- **Tiêu đề**: "Về chúng tôi"
- **URL Slug**: "ve-chung-toi"
- **Mô tả ngắn** (chỉ Posts): "Giới thiệu về công ty..."
- **Nội dung**: "Chi tiết nội dung..."

#### Tab "SEO":
- **Meta Title**: "Về chúng tôi - Taza Group"
- **Meta Description**: "Tìm hiểu về..."
- **Meta Keywords**: "về, công ty, giới thiệu"

### **Bước 4: Click "Tạo"**
Content sẽ được lưu và hiển thị trong list!

---

## 🎨 NHẬN BIẾT LOẠI CONTENT

### **Builder Pages:**
```
┌───────────────────────┐
│   🎨 [Palette Icon]   │
│        25             │
│     Elements          │
├───────────────────────┤
│ Landing Page          │
│ /landing              │
│ [Badge: Builder]      │
│ [Edit Builder] [👁️]   │
└───────────────────────┘
```
- Gradient: **Blue → Indigo**
- Icon: 🎨 Palette
- Hiển thị số elements

### **Posts (Blog):**
```
┌───────────────────────┐
│   📖 [BookOpen Icon]  │
│                       │
├───────────────────────┤
│ Top 10 xu hướng 2025  │
│ /top-10-xu-huong      │
│ [Badge: Post]         │
│ 👤 Admin User         │
│ [Sửa] [👁️] [🗑️]       │
└───────────────────────┘
```
- Gradient: **Pink → Rose**
- Icon: 📖 BookOpen
- Hiển thị tác giả

### **Content Pages:**
```
┌───────────────────────┐
│   📄 [FileText Icon]  │
│                       │
├───────────────────────┤
│ Về chúng tôi          │
│ /ve-chung-toi         │
│ [Badge: Page]         │
│ [Sửa] [👁️] [🗑️]       │
└───────────────────────┘
```
- Gradient: **Purple → Violet**
- Icon: 📄 FileText
- Trang tĩnh đơn giản

---

## ✏️ CHỈNH SỬA CONTENT

### **Content Pages & Posts:**
1. Click nút **"Sửa"** trên card
2. Dialog hiện ra với thông tin hiện tại
3. Chỉnh sửa bất kỳ field nào
4. Click **"Cập nhật"**
5. Done! ✅

### **Builder Pages:**
1. Click nút **"Edit Builder"** trên card
2. Chuyển sang **Page Builder** editor
3. Design visual với drag & drop
4. Save trong Builder
5. Quay lại Content Management

---

## 🔍 LỌC CONTENT

### **Xem tất cả:**
```
Click tab "Tất cả (45)"
→ Hiển thị Pages, Posts, Builder tất cả
```

### **Chỉ Pages:**
```
Click tab "Pages (15)"
→ Chỉ hiển thị content pages (không có builder)
```

### **Chỉ Posts:**
```
Click tab "Posts (20)"
→ Chỉ hiển thị blog posts
```

### **Chỉ Builder:**
```
Click tab "Builder (10)"
→ Chỉ hiển thị builder pages
```

---

## 👁️ PUBLISH/DRAFT

### **Toggle trạng thái:**
Mỗi card có **badge** hiển thị trạng thái:
- 🟢 **Live** = Đã xuất bản
- ⚪ **Draft** = Bản nháp

**Để chuyển đổi:**
1. Click icon 👁️ (publish) hoặc 🔒 (unpublish)
2. Trạng thái thay đổi ngay lập tức
3. Badge cập nhật tự động

---

## 🗑️ XÓA CONTENT

1. Click nút **"Xóa"** (icon 🗑️)
2. Popup confirm xuất hiện
3. Click **"OK"** để xác nhận
4. Content bị xóa vĩnh viễn

⚠️ **Lưu ý:** Không thể hoàn tác!

---

## 🎨 TẠO VISUAL PAGE

### **Option 1: Từ Content Management**
```
1. Click "Tạo nội dung"
2. Chọn "Page"
3. Fill basic info → Save
4. Trong list, click "Edit Builder"
5. Design visual
```

### **Option 2: Trực tiếp từ Page Builder**
```
1. Click nút "Page Builder" (header)
2. Hoặc vào /admin/page-builder
3. Design visual ngay
4. Save → Hiện trong Content Management
```

---

## 📈 WORKFLOW KHUYẾN NGHỊ

### **Landing Pages / Marketing:**
```
Content Management → Page Builder → Design Visual
```

### **Blog Posts:**
```
Content Management → Tạo Post → Fill content → Publish
```

### **Static Pages:**
```
Content Management → Tạo Page → Fill text → Publish
```

---

## 🎯 TIPS & TRICKS

### ✅ **Sắp xếp:**
- Content tự động sort theo **ngày cập nhật** (mới nhất trước)

### ✅ **SEO:**
- Luôn điền đầy đủ Meta Title, Description
- Title: max 60 ký tự
- Description: max 160 ký tự

### ✅ **URL Slug:**
- Dùng chữ thường
- Dấu gạch ngang giữa các từ
- VD: "ve-chung-toi", "lien-he"

### ✅ **Content vs Builder:**
- **Content**: Cho trang đơn giản, text nhiều
- **Builder**: Cho landing page, layout phức tạp

---

## 🔗 LIÊN KẾT

### **Related Routes:**
- Dashboard: `/admin`
- Content Management: `/admin/content`
- Page Builder: `/admin/page-builder`
- Media Library: `/admin/media`
- SEO Settings: `/admin/seo-settings`

---

## ❓ FAQ

### **Q: Tại sao không thấy menu "Quản lý Trang" nữa?**
A: Đã merge vào "Quản lý Nội dung". Tất cả pages, posts đều ở đó.

### **Q: Builder pages ở đâu?**
A: Trong "Quản lý Nội dung" → tab "Builder"

### **Q: Làm sao biết nội dung là Page hay Post?**
A: Nhìn badge dưới tiêu đề:
- 📄 Page
- 📖 Post
- 🎨 Builder

### **Q: Có thể chuyển đổi giữa Content và Builder không?**
A: Có! Edit content → Chuyển sang Builder sau.

### **Q: Xóa Builder page có mất design không?**
A: Có! Xóa = mất tất cả. Cẩn thận!

---

## 🎊 KẾT LUẬN

**Content Management** giúp bạn:
- ⚡ Quản lý nhanh hơn
- 🎯 Tìm content dễ hơn
- 📊 Thống kê rõ ràng
- 🎨 Tích hợp Builder mượt mà

**Chúc bạn quản lý content hiệu quả! 🚀**

---

**Hỗ trợ:** admin@tazagroup.vn  
**Version:** 2.0.0
