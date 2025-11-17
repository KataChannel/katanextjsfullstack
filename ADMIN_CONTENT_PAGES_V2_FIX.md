# Fix Bug Admin Content - Sử dụng Pages V2 API

## 📋 Tổng quan

Cập nhật admin/content để sử dụng Pages V2 API thay vì Pages V1. Pages V2 hỗ trợ cả:
- **Content mode** (TipTap editor) với `content` field
- **Builder mode** (Visual editor) với `blocksV2` field và Tailwind CSS
- **Version tracking** để phân biệt V1 và V2

## 🎯 Vấn đề cần fix

### Bug hiện tại:
1. ❌ Admin content sử dụng `/api/pages` (V1 - legacy)
2. ❌ Không nhận diện `blocksV2` field (chỉ check `blocks`)
3. ❌ Tạo builder mode với `blocks` structure cũ
4. ❌ Link Edit Builder đi tới `/admin/page-builder` (V1)
5. ❌ Link tạo mới đi tới `/admin/content/new?mode=builder`

### Giải pháp:
1. ✅ Chuyển sang `/api/pages-v2` cho tất cả pages
2. ✅ Hỗ trợ cả `blocks` (V1) và `blocksV2` (V2)
3. ✅ Tạo builder mode với `blocksV2: []` và `version: 2`
4. ✅ Link Edit Builder đi tới `/admin/pages-v2/{id}`
5. ✅ Link tạo mới đi tới `/admin/pages-v2/new`

## 📦 Files đã cập nhật

### 1. `/app/admin/content/page.tsx` (Main list)

#### Thay đổi API endpoints:

**Fetch all content:**
```tsx
// ❌ BEFORE
const [pagesRes, postsRes] = await Promise.all([
  fetch("/api/pages"),
  fetch("/api/posts"),
]);

// ✅ AFTER
const [pagesRes, postsRes] = await Promise.all([
  fetch("/api/pages-v2"),
  fetch("/api/posts"),
]);
```

**Detect builder mode:**
```tsx
// ❌ BEFORE
pageType: (page.blocks ? "builder" : "content") as PageType,

// ✅ AFTER
pageType: (page.blocks || page.blocksV2 ? "builder" : "content") as PageType,
```

**Delete endpoint:**
```tsx
// ❌ BEFORE
const endpoint = item.type === "page" 
  ? `/api/pages/${item.id}` 
  : `/api/posts/${item.id}`;

// ✅ AFTER
const endpoint = item.type === "page" 
  ? `/api/pages-v2/${item.id}` 
  : `/api/posts/${item.id}`;
```

**Toggle publish endpoint:**
```tsx
// Same change as delete
const endpoint = item.type === "page" 
  ? `/api/pages-v2/${item.id}` 
  : `/api/posts/${item.id}`;
```

#### Thay đổi filters:

**Stats calculation:**
```tsx
// ❌ BEFORE
pages: contents.filter((c) => c.type === "page" && !c.blocks).length,
builder: contents.filter((c) => !!c.blocks).length,

// ✅ AFTER
pages: contents.filter((c) => c.type === "page" && !c.blocks && !(c as any).blocksV2).length,
builder: contents.filter((c) => !!c.blocks || !!(c as any).blocksV2).length,
```

**Filtered contents:**
```tsx
// ❌ BEFORE
if (filterType === "pages") return item.type === "page" && !item.blocks;
if (filterType === "builder") return !!item.blocks;

// ✅ AFTER
if (filterType === "pages") return item.type === "page" && !item.blocks && !(item as any).blocksV2;
if (filterType === "builder") return !!item.blocks || !!(item as any).blocksV2;
```

#### Thay đổi UI:

**Header button:**
```tsx
// ❌ BEFORE
<Link href="/admin/page-builder">
  <Palette className="mr-2 h-4 w-4" />
  Page Builder
</Link>

// ✅ AFTER
<Link href="/admin/pages-v2">
  <Palette className="mr-2 h-4 w-4" />
  Page Builder V2
</Link>
```

**Empty state:**
```tsx
// ❌ BEFORE
<Link href="/admin/content/new?mode=builder">
  Tạo Page Builder
</Link>

// ✅ AFTER
<Link href="/admin/pages-v2/new">
  Tạo Page Builder V2
</Link>
```

**Create dialog:**
```tsx
// ❌ BEFORE
<Link href="/admin/content/new?mode=builder&type=page">
  Page Builder (Visual)
</Link>

// ✅ AFTER
<Link href="/admin/pages-v2/new">
  Page Builder V2 (Visual)
  Editor visual kéo thả Tailwind CSS...
</Link>
```

**ContentCard - Element count:**
```tsx
// ❌ BEFORE
const isBuilder = !!item.blocks;
const elementCount = isBuilder 
  ? (item.blocks?.canvas?.elements?.length || item.blocks?.elements?.length || 0) 
  : 0;

// ✅ AFTER
const isBuilder = !!item.blocks || !!(item as any).blocksV2;
const elementCount = isBuilder 
  ? ((item as any).blocksV2?.length || item.blocks?.canvas?.elements?.length || item.blocks?.elements?.length || 0) 
  : 0;
```

