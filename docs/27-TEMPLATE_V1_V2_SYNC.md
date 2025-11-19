# Đồng Bộ và Merge BlockTemplate V1 & V2

**Ngày:** 19/11/2025  
**Trạng thái:** ✅ Đã phân tích

## Tổng quan

Hệ thống hiện có **2 bảng templates** song song:
1. **`block_templates`** (BlockTemplate V1) - Legacy
2. **`block_templates_v2`** (BlockTemplateV2) - Current

## Cấu trúc Schema

### BlockTemplate (V1)
```prisma
model BlockTemplate {
  id          String  @id @default(uuid())
  name        String
  description String?
  thumbnail   String?
  elements    Json     // Array format [block1, block2, ...]
  category    String   // general, hero, content, cta, etc.
  published   Boolean
  
  authorId    String
  createdAt   DateTime
  updatedAt   DateTime
  
  @@map("block_templates")
}
```

### BlockTemplateV2 (V2)
```prisma
model BlockTemplateV2 {
  id          String  @id @default(uuid())
  name        String
  description String?
  thumbnail   String?
  block       Json     // Single block object with children
  category    String   // element | template | custom
  published   Boolean
  downloads   Int      // NEW: Usage tracking
  tags        String[] // NEW: Search/filter
  
  authorId    String
  createdAt   DateTime
  updatedAt   DateTime
  
  @@map("block_templates_v2")
}
```

## API Endpoints

### V1 APIs (BlockTemplate)

1. **`/api/block-templates`** (Public)
   - GET: Lấy published templates V1
   - ⚠️ **KHÔNG được sử dụng bởi BlockSidebar**

2. **`/api/admin/block-templates`** (Admin CRUD)
   - GET: Lấy tất cả V1 templates
   - POST: Tạo V1 template mới
   - PUT: Update V1 template
   - DELETE: Xóa V1 template
   - ✅ **Admin page /admin/block-templates sử dụng**

### V2 APIs (BlockTemplateV2)

1. **`/api/block-templates-v2`** (BlockSidebar)
   - GET: Lấy V2 templates với filters
   - POST: Tạo V2 template mới
   - ✅ **BlockSidebar query từ đây**

2. **`/api/block-templates-v2/[id]`** (Single template)
   - GET: Lấy 1 template + increment downloads
   - PUT: Update template
   - DELETE: Xóa template

## Sự khác biệt chính

| Feature | V1 (BlockTemplate) | V2 (BlockTemplateV2) |
|---------|-------------------|----------------------|
| **Data Structure** | `elements: [array]` | `block: single object` |
| **Categories** | general, hero, content, cta | element, template, custom |
| **Tags** | ❌ Không có | ✅ `tags: string[]` |
| **Downloads tracking** | ❌ Không có | ✅ `downloads: int` |
| **Used by** | Admin page | BlockSidebar |
| **Format** | Array of blocks | Tree structure |

## Trạng thái hiện tại (innerbright.vn)

### V1 (block_templates)
```
✅ 1 template:
   - Mạng Trong Mình Khát Vọng (hero)
   - ID: a89c7ee4-84f1-4ef5-b9ed-2d9f655b2210
```

### V2 (block_templates_v2)
```
✅ 1 template:
   - Mạng Trong Mình Khát Vọng (template)
   - ID: e1bdffb4-75a5-411d-a35b-6942687ae497
   - Tags: ["vision", "target", "mission"]
   - Downloads: 0
```

## Migration Process

### ✅ Đã thực hiện

**Script:** `scripts/migrate-templates-v1-to-v2.ts`

**Chuyển đổi:**
```typescript
V1 → V2 Mapping:
├─ elements (array) → block (object)
├─ category: "hero" → category: "template"
├─ (none) → tags: auto-extracted
└─ (none) → downloads: 0
```

**Kết quả:**
- Template "Mạng Trong Mình Khát Vọng" đã có trong cả V1 và V2
- BlockSidebar hiển thị template từ V2 ✅

## Khuyến nghị đồng bộ

### ✅ Strategy: Keep Both, Favor V2

**Lý do:**
1. **Backward compatibility:** V1 cho admin page cũ
2. **New features:** V2 có tags, downloads, better structure
3. **Separation of concerns:** Admin CRUD vs Public display

### Best Practices

#### 1. Tạo templates mới → Seed trực tiếp vào V2

```typescript
// ✅ RECOMMENDED
await prisma.blockTemplateV2.create({
  data: {
    name: 'New Template',
    category: 'template',
    tags: ['hero', 'cta'],
    block: { /* block data */ },
    downloads: 0,
    // ...
  }
});
```

#### 2. Migrate V1 → V2 cho templates cũ

