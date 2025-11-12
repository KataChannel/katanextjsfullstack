# Fix Page Builder Elements Loss After F5 (Next.js Caching Issue)

## 🐛 Bug Report

**Symptoms**:
- User thêm heading và text vào Page Builder
- Click Save → Success toast
- PUT request → 200 OK
- F5 refresh page → Elements biến mất

**URL**: `/admin/page-builder/4a83da73-fdf0-467a-be5e-8906ee05c18c`
**Domain**: innerbright.vn
**Database**: innerv2core

## 🔍 Root Cause Analysis

### Investigation Steps

#### 1. Check if data was saved
```bash
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:13003/innerv2core" \
bun scripts/check-page-blocks.ts 4a83da73-fdf0-467a-be5e-8906ee05c18c
```

**Result**: ✅ Data WAS saved correctly!
```
✅ Page found:
   ID: 4a83da73-fdf0-467a-be5e-8906ee05c18c
   Title: Về InnerBright
   Updated: 2025-11-12T19:54:32.860Z

🧩 Elements at root: 7 elements
     1. text-1762977214807 (text)
     2. text-1762977234335 (text)
     3. text-1762977269670 (text)
     4. heading-1762977214279 (heading)
     5. heading-1762977233871 (heading)
     6. heading-1762977269229 (heading)
     7. container-1762977212936 (container)
```

#### 2. Check data format
- ✅ Both `blocks.elements` and `blocks.canvas.elements` exist
- ✅ Format: Object (correct for store)
- ✅ Count: 7 elements in both locations
- ✅ Canvas settings: zoom, gridSize, snapToGrid all saved

#### 3. API Logs Analysis
```
[Proxy] Hostname: localhost:3005 -> Domain: innerbright.vn
PUT /api/pages/4a83da73-fdf0-467a-be5e-8906ee05c18c 200 in 44ms
```
- ✅ Correct domain routing
- ✅ Multi-domain working
- ✅ 200 OK response

### Root Cause: **Next.js Server Component Caching**

File `/app/admin/page-builder/[id]/page.tsx` là Server Component:
- Next.js caches server components by default
- Khi user F5, Next.js serve cached version
- Cached version có old data (trước khi user thêm elements)
- Mặc dù database đã được update, UI vẫn show cached data

## ✅ Solution

### Fix: Force Dynamic Rendering

**File**: `/app/admin/page-builder/[id]/page.tsx`

Add these export constants:
```typescript
// Force dynamic rendering to avoid caching issues
export const dynamic = 'force-dynamic';
export const revalidate = 0;
```

**Why this works**:
- `dynamic = 'force-dynamic'` → Disable static optimization
- `revalidate = 0` → Disable caching completely
- Every request fetches fresh data from database
- No stale data issues

## 📊 Before vs After

### Before (Broken)
```
1. User adds elements → Save → Success
2. Database updated ✅
3. User hits F5
4. Next.js returns cached page (no elements) ❌
5. Elements disappear
```

### After (Fixed)
```
1. User adds elements → Save → Success
2. Database updated ✅
3. User hits F5
4. Next.js fetches fresh data from database ✅
5. Elements appear correctly ✅
```

## 🧪 Testing

### Test Case 1: Add Elements
1. Navigate to `/admin/page-builder/4a83da73-fdf0-467a-be5e-8906ee05c18c`
2. Add heading + text
3. Click Save
4. Hit F5
5. **Expected**: Elements should still be visible ✅

### Test Case 2: Edit Elements
1. Edit existing element
2. Save
3. F5
4. **Expected**: Changes should persist ✅

### Test Case 3: Delete Elements
1. Delete some elements
2. Save
3. F5
4. **Expected**: Deleted elements should stay deleted ✅

### Verify Data in Database
```bash
# Check current data
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:13003/innerv2core" \
bun scripts/check-page-blocks.ts 4a83da73-fdf0-467a-be5e-8906ee05c18c

# Should show:
# ✅ Page found
# 🧩 Elements: 7 elements
# 🎨 Canvas settings: all correct
```

