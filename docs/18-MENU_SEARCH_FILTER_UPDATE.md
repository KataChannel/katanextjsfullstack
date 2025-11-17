# Cập nhật Tìm kiếm, Sắp xếp, Lọc - Admin Menus

## 📋 Tổng quan

Cập nhật trang `/admin/menus` với tính năng:
- **Tìm kiếm** theo tên menu và URL
- **Sắp xếp** theo thứ tự, tên, ngày tạo
- **Lọc** theo vị trí menu và trạng thái hiển thị
- **Mobile First** responsive design
- **Shadcn UI** Combobox components

## 🎯 Mục tiêu

1. ✅ Tìm kiếm nhanh menu theo tên/URL
2. ✅ Sắp xếp linh hoạt 6 kiểu khác nhau
3. ✅ Lọc theo vị trí (Header/Footer/Admin/Sidebar)
4. ✅ Lọc theo trạng thái (Hiển thị/Ẩn)
5. ✅ Responsive Mobile First
6. ✅ Sử dụng Combobox thay vì Select
7. ✅ Vietnamese UI hoàn toàn
8. ✅ Empty state khi không có kết quả

## 📦 File cập nhật

### `/app/admin/menus/page.tsx`

**Thay đổi chính:**

#### 1. Import thêm `useMemo`, `Search`, `X` icons
```tsx
import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, Menu as MenuIcon, Eye, EyeOff, ArrowUp, ArrowDown, Search, X } from "lucide-react";
```

#### 2. Thêm interface `createdAt`, `updatedAt`
```tsx
interface Menu {
  id: string;
  label: string;
  url: string;
  icon?: string | null;
  order: number;
  published: boolean;
  position: string;
  parentId?: string | null;
  parent?: Menu | null;
  children?: Menu[];
  createdAt?: string;  // ✅ NEW
  updatedAt?: string;  // ✅ NEW
}
```

#### 3. Thêm constants cho Sort và Filter
```tsx
const SORT_OPTIONS = [
  { value: "order-asc", label: "Thứ tự: Tăng dần" },
  { value: "order-desc", label: "Thứ tự: Giảm dần" },
  { value: "label-asc", label: "Tên: A → Z" },
  { value: "label-desc", label: "Tên: Z → A" },
  { value: "created-desc", label: "Mới nhất" },
  { value: "created-asc", label: "Cũ nhất" },
];

const FILTER_POSITION_OPTIONS = [
  { value: "ALL", label: "Tất cả vị trí" },
  { value: "HEADER", label: "Header" },
  { value: "FOOTER", label: "Footer" },
  { value: "ADMIN", label: "Admin Sidebar" },
  { value: "SIDEBAR", label: "Sidebar phụ" },
];

const FILTER_PUBLISHED_OPTIONS = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "PUBLISHED", label: "Đã hiển thị" },
  { value: "DRAFT", label: "Đã ẩn" },
];
```

#### 4. Thêm state cho Search, Sort, Filter
```tsx
// Search, Sort, Filter states
const [searchQuery, setSearchQuery] = useState("");
const [sortBy, setSortBy] = useState("order-asc");
const [filterPosition, setFilterPosition] = useState("ALL");
const [filterPublished, setFilterPublished] = useState("ALL");
```

#### 5. Logic Filter và Sort với `useMemo`
```tsx
const filteredAndSortedMenus = useMemo(() => {
  let result = [...menus];

  // Search filter
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    result = result.filter(
      (menu) =>
        menu.label.toLowerCase().includes(query) ||
        menu.url.toLowerCase().includes(query)
    );
  }

  // Position filter
  if (filterPosition !== "ALL") {
    result = result.filter((menu) => menu.position === filterPosition);
  }

  // Published filter
  if (filterPublished !== "ALL") {
    result = result.filter((menu) =>
      filterPublished === "PUBLISHED" ? menu.published : !menu.published
    );
  }

  // Sort
  result.sort((a, b) => {
    switch (sortBy) {
      case "order-asc":
        return a.order - b.order;
      case "order-desc":
        return b.order - a.order;
      case "label-asc":
        return a.label.localeCompare(b.label, "vi");
      case "label-desc":
        return b.label.localeCompare(a.label, "vi");
      case "created-desc":
        return new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime();
      case "created-asc":
        return new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime();
      default:
        return a.order - b.order;
    }
  });

  return result;
}, [menus, searchQuery, sortBy, filterPosition, filterPublished]);
```

#### 6. Helper functions
```tsx
const handleClearFilters = () => {
  setSearchQuery("");
  setSortBy("order-asc");
  setFilterPosition("ALL");
  setFilterPublished("ALL");
};

const hasActiveFilters = searchQuery || sortBy !== "order-asc" || filterPosition !== "ALL" || filterPublished !== "ALL";
```

#### 7. UI Layout cập nhật

**CardHeader với Search, Sort, Filter:**
```tsx
<CardHeader className="border-b sticky top-0 bg-background z-10">
  <div className="flex flex-col gap-4">
    {/* Title and Button */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <CardTitle className="flex items-center gap-2">
          <MenuIcon className="h-6 w-6" />
          Quản lý Menu
        </CardTitle>
        <CardDescription className="mt-1">
          Thêm, sửa, xóa menu của website
        </CardDescription>
      </div>
      <div className="flex items-center gap-2">
        <Button onClick={() => handleOpenDialog()} className="flex-1 sm:flex-none">
          <Plus className="h-4 w-4 mr-2" />
          Thêm menu
        </Button>
        <Badge variant="outline">
          {filteredAndSortedMenus.length}/{menus.length}
        </Badge>
      </div>
    </div>

    {/* Search Bar */}
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <Input
        placeholder="Tìm kiếm theo tên hoặc URL..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="pl-9 pr-9"
      />
      {searchQuery && (
        <Button
          variant="ghost"
          size="icon"
          className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
          onClick={() => setSearchQuery("")}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>

    {/* Sort and Filter Controls */}
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Sắp xếp</Label>
        <Combobox
          options={SORT_OPTIONS}
          value={sortBy}
          onValueChange={setSortBy}
          placeholder="Sắp xếp theo..."
          searchPlaceholder="Tìm kiểu sắp xếp..."
          emptyText="Không tìm thấy"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Vị trí</Label>
        <Combobox
          options={FILTER_POSITION_OPTIONS}
          value={filterPosition}
          onValueChange={setFilterPosition}
          placeholder="Lọc theo vị trí..."
          searchPlaceholder="Tìm vị trí..."
          emptyText="Không tìm thấy"
        />
      </div>

      <div className="space-y-1">
        <Label className="text-xs text-muted-foreground">Trạng thái</Label>
        <Combobox
          options={FILTER_PUBLISHED_OPTIONS}
          value={filterPublished}
          onValueChange={setFilterPublished}
          placeholder="Lọc theo trạng thái..."
          searchPlaceholder="Tìm trạng thái..."
          emptyText="Không tìm thấy"
        />
      </div>
    </div>

    {/* Clear Filters Button */}
    {hasActiveFilters && (
      <div className="flex justify-end">
        <Button variant="outline" size="sm" onClick={handleClearFilters}>
          <X className="h-4 w-4 mr-2" />
          Xóa bộ lọc
        </Button>
      </div>
    )}
  </div>
</CardHeader>
```

**Empty State khi không có kết quả:**
```tsx
<CardContent className="p-0">
  {filteredAndSortedMenus.length === 0 ? (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <MenuIcon className="h-12 w-12 text-muted-foreground mb-4" />
      <p className="text-lg font-medium">Không tìm thấy menu</p>
      <p className="text-sm text-muted-foreground mt-1">
        {hasActiveFilters
          ? "Thử điều chỉnh bộ lọc hoặc tìm kiếm"
          : "Bắt đầu bằng cách thêm menu mới"}
      </p>
      {hasActiveFilters && (
        <Button variant="outline" size="sm" onClick={handleClearFilters} className="mt-4">
          <X className="h-4 w-4 mr-2" />
          Xóa bộ lọc
        </Button>
      )}
    </div>
  ) : (
    <div className="overflow-x-auto">
      <table className="w-full">
        {/* Table content */}
      </table>
    </div>
  )}
</CardContent>
```

**Badge hiển thị số lượng:**
```tsx
<Badge variant="outline">
  {filteredAndSortedMenus.length}/{menus.length}
</Badge>
```

**Table sử dụng `filteredAndSortedMenus`:**
```tsx
{filteredAndSortedMenus.map((menu, index) => (
  <tr key={menu.id} className="hover:bg-muted/30">
    {/* Row content */}
  </tr>
))}
```

## 🎨 Features

### 1. Tìm kiếm (Search)
- Input với icon Search bên trái
- Nút X clear bên phải (chỉ hiện khi có text)
- Tìm theo `label` và `url` (case-insensitive)
- Real-time filtering

### 2. Sắp xếp (Sort)
6 kiểu sắp xếp:
- **Thứ tự: Tăng dần** (`order-asc`) - Default
- **Thứ tự: Giảm dần** (`order-desc`)
- **Tên: A → Z** (`label-asc`)
- **Tên: Z → A** (`label-desc`)
- **Mới nhất** (`created-desc`)
- **Cũ nhất** (`created-asc`)

### 3. Lọc theo Vị trí (Filter Position)
- Tất cả vị trí (ALL) - Default
- Header
- Footer
- Admin Sidebar
- Sidebar phụ