```bash
# Chạy migration script
DOMAIN=innerbright.vn bun run scripts/migrate-templates-v1-to-v2.ts
```

#### 3. Admin page option

**Option A:** Keep using V1 admin page
- Current: `/admin/block-templates` → V1
- No changes needed

**Option B:** Migrate admin page to V2
- Update `/admin/block-templates/page.tsx`
- Change API from `/api/admin/block-templates` to `/api/block-templates-v2`
- Support tags, downloads fields

### Recommendation: **Option A** (Keep current)

**Reasons:**
- V1 admin page works fine
- V2 focus on BlockSidebar (end-user)
- Less refactoring work
- Can migrate later if needed

## Auto-sync Strategy (Future)

### Option 1: Webhook/Trigger
```typescript
// When V1 template created → Auto create in V2
prisma.blockTemplate.create({ ... })
  .then(v1 => migrateToV2(v1))
```

### Option 2: Scheduled Job
```bash
# Cron job chạy migration mỗi ngày
0 0 * * * DOMAIN=innerbright.vn bun run scripts/migrate-templates-v1-to-v2.ts
```

### Option 3: Manual Migration (Current)
```bash
# Admin chạy khi cần
bun run scripts/migrate-templates-v1-to-v2.ts
```

**Recommended:** Option 3 (Manual) - Simple and effective

## Scripts Available

### 1. Check Templates Status
```bash
DOMAIN=innerbright.vn bun run scripts/check-templates.ts
```

Output:
```
BlockTemplate (V1): 1 records
BlockTemplateV2 (V2): 1 records
```

### 2. Migrate V1 → V2
```bash
DOMAIN=innerbright.vn bun run scripts/migrate-templates-v1-to-v2.ts
```

Features:
- ✅ Auto-detect duplicates (skip if exists)
- ✅ Category mapping
- ✅ Tag extraction
- ✅ Preserve metadata

### 3. Sync Check (Detailed)
```bash
DOMAIN=innerbright.vn bun run scripts/sync-check-templates.ts
```

Output:
- Templates in V1 but not V2
- Templates in V2 but not V1
- Matching templates comparison
- Recommendations

## Workflow

### For New Templates

```
1. Design template trong Page Builder
2. Save as template → Choose V2 format
3. Seed script:
   └─ Create in BlockTemplateV2 directly
4. ✅ Auto show in BlockSidebar
```

### For Existing V1 Templates

```
1. Check: bun run scripts/check-templates.ts
2. Migrate: bun run scripts/migrate-templates-v1-to-v2.ts
3. Verify: Check BlockSidebar tab "Mẫu"
4. ✅ Template appears
```

## Data Consistency

### Current Status: ✅ SYNCED

**innerbright.vn:**
- V1: 1 template ✅
- V2: 1 template ✅
- Same name, same author
- Different IDs (expected)
- Different formats (expected)

### Monitoring

Check periodically:
```bash
# Weekly or when needed
DOMAIN=innerbright.vn bun run scripts/check-templates.ts
```

If V1 count > V2 count → Run migration

## Deprecation Plan (Long-term)

### Phase 1: Current (✅ Now)
- Keep both V1 & V2
- BlockSidebar uses V2
- Admin page uses V1

### Phase 2: Transition (Future)
- Migrate all templates to V2
- Update admin page to use V2 API
- Add deprecation warning to V1

### Phase 3: Sunset (Far future)
- Remove V1 completely
- Single source of truth: V2
- Clean up schemas

**Timeline:** No rush, V1 works fine for admin

## Testing Checklist

- [x] V1 templates visible in `/admin/block-templates`
- [x] V2 templates visible in BlockSidebar
- [x] Migration script works without errors
- [x] No duplicate templates created
- [x] Tags extracted correctly
- [x] Downloads initialized to 0
- [x] Category mapping correct
- [ ] Test creating new template directly in V2
- [ ] Test deleting V1 template (V2 unaffected)
- [ ] Test deleting V2 template (V1 unaffected)

## Kết luận

### ✅ Current State: HEALTHY

- **V1 & V2 coexist** peacefully
- **No conflicts** between systems
- **Migration path** clear and tested
- **BlockSidebar works** with V2 ✅

### 💡 Recommendations

1. ✅ **Keep current setup** - No changes needed
2. ✅ **New templates** → Seed to V2 directly
3. ✅ **Old templates** → Run migration when needed
4. ✅ **Monitor** with check-templates.ts script

### 🚀 Next Steps

1. Create more templates directly in V2
2. Test BlockSidebar drag & drop
3. Consider admin page V2 migration (optional, low priority)

---

**Status:** ✅ Synced & Working  
**Domain:** innerbright.vn  
**V1 Count:** 1 template  
**V2 Count:** 1 template  
**Action Required:** None - working as expected
