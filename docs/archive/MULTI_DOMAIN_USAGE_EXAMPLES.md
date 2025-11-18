# VÍ DỤ SỬ DỤNG MULTI-DOMAIN

Hướng dẫn cách sử dụng hệ thống multi-domain trong các component và pages.

## 📖 MỤC LỤC

1. [Server Components](#server-components)
2. [Client Components](#client-components)
3. [Server Actions](#server-actions)
4. [API Routes](#api-routes)
5. [Database Queries](#database-queries)
6. [SEO & Metadata](#seo--metadata)

---

## Server Components

### Lấy thông tin domain hiện tại

```tsx
// app/page.tsx
import { getCurrentDomainConfig } from '@/lib/domain-helpers';

export default async function HomePage() {
  const config = await getCurrentDomainConfig();
  
  return (
    <div>
      <h1>Chào mừng đến {config.siteName}</h1>
      <p>{config.description}</p>
      
      <div className="contact">
        <p>Địa chỉ: {config.address}</p>
        <p>Hotline: {config.hotline}</p>
        <p>Email: {config.email}</p>
      </div>
    </div>
  );
}
```

### Lấy contact info

```tsx
// app/contact/page.tsx
import { getContactInfo } from '@/lib/domain-helpers';

export default async function ContactPage() {
  const contact = await getContactInfo();
  
  return (
    <div>
      <h1>Liên hệ</h1>
      <p>{contact.address}</p>
      <a href={`tel:${contact.hotline}`}>{contact.hotline}</a>
      <a href={`mailto:${contact.email}`}>{contact.email}</a>
    </div>
  );
}
```

### Conditional rendering theo domain

```tsx
// app/components/DomainSpecific.tsx
import { isDomain } from '@/lib/domain-helpers';

export default async function DomainSpecific() {
  const isTazaGroup = await isDomain('tazagroup.vn');
  const isTazaSkin = await isDomain('tazaskinclinic.com');
  
  if (isTazaGroup) {
    return <div>Content riêng cho Taza Group</div>;
  }
  
  if (isTazaSkin) {
    return <div>Content riêng cho Taza Skin Clinic</div>;
  }
  
  return <div>Content chung</div>;
}
```

---

## Client Components

### Hook để lấy domain info

```tsx
'use client';

import { useDomainInfo } from '@/lib/domain-hooks';

export function Header() {
  const { domain, hostname, port } = useDomainInfo();
  
  return (
    <header>
      <div>Domain: {domain}</div>
      <div>Running on: {hostname}</div>
      {port && <div>Port: {port}</div>}
    </header>
  );
}
```

### Check domain trong Client Component

```tsx
'use client';

import { useIsDomain } from '@/lib/domain-hooks';

export function SpecialOffer() {
  const isTazaSkin = useIsDomain('tazaskinclinic.com');
  
  if (!isTazaSkin) return null;
  
  return (
    <div className="special-offer">
      Ưu đãi đặc biệt cho Taza Skin Clinic!
    </div>
  );
}
```

### Lấy full URL

```tsx
'use client';

import { useFullUrl } from '@/lib/domain-hooks';

export function ShareButton() {
  const fullUrl = useFullUrl();
  
  const handleShare = () => {
    navigator.clipboard.writeText(fullUrl);
  };
  
  return <button onClick={handleShare}>Chia sẻ trang này</button>;
}
```

---

## Server Actions

### Sử dụng database trong Server Action

```tsx
'use server';

import { getPrisma } from '@/lib/prisma';
import { getCurrentDomainConfig } from '@/lib/domain-helpers';

export async function createPost(formData: FormData) {
  const prisma = await getPrisma();
  const config = await getCurrentDomainConfig();
  
  const title = formData.get('title') as string;
  const content = formData.get('content') as string;
  
  const post = await prisma.post.create({
    data: {
      title,
      content,
      // Tự động gắn tag theo domain
      tags: [config.domain],
    },
  });
  
  return post;
}
```

### Action với domain context

```tsx
'use server';

import { getCurrentDomain } from '@/lib/domain-helpers';

export async function sendEmail(to: string, subject: string, body: string) {
  const domain = await getCurrentDomain();
  
  // Tùy chỉnh email template theo domain
  const template = getEmailTemplate(domain);
  
  // Send email với template tương ứng
  await sendEmailWithTemplate(to, subject, body, template);
}

function getEmailTemplate(domain: string) {
  const templates = {
    'tazagroup.vn': 'taza-group-template',
    'tazaskinclinic.com': 'taza-skin-template',
    'timona.edu.vn': 'timona-template',
    'hderma.vn': 'hderma-template',
    'elasome.com': 'elasome-template',
  };
  
  return templates[domain] || templates['tazagroup.vn'];
}
```

---

## API Routes

### API Route với domain detection

```tsx
// app/api/posts/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDomainConfig } from '@/lib/domain-config';
import { getPrismaClient } from '@/lib/database';

export async function GET(request: NextRequest) {
  // Lấy hostname từ headers
  const hostname = request.headers.get('host') || 'localhost:3000';
  
  // Get config
  const config = getDomainConfig(hostname);
  
  // Get database client
  const prisma = getPrismaClient(hostname);
  
  // Query posts
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
  });
  
  return NextResponse.json({
    domain: config.domain,
    siteName: config.siteName,
    posts,
  });
}
```

### API với response tùy theo domain

```tsx
// app/api/config/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { getDomainConfig } from '@/lib/domain-config';

export async function GET(request: NextRequest) {
  const hostname = request.headers.get('host') || 'localhost:3000';
  const config = getDomainConfig(hostname);
  
  // Trả về config public (không bao gồm database)
  return NextResponse.json({
    domain: config.domain,
    siteName: config.siteName,
    description: config.description,
    contact: {
      address: config.address,
      hotline: config.hotline,
      email: config.email,
    },
  });
}
```

---

## Database Queries

### Query với Prisma trong Server Component

```tsx
// app/posts/page.tsx
import { getPrisma } from '@/lib/prisma';
import { getCurrentDomainConfig } from '@/lib/domain-helpers';

export default async function PostsPage() {
  const prisma = await getPrisma();
  const config = await getCurrentDomainConfig();
  
  // Query posts từ database của domain hiện tại
  const posts = await prisma.post.findMany({
    where: {
      published: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });
  
  return (
    <div>
      <h1>Bài viết - {config.siteName}</h1>
      {posts.map(post => (
        <article key={post.id}>
          <h2>{post.title}</h2>
          <p>{post.excerpt}</p>
        </article>
      ))}
    </div>
  );
}
```

### Complex query với domain context

```tsx
// app/dashboard/page.tsx
import { getPrisma } from '@/lib/prisma';
import { getCurrentDomain } from '@/lib/domain-helpers';

export default async function DashboardPage() {
  const prisma = await getPrisma();
  const domain = await getCurrentDomain();
  
  // Aggregate data
  const stats = await prisma.$transaction([
    prisma.post.count({ where: { published: true } }),
    prisma.user.count(),
    prisma.page.count(),
  ]);
  
  return (
    <div>
      <h1>Dashboard - {domain}</h1>
      <div className="stats">
        <div>Posts: {stats[0]}</div>
        <div>Users: {stats[1]}</div>
        <div>Pages: {stats[2]}</div>
      </div>
    </div>
  );
}
```

---

## SEO & Metadata

### Generate metadata với domain context

```tsx
// app/layout.tsx
import { generateDomainSEOMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return await generateDomainSEOMetadata();
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
```

### Custom metadata cho từng page

```tsx
// app/about/page.tsx
import { generateDomainSEOMetadata } from '@/lib/seo';

export async function generateMetadata() {
  return await generateDomainSEOMetadata({
    title: 'Giới thiệu',
    description: 'Tìm hiểu thêm về chúng tôi',
  });
}

export default function AboutPage() {
  return <div>About page content</div>;
}
```

### Organization Schema

```tsx
// app/layout.tsx
import { generateDomainOrganizationSchema } from '@/lib/seo';

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const schema = await generateDomainOrganizationSchema();
  
  return (
    <html lang="vi">
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

## 🎯 BEST PRACTICES

### ✅ DO

```tsx
// ✅ Sử dụng helpers
const config = await getCurrentDomainConfig();

// ✅ Sử dụng getPrisma() cho database
const prisma = await getPrisma();

// ✅ Sử dụng hooks trong client components
const { domain } = useDomainInfo();
```

### ❌ DON'T

```tsx
// ❌ Không hardcode domain
const siteName = 'Taza Group';

// ❌ Không trực tiếp import prisma
import { prisma } from '@/lib/prisma'; // Sai!

// ❌ Không sử dụng process.env.DATABASE_URL trực tiếp
const dbUrl = process.env.DATABASE_URL; // Sai!
```

---

## 🚀 DEPLOYMENT NOTES

### Development
```bash
# Chạy domain cụ thể
bun dev -- -p 3001  # tazaskinclinic.com
```

### Production
- Domain tự động detect từ request headers
- Không cần config thêm
- Database tự động switch theo domain

---

**Cập nhật:** 12/11/2025
