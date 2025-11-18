# CẬP NHẬT HỆ THỐNG THÔNG BÁO SONNER

## Tổng quan
Đã cập nhật toàn bộ hệ thống thông báo trong dự án sử dụng **Sonner** theo chuẩn shadcn UI, thay thế các phương pháp thông báo cũ (Card messages, browser confirm, alert).

## Các thay đổi chính

### 1. Component Sonner (Đã có sẵn)
**File**: `components/ui/sonner.tsx`

Component Toaster đã được cài đặt và cấu hình với:
- ✅ Icons custom cho từng loại toast (success, error, warning, info, loading)
- ✅ Theme tự động (light/dark mode)
- ✅ Styling theo design system của project
- ✅ Animation mượt mà

**Đặc điểm**:
```typescript
icons={{
  success: <CircleCheckIcon />,
  info: <InfoIcon />,
  warning: <TriangleAlertIcon />,
  error: <OctagonXIcon />,
  loading: <Loader2Icon className="animate-spin" />,
}}
```

### 2. Component ConfirmDialog (Mới tạo)
**File**: `components/ui/confirm-dialog.tsx`

Thay thế `window.confirm()` bằng AlertDialog component chuẩn shadcn UI:

```typescript
<ConfirmDialog
  open={showDialog}
  onOpenChange={setShowDialog}
  title="Xác nhận xóa"
  description="Bạn chắc chắn muốn xóa...?"
  confirmText="Xóa"
  cancelText="Hủy"
  variant="destructive"
  onConfirm={handleConfirm}
/>
```

**Props**:
- `open`: boolean - Trạng thái hiển thị
- `onOpenChange`: (open: boolean) => void - Callback khi thay đổi
- `title`: string - Tiêu đề dialog
- `description`: string - Nội dung mô tả
- `confirmText`: string - Text nút xác nhận (default: "Xác nhận")
- `cancelText`: string - Text nút hủy (default: "Hủy")
- `variant`: "default" | "destructive" - Style của nút confirm
- `onConfirm`: () => void - Callback khi confirm

### 3. Files đã cập nhật

#### a. `components/seo-settings-form.tsx`
**Trước**:
- Sử dụng Card component để hiển thị success/error messages
- State riêng cho success và error
- Auto-hide sau 3 giây bằng setTimeout

**Sau**:
```typescript
import { toast } from "sonner";

// Success
toast.success("Cài đặt SEO đã được lưu thành công!");

// Error
toast.error(result.error || "Có lỗi xảy ra khi lưu cài đặt");
```

**Cải thiện**:
- ✅ Gọn gàng hơn, không cần state quản lý
- ✅ Auto-dismiss tự động
- ✅ Stack multiple toasts
- ✅ Animation smooth

#### b. `app/admin/media/media-card.tsx`
**Trước**:
```typescript
if (!confirm("Bạn chắc chắn muốn xóa file này?")) return;
```

**Sau**:
```typescript
const [showDeleteDialog, setShowDeleteDialog] = useState(false);

// Button trigger
onClick={() => setShowDeleteDialog(true)}

// ConfirmDialog component
<ConfirmDialog
  open={showDeleteDialog}
  onOpenChange={setShowDeleteDialog}
  title="Xác nhận xóa"
  description="Bạn chắc chắn muốn xóa file này? Hành động này không thể hoàn tác."
  variant="destructive"
  onConfirm={handleDelete}
/>
```

**Toast messages**:
- `toast.success("Đã copy URL vào clipboard!")`
- `toast.success("Đã xóa media thành công!")`
- `toast.error("Lỗi khi xóa media")`

#### c. `app/admin/content/page.tsx`
**Trước**:
```typescript
if (!confirm(`Bạn chắc chắn muốn xóa ${typeName} này?`)) return;
```

**Sau**:
```typescript
const [deleteDialog, setDeleteDialog] = useState<{
  open: boolean;
  item: ContentItem | null;
}>({ open: false, item: null });

// Trigger delete
onDelete={() => setDeleteDialog({ open: true, item })}

// ConfirmDialog
<ConfirmDialog
  open={deleteDialog.open}
  onOpenChange={(open) => setDeleteDialog({ open, item: null })}
  title="Xác nhận xóa"
  description={`Bạn chắc chắn muốn xóa ${item.type === "page" ? "trang" : "bài viết"} "${item.title}"?`}
  variant="destructive"
  onConfirm={() => deleteDialog.item && handleDelete(deleteDialog.item)}
/>
```

