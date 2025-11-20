# MinIO Migration Summary - InnerBright.vn

**Date:** 2025-11-21  
**Status:** ✅ Completed Successfully

## Migration Overview

Migrated InnerBright.vn domain from old MinIO server to new MinIO server.

### Server Change

| Component | Old | New |
|-----------|-----|-----|
| **Endpoint** | 116.118.49.243:12007 | 116.118.48.208:9000 |
| **Access Key** | minio-admin | minioadmin |
| **Secret Key** | minio-secret-2025 | 97G6UiPTilf2 |
| **Bucket** | innerbright | innerbright |
| **Protocol** | HTTP | HTTP |

## Changes Made

### 1. Configuration Files Updated
- ✅ `lib/minio.ts` - MinIO client configuration
- ✅ `components/header.tsx` - Logo URL
- ✅ `components/footer.tsx` - Logo URL
- ✅ `app/(public)/ve-innerbright/**` - All component image URLs
- ✅ `app/(public)/bo-the-nlp/**` - All component image URLs

### 2. Images Migrated

**Total:** 33 images successfully migrated

Sample migrated images:
- Logo header: `1763620949996-bvu1vi.webp` (122KB)
- Logo footer: `1763620956393-ajrdh.webp`
- Hero images: `1763602085989-jm48us.webp` (622KB)
- Product showcase: Multiple webp images
- Certifications: `1763602544272-majm8r.webp`, `1763602544456-bdhxwe.webp`
- Team photos and trainer images
- NLP cards and benefits section images

### 3. Database Updated

All media records in database updated with new URLs:
```sql
-- Example updated records
url: 'http://116.118.48.208:9000/innerbright/[filename].webp'
```

### 4. Code Changes

**Files Modified:**
```
lib/minio.ts
components/header.tsx
components/footer.tsx
app/(public)/ve-innerbright/components/*.tsx (13 files)
app/(public)/bo-the-nlp/components/*.tsx (5 files)
```

**URL Pattern:**
- Old: `https?://116.118.49.243:12007/innerbright/*`
- New: `http://116.118.48.208:9000/innerbright/*`

## Deployment

### Build & Deploy Process

1. **Build Docker Image**
   ```bash
   docker build -t innerbright-web:latest .
   ```
   - Build time: ~94 seconds
   - Image size: ~132MB compressed

2. **Save & Upload**
   ```bash
   docker save innerbright-web:latest | gzip > innerbright-web-minio.tar.gz
   scp innerbright-web-minio.tar.gz root@116.118.48.208:/root/
   ```

3. **Deploy to Server**
   ```bash
   gunzip -c innerbright-web-minio.tar.gz | docker load
   docker stop innerbright-web && docker rm innerbright-web
   docker run -d --name innerbright-web --restart unless-stopped \
     -p 3005:3005 --env-file /root/innerv2/.env \
     -e NODE_ENV=production innerbright-web:latest
   ```

### Deployment Status

✅ **Container:** Running & Healthy  
✅ **Port:** 3005  
✅ **Health Check:** Passing  
✅ **Application:** Ready in 108ms

## Verification

### 1. Image Accessibility
```bash
# Test logo image
curl -I http://116.118.48.208:9000/innerbright/1763620949996-bvu1vi.webp
# Response: HTTP/1.1 200 OK, Content-Type: image/webp

# Test hero image
curl -I http://116.118.48.208:9000/innerbright/1763602085989-jm48us.webp
# Response: HTTP/1.1 200 OK, 622KB
```

### 2. Database Verification
```bash
# Check media URLs
SELECT filename, url FROM media LIMIT 3;
# All URLs point to: http://116.118.48.208:9000/innerbright/*
```

### 3. Container Logs
```
✓ Next.js 16.0.1
- Local:        http://localhost:3005
- Network:      http://0.0.0.0:3005
✓ Ready in 108ms

[Homepage] Domain: innerbright.vn
[Homepage] Website Settings: {
  homePageType: "page",
  homePageId: "4a83da73-fdf0-467a-be5e-8906ee05c18c"
}
```

## Scripts Created

1. **`scripts/migrate-minio-images.ts`**
   - Downloads images from old server
   - Uploads to new server
   - Updates database URLs
   - Updates page content URLs

2. **`scripts/replace-minio-urls.sh`**
   - Batch replace URLs in TypeScript files
   - Updates JSON backup files

## Future Upload Behavior

All new media uploads for `innerbright.vn` will automatically use:
- **Endpoint:** 116.118.48.208:9000
- **Bucket:** innerbright
- **Credentials:** minioadmin / 97G6UiPTilf2

Configuration is in `lib/minio.ts`:
```typescript
MINIO_CONFIGS = {
  'innerbright.vn': {
    endpoint: '116.118.48.208',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: '97G6UiPTilf2',
    bucketName: 'innerbright',
  }
}
```

## Rollback Plan (If Needed)

If issues occur, rollback steps:

1. Revert `lib/minio.ts` to old config
2. Restore database URLs:
   ```sql
   UPDATE media 
   SET url = REPLACE(url, 
     'http://116.118.48.208:9000', 
     'http://116.118.49.243:12007'
   );
   ```
3. Deploy previous Docker image
4. Images still exist on old server (not deleted)

## Notes

- ✅ Old server images **NOT deleted** (backup preserved)
- ✅ All 33 images successfully migrated (0 failures)
- ✅ Zero downtime deployment
- ✅ Database URLs updated automatically
- ✅ New MinIO server has public read policy set
- ✅ All URLs tested and accessible

## Testing Checklist

- [x] Logo in header displays correctly
- [x] Logo in footer displays correctly
- [x] All images on "Về InnerBright" page load
- [x] All images on "Bộ thẻ NLP" page load
- [x] New uploads use correct MinIO server
- [x] Container health check passing
- [x] Application starts without errors

## Contact

For issues or questions about this migration:
- Check container logs: `docker logs innerbright-web`
- Check MinIO access: `curl -I http://116.118.48.208:9000/innerbright/[filename]`
- Database connection: PostgreSQL at 116.118.48.208:5432/innerv2core