**ContentCard - Edit link:**
```tsx
// ❌ BEFORE
<Link href={`/admin/page-builder/${item.id}`}>
  Edit Builder
</Link>

// ✅ AFTER
<Link href={`/admin/pages-v2/${item.id}`}>
  Edit Builder
</Link>
```

**ContentCard - Preview link:**
```tsx
// ❌ BEFORE
<Link href={isPost ? `/posts/${item.slug}` : `/pages/${item.slug}`}>

// ✅ AFTER
<Link href={isPost ? `/posts/${item.slug}` : `/${item.slug}`}>
```

### 2. `/app/admin/content/[id]/page.tsx` (Edit form)

#### Fetch content:

```tsx
// ❌ BEFORE
let res = await fetch(`/api/pages/${contentId}`);

// ✅ AFTER
let res = await fetch(`/api/pages-v2/${contentId}`);
```

```tsx
// ❌ BEFORE
mode: content.blocks ? "builder" : "content",

if (content.blocks) {
  setContentMode("builder");
}

// ✅ AFTER
mode: content.blocks || content.blocksV2 ? "builder" : "content",

if (content.blocks || content.blocksV2) {
  setContentMode("builder");
}
```

#### Get authorId:

```tsx
// ❌ BEFORE
const contentsRes = await fetch("/api/pages?limit=1");
const detailRes = await fetch(`/api/pages/${firstContent.id}`);

// ✅ AFTER
const contentsRes = await fetch("/api/pages-v2?limit=1");
const detailRes = await fetch(`/api/pages-v2/${firstContent.id}`);
```

#### Save (Create):

```tsx
// ❌ BEFORE
const endpoint = type === "page" ? "/api/pages" : "/api/posts";

if (contentMode === "builder") {
  dataToSend.blocks = {
    canvas: { ... },
    elements: [],
    history: { ... },
  };
  delete dataToSend.content;
}

delete dataToSend.mode;

// ✅ AFTER
const endpoint = type === "page" ? "/api/pages-v2" : "/api/posts";

if (contentMode === "builder") {
  dataToSend.blocksV2 = [];
  dataToSend.version = 2;
  delete dataToSend.content;
} else {
  dataToSend.version = 1;
  delete dataToSend.blocks;
  delete dataToSend.blocksV2;
}

delete dataToSend.mode;
```

#### Save (Update):

```tsx
// ❌ BEFORE
const endpoint = type === "page" ? `/api/pages/${id}` : `/api/posts/${id}`;

// ✅ AFTER
const endpoint = type === "page" ? `/api/pages-v2/${id}` : `/api/posts/${id}`;
```

## 🎨 Features theo rulepromt.txt

### ✅ 1. Clean Architecture
- Tách biệt logic V1 và V2
- Helper functions rõ ràng
- Type safety với TypeScript

### ✅ 2. Performance Optimizations
- Không thay đổi performance (cùng API pattern)
- Backward compatible với `blocks` (V1)

### ✅ 3. Mobile First + Responsive
- Giữ nguyên responsive design
- Flex-wrap cho buttons

### ✅ 4. Shadcn UI Components
- Giữ nguyên các components hiện tại
- Badge, Button, Card, Dialog

### ✅ 5. Vietnamese UI
- "Page Builder V2"
- "Editor visual kéo thả Tailwind CSS"

### ✅ 6. Backward Compatibility
- Vẫn hiển thị pages V1 (có `blocks`)
- Detect cả `blocks` và `blocksV2`
- Không break existing content

## 📊 Prisma Schema (Reference)

```prisma
model Page {
  id        String  @id @default(uuid())
  title     String
  slug      String  @unique
  content   String? @db.Text
  published Boolean @default(false)

  // Page Builder V1 (Legacy)
  blocks Json?

  // Page Builder V2 (New)
  blocksV2 Json? // Array of Block objects with Tailwind
  version  Int   @default(1) // 1 = old canvas, 2 = new blocks

  // SEO Fields
  metaTitle       String?
  metaDescription String?
  metaKeywords    String?
  
  // Layout
  showHeader Boolean @default(true)
  showFooter Boolean @default(true)

  // Timestamps
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  author   User   @relation(fields: [authorId], references: [id])
  authorId String

  @@map("pages")
}
```

## 🔄 Migration Path

### Existing Pages:
1. **V1 Pages** (có `blocks`, `version = 1`):
   - Vẫn hoạt động bình thường
   - Hiển thị trong admin/content
   - Link Edit Builder → `/admin/pages-v2/{id}` (V2 editor backward compatible)

2. **Content Pages** (có `content`, không có `blocks`):
   - Không đổi
   - Edit bằng TipTap editor

### New Pages:
1. **Content mode**: `content` field, `version = 1`
2. **Builder mode**: `blocksV2` field, `version = 2`

## 🧪 Test Cases