### 4. Lọc theo Trạng thái (Filter Published)
- Tất cả trạng thái (ALL) - Default
- Đã hiển thị (PUBLISHED)
- Đã ẩn (DRAFT)

### 5. Clear Filters
- Nút "Xóa bộ lọc" chỉ hiện khi có filter active
- Reset tất cả về default:
  - searchQuery = ""
  - sortBy = "order-asc"
  - filterPosition = "ALL"
  - filterPublished = "ALL"

### 6. Empty State
- Hiển thị khi không có menu hoặc không có kết quả
- Icon + Message động:
  - Có filter: "Thử điều chỉnh bộ lọc hoặc tìm kiếm"
  - Không có filter: "Bắt đầu bằng cách thêm menu mới"
- Nút Clear Filters nếu có filter active

### 7. Badge Counter
- Hiển thị `{filtered}/{total}` menus
- Ví dụ: `5/20` khi filter

## 📱 Responsive Design

### Mobile (< 640px)
```tsx
// Title và Button stacked
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

// Button full width trên mobile
<Button className="flex-1 sm:flex-none">

// Sort/Filter grid 1 cột
<div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
```

### Tablet/Desktop (≥ 640px)
- Title và Button ngang hàng
- Sort/Filter grid 3 cột
- Table scroll horizontal nếu cần

## 🎯 Performance Optimization

### useMemo Hook
```tsx
const filteredAndSortedMenus = useMemo(() => {
  // Logic here
}, [menus, searchQuery, sortBy, filterPosition, filterPublished]);
```

**Lý do:**
- Tránh re-calculate mỗi lần render
- Chỉ re-calculate khi dependencies thay đổi
- Tối ưu với danh sách menu lớn

### Locale Compare
```tsx
a.label.localeCompare(b.label, "vi")
```
- Sắp xếp đúng với tiếng Việt
- Xử lý dấu thanh, dấu sắc chính xác

## 🧪 Cách sử dụng

### 1. Tìm kiếm menu
```
Nhập: "trang"
Kết quả: "Trang chủ", "Trang liên hệ", "Trang giới thiệu"
```

### 2. Sắp xếp
```
Chọn: "Tên: A → Z"
Kết quả: Menus sắp xếp theo alphabet
```

### 3. Lọc vị trí
```
Chọn: "Admin Sidebar"
Kết quả: Chỉ hiển thị menu position = ADMIN
```

### 4. Lọc trạng thái
```
Chọn: "Đã ẩn"
Kết quả: Chỉ hiển thị menu published = false
```

### 5. Kết hợp filters
```
Search: "dashboard"
Sort: "Mới nhất"
Position: "Admin Sidebar"
Published: "Đã hiển thị"

Kết quả: Menu "Dashboard" trong Admin Sidebar, đang hiển thị, mới nhất
```

### 6. Xóa bộ lọc
```
Click "Xóa bộ lọc"
Kết quả: Hiển thị tất cả menus, sắp xếp theo order-asc
```

## 🎨 Design Principles (theo rulepromt.txt)

### ✅ 1. Clean Architecture
- Logic tách biệt: Search/Sort/Filter trong `useMemo`
- Helper functions: `handleClearFilters`, `hasActiveFilters`
- Constants: `SORT_OPTIONS`, `FILTER_POSITION_OPTIONS`

### ✅ 2. Performance Optimizations
- `useMemo` cho filtered data
- Debounce không cần (search ngay lập tức OK với client-side)
- Locale compare cho tiếng Việt

### ✅ 3. Mobile First + Responsive
```tsx
// Mobile: 1 column, stacked
grid-cols-1 sm:grid-cols-3
flex-col sm:flex-row
flex-1 sm:flex-none
```

### ✅ 4. Shadcn UI Components
- `Input` cho search
- `Combobox` cho sort/filter (KHÔNG dùng Select)
- `Button` cho actions
- `Badge` cho counters
- `Label` cho field labels

### ✅ 5. All Select → Combobox
```tsx
<Combobox
  options={SORT_OPTIONS}
  value={sortBy}
  onValueChange={setSortBy}
  placeholder="Sắp xếp theo..."
  searchPlaceholder="Tìm kiểu sắp xếp..."
  emptyText="Không tìm thấy"
/>
```

### ✅ 6. Dialog Layout
- CardHeader: Sticky top, contain filters
- CardContent: Scrollable table
- Empty state: Centered, với icon

### ✅ 7. Vietnamese UI
- Tất cả text tiếng Việt
- Placeholder: "Tìm kiếm theo tên hoặc URL..."
- Labels: "Sắp xếp", "Vị trí", "Trạng thái"
- Empty message: "Không tìm thấy menu"

