# 🌐 Multi-Domain System

## Overview

Hệ thống hỗ trợ **6 domains** với database riêng biệt, đảm bảo data isolation hoàn toàn.

## Supported Domains

| Domain | Port (Dev) | Database | Status |
|--------|-----------|----------|--------|
| tazagroup.vn | 3000 | tazagroupvn | ✅ Active |
| tazaskinclinic.com | 3001 | tazaskincliniccom | ✅ Active |
| timona.edu.vn | 3002 | timonaedu | ✅ Active |
| hderma.vn | 3003 | hdermavn | ✅ Active |
| elasome.com | 3004 | elasomecom | ✅ Active |
| innerbright.vn | 3005 | innerv2core | ✅ Active |

## How It Works

### 1. Domain Detection

```typescript
// lib/domain-config.ts
export function getDomainConfig(hostname: string): DomainConfig {
  // Development: Port-based routing
  if (hostname.includes('localhost') || hostname.includes('127.0.0.1')) {
    const port = hostname.split(':')[1];
    return PORT_TO_DOMAIN_MAP[port] || DEFAULT_DOMAIN;
  }
  
  // Production: Domain-based routing
  const domain = hostname.split(':')[0];
  return DOMAIN_CONFIGS[domain] || DEFAULT_DOMAIN;
}
```

### 2. Database Isolation

```typescript
// lib/database.ts
export function getPrismaClient(domain: string): PrismaClient {
  // Each domain gets its own Prisma instance
  if (!prismaInstances[domain]) {
    prismaInstances[domain] = new PrismaClient({
      datasources: {
        db: { url: getDatabaseUrl(domain) }
      }
    });
  }
  return prismaInstances[domain];
}
```

### 3. Automatic Routing

**Middleware (`proxy.ts`)** automatically:
- Detects domain from request
- Sets domain headers
- Routes to correct database
- Handles authentication per domain

## Development Setup

### Start Specific Domain

```bash
# Taza Group (port 3000)
PORT=3000 NEXT_PUBLIC_DOMAIN=tazagroup.vn bun dev

# InnerBright (port 3005)
PORT=3005 NEXT_PUBLIC_DOMAIN=innerbright.vn bun dev
```

### Access URLs

```
http://localhost:3000  → tazagroup.vn
http://localhost:3001  → tazaskinclinic.com
http://localhost:3002  → timona.edu.vn
http://localhost:3003  → hderma.vn
http://localhost:3004  → elasome.com
http://localhost:3005  → innerbright.vn
```

## Add New Domain

See [ADD_DOMAIN.md](./ADD_DOMAIN.md) for step-by-step guide.

**Quick steps:**
1. Choose next available port (3006+)
2. Add domain config in `lib/domain-config.ts`
3. Create database for domain
4. Run Prisma migrations
5. Test locally

## Database Schema

Each domain has **identical schema** but **separate data**:

```prisma
// prisma/schema.prisma
model User { ... }
model Page { ... }
model Post { ... }
model Menu { ... }
model BlockTemplate { ... }
// ... etc
```

## API Best Practices

### ✅ Correct Way

```typescript
import { getPrisma } from '@/lib/prisma';

export async function GET() {
  const prisma = await getPrisma(); // Auto-detects domain
  const pages = await prisma.page.findMany();
  return Response.json(pages);
}
```

### ❌ Wrong Way

```typescript
import { prisma } from '@/lib/prisma'; // Default client!

export async function GET() {
  const pages = await prisma.page.findMany(); // Wrong database!
  return Response.json(pages);
}
```

## Proxy Configuration

```typescript
// proxy.ts
export async function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const config = getDomainConfig(hostname);
  
  // Set domain headers
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-hostname', hostname);
  requestHeaders.set('x-domain', config.domain);
  requestHeaders.set('x-site-name', config.siteName);
  
  return NextResponse.next({
    request: { headers: requestHeaders }
  });
}
```

## Environment Variables

### Development (`.env.local`)

```bash
# Port defines which domain
PORT=3005

# Domain identifier
NEXT_PUBLIC_DOMAIN=innerbright.vn

# Database URL (auto-selected based on domain)
DATABASE_URL="postgresql://..."
```

### Production (`.env.production.innerbright`)

```bash
NODE_ENV=production
NEXT_PUBLIC_DOMAIN=innerbright.vn
DATABASE_URL="postgresql://postgres:pass@host:5432/innerv2core"
NEXTAUTH_URL="https://innerbright.vn"
```

## Domain-Specific Features

### Website Settings

Each domain can configure:
- Site name & description
- Logo & favicon
- Contact information
- Social media links
- Footer content

### SEO Settings

Per-domain SEO configuration:
- Meta title/description
- OG images
- Structured data
- Sitemaps
- Robots.txt

### Analytics

Each domain can have separate:
- Google Analytics ID
- Facebook Pixel ID
- Google Tag Manager

## Troubleshooting

### Wrong Database Connection

**Symptom:** Seeing content from different domain

**Solution:** Ensure using `getPrisma()` not default `prisma` client

### Port Already in Use

```bash
# Kill process on port
lsof -ti:3005 | xargs kill -9

# Or use different port
PORT=3006 bun dev
```

### Database Migration

```bash
# Migrate specific domain
NEXT_PUBLIC_DOMAIN=innerbright.vn bunx prisma migrate dev

# Migrate all domains
for domain in tazagroup.vn tazaskinclinic.com timona.edu.vn hderma.vn elasome.com innerbright.vn; do
  NEXT_PUBLIC_DOMAIN=$domain bunx prisma migrate dev
done
```

## Security

- Each domain has **isolated authentication**
- Users on domain A cannot access domain B
- Admin users are **per-domain**
- Sessions are **domain-scoped**

## Performance

- **Lazy loading**: Prisma clients created on-demand
- **Connection pooling**: Shared per domain
- **Cache per domain**: No cross-domain pollution

---

**See Also:**
- [Add New Domain](./ADD_DOMAIN.md)
- [Database Schema](./DATABASE_SCHEMA.md)
- [API Documentation](./API_DOCS.md)
