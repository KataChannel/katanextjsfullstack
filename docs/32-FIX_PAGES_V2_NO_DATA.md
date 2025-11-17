# Fix Bug Admin Pages V2 - Không hiển thị dữ liệu

**Ngày:** 17/11/2025  
**Status:** ✅ FIXED

---

## 🐛 Bug

**Vấn đề:** Trang `/admin/pages-v2` không hiển thị dữ liệu pages

**Nguyên nhân:**
- Filter `where: { version: 2 }` quá chặt
- Tất cả pages mặc định có `version: 1` khi tạo
- Không có pages nào có `version: 2` trong database

---

## ✅ Giải pháp

### 1. **Cập nhật filter logic**

**File:** `app/admin/pages-v2/page.tsx`

```typescript
// ❌ Before - Quá chặt
const pages = await prisma.page.findMany({
  where: { version: 2 }
});

// ✅ After - Linh hoạt hơn
const allPages = await prisma.page.findMany({
  include: { author: true }
});

return allPages.filter(page => {
  // Show version 2 pages
  if (page.version === 2) return true;
  
  // Show pages with non-empty blocksV2 data
  if (page.blocksV2 !== null && page.blocksV2 !== undefined) {
    const blocks = Array.isArray(page.blocksV2) ? page.blocksV2 : [];
    return blocks.length > 0;
  }
  
  return false;
});
```

**Logic mới:**
- ✅ Hiển thị pages có `version === 2`
- ✅ Hiển thị pages có `blocksV2` là array không rỗng
- ❌ Bỏ qua pages có `blocksV2 = []` hoặc `null`

### 2. **Tạo test data**

**Script:** `scripts/create-page-v2-test.ts`

```bash
bun run scripts/create-page-v2-test.ts
```

Tạo page test với:
- `version: 2`
- `blocksV2: [...]` - 3 blocks (h1, p, button)
- `published: true`

### 3. **Utility script**

**Script:** `scripts/show-pages-v2.ts`

```bash
bun run scripts/show-pages-v2.ts
```

Hiển thị:
- Tổng số pages
- Số pages V1 vs V2
- Chi tiết từng page V2
- Links để view và edit

---

## 📊 Kết quả

### Before Fix:
```
Pages V2: 0 pages
→ Không có dữ liệu hiển thị
```

### After Fix:
```
📊 Pages Statistics:
  Total Pages: 3
  Pages V1 (old): 2
  Pages V2 (new): 1
  Published: 3

📄 Pages V2 List:
  1. Test Page V2
     - Version: 2
     - Blocks: 3
     - Status: ✅ Published
```

---

## 🎯 Khi nào page được hiển thị trong Pages V2?

1. **Version 2 pages** ✅
   - `page.version === 2`
   - Tạo từ `/admin/pages-v2/new`

2. **Pages có blocksV2 data** ✅
   - `page.blocksV2` là array không rỗng
   - Đã được edit bằng Block Editor V2

3. **Pages V1 không có blocks** ❌
   - `page.version === 1`
   - `page.blocksV2 === null` hoặc `[]`
   - Chỉ hiển thị trong Pages V1

---

## 🔧 Files đã sửa

1. ✅ `app/admin/pages-v2/page.tsx` - Updated filter logic
2. ✅ `scripts/create-page-v2-test.ts` - Create test data
3. ✅ `scripts/show-pages-v2.ts` - Show statistics

---

## 📝 Testing

```bash
# 1. Tạo test page
bun run scripts/create-page-v2-test.ts

# 2. Kiểm tra statistics
bun run scripts/show-pages-v2.ts

# 3. Truy cập admin
http://localhost:3005/admin/pages-v2

# 4. View test page
http://localhost:3005/test-page-v2
```

---

## 🚀 Next Steps

**Để tạo page V2 mới:**
1. Vào `/admin/pages-v2`
2. Click "New Page"
3. Sử dụng Block Editor
4. Save với `version: 2`

**Để migrate page V1 → V2:**
1. Edit page V1 trong V2 editor
2. Add blocks vào `blocksV2`
3. Page sẽ tự động xuất hiện trong Pages V2

---

**Status:** ✅ FIXED - Pages V2 hiển thị đúng dữ liệu
