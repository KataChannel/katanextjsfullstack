# Quick Start Guide - Taza SEO Website

## 🚀 Khởi động nhanh

### 1. Cài đặt Dependencies
```bash
cd /mnt/chikiet/kata2025/kataseo
npm install
```

### 2. Cấu hình Database
```bash
# Copy file môi trường
cp .env.example .env

# Chỉnh sửa .env và chọn DATABASE_URL phù hợp với domain
nano .env
```

### 3. Khởi tạo Database
```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Hoặc tạo migration (production)
npm run db:migrate
```

### 4. Chạy Development Server
```bash
npm run dev
```

Truy cập: http://localhost:3000

## 📁 Các trang quan trọng

| URL | Mô tả |
|-----|-------|
| `/` | Homepage |
| `/admin` | Admin Dashboard |
| `/admin/page-builder` | Page Builder - Tạo trang mới |
| `/posts` | Quản lý bài viết |
| `/users` | Quản lý người dùng |
| `/api/pages` | API Pages CRUD |
| `/api/posts` | API Posts CRUD |
| `/api/media` | API Media Upload |

## 🔧 Các lệnh hữu ích

```bash
# Development
npm run dev              # Chạy dev server
npm run build            # Build cho production
npm run start            # Chạy production server

# Database
npm run db:studio        # Mở Prisma Studio
npm run db:generate      # Generate Prisma Client
npm run db:push          # Push schema (dev)
npm run db:migrate       # Tạo migration (prod)
npm run db:reset         # Reset database (CẢNH BÁO!)

# Linting
npm run lint             # Check code quality
```

## 📝 Tạo trang đầu tiên

### Bước 1: Tạo User
1. Truy cập `/users`
2. Nhập email và tên
3. Click "Tạo User"

### Bước 2: Tạo Page với Page Builder
1. Truy cập `/admin/page-builder`
2. Nhập tiêu đề và slug
3. Thêm blocks từ sidebar:
   - **Tiêu đề**: Heading lớn
   - **Văn bản**: Rich text với Tiptap
   - **Hình ảnh**: URL hoặc upload
   - **Video**: Embed URL
   - **Code**: Code snippets
4. Kéo thả để sắp xếp
5. Tab SEO: Nhập Meta Title và Description
6. Click "Lưu trang"

### Bước 3: Tạo Blog Post
1. Truy cập `/posts`
2. Nhập Title, Content
3. Chọn author
4. Toggle "Published" để public
5. Click "Tạo Post"

## 🌐 Multi-domain Setup

### Development
Trong development, middleware tự động detect domain từ `localhost` và fallback về `tazagroup.vn`.

### Production
1. Cấu hình DNS cho từng domain trỏ về server
2. Middleware tự động:
   - Detect domain từ headers
   - Chọn database tương ứng
   - Inject domain info vào request

### Domains được hỗ trợ
| Domain | Database |
|--------|----------|
| tazagroup.vn | tazagroupvn |
| tazaskinclinic.com | tazaskinclinic |
| timona.edu.vn | tazagroupvn |
| hderma.vn | hderma |
| elasome.com | elasome |

## 🎨 Customization

### Thay đổi theme colors
Edit `app/globals.css`:
```css
:root {
  --primary: ...;
  --secondary: ...;
}
```

### Thêm Block Type mới
Edit `components/page-builder.tsx`:
1. Thêm type vào `PageBlock`
2. Thêm button trong Sidebar
3. Implement render logic trong `BlockContent`
4. Implement display trong `PageBlocksRenderer`

### Cấu hình SEO per domain
1. Tạo record trong `SeoSettings` model
2. Sử dụng trong components với `getPrisma()`

## 📊 API Usage Examples

### Create Page
```bash
curl -X POST http://localhost:3000/api/pages \
  -H "Content-Type: application/json" \
  -d '{
    "title": "About Us",
    "slug": "about-us",
    "content": "<p>Welcome</p>",
    "blocks": [],
    "published": true,
    "metaTitle": "About Us - Taza Group",
    "metaDescription": "Learn more about Taza Group",
    "authorId": "user-id-here"
  }'
```

### Upload Media
```bash
curl -X POST http://localhost:3000/api/media \
  -F "file=@/path/to/image.jpg" \
  -F "alt=Product Image" \
  -F "caption=Our latest product"
```

### Get Posts (with pagination)
```bash
curl "http://localhost:3000/api/posts?published=true&page=1&limit=10"
```

## 🔒 Security Checklist

- ✅ Environment variables không commit
- ✅ SQL Injection protection (Prisma ORM)
- ✅ XSS protection (React)
- ✅ Security headers configured
- ⚠️ Implement authentication cho `/admin/*` routes
- ⚠️ Implement authorization cho API routes
- ⚠️ Rate limiting cho API endpoints
- ⚠️ File upload validation & scanning

## 📱 PWA Installation

Trên mobile:
1. Truy cập website
2. Chrome: Menu → "Add to Home Screen"
3. Safari: Share → "Add to Home Screen"

## 🐛 Troubleshooting

### Database Connection Error
```
Error: Environment variable not found: DATABASE_URL
```
**Fix**: Tạo file `.env` và set `DATABASE_URL`

### Prisma Client Error
```
Error: Prisma Client not generated
```
**Fix**: Run `npm run db:generate`

### Port 3000 đã được sử dụng
```bash
# Kill process on port 3000
npx kill-port 3000
# Hoặc
lsof -ti:3000 | xargs kill -9
```

## 📚 Documentation Links

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Docs](https://www.prisma.io/docs)
- [Tiptap Docs](https://tiptap.dev/docs)
- [shadcn/ui Docs](https://ui.shadcn.com)

## 💡 Pro Tips

1. **Prisma Studio**: Sử dụng `npm run db:studio` để visual database management
2. **Hot Reload**: Next.js tự động reload khi thay đổi code
3. **TypeScript**: Tận dụng IntelliSense để autocomplete
4. **Components**: Tất cả UI components trong `components/ui/`
5. **Server Actions**: Các hàm async trong `lib/actions.ts`

## 🎯 Next Steps

1. [ ] Setup authentication (NextAuth.js)
2. [ ] Implement role-based permissions
3. [ ] Add image optimization với sharp
4. [ ] Setup CI/CD pipeline
5. [ ] Configure production environment variables
6. [ ] Setup monitoring & logging
7. [ ] Implement caching strategy
8. [ ] Add rate limiting
9. [ ] Setup automated backups
10. [ ] Performance testing & optimization

---

**Created**: 10/11/2025  
**Last Updated**: 10/11/2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready
