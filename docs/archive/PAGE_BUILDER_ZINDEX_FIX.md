# Page Builder Z-Index Fix

## Vấn Đề

Page Builder fullscreen bị che bởi các component khác như:
- Admin Header (`z-50`)
- Admin Sidebar (`z-50`)
- Dialog components (`z-50`)
- Các overlay khác

## Giải Pháp

### 1. Layout Hierarchy

Tạo z-index hierarchy rõ ràng:

```
Base Layer (0-10):
- Normal content

UI Layer (10-50):
- Sticky headers: z-10
- Dropdowns: z-20
- Tooltips: z-30
- Dialogs: z-50

Admin Layer (50-100):
- Admin Header: z-50
- Admin Sidebar: z-50

Page Builder Layer (9998-10000):
- Page Builder Layout: z-9998
- Page Builder Main: z-9999
- Page Builder Sidebars: z-10000
```

### 2. Thay Đổi Code

#### `/app/admin/page-builder/[id]/layout.tsx`

```tsx
// Before
<div className="h-screen w-screen overflow-hidden">
  {children}
</div>

// After
<div 
  className="fixed inset-0 h-screen w-screen overflow-hidden bg-background" 
  style={{ zIndex: 9998 }}
>
  {children}
</div>
```

**Lý do:**
- `fixed inset-0`: Fullscreen overlay
- `zIndex: 9998`: Cao hơn tất cả admin components
- `bg-background`: Đảm bảo background đúng

#### `/components/page-builder/PageBuilderEditor.tsx`

```tsx
// Container
<div 
  className="flex h-screen w-screen fixed inset-0 bg-background overflow-hidden" 
  style={{ zIndex: 9999 }}
>

// Left Sidebar Overlay
<div 
  className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
  style={{ zIndex: 10000 }}
>

// Right Sidebar Overlay
<div 
  className="fixed inset-0 bg-black/60 backdrop-blur-sm lg:hidden"
  style={{ zIndex: 10000 }}
>
```

**Lý do:**
- Container z-9999: Trên layout
- Sidebars z-10000: Trên container
- Sử dụng inline style vì Tailwind không có z-index > 50

### 3. Layout Structure

```
app/admin/layout.tsx (admin layout)
  ├── AdminSidebar (z-50)
  ├── AdminHeader (z-50)
  └── children
      └── app/admin/page-builder/[id]/layout.tsx (z-9998) ✅ Override
          └── PageBuilderEditor (z-9999)
              ├── Left Sidebar Overlay (z-10000)
              └── Right Sidebar Overlay (z-10000)
```

## Kết Quả

✅ Page Builder hiển thị fullscreen đúng  
✅ Không bị che bởi admin header/sidebar  
✅ Mobile sidebars overlay hoạt động đúng  
✅ Không conflict với dialogs/toasts  

## Testing Checklist

- [x] Desktop: Page Builder fullscreen
- [x] Mobile: Left sidebar overlay
- [x] Mobile: Right sidebar overlay
- [x] Admin Header không hiển thị trong Page Builder
- [x] Admin Sidebar không hiển thị trong Page Builder
- [x] Back navigation hoạt động
- [x] Save/Export buttons accessible
- [x] Canvas không bị crop

## Notes

- Sử dụng inline `style={{ zIndex }}` thay vì Tailwind classes vì Tailwind chỉ có z-0 đến z-50
- Layout riêng cho Page Builder route đảm bảo fullscreen thật sự
- Mobile sidebars cần z-index cao nhất để overlay trên canvas

## Related Files

- `/app/admin/page-builder/[id]/layout.tsx`
- `/components/page-builder/PageBuilderEditor.tsx`
- `/app/admin/layout.tsx`
- `/components/admin-header.tsx`
- `/components/admin-sidebar.tsx`

---

**Updated:** December 2024  
**Status:** ✅ Fixed
