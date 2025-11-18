# Fix Bug 404 - Page/Post Routing

## 🐛 Vấn Đề

URL `/giai-dap-thac-mac-ve-tiem-filler-moi` trả về 404 Not Found.

## 🔍 Nguyên Nhân

### 1. **Post unpublished**
```typescript
// prisma/seed.ts (line 142)
published: false  // ❌ Post không được published
```

### 2. **Route Structure Ambiguous**
```
app/(public)/
  ├── [slug]/page.tsx           # Catch-all route
  ├── pages/[slug]/page.tsx     # Pages specific route
  └── posts/[slug]/page.tsx     # Posts specific route
```

**Vấn đề**: URL `/giai-dap-thac-mac-ve-tiem-filler-moi` match cả 3 routes!

Next.js routing priority:
1. Specific routes first (`/pages/[slug]`, `/posts/[slug]`)
2. Dynamic catch-all last (`/[slug]`)

Nhưng code chỉ check `page`, không check `post` → 404

## ✅ Giải Pháp

### 1. Update Seed Data

**File**: `prisma/seed.ts`

```typescript
// Before
{
  title: 'Giải Đáp Thắc Mắc Về Tiêm Filler Môi',
  slug: 'giai-dap-thac-mac-ve-tiem-filler-moi',
  published: false,  // ❌
}

// After
{
  title: 'Giải Đáp Thắc Mắc Về Tiêm Filler Môi',
  slug: 'giai-dap-thac-mac-ve-tiem-filler-moi',
  published: true,   // ✅
}
```

**Run**: `bun prisma db seed`

### 2. Update Route Logic

**File**: `app/(public)/[slug]/page.tsx`

#### Before
```typescript
export default async function PageDetail({ params }: PageProps) {
  const page = await prisma.page.findUnique({ where: { slug } });
  
  if (!page || !page.published) {
    notFound();  // ❌ Không check post
  }
  // ...
}
```

#### After
```typescript
export default async function PageDetail({ params }: PageProps) {
  // 1. Try to find as page first
  const page = await prisma.page.findUnique({ where: { slug } });
  
  if (page && page.published) {
    // Render page
  } else {
    // 2. Try to find as post
    const post = await prisma.post.findUnique({ where: { slug } });
    
    if (post && post.published) {
      // Redirect to /posts/[slug] ✅
      redirect(`/posts/${slug}`);
    }
    
    // 3. Not found
    notFound();
  }
  // ...
}
```

### 3. Update Static Params

**File**: `app/(public)/[slug]/page.tsx`

```typescript
export async function generateStaticParams() {
  const prisma = await getPrisma('tazagroup.vn');
  
  // Get both pages and posts
  const pages = await prisma.page.findMany({
    where: { published: true },
    select: { slug: true },
  });

  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });

  // Combine all slugs
  return [
    ...pages.map((page) => ({ slug: page.slug })),
    ...posts.map((post) => ({ slug: post.slug })),
  ];
}
```

## 🎯 Kết Quả

### Route Flow

```
User visits: /giai-dap-thac-mac-ve-tiem-filler-moi
     ↓
app/(public)/[slug]/page.tsx
     ↓
Check: prisma.page.findUnique({ slug })
     ↓
Not found → Check: prisma.post.findUnique({ slug })
     ↓
Found → redirect(`/posts/${slug}`)
     ↓
User redirected to: /posts/giai-dap-thac-mac-ve-tiem-filler-moi
     ↓
app/(public)/posts/[slug]/page.tsx renders post
```

### URL Behavior

| URL | Result |
|-----|--------|
| `/ve-chung-toi` | ✅ Renders page directly |
| `/giai-dap-thac-mac-ve-tiem-filler-moi` | ✅ Redirects to `/posts/...` |
| `/posts/giai-dap-thac-mac-ve-tiem-filler-moi` | ✅ Renders post |
| `/invalid-slug` | ✅ Shows 404 |

## 📝 Files Modified

1. ✅ `prisma/seed.ts` - Changed `published: false` → `true`
2. ✅ `app/(public)/[slug]/page.tsx` - Added post check + redirect logic
3. ✅ `scripts/fix-404-bug.sh` - Created test script

## 🧪 Testing

```bash
# 1. Seed database
bun prisma db seed

# 2. Start dev server
bun dev

# 3. Test URLs
curl -I http://localhost:3000/giai-dap-thac-mac-ve-tiem-filler-moi
# Should return: 307 Temporary Redirect → /posts/...

curl -I http://localhost:3000/posts/giai-dap-thac-mac-ve-tiem-filler-moi
# Should return: 200 OK

curl -I http://localhost:3000/ve-chung-toi
# Should return: 200 OK (page)
```

## 📚 Route Priority

Next.js evaluates routes in this order:

```
1. Static routes (highest priority)
   /about, /contact

2. Dynamic segments
   /pages/[slug]
   /posts/[slug]

3. Catch-all segments (lowest priority)
   /[slug]
   /[...slug]
```

## 🎓 Best Practices

### ✅ DO
- Use specific routes for specific content types (`/posts/[slug]`)
- Use catch-all only for truly dynamic content
- Always check multiple sources in catch-all routes
- Redirect to specific routes when possible

### ❌ DON'T
- Rely only on catch-all routes
- Mix content types in same route without checking
- Return 404 without checking all possibilities

## 🔗 Related

- [Next.js Dynamic Routes](https://nextjs.org/docs/app/building-your-application/routing/dynamic-routes)
- [Next.js Route Priority](https://nextjs.org/docs/app/building-your-application/routing#route-groups-and-route-priority)
- [Prisma findUnique](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findunique)

---

**Fixed**: December 2024  
**Status**: ✅ Resolved  
**Type**: Routing + Data