**Toast messages**:
- `toast.success("Đã xóa thành công!")`
- `toast.error("Lỗi khi xóa")`
- `toast.error("Lỗi khi thay đổi trạng thái")`

#### d. `app/admin/content/[id]/page.tsx`
**Cập nhật**:
- `toast.success("Đã tạo trang/bài viết thành công!")`
- `toast.success("Đã cập nhật thành công!")`
- `toast.error("Lỗi khi lưu")`

#### e. `components/page-builder/PageBuilderEditor.tsx`
**Cập nhật**:
- `toast.success("Đã lưu page thành công!")`
- `toast.error("Lỗi khi lưu page")`
- `toast.success("Đã export HTML thành công!")`

### 4. Loại bỏ Emoji
Đã xóa tất cả emoji (✅, ❌, ℹ️, ⚠️) khỏi toast messages vì:
- Sonner đã có icons riêng cho từng loại
- Giao diện đồng nhất, professional hơn
- Tránh duplicate icons

**Trước**: `toast.success("✅ Đã lưu thành công!")`  
**Sau**: `toast.success("Đã lưu thành công!")`

### 5. Layout Setup
**File**: `app/layout.tsx` và `app/admin/layout.tsx`

Cả 2 layout đã có `<Toaster />` component:
```tsx
import { Toaster } from '@/components/ui/sonner';

// In JSX
<Toaster />
```

## Hướng dẫn sử dụng

### Toast Messages

```typescript
import { toast } from "sonner";

// Success
toast.success("Thao tác thành công!");

// Error
toast.error("Có lỗi xảy ra!");

// Warning
toast.warning("Cảnh báo!");

// Info
toast.info("Thông tin!");

// Loading (with promise)
toast.promise(
  fetchData(),
  {
    loading: 'Đang tải...',
    success: 'Tải thành công!',
    error: 'Lỗi khi tải!',
  }
);

// Custom duration
toast.success("Message này sẽ tự ẩn sau 5s", {
  duration: 5000,
});
```

### Confirm Dialog

```typescript
import { useState } from "react";
import { ConfirmDialog } from "@/components/ui/confirm-dialog";

function MyComponent() {
  const [showDialog, setShowDialog] = useState(false);

  const handleDelete = async () => {
    // Xử lý xóa
    toast.success("Đã xóa!");
    setShowDialog(false);
  };

  return (
    <>
      <Button onClick={() => setShowDialog(true)}>
        Xóa
      </Button>

      <ConfirmDialog
        open={showDialog}
        onOpenChange={setShowDialog}
        title="Xác nhận xóa"
        description="Bạn chắc chắn muốn xóa?"
        confirmText="Xóa"
        cancelText="Hủy"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </>
  );
}
```

## Ưu điểm

✅ **Nhất quán**: Tất cả notifications đều sử dụng Sonner  
✅ **UX tốt hơn**: Animation mượt, auto-dismiss  
✅ **Mobile-friendly**: Responsive tốt trên mọi màn hình  
✅ **Accessible**: Hỗ trợ screen readers  
✅ **Stack notifications**: Nhiều toast có thể hiển thị cùng lúc  
✅ **Theme-aware**: Tự động đổi màu theo dark/light mode  
✅ **Professional**: Không dùng browser alert/confirm  
✅ **Type-safe**: Full TypeScript support  
✅ **Customizable**: Dễ dàng custom style và behavior

## Dependencies

```json
{
  "sonner": "latest",
  "@radix-ui/react-alert-dialog": "latest"
}
```

## Files tham chiếu

```
components/
  └── ui/
      ├── sonner.tsx (Toaster component)
      ├── confirm-dialog.tsx (ConfirmDialog component)
      └── alert-dialog.tsx (Base AlertDialog từ shadcn)

app/
  ├── layout.tsx (Root layout với Toaster)
  └── admin/
      └── layout.tsx (Admin layout với Toaster)
```

## Migration Checklist

- [x] Cài đặt Sonner component
- [x] Thêm Toaster vào layouts
- [x] Tạo ConfirmDialog component
- [x] Thay thế Card messages bằng toast
- [x] Thay thế window.confirm() bằng ConfirmDialog
- [x] Loại bỏ emoji khỏi messages
- [x] Test trên các màn hình khác nhau
- [x] Verify dark mode hoạt động tốt

---

**Ngày cập nhật**: 13/11/2025  
**Version**: 1.0  
**Trạng thái**: ✅ Hoàn thành
