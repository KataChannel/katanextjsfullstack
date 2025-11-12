# Fix Bug: Posts Hỗ Trợ Page Builder

## Tổng Quan
Đã fix bug để **Posts** có thể sử dụng **Page Builder** giống như Pages. Trước đây chỉ có Pages hỗ trợ page builder format, bây giờ Posts cũng có thể tạo bằng visual builder.

---

## Thay Đổi

### 1. **Database Schema** - Thêm `blocks` cho Posts

**File**: `prisma/schema.prisma`

```prisma
model Post {
  id          String   @id @default(uuid())
  title       String
  slug        String   @unique
  content     String?
  excerpt     String?
  published   Boolean  @default(false)
  
  // Page Builder JSON - ✨ THÊM MỚI
  blocks      Json?
  
  // SEO Fields
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?
  ogImage         String?
  ogType          String?  @default("article")
  canonicalUrl    String?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author   User   @relation(fields: [authorId], references: [id], onDelete: Cascade)
  authorId String

  @@map("posts")
  @@index([slug])
  @@index([published])
}
```

**Migration**: `20251112111913_add_blocks_to_posts`
- Thêm column `blocks` type `JSONB` vào table `posts`
- Nullable (optional)

---

### 2. **Frontend Rendering** - Posts hiển thị Page Builder

**File**: `app/(public)/posts/[slug]/page.tsx`

#### Thêm Logic Parse Blocks:
```typescript
// Parse blocks - Handle both old format (array) and new PageBuilder format
let blocks: any[] | null = null;
let isPageBuilder = false;

if (post.blocks) {
  try {
    const parsed = typeof post.blocks === 'string' 
      ? JSON.parse(post.blocks) 
      : post.blocks;
    
    // Check if it's PageBuilder format (has canvas.elements)
    if (parsed?.canvas?.elements) {
      blocks = parsed.canvas.elements;
      isPageBuilder = true;
    } 
    // Check if it's old format (direct array)
    else if (Array.isArray(parsed)) {
      blocks = parsed;
      isPageBuilder = false;
    }
    // Check if parsed.elements exists
    else if (parsed?.elements) {
      blocks = parsed.elements;
      isPageBuilder = true;
    }
  } catch (error) {
    console.error('Error parsing blocks:', error);
    blocks = null;
  }
}
```

#### Conditional Rendering:
```tsx
<div className="prose prose-lg max-w-none">
  {blocks && blocks.length > 0 ? (
    isPageBuilder ? (
      <PageBuilderRenderer elements={blocks} />
    ) : (
      <PageBlocksRenderer blocks={blocks} />
    )
  ) : (
    <div dangerouslySetInnerHTML={{ __html: post.content || '' }} />
  )}
</div>
```

#### Thêm 2 Components:
1. **PageBuilderRenderer**: Render visual builder elements (text, heading, button, image, container, video, divider, spacer)
2. **PageBlocksRenderer**: Render old format blocks (heading, text, image, video, code)

---

### 3. **API Routes** - Posts hỗ trợ `blocks` field

#### `app/api/posts/route.ts`:
```typescript
const postSchema = z.object({
  title: z.string().min(1, 'Tiêu đề là bắt buộc'),
  slug: z.string().min(1, 'Slug là bắt buộc'),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  published: z.boolean().optional(),
  blocks: z.any().optional(), // ✨ THÊM MỚI
  metaTitle: z.string().optional(),
  // ... other fields
});
```

#### `app/api/posts/[id]/route.ts`:
```typescript
const postUpdateSchema = z.object({
  title: z.string().optional(),
  slug: z.string().optional(),
  content: z.string().optional(),
  excerpt: z.string().optional(),
  published: z.boolean().optional(),
  blocks: z.any().optional(), // ✨ THÊM MỚI
  // ... other fields
});
```

---

### 4. **Admin Content Management** - Phân biệt Posts Builder

**File**: `app/admin/content/page.tsx`

#### Posts Mapping với `pageType`:
```typescript
const posts: ContentItem[] = postsData.data.map((post: any) => ({
  ...post,
  type: "post" as ContentType,
  pageType: (post.blocks ? "builder" : "content") as PageType, // ✨ THÊM MỚI
}));
```

#### Updated Filter Logic:
```typescript
const filteredContents = contents.filter((item) => {
  if (filterType === "all") return true;
  if (filterType === "pages") return item.type === "page" && !item.blocks;
  if (filterType === "posts") return item.type === "post" && !item.blocks;
  if (filterType === "builder") return !!item.blocks; // ✨ Both pages AND posts
  return true;
});
```

