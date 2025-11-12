# Fix 404 Page Builder Not Found

## 🐛 Bug Report

**URL**: `/admin/page-builder/4a83da73-fdf0-467a-be5e-8906ee05c18c`
**Status**: 404 Not Found
**Issue**: Page Builder không tồn tại trong database

## 🔍 Root Cause Analysis

### 1. Page không tồn tại
Kiểm tra tất cả 6 domains:
```bash
bun scripts/find-page-across-domains.ts 4a83da73-fdf0-467a-be5e-8906ee05c18c
```

**Result**: Page ID `4a83da73-fdf0-467a-be5e-8906ee05c18c` **KHÔNG TỒN TẠI** trong bất kỳ database nào.

### 2. Possible Causes

#### A. Page chưa được tạo thành công
- User tạo page builder mới
- API `/api/pages` fail (validation, slug duplicate, etc.)
- Frontend vẫn redirect với ID không đúng

#### B. Page đã bị xóa
- Page đã được tạo trước đó
- User hoặc system đã xóa
- Link cũ vẫn còn

#### C. Multi-domain issue
- Page được tạo ở domain khác
- User đang truy cập từ domain sai
- **Fixed**: Đã update code dùng `getPrisma()` cho multi-domain support

## ✅ Fixes Implemented

### 1. Multi-Domain Support
**File**: `/app/admin/page-builder/[id]/page.tsx`

**Before**:
```typescript
import { prisma } from '@/lib/prisma';
const page = await prisma.page.findUnique({ where: { id } });
```

**After**:
```typescript
import { getPrisma } from '@/lib/prisma';
const prisma = await getPrisma();
const page = await prisma.page.findUnique({ where: { id } });
```

### 2. Custom 404 Page
**File**: `/app/admin/page-builder/[id]/not-found.tsx`

Features:
- ✅ Clear error message
- ✅ Helpful suggestions (multi-domain tip)
- ✅ Quick actions:
  - Back to content list
  - Create new page builder
- ✅ Better UX than default 404

### 3. Search Tool
**File**: `/scripts/find-page-across-domains.ts`

Usage:
```bash
bun scripts/find-page-across-domains.ts <page-id>
```

Features:
- Search across all 6 domains
- Show page details if found
- Show which domain owns the page
- Correct database credentials

## 📊 Current State

### Existing Page Builders

```bash
bun scripts/check-page-builder-data.ts
```

Found 4 pages:
1. **c2bdfc56-e2e3-4931-a854-47d08a60db98** - Landing Page Demo
2. **22c92adb-7763-4792-8805-d1b96f12764a** - Pricing Demo
3. **62797eb9-415c-4d15-b38c-16a9219370b6** - Contact Demo
4. **18d4a799-7ac5-4390-9ac1-ed042aa5de1e** - Page Builder 1

**Valid URLs**:
- `/admin/page-builder/c2bdfc56-e2e3-4931-a854-47d08a60db98`
- `/admin/page-builder/22c92adb-7763-4792-8805-d1b96f12764a`
- `/admin/page-builder/62797eb9-415c-4d15-b38c-16a9219370b6`
- `/admin/page-builder/18d4a799-7ac5-4390-9ac1-ed042aa5de1e`

## 🧪 Testing

### Test Multi-Domain Fix
1. Visit valid page builder URL
2. Should load correctly from database
3. Should work across domains

### Test 404 Page
1. Visit `/admin/page-builder/invalid-id`
2. Should show custom 404 page
3. Should have "Back to list" button
4. Should have "Create new" button

### Test Search Tool
```bash
# Search existing page
bun scripts/find-page-across-domains.ts c2bdfc56-e2e3-4931-a854-47d08a60db98

# Should output:
# ✅ Found in domain: tazagroup
#    Title: Landing Page Demo
#    Slug: landing-page-demo
#    Published: true
```

## 🎯 User Action Required

Since page `4a83da73-fdf0-467a-be5e-8906ee05c18c` doesn't exist, user should:

### Option 1: Create New Page Builder
```
1. Go to /admin/content
2. Click "Tạo mới" button
3. Select "Page Builder"
4. Fill in Title & Slug
5. Save to create new page builder
```

### Option 2: Use Existing Page Builder
Valid page builders:
- Landing Page Demo: `/admin/page-builder/c2bdfc56-e2e3-4931-a854-47d08a60db98`
- Pricing Demo: `/admin/page-builder/22c92adb-7763-4792-8805-d1b96f12764a`
- Contact Demo: `/admin/page-builder/62797eb9-415c-4d15-b38c-16a9219370b6`
- Page Builder 1: `/admin/page-builder/18d4a799-7ac5-4390-9ac1-ed042aa5de1e`

## 🔄 Prevention

To prevent future 404s:

### 1. Better Error Handling
Add error handling in content creation:

```typescript
// In /admin/content/[id]/page.tsx - handleSave()
try {
  const res = await fetch(endpoint, {...});
  
  if (!res.ok) {
    const errorData = await res.json();
    toast.error(errorData.error || "Failed to create");
    setSaving(false);
    return; // Don't redirect if failed
  }
  
  const result = await res.json();
  const newId = result.data?.id || result.id;
  
  if (!newId) {
    toast.error("No ID returned from API");
    setSaving(false);
    return;
  }
  
  // Only redirect if we have valid ID
  router.push(`/admin/page-builder/${newId}`);
} catch (error) {
  toast.error("Network error");
  setSaving(false);
}
```

### 2. Validate Before Redirect
```typescript
// Verify page was created before redirecting
const verifyRes = await fetch(`/api/pages/${newId}`);
if (verifyRes.ok) {
  router.push(`/admin/page-builder/${newId}`);
} else {
  toast.error("Page created but not found");
}
```

### 3. Add Logging
```typescript
console.log('Creating page with data:', dataToSend);
console.log('Response:', result);
console.log('New ID:', newId);
```

## 📝 Related Files

- `/app/admin/page-builder/[id]/page.tsx` - Main page builder page
- `/app/admin/page-builder/[id]/not-found.tsx` - Custom 404 page
- `/app/admin/content/[id]/page.tsx` - Content creation logic
- `/app/api/pages/route.ts` - Pages API endpoint
- `/scripts/find-page-across-domains.ts` - Search tool
- `/scripts/check-page-builder-data.ts` - Check tool

## 🎓 Lessons Learned

1. ✅ Always use `getPrisma()` for multi-domain support
2. ✅ Create custom 404 pages for better UX
3. ✅ Validate page creation before redirecting
4. ✅ Add search tools for debugging
5. ✅ Log errors properly in API endpoints
6. ✅ Don't redirect on API errors

## ✅ Status

- ✅ Multi-domain support fixed
- ✅ Custom 404 page created
- ✅ Search tool created
- ✅ Root cause identified
- ⚠️ User needs to create new page builder (old ID doesn't exist)

---

**Updated**: 2024-11-13
**Status**: Fixed & Documented
