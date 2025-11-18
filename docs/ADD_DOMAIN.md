# ➕ How to Add New Domain

Hướng dẫn chi tiết thêm domain mới vào hệ thống multi-domain.

## Overview

Mỗi domain trong hệ thống có:
- Database riêng biệt
- Environment file riêng
- Port development riêng
- Content & menus độc lập

## Steps

### 1. Create Database

```bash
# Kết nối PostgreSQL
psql -h localhost -U postgres

# Tạo database mới
CREATE DATABASE newdomain_db;

# Grant permissions
GRANT ALL PRIVILEGES ON DATABASE newdomain_db TO postgres;

# Exit
\q
```

### 2. Create Environment File

```bash
# Copy từ template
cp .env.local .env.newdomain

# Chỉnh sửa các giá trị
nano .env.newdomain
```

**Required Variables:**

```bash
# Database (IMPORTANT: Change database name)
DATABASE_URL="postgresql://postgres:password@localhost:5432/newdomain_db"

# Domain
NEXT_PUBLIC_DOMAIN="newdomain.com"

# Port (Choose unused port: 3006, 3007, ...)
PORT=3006

# Authentication (Generate new secret)
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3006"

# Optional: MinIO bucket
MINIO_BUCKET="newdomain"
```

### 3. Update Domain Config

Edit `lib/domain.ts`:

```typescript
export const DOMAIN_CONFIGS = {
  // ... existing domains ...
  
  'newdomain.com': {
    name: 'New Domain',
    databaseUrl: process.env.DATABASE_URL!,
    defaultLocale: 'en',
    logo: '/logos/newdomain.png',
    theme: {
      primaryColor: '#0070f3',
      secondaryColor: '#1a202c',
    },
  },
} as const;
```

### 4. Run Migrations

```bash
# Generate Prisma Client với database mới
bun --env-file=.env.newdomain prisma generate

# Run migrations
bun --env-file=.env.newdomain prisma migrate deploy

# Or for development
bun --env-file=.env.newdomain prisma migrate dev
```

### 5. Seed Initial Data

Tạo file seed: `prisma/seeds/newdomain.ts`

```typescript
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedNewDomain() {
  console.log('Seeding newdomain.com...');
  
  // 1. Create admin user
  const hashedPassword = await bcrypt.hash('Admin@123', 10);
  const admin = await prisma.user.create({
    data: {
      email: 'admin@newdomain.com',
      name: 'Admin',
      password: hashedPassword,
      role: 'admin',
      emailVerified: new Date(),
    },
  });
  
  // 2. Create homepage
  await prisma.page.create({
    data: {
      title: 'Home',
      slug: 'home',
      content: '<h1>Welcome to New Domain</h1>',
      published: true,
      isHomepage: true,
      seoTitle: 'New Domain - Home',
      seoDescription: 'Welcome to our website',
    },
  });
  
  // 3. Create header menu
  await prisma.menu.create({
    data: {
      label: 'Home',
      url: '/',
      position: 'header',
      order: 0,
      type: 'custom',
      isVisible: true,
    },
  });
  
  await prisma.menu.create({
    data: {
      label: 'About',
      url: '/about',
      position: 'header',
      order: 1,
      type: 'custom',
      isVisible: true,
    },
  });
  
  console.log('✅ Seeded successfully');
}

seedNewDomain()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

Run seed:

```bash
bun --env-file=.env.newdomain prisma/seeds/newdomain.ts
```

### 6. Update Menu Script

Edit `menu.sh` để thêm domain mới:

```bash
#!/bin/bash

echo "==================================="
echo "  Chọn Domain để chạy"
echo "==================================="
echo "1. tazagroup.vn (Port 3000)"
echo "2. tazaskinclinic.com (Port 3001)"
echo "3. timona.edu.vn (Port 3002)"
echo "4. hderma.vn (Port 3003)"
echo "5. elasome.com (Port 3004)"
echo "6. innerbright.vn (Port 3005)"
echo "7. newdomain.com (Port 3006)"  # ADD THIS LINE
echo "==================================="
read -p "Nhập lựa chọn (1-7): " choice

case $choice in
  1) ENV_FILE=".env.local" ;;
  2) ENV_FILE=".env.tazaskinclinic" ;;
  3) ENV_FILE=".env.timona" ;;
  4) ENV_FILE=".env.hderma" ;;
  5) ENV_FILE=".env.elasome" ;;
  6) ENV_FILE=".env.innerbright" ;;
  7) ENV_FILE=".env.newdomain" ;;  # ADD THIS LINE
  *) echo "Lựa chọn không hợp lệ"; exit 1 ;;
esac

echo "Đang chạy với $ENV_FILE..."
bun --env-file=$ENV_FILE dev
```

### 7. Test New Domain

```bash
# Start development server
./menu.sh
# Choose option 7

# Or run directly
bun --env-file=.env.newdomain dev
```

Visit: http://localhost:3006

### 8. Verify Setup

```bash
# 1. Check database connection
bun --env-file=.env.newdomain prisma studio

# 2. Check admin login
# Go to: http://localhost:3006/auth/login
# Email: admin@newdomain.com
# Password: Admin@123

# 3. Check admin panel
# Go to: http://localhost:3006/admin

