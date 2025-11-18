# Fix Bug Upload Form Redirect to API JSON Response

## 🎯 Vấn đề
Sau khi upload file xong, form submit redirect về `/api/media` và hiển thị JSON response thay vì ở lại trang admin:
```json
{"success":true,"data":{...},"message":"File đã được tải lên thành công (minio)"}
```

## ✅ Giải pháp
Chuyển từ **HTML form submit** sang **AJAX/Fetch upload** để không redirect.

## 📦 Thay đổi

### 1. **Cài đặt Sonner** (Toast Notifications)
```bash
bun add sonner
```

### 2. **Tạo Client Component** `app/admin/media/media-upload-form.tsx`
```tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function MediaUploadForm() {
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<string>("");
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    
    const formData = new FormData(e.currentTarget);
    const file = formData.get("file") as File;
    
    if (!file || file.size === 0) {
      toast.error("Vui lòng chọn file");
      return;
    }

    setUploading(true);

    try {
      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        toast.success(data.message || "Upload thành công!");
        e.currentTarget.reset();
        setSelectedFile("");
        router.refresh(); // Refresh để hiển thị ảnh mới
      } else {
        toast.error(data.error || "Upload thất bại");
      }
    } catch (error) {
      toast.error("Có lỗi xảy ra khi upload");
    } finally {
      setUploading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <Input
        type="file"
        name="file"
        accept="image/*,video/*"
        required
        disabled={uploading}
        onChange={(e) => setSelectedFile(e.target.value)}
      />
      <Button type="submit" disabled={uploading || !selectedFile}>
        {uploading ? "Đang tải..." : "Upload"}
      </Button>
    </form>
  );
}
```

### 3. **Update Server Component** `app/admin/media/page.tsx`
```tsx
import { MediaUploadForm } from "./media-upload-form";

export default async function MediaLibraryPage() {
  // ...
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Media</CardTitle>
        <CardDescription>
          Tải lên hình ảnh hoặc video (tối đa 10MB, tự động tối ưu sang WebP)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <MediaUploadForm />
      </CardContent>
    </Card>
  );
}
```

## ✅ Kết quả

### Before (HTML Form):
```tsx
<form action="/api/media" method="POST" encType="multipart/form-data">
  {/* → Submit → Redirect to /api/media → Show JSON */}
</form>
```

### After (AJAX Upload):
```tsx
<form onSubmit={handleSubmit}>
  {/* → Fetch API → Show toast → Refresh page → Stay on /admin/media */}
</form>
```

### UX Improvements:
- ✅ **No redirect**: Ở lại trang `/admin/media`
- ✅ **Toast notification**: Hiển thị thông báo thành công/lỗi
- ✅ **Loading state**: Button disabled + spinner khi đang upload
- ✅ **Auto refresh**: Tự động refresh để hiển thị ảnh mới
- ✅ **Form reset**: Clear input sau khi upload xong
- ✅ **File preview**: Hiển thị tên file đã chọn
- ✅ **Mobile responsive**: Flex column trên mobile

## 🧪 Testing

### 1. Upload hình:
1. Truy cập: `http://localhost:3005/admin/media`
2. Chọn file: `photo.jpg`
3. Click "Upload"
4. → Toast: "✅ File đã được tải lên thành công (minio)"
5. → Form reset
6. → Page refresh
7. → Ảnh mới xuất hiện ở đầu grid

### 2. Upload lỗi:
1. Upload file > 10MB
2. → Toast: "❌ File quá lớn (tối đa 10MB)"
3. → Form không reset
4. → Không redirect

### 3. Network error:
1. Tắt server
2. Upload file
3. → Toast: "❌ Có lỗi xảy ra khi upload"
4. → Form không reset

## 📊 Flow Comparison

### OLD (Broken):
```
User clicks Upload
  ↓
HTML form POST to /api/media
  ↓
Browser redirects to /api/media
  ↓
Show JSON response (broken UX)
```

### NEW (Fixed):
```
User clicks Upload
  ↓
JavaScript fetch() to /api/media
  ↓
Receive JSON response
  ↓
Show toast notification
  ↓
Reset form + Refresh page
  ↓
Stay on /admin/media (good UX)
```

## 🎨 Toast Styles

Sonner toast đã được config trong `components/ui/sonner.tsx`:
- **Position**: Top right
- **Icons**: Custom lucide icons
- **Theme**: Auto (light/dark)
- **Animation**: Smooth slide in/out

## 📝 Lưu ý

1. **Client Component**: Upload form phải là `"use client"` để dùng hooks
2. **Server Component**: Page vẫn là server component để fetch data
3. **Toast Provider**: Đã có sẵn trong `app/layout.tsx` (`<Toaster />`)
4. **Router.refresh()**: Trigger server component re-render để load ảnh mới
5. **FormData API**: Dùng native FormData, không cần encode multipart manual

## 🚀 Next Steps

- [ ] Add progress bar khi upload file lớn
- [ ] Add drag & drop zone
- [ ] Add multiple file upload
- [ ] Add preview thumbnail trước khi upload
- [ ] Add retry button khi upload fail
