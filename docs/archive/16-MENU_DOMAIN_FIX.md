# Fix: Menu Domain Auto-Detection

**Date:** 17/11/2025
**Status:** ✅ Fixed

## Problem

Menu trong `/admin/menus` luôn mặc định hiển thị `innerbright.vn` thay vì tự động detect domain dựa trên port hiện tại.

Ví dụ:
- Chạy port 3005 → Nên auto chọn `innerbright.vn`
- Chạy port 3000 → Nên auto chọn `tazagroup.vn`
- ...

## Root Cause

Trong `app/admin/menus/page.tsx`, state `selectedDomain` được hardcode:

```tsx
const [selectedDomain, setSelectedDomain] = useState("innerbright.vn");
```

## Solution

### 1. Auto-detect domain từ port

**File:** `app/admin/menus/page.tsx`

**Changes:**

```tsx
// Thay đổi initial state
const [selectedDomain, setSelectedDomain] = useState<string>("");

// Thêm useEffect để detect domain
useEffect(() => {
  const detectDomain = () => {
    const port = window.location.port || "3000";
    const portMap: Record<string, string> = {
      "3000": "tazagroup.vn",
      "3001": "tazaskinclinic.com", 
      "3002": "timona.edu.vn",
      "3003": "hderma.vn",
      "3004": "elasome.com",
      "3005": "innerbright.vn",
    };
    
    const detectedDomain = portMap[port] || "tazagroup.vn";
    setSelectedDomain(detectedDomain);
  };

  detectDomain();
}, []);
```

### 2. Cập nhật fetchMenus

Thêm guard để không fetch khi chưa có domain:

```tsx
const fetchMenus = async () => {
  if (!selectedDomain) return;
  
  setLoading(true);
  // ... rest of code
};
```

### 3. Cập nhật loading state

```tsx
if (loading || !selectedDomain) {
  return (
    <div className="text-center">
      <p className="text-lg mb-2">Đang tải...</p>
      <p className="text-sm text-muted-foreground">
        {selectedDomain ? `Domain: ${selectedDomain}` : "Đang xác định domain..."}
      </p>
    </div>
  );
}
```

### 4. Hiển thị port hiện tại

Thêm badge để user biết đang ở port nào:

```tsx
<Badge variant="default" className="ml-2">
  Port: {window.location.port || "3000"}
</Badge>
```

### 5. Thêm helper text

```tsx
<CardDescription className="mt-1 space-y-1">
  <div>Thêm, sửa, xóa menu của website theo từng domain</div>
  <div className="text-xs bg-blue-50 ... px-2 py-1 rounded inline-block">
    💡 Mỗi domain có bộ menu riêng. Menu hiển thị theo database của domain đã chọn.
  </div>
</CardDescription>
```

## Port Mapping

| Port | Domain | Database |
|------|--------|----------|
| 3000 | tazagroup.vn | tazagroupvn |
| 3001 | tazaskinclinic.com | tazaskinclinic |
| 3002 | timona.edu.vn | timona |
| 3003 | hderma.vn | hderma |
| 3004 | elasome.com | elasome |
| 3005 | innerbright.vn | innerv2core |

## Testing

### Test Case 1: Port 3005
1. Chạy: `bun run dev:innerbright` (port 3005)
2. Truy cập: `http://localhost:3005/admin/menus`
3. ✅ Domain dropdown auto-select: `innerbright.vn`
4. ✅ Badge hiển thị: `Port: 3005`
5. ✅ Menu list hiển thị từ database `innerv2core`

### Test Case 2: Port 3000
1. Chạy: `bun run dev:tazagroup` (port 3000)
2. Truy cập: `http://localhost:3000/admin/menus`
3. ✅ Domain dropdown auto-select: `tazagroup.vn`
4. ✅ Badge hiển thị: `Port: 3000`
5. ✅ Menu list hiển thị từ database `tazagroupvn`

### Test Case 3: Manual Switch
1. Chạy bất kỳ port nào
2. Truy cập: `/admin/menus`
3. ✅ Auto-select domain đúng theo port
4. ✅ User có thể manually switch sang domain khác nếu cần
5. ✅ Menu reload theo domain mới

## Benefits

1. **User-Friendly:** Không cần manually chọn domain mỗi lần vào trang
2. **Correct by Default:** Tự động chọn đúng domain theo port đang chạy
3. **Transparent:** Hiển thị rõ port và domain hiện tại
4. **Flexible:** Vẫn cho phép switch manual nếu cần
5. **Consistent:** Logic mapping giống với `lib/domain-config.ts`

## Related Files

- `app/admin/menus/page.tsx` - Menu management page (modified)
- `lib/domain-config.ts` - Domain configuration (reference)
- `lib/database.ts` - Database connection logic (reference)
- `lib/prisma.ts` - Prisma client factory (reference)

## Notes

- Logic mapping port → domain phải sync với `lib/domain-config.ts`
- Frontend detection sử dụng `window.location.port`
- Backend detection sử dụng `headers.get('host')` hoặc `x-hostname`
- Fallback default: `tazagroup.vn` (port 3000)

## Future Improvements

Có thể tạo một custom hook để reuse logic này:

```tsx
// hooks/useDomainDetection.ts
export function useDomainDetection() {
  const [domain, setDomain] = useState<string>("");
  
  useEffect(() => {
    // Detection logic
  }, []);
  
  return domain;
}
```

Sau đó có thể dùng trong các trang khác:
- `/admin/website-settings`
- `/admin/pages`
- `/admin/posts`
- etc.
