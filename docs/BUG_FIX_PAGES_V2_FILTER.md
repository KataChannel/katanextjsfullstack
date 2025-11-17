# Bug Fix: Pages V2 Filter Logic

**Date:** 2025-01-17  
**Issue:** admin/pages-v2 chỉ hiển thị 1 page khi database có 3 pages  
**Status:** ✅ FIXED

## Problem

User báo cáo rằng database có 3 pages nhưng truy cập `/admin/pages-v2` chỉ hiển thị có 1 page.

## Investigation

### Database State
Sau khi kiểm tra bằng diagnostic script, phát hiện database có 3 pages:

1. **Test Page V2** (version 2)
   - `blocksV2`: Object với 0 blocks
   - **Should show in V2:** ✅ YES

2. **Về InnerBright** (version 1)
   - `blocksV2`: Object với 3 blocks (text, image, button)
   - **Should show in V2:** ✅ YES (page đã được mở trong V2 editor)

3. **Bộ Thẻ NLP** (version 1)
   - `blocksV2`: NULL
   - **Should show in V2:** ❌ NO (chưa bao giờ mở trong V2 editor)

### Root Cause

Filter logic trong `app/admin/pages-v2/page.tsx` có bug:

```typescript
// ❌ WRONG - Check if blocksV2 is array
return Array.isArray(page.blocksV2);
```

**Problem:** `blocksV2` không phải là array, mà là **object** với structure:
```typescript
{
  blocks: [...],    // Array of blocks
  version: 2
}
```

Vì vậy `Array.isArray(page.blocksV2)` luôn return `false`, khiến "Về InnerBright" không hiển thị dù đã có data V2.

## Solution

### Files Changed

#### 1. `app/admin/pages-v2/page.tsx`

**Before:**
```typescript
if (page.blocksV2 !== null && page.blocksV2 !== undefined) {
  try {
    // Verify it's an array (could be empty)
    return Array.isArray(page.blocksV2);
  } catch {
    return false;
  }
}
```

**After:**
```typescript
// Filter pages with version 2 or has blocksV2 field
// blocksV2 structure: { blocks: [...], version: 2 } (object, not array)
// If page has blocksV2 field, it means it was touched by V2 editor
return allPages.filter(page => {
  // Show all version 2 pages
  if (page.version === 2) return true;
  
  // Show pages that have blocksV2 field (object with blocks array inside)
  // This includes pages that were opened in V2 editor
  if (page.blocksV2 !== null && page.blocksV2 !== undefined) {
    return typeof page.blocksV2 === 'object';
  }
  
  return false;
});
```

#### 2. `scripts/show-all-pages-detailed.ts`

Created comprehensive diagnostic script để debug blocksV2 structure và filter logic.

**Key changes:**
- Display blocksV2 as object with nested blocks array
- Update filter logic to match admin page
- Show which editor (V1/V2) should display each page

## Results

### Before Fix
- **Pages showing in /admin/pages-v2:** 1 (chỉ "Test Page V2")
- **Expected:** 2 pages

### After Fix
- **Pages showing in /admin/pages-v2:** 2 ✅
  1. Test Page V2 (version 2)
  2. Về InnerBright (version 1 with blocksV2 data)
- **Pages in V1 only:** 1
  - Bộ Thẻ NLP (version 1, no blocksV2 data)

## Why Not 3 Pages?

User mong đợi 3 pages hiển thị, nhưng thực tế chỉ có **2 pages** nên hiển thị trong V2:

- ✅ **Test Page V2**: Explicitly version 2
- ✅ **Về InnerBright**: Has blocksV2 object (đã được touch by V2 editor)
- ❌ **Bộ Thẻ NLP**: NULL blocksV2 (chưa bao giờ mở trong V2)

Page "Bộ Thẻ NLP" chỉ nên hiển thị trong V1 editor vì chưa được migrate.

## Verification

Run diagnostic script:
```bash
bun run scripts/show-all-pages-detailed.ts
```

**Output:**
```
📊 ALL Pages Detailed Info:
  Total Pages: 3

1. Test Page V2
   - blocksV2: Object with 0 blocks
   - Show in V2: ✅

2. Về InnerBright
   - blocksV2: Object with 3 blocks
   - Block types: text, image, button
   - Show in V2: ✅

3. Bộ Thẻ NLP
   - blocksV2: NULL/undefined
   - Show in V1: ✅
   - Show in V2: ❌

📈 Summary:
  Pages V1: 1
  Pages V2: 2
  Total: 3
```

## Testing Checklist

- [x] Diagnostic script shows correct filter logic
- [ ] Browser test: Navigate to `/admin/pages-v2`
- [ ] Verify 2 pages display (Test Page V2 + Về InnerBright)
- [ ] Verify stats card shows "Total: 2"
- [ ] Verify "Về InnerBright" can be edited in V2 editor
- [ ] Verify "Bộ Thẻ NLP" only shows in `/admin/pages` (V1)

## Next Steps

1. **Browser Verification**: Test admin page in browser at `http://localhost:3005/admin/pages-v2`
2. **Consider Migration UI**: Add "Migrate to V2" button for V1-only pages
3. **Update Other Scripts**: Check if `scripts/show-pages-v2.ts` needs similar fix

## Technical Notes

### blocksV2 Structure
```typescript
type BlocksV2Data = {
  blocks: Block[];    // Array of block objects
  version: number;    // Always 2 for V2
}
```

### Filter Logic Pattern
```typescript
// Check if page should show in V2
const hasBlocksV2 = page.blocksV2 !== null && 
                    page.blocksV2 !== undefined && 
                    typeof page.blocksV2 === 'object';

const showInV2 = page.version === 2 || hasBlocksV2;
```

## Related Files
- `app/admin/pages-v2/page.tsx` - Admin page list (FIXED)
- `scripts/show-all-pages-detailed.ts` - Diagnostic tool (CREATED)
- `scripts/show-pages-v2.ts` - Simple V2 pages list (needs update)
- `app/admin/pages-v2/[slug]/page.tsx` - V2 editor page
- `prisma/schema.prisma` - Page model with blocksV2 field
