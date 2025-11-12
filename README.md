# Kata Next.js Fullstack

# 🚀 Taza SEO Website - Multi-tenant Next.js Fullstack Platform

[![Next.js](https://img.shields.io/badge/Next.js-16-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-6-2D3748)](https://www.prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-4-38bdf8)](https://tailwindcss.com/)

**Hệ thống website SEO-optimized multi-tenant với Page Builder, Tiptap Editor và quản lý nội dung toàn diện.**

## ✨ Tính năng nổi bật

### 🌐 Multi-tenancy
- Hỗ trợ **5 domains** với database riêng biệt
- Tự động chuyển đổi database theo domain/port
- Middleware intelligent domain detection
- **Development**: Port-based routing (3000-3004)
- **Production**: Domain-based automatic switching
- Domains: tazagroup.vn, tazaskinclinic.com, timona.edu.vn, hderma.vn, elasome.com

### 📝 Page Builder Professional
- **Drag & Drop** interface trực quan
- **Tiptap Editor** kiểu Notion với full formatting
- 5+ block types: Heading, Text, Image, Video, Code
- Real-time preview
- JSON storage cho flexibility

### 🎯 SEO Optimization
- Meta tags đầy đủ (Open Graph, Twitter Cards)
- JSON-LD structured data (Organization, Article, Website, Breadcrumb)
- Dynamic sitemap.xml tự động
- robots.txt configuration
- Canonical URLs
- Mobile-first responsive design

### 📱 Progressive Web App (PWA)
- App manifest configured
- Offline-ready architecture
- Mobile responsive
- Install prompt support

### 🔌 RESTful API
- **Pages API**: Full CRUD operations
- **Posts API**: Blog management với pagination
- **Media API**: File upload & management (images, videos)
- Zod validation cho tất cả endpoints
- Structured error responses

### 🎨 Modern UI/UX
- **shadcn/ui** components với Tailwind CSS 4
- Vietnamese interface 100%
- Dark mode ready
- Combobox thay vì Select (accessible)
- Enhanced Dialog (header/body/footer scrollable)

## 🏗️ Tech Stack

### Core
- **Next.js 16** - React framework với App Router
- **React 19** - Latest React với Server Components
- **TypeScript 5** - Type safety
- **Prisma 6** - Next-gen ORM cho PostgreSQL

### UI & Styling
- **Tailwind CSS 4** - Utility-first CSS
- **shadcn/ui** - High-quality React components
- **Radix UI** - Unstyled accessible components
- **Lucide React** - Beautiful icons

### Editor & Builder
- **Tiptap** - Headless editor framework
- **@hello-pangea/dnd** - Drag and drop

### Forms & Validation
- **React Hook Form** - Performant forms
- **Zod** - TypeScript-first schema validation

### Database
- **PostgreSQL** - Production database
- **Multi-tenant architecture** - 5 databases

## 📦 Installation

```bash
# Clone repository
git clone <repository-url>
cd kataseo

# Install dependencies (using Bun)
bun install

# Setup environment
cp .env.example .env
# Edit .env với DATABASE_URL của bạn

# Generate Prisma Client
bun run db:generate

# Push schema to database
bun run db:push

# Start development server (default: port 3000 - tazagroup.vn)
bun run dev

# Hoặc chạy domain cụ thể:
bun run dev:tazagroup   # Port 3000 - tazagroup.vn
bun run dev:tazaskin    # Port 3001 - tazaskinclinic.com
bun run dev:timona      # Port 3002 - timona.edu.vn
bun run dev:hderma      # Port 3003 - hderma.vn
bun run dev:elasome     # Port 3004 - elasome.com
npm run dev
```

Truy cập http://localhost:3000

## 📖 Documentation

- **[TONG_HOP_MULTI_DOMAIN.md](./TONG_HOP_MULTI_DOMAIN.md)** - 🎯 **TỔNG HỢP MULTI-DOMAIN** (Đọc đầu tiên!)
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - 🚀 Hướng dẫn Deploy Production (Tất cả domains)
- **[DEPLOYMENT_PER_DOMAIN.md](./DEPLOYMENT_PER_DOMAIN.md)** - 🔧 Deploy Từng Domain Riêng Lẻ
- **[MULTI_DOMAIN_CONFIG.md](./MULTI_DOMAIN_CONFIG.md)** - ⭐ Hướng dẫn cấu hình Multi-Domain
- **[MULTI_DOMAIN_USAGE_EXAMPLES.md](./docs/MULTI_DOMAIN_USAGE_EXAMPLES.md)** - ⭐ Ví dụ sử dụng Multi-Domain
- **[IMPLEMENTATION_SUMMARY.md](./IMPLEMENTATION_SUMMARY.md)** - Chi tiết kiến trúc và implementation
- **[QUICK_START.md](./QUICK_START.md)** - Hướng dẫn nhanh bắt đầu

## 🗂️ Project Structure

```
kataseo/
├── app/                      # Next.js App Router
│   ├── [slug]/              # Dynamic pages
│   ├── admin/               # Admin dashboard
│   ├── api/                 # REST API routes
│   ├── posts/               # Blog management
│   └── users/               # User management
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   ├── page-builder.tsx     # Page Builder main
│   └── tiptap-editor.tsx    # Tiptap editor wrapper
├── lib/                     # Utilities
│   ├── domain-config.ts     # ⭐ Multi-domain configuration
│   ├── domain-helpers.ts    # ⭐ Server-side domain helpers
│   ├── domain-hooks.ts      # ⭐ Client-side domain hooks
│   ├── database.ts          # Multi-tenant DB manager
│   ├── prisma.ts            # Prisma client
│   ├── seo.ts               # SEO utilities
│   └── actions.ts           # Server actions
├── middleware.ts            # ⭐ Domain detection middleware
├── prisma/                  # Database schema
└── public/                  # Static assets
```

## 🚀 Quick Commands

```bash
# Development
bun run dev              # Start dev server (port 3000)
bun run dev:tazagroup    # Port 3000 - tazagroup.vn
bun run dev:tazaskin     # Port 3001 - tazaskinclinic.com
bun run dev:timona       # Port 3002 - timona.edu.vn
bun run dev:hderma       # Port 3003 - hderma.vn
bun run dev:elasome      # Port 3004 - elasome.com
bun run build            # Build for production
bun run start            # Start production server

# Database
bun run db:studio        # Open Prisma Studio
bun run db:generate      # Generate Prisma Client
bun run db:push          # Push schema changes
bun run db:migrate       # Create migration
bun run db:reset         # Reset database

# Code Quality
bun run lint             # Run ESLint
```

## 🌍 Supported Domains

Hệ thống hỗ trợ 5 domains với database và cấu hình riêng biệt:

| Domain | Database | Dev Port | Mô tả |
|--------|----------|----------|-------|
| **tazagroup.vn** | tazagroupvn | 3000 | Taza Group - Nâng tầm giá trị phụ nữ Việt |
| **tazaskinclinic.com** | tazaskinclinic | 3001 | Taza Skin Clinic - Chuyên gia thẩm mỹ |
| **timona.edu.vn** | timona | 3002 | Timona Academy - Đào tạo thẩm mỹ |
| **hderma.vn** | hderma | 3003 | H.Derma - Khai phá vẻ đẹp riêng |
| **elasome.com** | elasome | 3004 | Elasome - Giải pháp chăm sóc da |

### 🔧 Multi-Domain Architecture

```
Request → Middleware (Domain Detection)
    ↓
Port/Domain → Domain Config Mapping
    ↓
Database Selection → Correct Database
    ↓
Render with Domain-specific Data
```

**Chi tiết:** Xem [MULTI_DOMAIN_CONFIG.md](./MULTI_DOMAIN_CONFIG.md)

## 📱 Features Walkthrough

### Admin Dashboard
- Tổng quan hệ thống với statistics
- Quick actions cho các tác vụ thường dùng
- Recent activity tracking

### Page Builder
1. Thêm blocks từ sidebar
2. Drag & drop để sắp xếp
3. Edit inline với Tiptap editor
4. Configure SEO metadata
5. Save và publish

### Content Management
- **Posts**: Blog articles với rich text editor
- **Pages**: Landing pages với page builder
- **Media**: Centralized media library
- **Users**: User management system

## 🔐 Security Features

- ✅ Environment variable protection
- ✅ SQL injection prevention (Prisma ORM)
- ✅ XSS protection (React escaping)
- ✅ Security headers configured
- ✅ Input validation (Zod schemas)
- ✅ File upload validation

## 🎯 Roadmap

- [ ] Authentication & Authorization (NextAuth.js)
- [ ] Role-based access control
- [ ] Email notifications
- [ ] Analytics integration (GA, GTM, FB Pixel)
- [ ] Advanced media editor
- [ ] Multi-language support (i18n)
- [ ] Comment system
- [ ] Search functionality
- [ ] Cache optimization
- [ ] Performance monitoring

## 📊 Performance

- ⚡ Fast page loads với Next.js optimizations
- 📱 Mobile-first responsive design
- 🎨 Optimized images với Next.js Image
- 🚀 Static generation cho public pages
- 💾 Efficient database queries với Prisma

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is private and proprietary.

## 👥 Authors

- **Taza Group Development Team**

## 📞 Support

For support, email support@tazagroup.vn or visit our documentation.

---

**Built with ❤️ by Taza Group**  
**Last Updated**: 10/11/2025  
**Version**: 1.0.0  
**Status**: ✅ Production Ready

## 🚀 Tính năng

- ✅ **Next.js 16** với Turbopack
- ✅ **shadcn/ui** - Component library hiện đại
- ✅ **Prisma** - ORM mạnh mẽ với SQLite
- ✅ **Server Actions** - Xử lý form và API
- ✅ **Prisma Studio** - Database viewer
- ✅ **Toast Notifications** - Thông báo người dùng
- ✅ **TypeScript** - Type safety
- ✅ **Tailwind CSS** - Styling

## 🛠 Cài đặt

1. Clone và cài đặt dependencies:
```bash
git clone <repo-url>
cd katanextjsfullstack
npm install
```

2. Setup database:
```bash
npm run db:generate
npm run db:migrate
```

3. Chạy ứng dụng:
```bash
npm run dev
```

4. Mở Prisma Studio (terminal mới):
```bash
npm run db:studio
```

## 📱 Sử dụng

### URLs quan trọng:
- **Ứng dụng chính**: http://localhost:3001
- **Prisma Studio**: http://localhost:5556
- **Admin Dashboard**: http://localhost:3001/admin

### Chức năng:
1. **Quản lý Users** - Tạo và xem danh sách người dùng
2. **Quản lý Posts** - Tạo bài viết, publish/unpublish
3. **Admin Dashboard** - Tổng quan hệ thống
4. **Prisma Studio** - Xem và chỉnh sửa database trực tiếp

## 🗃 Database Schema

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  posts     Post[]
}

model Post {
  id        String   @id @default(cuid())
  title     String
  content   String?
  published Boolean  @default(false)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  author    User     @relation(fields: [authorId], references: [id])
  authorId  String
}
```

## 📚 Commands

```bash
# Development
npm run dev              # Chạy dev server
npm run build           # Build production
npm run start           # Chạy production

# Database
npm run db:studio       # Mở Prisma Studio
npm run db:generate     # Generate Prisma Client
npm run db:migrate      # Tạo migration mới
npm run db:push         # Push schema lên database
npm run db:reset        # Reset database

# Linting
npm run lint            # Chạy ESLint
```

## 🏗 Project Structure

```
├── app/
│   ├── admin/          # Admin dashboard
│   ├── posts/          # Post management
│   ├── users/          # User management
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Homepage
├── components/
│   ├── ui/             # shadcn/ui components
│   ├── create-user-form.tsx
│   ├── create-post-form.tsx
│   └── toggle-publish-button.tsx
├── lib/
│   ├── actions.ts      # Server Actions
│   ├── prisma.ts       # Prisma client
│   └── utils.ts        # Utilities
├── prisma/
│   ├── schema.prisma   # Database schema
│   └── migrations/     # Database migrations
└── package.json
```

## 🎯 Server Actions

Dự án sử dụng Server Actions để xử lý form và database operations:

- `createUser()` - Tạo user mới
- `createPost()` - Tạo post mới
- `getUsers()` - Lấy danh sách users
- `getPosts()` - Lấy danh sách posts
- `togglePostPublished()` - Toggle publish status

## 🎨 UI Components

Sử dụng shadcn/ui components:
- Button, Card, Input, Label
- Form handling với toast notifications
- Responsive design với Tailwind CSS

## 🔧 Development Tips

1. **Database changes**: Chạy `npm run db:migrate` sau khi thay đổi schema
2. **Type safety**: Prisma tự generate types cho database
3. **Real-time data**: Sử dụng `revalidatePath()` để update UI
4. **Toast notifications**: Tự động hiển thị thành công/lỗi

---

Built with ❤️ using Next.js + shadcn/ui + Prisma