### ✅ 8. No Testing, No Git
- Chỉ code production
- Không tạo test files

### ✅ 9. Single .md Summary
- File này: `MENU_SEARCH_FILTER_UPDATE.md`

## 📊 Example Scenarios

### Scenario 1: Quản lý Admin Menu
```
1. Chọn Position: "Admin Sidebar"
2. Sort: "Thứ tự: Tăng dần"
Kết quả: 11 admin menus theo thứ tự 1-11
```

### Scenario 2: Tìm menu bị ẩn
```
1. Chọn Published: "Đã ẩn"
2. Search: (để trống)
Kết quả: Tất cả menus đang ẩn
```

### Scenario 3: Tìm menu Footer cũ nhất
```
1. Position: "Footer"
2. Sort: "Cũ nhất"
Kết quả: Footer menus, sắp xếp theo createdAt tăng dần
```

### Scenario 4: Debug menu sai URL
```
1. Search: "/admin"
2. Position: "Tất cả"
Kết quả: Tất cả menus có "/admin" trong URL
```

## 🔍 Technical Details

### Filter Logic
```tsx
// Search: OR condition (label OR url)
menu.label.toLowerCase().includes(query) ||
menu.url.toLowerCase().includes(query)

// Position: Exact match
menu.position === filterPosition

// Published: Boolean check
filterPublished === "PUBLISHED" ? menu.published : !menu.published
```

### Sort Logic
```tsx
// String compare với locale
a.label.localeCompare(b.label, "vi")

// Number compare
a.order - b.order

// Date compare
new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
```

### Active Filters Detection
```tsx
const hasActiveFilters = 
  searchQuery || 
  sortBy !== "order-asc" || 
  filterPosition !== "ALL" || 
  filterPublished !== "ALL";
```

## 🎯 Benefits

### 1. User Experience
- Tìm menu nhanh chóng
- Sắp xếp linh hoạt theo nhu cầu
- Lọc chính xác theo vị trí/trạng thái
- Empty state rõ ràng

### 2. Admin Productivity
- Quản lý nhiều menus dễ dàng
- Debug menu issues nhanh
- Reorder theo nhiều tiêu chí
- Clear filters một click

### 3. Performance
- Client-side filtering (no API calls)
- Memoized results
- Smooth UX

### 4. Responsive
- Mobile-friendly controls
- Touch-optimized buttons
- Stacked layout trên mobile

## 🚀 Future Enhancements

### 1. Advanced Filters
- Filter by icon có/không
- Filter by parent menu
- Multiple position filter

### 2. Bulk Actions
- Select multiple menus
- Bulk publish/unpublish
- Bulk delete
- Bulk reorder

### 3. Export/Import
- Export filtered menus to JSON
- Import menus from file

### 4. Search Enhancements
- Regex search
- Advanced search syntax
- Search history

### 5. Sort Enhancements
- Multi-level sort
- Custom sort order
- Drag-drop reorder

## ✅ Checklist hoàn thành

- ✅ Thêm search input với icon và clear button
- ✅ Thêm sort Combobox với 6 options
- ✅ Thêm filter Position Combobox
- ✅ Thêm filter Published Combobox
- ✅ Implement useMemo filtering logic
- ✅ Implement sorting logic (6 types)
- ✅ Add Clear Filters button
- ✅ Add Empty State
- ✅ Add Badge counter
- ✅ Mobile First responsive layout
- ✅ Update interface với createdAt/updatedAt
- ✅ Sử dụng Combobox thay vì Select
- ✅ Vietnamese UI hoàn toàn
- ✅ Sticky header với filters
- ✅ No compile errors
- ✅ Viết documentation này

## 📝 Notes

### Database Requirements
- Menu model cần có `createdAt` field để sort "Mới nhất/Cũ nhất" hoạt động
- Prisma schema đã có `createdAt` và `updatedAt` by default

### Browser Compatibility
- `localeCompare` support: All modern browsers
- CSS Grid: IE11+ (không quan trọng, project dùng modern stack)
- Flexbox: All browsers

### Performance Notes
- Client-side filtering: OK cho < 1000 menus
- Nếu > 1000 menus: Cân nhắc server-side pagination + filtering
- useMemo: Re-calculate chỉ khi dependencies thay đổi

## 🎉 Kết quả

Trang `/admin/menus` giờ đây có:
- ✅ Search bar với icon và clear button
- ✅ Sort dropdown với 6 options
- ✅ 2 Filter dropdowns (Position, Published)
- ✅ Clear Filters button
- ✅ Empty state thông minh
- ✅ Badge counter động
- ✅ Mobile responsive
- ✅ Performance optimized với useMemo
- ✅ Vietnamese UI
- ✅ Shadcn Combobox components

**Tất cả theo đúng rulepromt.txt!** 🎯
