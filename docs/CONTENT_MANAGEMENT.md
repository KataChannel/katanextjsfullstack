# 📝 Content Management

## Overview

Hệ thống quản lý nội dung với Tiptap editor kiểu Notion, hỗ trợ Pages và Posts.

## Content Types

### 1. Pages
- Static pages (About, Contact, Services)
- URL: `/{slug}`
- SEO optimized
- Can set as homepage

### 2. Posts  
- Blog/news articles
- URL: `/posts/{slug}`
- Categories & tags
- Publish scheduling

## Tiptap Editor

### Features

- **Rich Text Formatting**: Bold, italic, underline, strikethrough
- **Headings**: H1-H6
- **Lists**: Bullet, numbered, task lists
- **Links**: Insert & edit hyperlinks
- **Images**: Upload & embed
- **Videos**: YouTube embeds
- **Code Blocks**: Syntax highlighting
- **Tables**: Full table support
- **Slash Commands**: Type `/` for quick actions

### Slash Commands

Type `/` to open menu:

```
/heading1  - Large heading
/heading2  - Medium heading
/bullet    - Bullet list
/number    - Numbered list
/image     - Insert image
/video     - Embed video
/code      - Code block
/quote     - Block quote
/divider   - Horizontal line
```

### Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + B` | Bold |
| `Ctrl/Cmd + I` | Italic |
| `Ctrl/Cmd + U` | Underline |
| `Ctrl/Cmd + K` | Add link |
| `Ctrl/Cmd + Z` | Undo |
| `Ctrl/Cmd + Shift + Z` | Redo |
| `Ctrl/Cmd + Enter` | Save |

## API Endpoints

### Pages

```typescript
// List pages
GET /api/pages
Response: Page[]

// Create page
POST /api/pages
Body: { title, slug, content, seoTitle?, seoDescription? }

// Update page
PUT /api/pages/[id]
Body: { title?, content?, published? }

// Delete page
DELETE /api/pages/[id]

// Set as homepage
POST /api/pages/[id]/set-homepage
```

### Posts

```typescript
// List posts
GET /api/posts
Query: ?page=1&limit=10&search=query

// Create post
POST /api/posts
Body: { title, slug, content, excerpt?, published? }

// Update post
PUT /api/posts/[id]

// Delete post
DELETE /api/posts/[id]
```

## Media Management

### Upload Media

```typescript
// POST /api/media
const formData = new FormData();
formData.append('file', file);

const response = await fetch('/api/media', {
  method: 'POST',
  body: formData,
});

// Response
{
  url: "/uploads/image-123.jpg",
  filename: "image-123.jpg",
  size: 1024000,
  mimetype: "image/jpeg"
}
```

### Storage Options

**1. Local Storage** (default)
- Files stored in `/public/uploads`
- Fast, simple setup

**2. MinIO (S3-compatible)**
- Object storage
- CDN-ready
- Scalable

Configuration:
```bash
# .env
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_BUCKET=domain-name
```

## SEO Features

### Page SEO

```typescript
interface PageSEO {
  seoTitle: string;        // Meta title
  seoDescription: string;  // Meta description
  ogImage?: string;        // Open Graph image
  keywords?: string[];     // Meta keywords
  canonical?: string;      // Canonical URL
}
```

### Auto-generated

- **Sitemap**: `/sitemap.xml`
- **Robots.txt**: `/robots.txt`
- **Structured Data**: JSON-LD for articles

## Homepage Management

### Set Homepage

```typescript
// Option 1: Set existing page as homepage
await fetch(`/api/pages/${pageId}/set-homepage`, {
  method: 'POST',
});

// Option 2: Use Page Builder for homepage
// Navigate to /admin/pages-v2
// Create page with slug: '/' or 'home'
// Toggle "Set as Homepage"
```

### Homepage Priority

1. Page Builder page with `isHomepage: true`
2. Regular page with slug `/` or `home`
3. Custom homepage component (default)

## Content Filtering

### By Domain

All content is automatically filtered by current domain:

```typescript
const prisma = await getPrisma(); // Auto-detects domain
const pages = await prisma.page.findMany(); // Only current domain
```

### Published Status

```typescript
// Admin: See all
const pages = await prisma.page.findMany();

// Public: Only published
const pages = await prisma.page.findMany({
  where: { published: true },
});
```

### Search

```typescript
// Search pages by title or content
GET /api/pages?search=keyword

// Implementation
const pages = await prisma.page.findMany({
  where: {
    OR: [
      { title: { contains: search, mode: 'insensitive' } },
      { content: { contains: search, mode: 'insensitive' } },
    ],
  },
});
```

## Database Schema

```prisma
model Page {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   @db.Text // HTML from Tiptap
  blocks      Json?    // Optional: Page Builder blocks
  published   Boolean  @default(false)
  isHomepage  Boolean  @default(false)
  
  // SEO
  seoTitle       String?
  seoDescription String?
  ogImage        String?
  keywords       String[]
  
  // Timestamps
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  publishedAt DateTime?
}

model Post {
  id          String   @id @default(cuid())
  title       String
  slug        String   @unique
  content     String   @db.Text
  excerpt     String?
  published   Boolean  @default(false)
  
  // SEO
  seoTitle       String?
  seoDescription String?
  featuredImage  String?
  
  // Metadata
  authorId    String
  author      User     @relation(fields: [authorId], references: [id])
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  publishedAt DateTime?
}

model Media {
  id        String   @id @default(cuid())
  filename  String
  url       String
  mimetype  String
  size      Int
  uploadedBy String
  createdAt DateTime @default(now())
}
```

## Best Practices

### 1. SEO Optimization

```typescript
// Always set SEO fields
const page = {
  title: 'About Us',
  seoTitle: 'About Us - Company Name',
  seoDescription: 'Learn about our company, mission, and team...',
  ogImage: '/images/about-og.jpg',
};
```

### 2. Slug Generation

```typescript
// Auto-generate from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
    .replace(/[^a-z0-9]+/g, '-')     // Replace spaces/special chars
    .replace(/(^-|-$)/g, '');        // Remove leading/trailing dashes
}
```

### 3. Content Preview

```typescript
// Generate excerpt from content
function generateExcerpt(html: string, maxLength = 160): string {
  const text = html.replace(/<[^>]*>/g, ''); // Strip HTML
  return text.length > maxLength
    ? text.substring(0, maxLength) + '...'
    : text;
}
```

### 4. Image Optimization

```typescript
// Use Next.js Image component
import Image from 'next/image';

<Image
  src={media.url}
  alt={page.title}
  width={800}
  height={600}
  loading="lazy"
/>
```

## Troubleshooting

### Content Not Showing

**Check:**
1. Page is published
2. Correct domain selected
3. Slug is unique

### Editor Not Saving

**Solutions:**
1. Check API endpoint authentication
2. Verify content size < database limit
3. Check browser console for errors

### Images Not Uploading

**Fixes:**
1. Check upload directory permissions
2. Verify file size < limit (10MB default)
3. Check allowed file types

---

**See Also:**
- [Page Builder](./PAGE_BUILDER.md)
- [Media Management](./MEDIA_MANAGEMENT.md)
- [SEO Guide](./SEO_GUIDE.md)
