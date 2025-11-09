# Kata Next.js Fullstack

Dự án fullstack sử dụng Next.js, shadcn/ui, Prisma và Server Actions.

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