# 4. Check homepage
# Go to: http://localhost:3006
```

## Production Setup

### 1. DNS Configuration

Point domain to your server:

```
A Record: newdomain.com → 116.118.48.208
CNAME: www.newdomain.com → newdomain.com
```

### 2. SSL Certificate

```bash
# SSH to server
ssh root@116.118.48.208

# Install certbot
apt install certbot

# Get certificate
certbot certonly --standalone -d newdomain.com -d www.newdomain.com
```

### 3. Nginx Configuration

Create `/etc/nginx/sites-available/newdomain.com.conf`:

```nginx
upstream newdomain_backend {
    server localhost:3006;
}

server {
    listen 80;
    server_name newdomain.com www.newdomain.com;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name newdomain.com www.newdomain.com;

    ssl_certificate /etc/letsencrypt/live/newdomain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/newdomain.com/privkey.pem;

    location / {
        proxy_pass http://newdomain_backend;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable site:

```bash
ln -s /etc/nginx/sites-available/newdomain.com.conf /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 4. Create Production Database

```bash
# On server
psql -U postgres

CREATE DATABASE newdomain_db;
GRANT ALL PRIVILEGES ON DATABASE newdomain_db TO postgres;
\q
```

### 5. Deploy with Docker

Create `.env.newdomain.production`:

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/newdomain_db"
NEXT_PUBLIC_DOMAIN="newdomain.com"
NEXTAUTH_SECRET="production-secret-here"
NEXTAUTH_URL="https://newdomain.com"
PORT=3006
NODE_ENV=production
```

Build and deploy:

```bash
# Build locally
docker build -t newdomain-web:latest \
  --build-arg ENV_FILE=.env.newdomain.production .

# Save image
docker save newdomain-web:latest | gzip > newdomain-web.tar.gz

# Transfer to server
scp newdomain-web.tar.gz root@116.118.48.208:/root/

# On server: Load and run
ssh root@116.118.48.208
docker load < newdomain-web.tar.gz

docker run -d \
  --name newdomain-web \
  --restart unless-stopped \
  -p 3006:3006 \
  --env-file .env.newdomain.production \
  newdomain-web:latest

# Check status
docker ps | grep newdomain-web
docker logs newdomain-web
```

### 6. Run Migrations on Production

```bash
# SSH to server
ssh root@116.118.48.208

# Run migrations inside container
docker exec newdomain-web bun prisma migrate deploy

# Or run from host with env file
bun --env-file=.env.newdomain.production prisma migrate deploy
```

### 7. Test Production

```bash
# Check health
curl https://newdomain.com/api/health

# Check homepage
curl https://newdomain.com

# Check admin redirect
curl -I https://newdomain.com/admin
```

## Best Practices

### 1. Environment Naming

```bash
# Development
.env.local → Default domain
.env.newdomain → New domain

# Production
.env.newdomain.production
.env.newdomain.staging
```

### 2. Port Allocation

```
3000 - tazagroup.vn (default)
3001 - tazaskinclinic.com
3002 - timona.edu.vn
3003 - hderma.vn
3004 - elasome.com
3005 - innerbright.vn
3006 - newdomain.com
3007 - (available)
3008 - (available)
...
```

### 3. Database Naming

```
tazav2core       → tazagroup.vn
tazaskinclinic   → tazaskinclinic.com
timona           → timona.edu.vn
hderma           → hderma.vn
elasome          → elasome.com
innerv2core      → innerbright.vn
newdomain_db     → newdomain.com
```

### 4. Container Naming

```bash
docker run -d \
  --name newdomain-web \  # Descriptive name
  -p 3006:3006 \
  newdomain-web:latest
```

## Troubleshooting

### Database Connection Failed

```bash
# Check DATABASE_URL in .env.newdomain
cat .env.newdomain | grep DATABASE_URL

# Test connection
psql "postgresql://postgres:password@localhost:5432/newdomain_db"

# Fix: Update DATABASE_URL with correct values
```

### Port Already in Use

```bash
# Find process
lsof -i :3006

# Kill process
kill -9 <PID>

# Or use different port in .env.newdomain
PORT=3007
```

### Domain Not Found Error

```bash
# Check DOMAIN_CONFIGS in lib/domain.ts
# Make sure domain is added:

'newdomain.com': {
  name: 'New Domain',
  databaseUrl: process.env.DATABASE_URL!,
  // ...
}
```

### Migrations Failed

```bash
# Reset database
bun --env-file=.env.newdomain prisma migrate reset

# Or manually
psql -U postgres
DROP DATABASE newdomain_db;
CREATE DATABASE newdomain_db;
\q

# Run migrations again
bun --env-file=.env.newdomain prisma migrate deploy
```

## Checklist

- [ ] Database created
- [ ] `.env.newdomain` file created with correct values
- [ ] Domain added to `lib/domain.ts`
- [ ] Migrations run successfully
- [ ] Initial data seeded
- [ ] Menu script updated
- [ ] Development server runs without errors
- [ ] Admin login works
- [ ] Homepage displays correctly
- [ ] DNS configured (production)
- [ ] SSL certificate obtained (production)
- [ ] Nginx configured (production)
- [ ] Docker container deployed (production)

---

**See Also:**
- [Multi-domain System](./MULTI_DOMAIN.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Environment Variables](./ENVIRONMENT.md)