#### Updated Statistics:
```typescript
const stats = {
  total: contents.length,
  published: contents.filter((c) => c.published).length,
  draft: contents.filter((c) => !c.published).length,
  pages: contents.filter((c) => c.type === "page" && !c.blocks).length,
  posts: contents.filter((c) => c.type === "post" && !c.blocks).length,
  builder: contents.filter((c) => !!c.blocks).length, // ✨ Pages + Posts with builder
};
```

#### ContentCard Component:
```typescript
const isBuilder = !!item.blocks; // ✨ Both pages and posts
const isPost = item.type === "post";
const elementCount = isBuilder 
  ? (item.blocks?.canvas?.elements?.length || item.blocks?.elements?.length || 0) 
  : 0;

// Preview link
<Link href={isPost ? `/posts/${item.slug}` : `/pages/${item.slug}`}>
```

---

## Workflow

### Tạo Post với Page Builder:

1. **Admin**: Vào `/admin/page-builder`
2. **Create New**: Click "New Page" → Chọn type "Post"
3. **Visual Edit**: Kéo thả elements (text, heading, button, image, container)
4. **Save**: Lưu → Prisma lưu vào `posts.blocks` dạng JSON
5. **Publish**: Toggle published = true

### Hiển thị Post:

1. **URL**: `/posts/my-post-slug`
2. **Check blocks**: Parse `post.blocks` JSON
3. **Render**:
   - Nếu có `blocks.canvas.elements` → `PageBuilderRenderer`
   - Nếu có `blocks` array → `PageBlocksRenderer`
   - Nếu không có blocks → `dangerouslySetInnerHTML` với `post.content`

---

## Types Hỗ Trợ

### Page Builder Elements:
- ✅ **Text**: Paragraph, styled text
- ✅ **Heading**: H1-H6 với props.level
- ✅ **Button**: CTA buttons
- ✅ **Image**: Với alt, src từ media library
- ✅ **Container**: Wrapper với layout
- ✅ **Video**: Embed iframe
- ✅ **Divider**: HR separator
- ✅ **Spacer**: Empty space

### Old Format Blocks:
- ✅ **heading**: H2 title
- ✅ **text**: HTML content
- ✅ **image**: With caption
- ✅ **video**: Embed
- ✅ **code**: Pre-formatted code

---

## Benefits

### ✅ Unified Experience:
- Posts và Pages đều có thể dùng Page Builder
- Consistent visual editing workflow

### ✅ Flexibility:
- Post builder: Visual rich content (landing page style)
- Post content: Traditional blog HTML content
- Mix cả 2 trong cùng 1 hệ thống

### ✅ Content Management:
- Filter theo type: Pages, Posts, Builder (all types)
- Stats riêng cho Pages text, Posts text, Builder content
- Preview link khác nhau: `/pages/...` vs `/posts/...`

---

## Migration

```bash
bun prisma migrate dev --name add_blocks_to_posts
```

**Output**:
```
Applying migration `20251112111913_add_blocks_to_posts`
Your database is now in sync with your schema.
```

---

## Testing Checklist

### ✅ Database:
- [x] Migration chạy thành công
- [x] Column `blocks` tồn tại trong `posts` table
- [x] Type `JSONB` nullable

### ✅ API:
- [x] POST `/api/posts` chấp nhận `blocks` field
- [x] PUT `/api/posts/:id` update `blocks`
- [x] GET `/api/posts` trả về `blocks`

### ✅ Frontend:
- [x] `/posts/[slug]` parse blocks từ JSON
- [x] PageBuilderRenderer render đúng elements
- [x] PageBlocksRenderer render old format
- [x] Fallback về HTML content nếu không có blocks

### ✅ Admin:
- [x] Content management hiển thị posts với builder
- [x] Filter "Builder" bao gồm cả posts
- [x] Stats đếm đúng posts builder
- [x] Preview link phân biệt pages vs posts

---

## Files Changed

| File | Changes |
|------|---------|
| `prisma/schema.prisma` | Thêm `blocks Json?` vào model Post |
| `app/(public)/posts/[slug]/page.tsx` | Thêm blocks parsing + PageBuilderRenderer + PageBlocksRenderer |
| `app/api/posts/route.ts` | Thêm `blocks: z.any().optional()` vào schema |
| `app/api/posts/[id]/route.ts` | Thêm `blocks: z.any().optional()` vào update schema |
| `app/admin/content/page.tsx` | Update filter logic, stats, và ContentCard cho posts builder |

---

**Status**: ✅ Hoàn thành
**Migration**: ✅ Applied
**TypeScript**: ✅ No errors
**Testing**: ✅ Ready
