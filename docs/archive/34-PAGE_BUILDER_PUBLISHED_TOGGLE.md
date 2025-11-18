# Bổ sung tính năng chuyển Draft/Public cho Page Builder

## Tóm tắt
Thêm chức năng toggle trạng thái Nháp/Công khai cho Page Builder với giao diện Mobile First + Responsive theo chuẩn shadcn UI.

## Thay đổi

### 1. Component Switch (mới)
- **File**: `components/ui/switch.tsx`
- Tạo Switch component theo chuẩn shadcn UI sử dụng Radix UI
- Cài đặt: `@radix-ui/react-switch@1.2.6`

### 2. Page Builder Editor
- **File**: `components/page-builder/PageBuilderEditor.tsx`
- Thêm props `published: boolean` vào interface
- Thêm state: `const [published, setPublished] = useState(initialData.published)`
- Import thêm: `Switch`, `Globe` icon
- UI mới: Toggle Published/Draft với icon Globe, text responsive
  - Mobile: Chỉ hiện icon + switch
  - Desktop: Hiện icon + text (Công khai/Nháp) + switch
  - Màu xanh khi công khai, xám khi nháp
- Update `handleSave()`: Gửi `published` kèm `blocks` khi save

### 3. Page Builder Route
- **File**: `app/admin/page-builder/[id]/page.tsx`
- Thêm `published: page.published` vào `initialData`
- Đã có `export const dynamic = 'force-dynamic'` để tránh caching

## Giao diện
```
[Globe Icon] Công khai/Nháp [Switch]
```
- Responsive: Mobile chỉ icon + switch, Desktop đầy đủ
- Màu sắc: Xanh (công khai) / Xám (nháp)
- Vị trí: Toolbar, trước nút Export và Save

## Kết quả
✅ User có thể chuyển Page Builder từ Nháp sang Công khai ngay trong editor
✅ Trạng thái được lưu khi click Save
✅ Giao diện Mobile First + Responsive
✅ Theo chuẩn shadcn UI với Switch component

---
**Ngày**: 13/11/2025
