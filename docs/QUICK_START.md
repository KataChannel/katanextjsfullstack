# 🚀 Quick Start Guide

Hướng dẫn setup và chạy dự án trong 5 phút.

## Prerequisites

- **Bun** >= 1.3.2 ([Download](https://bun.sh))
- **PostgreSQL** >= 15
- **Node.js** >= 20 (optional, Bun is recommended)

## 1. Clone & Install

```bash
# Clone repository
git clone <repo-url>
cd kataseo

# Install dependencies (với Bun - nhanh hơn npm)
bun install

# Or với npm/yarn
npm install
```

## 2. Database Setup

```bash
# Start PostgreSQL (nếu dùng Docker)
docker-compose -f docker-compose.infrastructure.yml up -d

# Hoặc dùng PostgreSQL local
# Port: 5432
# User: postgres
# Password: (your-password)
```

## 3. Environment Variables

```bash
# Copy file env mẫu
cp .env.example .env.local

# Chỉnh sửa .env.local
DATABASE_URL="postgresql://postgres:password@localhost:5432/tazav2core"
NEXTAUTH_SECRET="your-secret-here" # Generate: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_DOMAIN="tazagroup.vn"
```

### Environment cho mỗi domain

```bash
.env.local          → tazagroup.vn (port 3000)
.env.tazaskinclinic → tazaskinclinic.com (port 3001)
.env.timona         → timona.edu.vn (port 3002)
.env.hderma         → hderma.vn (port 3003)
.env.elasome        → elasome.com (port 3004)
.env.innerbright    → innerbright.vn (port 3005)
```

## 4. Database Migration

```bash
# Generate Prisma Client
bun prisma generate

# Run migrations
bun prisma migrate dev

# Seed initial data (optional)
bun prisma db seed
```

## 5. Run Development Server

### Chọn domain để chạy

```bash
# Chạy menu chọn domain
./menu.sh

# Hoặc chạy trực tiếp
bun --env-file=.env.local dev        # Port 3000
bun --env-file=.env.innerbright dev  # Port 3005
```

### Chạy tất cả domains cùng lúc

```bash
# Terminal 1
bun --env-file=.env.local dev

# Terminal 2
bun --env-file=.env.innerbright dev

# ... more terminals for other domains
```

## 6. Access Application

### Public Site
- **tazagroup.vn**: http://localhost:3000
- **innerbright.vn**: http://localhost:3005

### Admin Panel
- **Login**: http://localhost:3000/auth/login
- **Dashboard**: http://localhost:3000/admin

### Default Admin Account

```
Email: admin@tazagroup.vn
Password: Admin@123
```

## 7. Verify Setup

```bash
# Check database connection
bun prisma studio

# Chạy tests
bun test

# Check build
bun run build
```

## Common Commands

```bash
# Development
bun dev                  # Start dev server
bun --env-file=.env.innerbright dev  # Specific domain

# Database
bun prisma studio        # Open Prisma Studio
bun prisma migrate dev   # Run migrations
bun prisma generate      # Generate Prisma Client

# Build & Deploy
bun run build            # Build for production
bun start                # Start production server

# Code Quality
bun run lint             # Run ESLint
bun run type-check       # TypeScript check

# Docker
docker-compose up -d     # Start infrastructure
docker-compose down      # Stop all containers
```

## Project Structure

```
kataseo/
├── app/                  # Next.js App Router
│   ├── (public)/        # Public routes
│   ├── admin/           # Admin panel
│   ├── api/             # API routes
│   └── auth/            # Authentication pages
├── components/          # React components
├── lib/                 # Utilities & helpers
│   ├── auth.ts         # NextAuth config
│   ├── prisma.ts       # Prisma client
│   └── domain.ts       # Domain detection
├── prisma/             # Database schema & migrations
├── public/             # Static files
├── .env.local          # Environment variables
└── docs/               # Documentation
```

## Development Workflow

### 1. Create New Page

```bash
# Create page file
touch app/(public)/about/page.tsx

# Add content
export default function AboutPage() {
  return <div>About Us</div>;
}
```

### 2. Create API Endpoint

```bash
# Create API route
touch app/api/hello/route.ts

# Add handler
export async function GET() {
  return Response.json({ message: 'Hello' });
}
```

### 3. Update Database Schema

```bash
# Edit prisma/schema.prisma
model NewModel {
  id String @id @default(cuid())
  name String
}

# Run migration
bun prisma migrate dev --name add_new_model
```

### 4. Add New Domain

```bash
# 1. Create .env file
cp .env.local .env.newdomain

# 2. Update DATABASE_URL
DATABASE_URL="postgresql://postgres:password@localhost:5432/newdomain_db"

# 3. Add to menu.sh
# 4. Run migration for new database
bun --env-file=.env.newdomain prisma migrate deploy
```

## Troubleshooting

### Database Connection Error

```bash
# Check PostgreSQL is running
docker ps | grep postgres

# Test connection
psql -h localhost -U postgres -d tazav2core

# Fix: Start PostgreSQL
docker-compose -f docker-compose.infrastructure.yml up -d
```

### Port Already in Use

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3010 bun dev
```

### Prisma Client Error

```bash
# Regenerate Prisma Client
bun prisma generate

# If still error, clear node_modules
rm -rf node_modules .next
bun install
bun prisma generate
```

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Clear Bun cache
rm -rf node_modules/.cache

# Rebuild
bun run build
```

## Next Steps

1. **Read Documentation**
   - [Multi-domain System](./MULTI_DOMAIN.md)
   - [Authentication](./AUTHENTICATION.md)
   - [Page Builder](./PAGE_BUILDER.md)

2. **Customize**
   - Update branding in `app/layout.tsx`
   - Configure SEO in `app/sitemap.ts`
   - Add custom components in `components/`

3. **Deploy**
   - [Deployment Guide](./DEPLOYMENT.md)
   - [Docker Setup](./DOCKER.md)

## Resources

- **Docs**: `/docs` folder
- **API Reference**: [API_DOCS.md](./API_DOCS.md)
- **Database Schema**: [DATABASE_SCHEMA.md](./DATABASE_SCHEMA.md)
- **Troubleshooting**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)

## Support

- **Issues**: Check existing issues or create new one
- **Docs**: Read documentation in `/docs`
- **Examples**: See `/test-export` for examples

---

**Happy coding! 🎉**
