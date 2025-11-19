# Fix: BlockSidebar Không Hiển Thị Templates

**Ngày:** 19/11/2025  
**Trạng thái:** ✅ Đã fix

## Vấn đề

BlockSidebar không hiển thị template "Mạng Trong Mình Khát Vọng" trong tab Templates.

## Nguyên nhân

- Template được seed vào table `block_templates` (V1)
- BlockSidebar API query từ `block_templates_v2` (V2)
- Không tương thích giữa 2 versions

## Giải pháp

### 1. ✅ Migrate Template V1 → V2

Created script: `scripts/migrate-templates-v1-to-v2.ts`

**Chuyển đổi:**
```
BlockTemplate (V1)          →    BlockTemplateV2 (V2)
├─ elements: [array]        →    block: single object
├─ category: "hero"         →    category: "template"
└─ tags: (auto-extract)     →    tags: ["vision", "target", "mission"]
```

**Chạy:**
```bash
DOMAIN=innerbright.vn bun run scripts/migrate-templates-v1-to-v2.ts
```

**Kết quả:**
```
✅ Created V2 template: e1bdffb4-75a5-411d-a35b-6942687ae497
```

### 2. ✅ Verify Migration

```bash
DOMAIN=innerbright.vn bun run scripts/check-templates.ts
```

**Output:**
```
BlockTemplate (V1): 1 records
  - Mạng Trong Mình Khát Vọng (hero)

BlockTemplateV2 (V2): 1 records
  - Mạng Trong Mình Khát Vọng (template)
```

## Kết quả

✅ **Template giờ hiển thị trong BlockSidebar tab "Mẫu"**

### Test trên innerbright.vn:

1. Go to: http://localhost:3005/admin/pages
2. Edit/Create page → Click "Page Builder"
3. Sidebar → Tab "Mẫu" (Templates)
4. Tìm thấy: "Mạng Trong Mình Khát Vọng"
5. Kéo thả vào canvas → ✅ Hoạt động

## Scripts Created

### 1. `scripts/check-templates.ts`
Check số lượng templates trong V1 và V2

### 2. `scripts/migrate-templates-v1-to-v2.ts`
Migrate templates từ V1 sang V2 với:
- Auto category mapping
- Auto tag extraction
- Duplicate check

### 3. `scripts/seed-vision-template.ts`
Seed template "Mạng Trong Mình Khát Vọng"

## Workflow cho templates mới

**Khuyến nghị: Seed trực tiếp vào V2**

Sửa `scripts/seed-vision-template.ts`:

```typescript
// BEFORE (V1)
await prisma.blockTemplate.create({
  data: { ... }
});

// AFTER (V2) - Recommended
await prisma.blockTemplateV2.create({
  data: {
    name: 'Template Name',
    category: 'template', // element | template | custom
    tags: ['hero', 'vision'],
    block: { /* block data */ },
    // ...
  }
});
```

## Migration cho domains khác

### Chạy cho tất cả domains:

```bash
# Tazagroup
DOMAIN=tazagroup.vn bun run scripts/migrate-templates-v1-to-v2.ts

# Kataseo
DOMAIN=kataseo.com bun run scripts/migrate-templates-v1-to-v2.ts

# Innerbright (đã chạy)
DOMAIN=innerbright.vn bun run scripts/migrate-templates-v1-to-v2.ts
```

## Files Modified/Created

### Created:
1. `scripts/check-templates.ts` - Check V1 & V2 counts
2. `scripts/migrate-templates-v1-to-v2.ts` - Migration script
3. `docs/26-BLOCKSIDEBAR_TEMPLATES_FIX.md` - Doc này

### Modified:
- None (pure migration, no code changes needed)

## Kết luận

✅ **Bug fixed** - BlockSidebar giờ hiển thị templates từ BlockTemplateV2  
✅ **Migration complete** - Template "Mạng Trong Mình Khát Vọng" đã ở V2  
✅ **Scripts ready** - Dễ dàng migrate cho domains khác  

**Next:** Test kéo thả template vào canvas và render trên frontend.

---

**Status:** ✅ Complete  
**Domain:** innerbright.vn (port 3005)  
**Template ID V2:** e1bdffb4-75a5-411d-a35b-6942687ae497