## 🔧 Additional Improvements

### 1. Added Debug Logging

**API Route**: `/app/api/pages/[id]/route.ts`

#### GET (Load)
```typescript
if (page.blocks) {
  const blocks = page.blocks as any;
  console.log('📂 Loading page blocks:', {
    pageId: id,
    hasCanvas: !!blocks.canvas,
    hasElements: !!blocks.elements,
    hasCanvasElements: !!blocks.canvas?.elements,
    elementsCount: blocks.elements 
      ? (Array.isArray(blocks.elements) 
        ? blocks.elements.length 
        : Object.keys(blocks.elements).length)
      : 0,
  });
}
```

#### PUT/PATCH (Save)
```typescript
if (validatedData.blocks) {
  console.log('📦 Updating page blocks:', {
    pageId: id,
    hasCanvas: !!validatedData.blocks.canvas,
    hasElements: !!validatedData.blocks.elements,
    hasCanvasElements: !!validatedData.blocks.canvas?.elements,
    elementsCount: validatedData.blocks.elements 
      ? Object.keys(validatedData.blocks.elements).length 
      : 0,
  });
}
```

### 2. Created Debug Scripts

**New Scripts**:
- `/scripts/check-page-blocks.ts` - Check detailed blocks data
- Already existed: `/scripts/check-page-builder-data.ts`

**Usage**:
```bash
# Check specific page
bun scripts/check-page-blocks.ts <page-id>

# Check all pages with blocks
bun scripts/check-page-builder-data.ts

# Check across all domains
bun scripts/find-page-across-domains.ts <page-id>
```

## 📝 Key Learnings

### 1. Next.js Caching Behavior
- Server Components are cached by default in production
- Need explicit opt-out for dynamic data
- Use `dynamic = 'force-dynamic'` for pages that always need fresh data

### 2. Multi-Domain Debugging
- Always check correct database using DATABASE_URL override
- innerbright.vn → innerv2core database
- tazaskin.com → tazaskinclinic database
- Use proxy logs to verify domain routing

### 3. Data Persistence Verification
- Don't assume save failed just because UI doesn't update
- Always verify in database directly
- API success !== UI update (due to caching)

### 4. Debug Tools Are Essential
- Create scripts to inspect database state
- Add logging to APIs for better visibility
- Test with actual database connections

## 🎯 Related Issues

This is similar to but different from:
- [29-FIX_PAGE_BUILDER_ELEMENTS_LOSS.md](./29-FIX_PAGE_BUILDER_ELEMENTS_LOSS.md) - Array/Object format issue
- [32-FIX_PAGE_BUILDER_404.md](./32-FIX_PAGE_BUILDER_404.md) - Multi-domain routing issue

**Differences**:
- Issue #29: Data format mismatch (array vs object)
- Issue #32: Page not found (wrong database)
- **This issue**: Next.js caching problem

## ✅ Status

- ✅ Root cause identified (Next.js Server Component caching)
- ✅ Fix implemented (`dynamic = 'force-dynamic'`)
- ✅ Debug logging added
- ✅ Verified data exists in database (7 elements)
- ✅ Multi-domain routing working correctly
- ✅ Ready for testing

## 📁 Files Changed

- `/app/admin/page-builder/[id]/page.tsx` - Added dynamic rendering
- `/app/api/pages/[id]/route.ts` - Added debug logging
- `/scripts/check-page-blocks.ts` - NEW: Detailed blocks checker
- `/docs/33-FIX_PAGE_BUILDER_CACHING.md` - This documentation

---

**Updated**: 2024-11-13
**Status**: ✅ Fixed - Ready for Testing
**Database**: innerv2core (innerbright.vn)
**Page ID**: 4a83da73-fdf0-467a-be5e-8906ee05c18c
