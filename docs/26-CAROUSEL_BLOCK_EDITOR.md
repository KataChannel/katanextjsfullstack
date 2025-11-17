# Cập nhật Carousel Block Editor

## Tổng quan
Đã hoàn thành tích hợp chức năng chỉnh sửa carousel block trong BlockInspector với giao diện mobile-first, responsive và tuân thủ chuẩn Shadcn UI.

## Các thay đổi đã thực hiện

### 1. **Thêm UI Components**
- ✅ Tạo `components/ui/textarea.tsx` - Component Textarea cho nhập mô tả
- ✅ Sử dụng `Switch` component có sẵn cho toggle autoplay
- ✅ Sử dụng `Dialog` với layout chuẩn: header, footer, content scrollable

### 2. **BlockInspector Carousel Editor** ✅
**File**: `components/block-editor/BlockInspector.tsx`

**Tính năng đã thêm**:

#### a) **Cài đặt Carousel**
- Toggle "Tự động chuyển" (Switch component)
- Input "Thời gian chuyển (ms)" - điều chỉnh interval

#### b) **Quản lý Slides**
- Hiển thị danh sách slides với thumbnail, title, subtitle
- **Thêm slide**: Nút "Thêm slide" với icon Plus
- **Sửa slide**: Click nút "Sửa" để mở dialog chỉnh sửa
- **Xóa slide**: Nút xóa với icon Trash2 màu đỏ
- **Di chuyển slide**: Nút MoveUp/MoveDown để sắp xếp thứ tự
- **Empty state**: Hiển thị placeholder khi chưa có slide

#### c) **Dialog Chỉnh sửa Slide**
**Layout theo chuẩn rulepromt.txt**:
- **Header**: Tiêu đề "Thêm slide mới" / "Chỉnh sửa slide" + Description
- **Content (scrollable)**: Form fields:
  - URL hình ảnh (với preview thumbnail)
  - Tiêu đề chính
  - Tiêu đề phụ
  - Mô tả (Textarea, 3 rows)
  - Badge (tùy chọn)
  - Badge Highlight (tùy chọn)
- **Footer**: Nút "Hủy" và "Lưu"

**Responsive**:
- Mobile: Full width (95vw), max-height 90vh
- Desktop: max-width 2xl (672px)
- Form grid: 1 column mobile, 2 columns desktop cho badges

### 3. **State Management**
Thêm local state trong BlockInspector:
```tsx
const [editingSlideIndex, setEditingSlideIndex] = useState<number | null>(null);
const [slideFormData, setSlideFormData] = useState<any>(null);
```

### 4. **Functions Implementation**

#### `handleAddSlide()`
- Tạo slide mới với placeholder data
- Mở dialog với form trống

#### `handleEditSlide(index)`
- Load dữ liệu slide hiện tại vào form
- Mở dialog để chỉnh sửa

#### `handleDeleteSlide(index)`
- Xóa slide khỏi array
- Cập nhật block content

#### `handleMoveSlide(index, direction)`
- Di chuyển slide lên/xuống trong array
- Disable nút khi ở đầu/cuối list

#### `handleSaveSlide()`
- Lưu slide mới hoặc cập nhật slide existing
- Đóng dialog và clear form

## Cấu trúc dữ liệu Carousel

```typescript
{
  type: 'carousel',
  content: {
    autoplay: boolean,        // true/false
    interval: number,         // milliseconds (default: 5000)
    slides: [
      {
        id: string,           // unique ID
        image: string,        // URL hình ảnh
        title: string,        // Tiêu đề chính (màu cam)
        subtitle: string,     // Tiêu đề phụ (màu trắng, lớn)
        description: string,  // Mô tả chi tiết
        badge?: string,       // Text badge (tùy chọn)
        badgeHighlight?: string // Text highlight trong badge
      }
    ]
  }
}
```

## Giao diện tuân thủ Rules

### Mobile First ✅
- Inspector slide từ bên phải với animation
- Dialog responsive full width trên mobile
- Grid layout 1 column → 2 columns
- Backdrop blur overlay trên mobile

### Shadcn UI Components ✅
- Dialog với layout chuẩn
- Input, Label, Button, Badge
- Switch component cho toggle
- Textarea cho mô tả dài

### Tiếng Việt ✅
- "Tự động chuyển", "Thời gian chuyển"
- "Thêm slide", "Sửa", "Xóa"
- "Tiêu đề chính", "Tiêu đề phụ", "Mô tả"
- "Hủy", "Lưu"

