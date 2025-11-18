# Homepage Status Report

**Date:** 2025-11-17  
**URL:** http://localhost:3005/  
**Current Status:** Using Custom Homepage (Page)

---

## 🏠 Current Homepage Configuration

### SEO Settings
```
Domain: innerbright.vn
Homepage Type: page
Homepage ID: 4a83da73-fdf0-467a-be5e-8906ee05c18c
Selected Page: "Về InnerBright" (ve-innerbright)
```

### Render Flow

```
Request: GET /
    ↓
app/(public)/page.tsx
    ↓
Check seoSettings.homePageType & homePageId
    ↓
homePageType = "page" ✓
homePageId = "4a83da73-fdf0-467a-be5e-8906ee05c18c" ✓
    ↓
Fetch page from database
    ↓
Page: "Về InnerBright"
    - Version: 1 (legacy)
    - blocks (V1): YES
    - blocksV2: Object with 3 blocks (text, image, button)
    - Published: ✅
    ↓
Render: <CustomHomePage content={page} type="page" />
```

---

## 📄 Page Details: "Về InnerBright"

**Metadata:**
- **ID:** 4a83da73-fdf0-467a-be5e-8906ee05c18c
- **Slug:** ve-innerbright
- **Version:** 1 (Legacy format)
- **Author:** Admin
- **Created:** 13/11/2025
- **Updated:** 17/11/2025
- **Published:** ✅ Yes

**Content Structure:**
- **blocks (V1):** YES (Legacy blocks format)
- **blocksV2:** Object with 3 blocks
  - Block 1: text
  - Block 2: image
  - Block 3: button

**Compatibility:**
- Show in V1 Editor: ❌ (has blocksV2 data)
- Show in V2 Editor: ✅ (has blocksV2 structure)

---

## 🎨 Rendering Component: CustomHomePage

**File:** `/components/custom-homepage.tsx`

### Component Logic

```typescript
export function CustomHomePage({ content, type }: CustomHomePageProps) {
  // Determine content format
  const hasBlocks = content.blocks && typeof content.blocks === 'object';
  const isPageBuilder = hasBlocks && (content.blocks.elements || content.blocks.canvas);
  const isLegacyBlocks = hasBlocks && Array.isArray(content.blocks);

  // Render based on format:
  if (isPageBuilder) {
    return <PageBuilderRenderer blocks={content.blocks} />
  } else if (isLegacyBlocks) {
    return <PageBlocksRenderer blocks={content.blocks} />
  } else {
    return <div dangerouslySetInnerHTML={{ __html: content.content }} />
  }
}
```

### For "Về InnerBright":

**Detection:**
- `hasBlocks`: TRUE (content.blocks exists and is object)
- `isPageBuilder`: FALSE (no `elements` or `canvas` properties)
- `isLegacyBlocks`: Depends on if `content.blocks` is array

**Likely Rendering:**
Since page has `blocksV2` with structure like `{ blocks: [...] }`, it will check:
1. If `blocks.elements` exists → PageBuilder format
2. If `blocks` is array → Legacy blocks format
3. Else → Raw HTML content

**Current blocksV2 structure:**
```javascript
{
  blocks: [
    { type: "text", ... },
    { type: "image", ... },
    { type: "button", ... }
  ],
  version: 2
}
```

This suggests it's using **V2 Block Editor format** (not PageBuilder, not Legacy).

---

## 🔍 Actual Rendering Path

Based on blocksV2 structure, the page is using:

**✅ V2 Block Editor Format**

The `CustomHomePage` component will render using one of these:
- `PageBuilderRenderer` - if blocks have elements/canvas structure
- `PageBlocksRenderer` - if blocks is simple array
- Raw HTML - fallback

Since blocksV2 has `{ blocks: [...], version: 2 }` structure, it needs proper renderer.

**However**, `CustomHomePage` might not be handling V2 format correctly!

### Potential Issue:

The page data being passed might be from `page.blocks` (V1) not `page.blocksV2`.

Let me check what's actually being passed:

```typescript
// app/(public)/page.tsx
const page = await prisma.page.findUnique({
  where: { id: seoSettings.homePageId },
  include: {
    author: { ... }
  }
});

// This returns BOTH:
// - page.blocks (V1 legacy)
// - page.blocksV2 (V2 new format)

return <CustomHomePage content={page} type="page" />;
```

**Problem:** `CustomHomePage` receives `page.blocks` (V1) not `page.blocksV2`!

---

## 🐛 Issue Identified

**Current behavior:**
- Page "Về InnerBright" has both `blocks` (V1) and `blocksV2` (V2 format)
- `CustomHomePage` component checks `content.blocks` (V1 legacy)
- It doesn't check `content.blocksV2` at all!

**Result:**
Homepage is rendering using **V1 legacy blocks format**, not the new V2 blocks with 3 items (text, image, button).

---

## ✅ What's Actually Showing

Based on the code analysis, http://localhost:3005/ is currently showing:

1. **Header Section** (from CustomHomePage):
   - Title: "Về InnerBright"
   - Author: "Admin"
   - Date: "17/11/2025"

2. **Content Section**:
   - Rendering `page.blocks` (V1 legacy format)
   - Using either:
     - `PageBlocksRenderer` if blocks is array
     - Raw HTML if blocks is string/null

3. **NOT showing**:
   - The new blocksV2 data (3 blocks: text, image, button)
   - V2 page builder content

---

## 📋 Summary

| Aspect | Status | Details |
|--------|--------|---------|
| **Homepage Type** | ✅ Custom Page | Set via SEO settings |
| **Selected Page** | ✅ "Về InnerBright" | ID: 4a83da73-fdf0-467a-be5e-8906ee05c18c |
| **Page Version** | ⚠️ V1 (Legacy) | Has both blocks & blocksV2 |
| **Rendering Component** | ✅ CustomHomePage | `/components/custom-homepage.tsx` |
| **Content Source** | ⚠️ `page.blocks` (V1) | Should use `page.blocksV2` |
| **V2 Blocks** | ❌ Not Rendered | 3 blocks exist but not used |

---

## 🔧 Recommendation

To properly render V2 blocks on homepage, need to update `CustomHomePage` component to:

1. **Priority check blocksV2 first:**
   ```typescript
   const hasBlocksV2 = content.blocksV2 && typeof content.blocksV2 === 'object';
   const hasBlocksV1 = content.blocks && typeof content.blocks === 'object';
   
   if (hasBlocksV2) {
     // Render V2 format
   } else if (hasBlocksV1) {
     // Fallback to V1 format
   }
   ```

2. **Add V2 Block Renderer:**
   - Import `FrontendBlockRenderer` from `/components/block-editor/`
   - Render `blocksV2.blocks` array properly

3. **Test with current page:**
   - Should show 3 blocks: text, image, button
   - V2 block editor styles and layout

---

## 🎯 Current Code Location

**Main Files:**
- `/app/(public)/page.tsx` - Homepage route
- `/components/custom-homepage.tsx` - Rendering component
- `/components/block-editor/FrontendBlockRenderer.tsx` - V2 block renderer

**Database:**
- Table: `Page`
- Record: "Về InnerBright"
- Fields: `blocks` (V1), `blocksV2` (V2 with 3 blocks)

**Settings:**
- Table: `SeoSettings`
- Domain: `innerbright.vn`
- Fields: `homePageType: "page"`, `homePageId: "4a83da73..."`
