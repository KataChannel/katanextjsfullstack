# Cập nhật MinIO Storage cho Admin Media Upload

## 🎯 Tổng quan
Đã tích hợp MinIO object storage để upload media cho domain `innerbright.vn` thay vì lưu file local.

## 📦 Thay đổi

### 1. **Cài đặt Dependencies**
```bash
bun add minio
```

### 2. **Tạo MinIO Configuration** (`lib/minio.ts`)
- Multi-domain MinIO config support
- Helper functions:
  - `getMinioClient(domain)` - Lấy MinIO client cho domain
  - `ensureBucket(client, bucketName)` - Tự động tạo bucket nếu chưa có
  - `uploadToMinio(...)` - Upload file lên MinIO
  - `deleteFromMinio(...)` - Xóa file từ MinIO
  - `getMinioConfigForDomain(domain)` - Lấy config + client cho domain

**Config cho innerbright.vn:**
```typescript
{
  endpoint: '116.118.49.243',
  port: 12007,
  useSSL: false,
  accessKey: 'minio-admin',
  secretKey: 'minio-secret-2025',
  bucketName: 'innerbright',
}
```

### 3. **Cập nhật Domain Config** (`lib/domain-config.ts`)
Thêm storage configuration vào `DomainConfig` interface:
```typescript
storage?: {
  type: 'minio' | 'local';
  endpoint?: string;
  port?: number;
  useSSL?: boolean;
  bucketName?: string;
}
```

Config cho `innerbright.vn`:
```typescript
storage: {
  type: 'minio',
  endpoint: '116.118.49.243',
  port: 12007,
  useSSL: false,
  bucketName: 'innerbright',
}
```

### 4. **Cập nhật Upload API** (`app/api/media/route.ts`)
**Logic mới:**
1. Lấy domain config từ request hostname
2. Kiểm tra `storage.type`:
   - `minio` → Upload lên MinIO server
   - `local` hoặc undefined → Upload local filesystem (default)
3. Generate unique filename: `timestamp-random.ext`
4. Upload file và lưu URL vào database

**MinIO Upload Flow:**
```typescript
const minioClient = getMinioClient(domainConfig.domain);
const url = await uploadToMinio(
  minioClient,
  bucketName,
  filename,
  buffer,
  mimeType,
  metadata
);
```

**URL format:**
- MinIO: `http://116.118.49.243:12007/innerbright/filename.jpg`
- Local: `/uploads/filename.jpg`

## ✅ Kết quả

### Domain `innerbright.vn` (localhost:3005)
- ✅ Upload lên MinIO server `116.118.49.243:12007`
- ✅ Bucket: `innerbright`
- ✅ Auto-create bucket nếu chưa có
- ✅ URL trả về: `http://116.118.49.243:12007/innerbright/[filename]`

### Các domain khác (mặc định)
- ✅ Upload local filesystem: `public/uploads/`
- ✅ URL trả về: `/uploads/[filename]`

## 🔧 Cách thêm MinIO cho domain khác

**Bước 1:** Thêm config vào `lib/minio.ts`:
```typescript
'tazagroup.vn': {
  endpoint: '116.118.49.243',
  port: 12007,
  useSSL: false,
  accessKey: 'minio-admin',
  secretKey: 'minio-secret-2025',
  bucketName: 'tazagroup', // Tên bucket riêng
},
```

**Bước 2:** Thêm storage config vào `lib/domain-config.ts`:
```typescript
'tazagroup.vn': {
  // ... existing config
  storage: {
    type: 'minio',
    endpoint: '116.118.49.243',
    port: 12007,
    useSSL: false,
    bucketName: 'tazagroup',
  },
}
```

## 🧪 Testing

### Upload File:
1. Truy cập: `http://localhost:3005/admin/media`
2. Chọn file và upload
3. File sẽ được upload lên MinIO server
4. URL trả về: `http://116.118.49.243:12007/innerbright/[filename]`

### Check MinIO:
```bash
# Có thể dùng MinIO Client (mc) để kiểm tra
mc ls myminio/innerbright
```

## 📝 Lưu ý

1. **Security**: 
   - MinIO credentials (`accessKey`, `secretKey`) nên để trong environment variables cho production
   - Hiện tại hardcoded trong code cho development

2. **Bucket Policy**:
   - Cần set bucket policy cho public read nếu muốn truy cập trực tiếp URL
   - Hoặc dùng presigned URL cho private files

3. **SSL/HTTPS**:
   - Hiện tại `useSSL: false` cho development
   - Production nên bật SSL: `useSSL: true` và port `443`

4. **Multi-domain**:
   - Mỗi domain nên có bucket riêng
   - Format bucket name: tên domain không dấu, không ký tự đặc biệt

## 🚀 Next Steps

- [ ] Move MinIO credentials to `.env` file
- [ ] Add bucket policy setup script
- [ ] Implement file deletion from MinIO khi xóa media
- [ ] Add image optimization before upload (sharp)
- [ ] Add MinIO config cho các domain còn lại
- [ ] Setup CORS policy cho MinIO bucket