### UX/UI Optimization ✅
- Thumbnail preview trong danh sách
- Preview hình ảnh trong dialog
- Hover effects trên slide items
- Disabled state cho nút move
- Empty state với icon và text
- Responsive spacing (px-4 sm:px-6)

## Cách sử dụng

### 1. Kéo Carousel Block vào Canvas
- Từ BlockSidebar, kéo "Carousel" vào canvas
- Block được tạo với 1 slide mặc định

### 2. Chỉnh sửa Carousel Settings
- Click vào carousel block để chọn
- Trong BlockInspector tab "Nội dung":
  - Toggle "Tự động chuyển" on/off
  - Điều chỉnh thời gian chuyển slide (ms)

### 3. Quản lý Slides
- **Thêm mới**: Click "Thêm slide" → Điền form → "Lưu"
- **Chỉnh sửa**: Click "Sửa" trên slide → Cập nhật → "Lưu"
- **Xóa**: Click icon Trash2 màu đỏ
- **Sắp xếp**: Dùng nút MoveUp/MoveDown

### 4. Chỉnh sửa Slide Content
Trong dialog chỉnh sửa:
1. **URL hình ảnh**: Paste link hình (preview tự động)
2. **Tiêu đề chính**: Text màu cam (VD: "CÂU CHUYỆN")
3. **Tiêu đề phụ**: Text lớn màu trắng (VD: "Về INNERBRIGHT")
4. **Mô tả**: Text chi tiết về slide
5. **Badge**: Label bên trái (VD: "Bởi nhà đào tạo")
6. **Badge Highlight**: Text highlight (VD: "CHLOE QUÝ CHÂU")

## Technical Details

### Icons sử dụng
- `Plus` - Thêm slide
- `Trash2` - Xóa slide
- `MoveUp` / `MoveDown` - Di chuyển
- `ImageIcon` - Empty state
- `Settings` - Default inspector icon

### Styling Classes
- Mobile: `w-full`, `sm:w-96`
- Dialog: `max-h-[90vh]`, `w-[95vw]`, `max-w-2xl`
- Grid: `grid-cols-1 sm:grid-cols-2`
- Buttons: `h-7`, `h-8`, `min-w-20`

### State Flow
```
User clicks "Thêm slide"
  → handleAddSlide()
  → setSlideFormData(newSlide)
  → setEditingSlideIndex(slides.length)
  → Dialog opens
  → User fills form
  → Click "Lưu"
  → handleSaveSlide()
  → updateBlock() with new slides array
  → Dialog closes
```

## Files thay đổi

```
components/
  ui/
    textarea.tsx                    # MỚI TẠO - Component Textarea
  block-editor/
    BlockInspector.tsx             # CẬP NHẬT - Thêm carousel editor
```

## Checklist hoàn thành

✅ Tạo Textarea component  
✅ Import Switch, Dialog, các UI components  
✅ Thêm carousel editor UI trong BlockInspector  
✅ Autoplay toggle với Switch  
✅ Interval input  
✅ Danh sách slides với thumbnail  
✅ Nút thêm/sửa/xóa/di chuyển slides  
✅ Dialog chỉnh sửa slide với layout chuẩn  
✅ Form fields đầy đủ (image, title, subtitle, description, badges)  
✅ Preview hình ảnh trong form  
✅ Responsive mobile-first  
✅ Tiếng Việt 100%  
✅ UX/UI optimization (hover, disabled, empty state)  

## Testing Notes

Để test carousel editor:
1. Mở admin page builder
2. Kéo carousel block vào canvas
3. Click vào carousel → BlockInspector hiện
4. Tab "Nội dung" → Thấy carousel settings
5. Click "Thêm slide" → Dialog mở
6. Điền form → Click "Lưu" → Slide xuất hiện trong list
7. Test các chức năng: Sửa, Xóa, Di chuyển
8. Test responsive: Resize browser window

## Known Issues
- TypeScript có thể cần restart để nhận textarea.tsx module (cache issue)
- Giải pháp: Restart VS Code hoặc TypeScript server

---

**Ngày hoàn thành**: 18/11/2025  
**Status**: ✅ Hoàn thành carousel block editor  
**Tuân thủ**: rulepromt.txt - Mobile First, Shadcn UI, Tiếng Việt, Dialog layout chuẩn