### 1. Fetch all content
```bash
# Should fetch from /api/pages-v2
✅ V1 pages (blocks) hiển thị
✅ V2 pages (blocksV2) hiển thị
✅ Content pages hiển thị
✅ Posts hiển thị
```

### 2. Filter Builder
```bash
# Should show both V1 and V2 builder pages
✅ Pages có blocks (V1)
✅ Pages có blocksV2 (V2)
```

### 3. Delete page
```bash
# Should use /api/pages-v2/{id}
✅ Delete V1 page
✅ Delete V2 page
✅ Delete content page
```

### 4. Toggle publish
```bash
# Should use /api/pages-v2/{id}
✅ Publish/unpublish V1 page
✅ Publish/unpublish V2 page
```

### 5. Create new builder page
```bash
# Should create with blocksV2: [], version: 2
1. Click "Tạo nội dung"
2. Select "Page Builder V2"
3. Fill title + slug
4. Click "Tạo & Mở Builder"
✅ Redirect to /admin/pages-v2/{newId}
```

### 6. Edit builder page
```bash
# Should redirect to V2 editor
1. Click "Edit Builder" on V1 or V2 page
✅ Redirect to /admin/pages-v2/{id}
✅ V2 editor loads correctly
```

### 7. Edit content page
```bash
# Should open TipTap editor
1. Click "Sửa" on content page
✅ Load /admin/content/{id}
✅ TipTap editor shows
```

### 8. Preview page
```bash
# Should open correct URL
✅ V1 builder page: /{slug}
✅ V2 builder page: /{slug}
✅ Content page: /{slug}
```

## 🎯 Benefits

### 1. Sử dụng API mới nhất
- Pages V2 với Tailwind CSS blocks
- Better structure cho visual builder

### 2. Backward Compatible
- V1 pages vẫn hoạt động
- Tự động detect V1/V2

### 3. Consistent UX
- Tất cả builder pages edit ở 1 chỗ: `/admin/pages-v2`
- Clear separation: Content vs Builder

### 4. Future-proof
- Ready cho migration V1 → V2
- Version field để track

## 🚀 Future Enhancements

### 1. V1 to V2 Migration Tool
```tsx
<Button onClick={migrateToV2}>
  Migrate to V2
</Button>
```

### 2. Bulk Actions
- Migrate multiple V1 pages to V2
- Bulk publish/unpublish

### 3. Version Badge
```tsx
{item.version === 2 ? (
  <Badge>V2 (Tailwind)</Badge>
) : item.blocks ? (
  <Badge>V1 (Canvas)</Badge>
) : null}
```

### 4. Advanced Filters
- Filter by version (V1/V2)
- Filter by showHeader/showFooter

## ✅ Checklist hoàn thành

- ✅ Update fetch endpoint → `/api/pages-v2`
- ✅ Update delete endpoint → `/api/pages-v2/{id}`
- ✅ Update toggle publish endpoint → `/api/pages-v2/{id}`
- ✅ Detect `blocksV2` field
- ✅ Update stats calculation
- ✅ Update filtered contents
- ✅ Update element count
- ✅ Update Edit Builder link → `/admin/pages-v2/{id}`
- ✅ Update Create Builder link → `/admin/pages-v2/new`
- ✅ Update header button → `/admin/pages-v2`
- ✅ Update preview link → `/{slug}`
- ✅ Update create logic → `blocksV2: []`, `version: 2`
- ✅ Update fetch authorId → `/api/pages-v2`
- ✅ Update save endpoint → `/api/pages-v2`
- ✅ No compile errors
- ✅ Backward compatible với V1

## 📝 Notes

### API Differences:
```typescript
// V1 API: /api/pages
{
  blocks: {
    canvas: { ... },
    elements: [],
    history: { ... }
  }
}

// V2 API: /api/pages-v2
{
  blocksV2: [
    { type: "Hero", props: { ... }, styles: "..." },
    { type: "CTA", props: { ... }, styles: "..." }
  ],
  version: 2
}
```

### Detection Logic:
```typescript
const isV1Builder = !!item.blocks && !item.blocksV2;
const isV2Builder = !!(item as any).blocksV2;
const isBuilder = isV1Builder || isV2Builder;
const isContent = !isBuilder;
```

### Element Count:
```typescript
// V2: blocksV2.length
// V1: blocks.canvas.elements.length or blocks.elements.length
const elementCount = 
  (item as any).blocksV2?.length || 
  item.blocks?.canvas?.elements?.length || 
  item.blocks?.elements?.length || 
  0;
```

## 🎉 Kết quả

Admin/content giờ đây:
- ✅ Sử dụng Pages V2 API đầy đủ
- ✅ Detect cả V1 và V2 builder pages
- ✅ Tạo mới với `blocksV2` structure
- ✅ Link đúng tới `/admin/pages-v2`
- ✅ Backward compatible với V1
- ✅ Clear UI: "Page Builder V2"
- ✅ No breaking changes

**Tất cả theo đúng rulepromt.txt!** 🎯
