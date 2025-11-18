# Cập nhật Image Optimization với WebP & Fix MinIO AccessDenied

## 🎯 Tổng quan
1. **Tối ưu hóa hình ảnh**: Tự động convert sang WebP, resize, nén
2. **Fix MinIO AccessDenied**: Set bucket policy public read
3. **SEO-friendly**: WebP format, kích thước nhỏ, tốc độ load nhanh

## 📦 Thay đổi

### 1. **Cài đặt Sharp** (Image Processing)
```bash
bun add sharp
```

### 2. **Image Optimization** (`app/api/media/route.ts`)

#### Logic mới:
```typescript
// 1. Convert file to buffer
const bytes = await file.arrayBuffer();
let buffer: Buffer = Buffer.from(bytes);

// 2. Optimize images (trừ SVG)
if (file.type.startsWith('image/') && file.type !== 'image/svg+xml') {
  const image = sharp(buffer);
  const metadata = await image.metadata();
  
  width = metadata.width;
  height = metadata.height;
  
  // Convert to WebP + resize + compress
  const optimizedBuffer = await image
    .resize(1920, undefined, {
      fit: 'inside',
      withoutEnlargement: true,
    })
    .webp({ 
      quality: 85,  // High quality
      effort: 6,    // Balance speed/compression
    })
    .toBuffer();
  
  buffer = optimizedBuffer;
  finalMimeType = 'image/webp';
}

// 3. Filename với extension đúng
const filename = finalMimeType === 'image/webp' 
  ? `${baseFilename}.webp` 
  : `${baseFilename}.${file.name.split('.').pop()}`;
```

#### Kết quả:
- ✅ **JPEG/PNG/GIF** → **WebP** (giảm 30-80% dung lượng)
- ✅ **Max width**: 1920px (responsive, không làm mất chất lượng)
- ✅ **Quality**: 85% (balance giữa chất lượng và dung lượng)
- ✅ **SVG**: Giữ nguyên (không optimize)
- ✅ **Video**: Giữ nguyên

**Ví dụ log:**
```
✅ Optimized: image/jpeg → WebP (2500.25KB → 450.50KB)
```

### 3. **Fix MinIO AccessDenied** (`lib/minio.ts`)

#### Vấn đề:
Upload thành công nhưng không xem được ảnh → **AccessDenied**

#### Giải pháp:
Set **bucket policy** thành **public read** khi tạo/ensure bucket:

```typescript
export async function ensureBucket(client: Minio.Client, bucketName: string) {
  const bucketExists = await client.bucketExists(bucketName);
  
  if (!bucketExists) {
    await client.makeBucket(bucketName, 'us-east-1');
    console.log(`✅ Created MinIO bucket: ${bucketName}`);
  }
  
  // Set bucket policy public read
  const publicReadPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucketName}/*`],
      },
    ],
  };
  
  await client.setBucketPolicy(bucketName, JSON.stringify(publicReadPolicy));
  console.log(`✅ Set public read policy for bucket: ${bucketName}`);
}
```

#### Policy giải thích:
- **Effect: Allow** - Cho phép
- **Principal: \*** - Tất cả mọi người
- **Action: s3:GetObject** - Đọc/download file
- **Resource: bucket/\*** - Tất cả files trong bucket

### 4. **Database Updates**
Lưu đúng thông tin sau optimize:
```typescript
const media = await prisma.media.create({
  data: {
    filename: file.name,           // Original filename
    url,                           // MinIO hoặc local URL
    mimeType: finalMimeType,       // 'image/webp' sau optimize
    size: buffer.length,           // Size SAU KHI optimize
    width,                         // Width từ metadata
    height,                        // Height từ metadata
    alt: formData.get('alt'),
    caption: formData.get('caption'),
  },
});
```

## ✅ Kết quả

### Upload Flow hoàn chỉnh:

1. **User upload** `photo.jpg` (2.5MB, 3000x2000px)
2. **Sharp optimize**:
   - Resize: 1920x1280px
   - Convert: WebP format
   - Compress: Quality 85%
   - Result: 450KB
3. **MinIO upload**: `http://116.118.49.243:12007/innerbright/1763410854894-10txxr.webp`
4. **Database save**: WebP MIME type, 450KB size
5. **Public access**: ✅ Mọi người có thể xem (bucket policy public)

### SEO Benefits:
- ✅ **WebP format**: Modern, được Google khuyến nghị
- ✅ **Reduced file size**: 30-80% nhỏ hơn JPEG/PNG
- ✅ **Fast loading**: Page speed tăng → SEO tốt hơn
- ✅ **Responsive**: Max 1920px → mobile-friendly
- ✅ **Width/Height metadata**: Tránh layout shift (Core Web Vitals)

## 🧪 Testing

### 1. Upload hình:
```bash
# Vào: http://localhost:3005/admin/media
# Upload file: photo.jpg (2.5MB)
# → Console log: ✅ Optimized: image/jpeg → WebP (2500.25KB → 450.50KB)
# → MinIO URL: http://116.118.49.243:12007/innerbright/1763410854894-10txxr.webp
```

### 2. Kiểm tra bucket policy:
```bash
# MinIO Client (mc)
mc anonymous get myminio/innerbright
# Output: Access permission for 'myminio/innerbright' is 'download'
```

### 3. Truy cập URL:
```
http://116.118.49.243:12007/innerbright/1763410854894-10txxr.webp
→ ✅ Hiển thị ảnh (không còn AccessDenied)
```

## 📊 So sánh Before/After

| Metric | Before | After | Improvement |
|--------|--------|-------|-------------|
| Format | JPEG/PNG | WebP | Modern format |
| Size | 2.5MB | 450KB | -82% |
| Width | 3000px | 1920px | Responsive |
| Access | ❌ AccessDenied | ✅ Public | Fixed |
| SEO Score | - | ✅ | Better |

## 📝 Lưu ý

1. **SVG files**: Không optimize (giữ nguyên vector)
2. **Video files**: Không optimize (cần tool khác)
3. **Quality 85%**: Balance tốt, có thể tăng lên 90% nếu cần
4. **Max width 1920px**: Đủ cho màn hình 4K, có thể tăng nếu cần
5. **Bucket policy**: Chỉ set **public read**, không cho phép write/delete

## 🚀 Next Steps

- [ ] Add lazy loading cho images trong frontend
- [ ] Implement responsive images với srcset
- [ ] Add CDN caching cho MinIO
- [ ] Monitor storage usage và cleanup old files
- [ ] Add image thumbnail generation (preview sizes)
- [ ] Implement video optimization (ffmpeg)
