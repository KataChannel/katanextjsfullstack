# Merge Pages Management - Tối Ưu Quản Lý Trang

## Tổng Quan
Đã merge thành công `pages-management` và `page-builder-list` thành 1 trang duy nhất với đầy đủ chức năng quản lý cả **Content Pages** và **Visual Builder Pages**.

---

## Thay Đổi Chính

### 1. **Pages Management** - Trang Quản Lý Hợp Nhất
**File**: `/app/admin/pages-management/page.tsx`

#### Tính Năng Mới:
✅ **Filter theo loại trang**:
- Tất cả (All)
- Content Pages (textarea)
- Builder Pages (visual builder)

✅ **Statistics Dashboard** (5 cards):
- Tổng số trang
- Published
- Draft  
- Content Pages
- Builder Pages

✅ **Dual Mode Display**:
- **Content Pages**: Card với icon FileText + actions (Edit, Publish, Delete)
- **Builder Pages**: Card với icon Palette + element count + link to editor

✅ **Smart Actions**:
- Content Pages → Dialog edit inline
- Builder Pages → Link to `/admin/page-builder/{id}`
- Preview button cho Builder Pages

#### UI/UX:
- **Mobile First + Responsive** ✅
- Stats grid: 2 cols mobile → 3 tablet → 5 desktop
- Filter tabs với count numbers
- Preview thumbnail khác nhau cho mỗi type
- Badge phân biệt: Content vs Builder

---

### 2. **Page Builder List** - Redirect
**File**: `/app/admin/page-builder-list/page.tsx`

**Trước**: Server component với full UI
**Sau**: Redirect to `/admin/pages-management`

```typescript
export default function PageBuilderListPage() {
  redirect('/admin/pages-management');
}
```

**Lý do**: Tránh duplicate, merge vào 1 trang quản lý tập trung

---

### 3. **Admin Sidebar** - Clean Menu
**File**: `/components/admin-sidebar.tsx`

**Removed**: "Page Builder List" menu item
**Kept**: 
- "Quản lý Trang" → `/admin/pages-management` (merged view)
- "Page Builder" → `/admin/page-builder` (create new)

---

## Workflow Mới

### Tạo Trang Mới:
1. **Content Page**: Button "Tạo content" → Dialog form → Save
2. **Builder Page**: Button "Page Builder" → Visual editor → Auto save

### Quản Lý:
1. Vào `/admin/pages-management`
2. Chọn filter: All / Content / Builder
3. Xem stats tổng quan
4. Actions theo loại:
   - **Content**: Edit (Dialog), Publish, Delete
   - **Builder**: Edit Builder (link), Preview

### Edit:
- **Content Page**: Click "Sửa" → Dialog mở → Edit → Save
- **Builder Page**: Click "Edit Builder" → `/admin/page-builder/{id}` → Visual edit

---

## Statistics Cards

| Card | Icon | Màu | Data |
|------|------|-----|------|
| Tổng số | BarChart3 | Blue | Total pages |
| Published | Eye | Green | Live pages |
| Draft | Lock | Orange | Unpublished |
| Content | FileText | Purple | Text-based pages |
| Builder | Palette | Pink | Visual builder pages |

---

## Filter Tabs

```
[Tất cả (15)] [Content (8)] [Builder (7)]
```

- Active tab: default variant
- Inactive tab: ghost variant
- Hiển thị count number trong ngoặc

---

## Card Preview

### Content Page Card:
```
┌──────────────────────────────┐
│ [FileText Icon - Green]      │ ← Preview (green gradient)
├──────────────────────────────┤
│ Title: Về chúng tôi          │
│ Slug: /ve-chung-toi          │
│ Badge: [Content] [Live/Draft]│
│ Updated: 11/11/2025          │
├──────────────────────────────┤
│ [Sửa] [👁️/🔒] [Xóa]         │ ← Actions
└──────────────────────────────┘
```

### Builder Page Card:
```
┌──────────────────────────────┐
│    [Palette Icon]            │
│        12                    │ ← Element count
│     Elements                 │ ← Purple gradient
├──────────────────────────────┤
│ Title: Homepage              │
│ Slug: /home                  │
│ Badge: [Builder] [Live/Draft]│
│ Updated: 11/11/2025          │
├──────────────────────────────┤
│ [Edit Builder]      [👁️]    │ ← Links
└──────────────────────────────┘
```

---

## Compliance với rulepromt.txt

✅ **Rule 1**: Code Principal Engineer - Clean, maintainable
✅ **Rule 2**: Clean Architecture - Component separation
✅ **Rule 5**: User Experience - Intuitive filter + stats
✅ **Rule 10**: Mobile First + Responsive
✅ **Rule 11**: Giao diện tiếng Việt 100%
✅ **Rule 12**: Dialog layout: header, scrollable content, footer

---

## Technical Details

### TypeScript Interface:
```typescript
interface Page {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  content?: string;      // Content pages
  blocks?: any;          // Builder pages
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string;
  createdAt: string;
  updatedAt: string;
}

type PageFilter = 'all' | 'content' | 'builder';
```

### Filter Logic:
```typescript
const filteredPages = pages.filter(page => {
  if (filterType === 'all') return true;
  if (filterType === 'content') return !page.blocks;
  if (filterType === 'builder') return !!page.blocks;
  return true;
});
```

### Statistics:
```typescript
const stats = {
  total: pages.length,
  published: pages.filter(p => p.published).length,
  draft: pages.filter(p => !p.published).length,
  content: pages.filter(p => !p.blocks).length,
  builder: pages.filter(p => !!p.blocks).length,
};
```

---

## Performance

- ✅ Single API call: `/api/pages` → Fetch all once
- ✅ Client-side filtering: Instant switch
- ✅ Conditional rendering: Type-based actions
- ✅ Lazy stats calculation: Computed from filtered list

---

## Benefits

### Before (2 Pages):
- 2 separate routes
- Duplicate navigation
- Split management
- Confusion about where to go

### After (1 Page):
- ✅ Single source of truth
- ✅ Unified management
- ✅ Better UX with filters
- ✅ Stats dashboard overview
- ✅ Less maintenance
- ✅ Cleaner navigation

---

## Future Enhancements

1. **Search**: Add search bar filter by title/slug
2. **Bulk Actions**: Select multiple → Publish/Delete
3. **Sort**: By date, title, type
4. **Export**: Export list to CSV/JSON
5. **Preview Modal**: Quick preview without leaving page

---

**Status**: ✅ Hoàn thành
**TypeScript**: ✅ No errors
**Responsive**: ✅ Mobile First
**Compliance**: ✅ rulepromt.txt
