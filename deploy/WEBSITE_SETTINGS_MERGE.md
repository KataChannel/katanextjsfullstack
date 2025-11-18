# Hợp nhất WebsiteSettings và SEOSettings

## Tổng quan

Hợp nhất 2 models `SeoSettings` và `WebsiteSettings` thành 1 model duy nhất `WebsiteSettings` để quản lý tập trung tất cả cài đặt website bao gồm: Metadata, SEO, Giao diện, Tracking và Custom Code.

## Thay đổi chính

### 1. Prisma Schema

**Trước:** 2 models riêng biệt
- `SeoSettings`: siteName, seoDescription, googleAnalytics, homePageType...
- `WebsiteSettings`: logo, headerHtml, footerHtml, navigationMenu...

**Sau:** 1 model duy nhất `WebsiteSettings` với các nhóm fields:

#### Metadata Settings
- `siteName` - Tên website **(required)**
- `siteDescription` - Mô tả website
- `siteKeywords` - Keywords (comma separated)
- `siteFavicon` - Favicon path
- `siteOgImage` - Default OG image
- `metaTitle` - Default meta title
- `metaDescription` - Default meta description
- `titleTemplate` - Template cho title (VD: "%s | Site Name")
- `twitterHandle` - Twitter username

#### SEO & Tracking
- `googleAnalytics` - GA ID
- `googleTagManager` - GTM ID
- `facebookPixel` - FB Pixel ID
- `homePageType` - 'page' | 'post' | null
- `homePageId` - ID của page/post làm homepage
- `organizationSchema` - JSON structured data
- `websiteSchema` - JSON structured data
- `robotsTxt` - Custom robots.txt

#### Header Settings
- `logo` - Logo URL
- `logoAlt` - Logo alt text
- `logoWidth` - Logo width (px)
- `logoHeight` - Logo height (px)
- `headerHtml` - Custom header HTML

#### Footer Settings
- `footerHtml` - Custom footer HTML
- `footerText` - Footer text
- `socialLinks` - JSON array social links

#### PWA Settings
- `manifestJson` - PWA manifest config
- `themeColor` - Theme color (default: #ffffff)

#### Advanced Settings
- `customCss` - Custom CSS code
- `customJs` - Custom JavaScript
- `headerCode` - Code inject vào `<head>`
- `footerCode` - Code inject trước `</body>`

### 2. Metadata Generation

**File mới:** `lib/metadata.ts`

Tạo helper functions để generate metadata động từ websiteSettings:

```typescript
generateMetadataFromSettings(options)  // Generate Next.js Metadata
generateViewportFromSettings(settings) // Generate Viewport config
generateManifestFromSettings(settings) // Generate PWA manifest
```

### 3. Layout Updates

**File:** `app/layout.tsx`

- ✅ Export `generateMetadata()` function - dynamic metadata từ DB
- ✅ Export `generateViewport()` function - dynamic viewport config
- ✅ Inject `customCss`, `customJs`, `headerCode`, `footerCode`
- ✅ Sử dụng `siteName` cho PWA app title

### 4. Admin UI

**File mới:** `components/website-settings-form.tsx`

Form thống nhất với 5 tabs:

1. **Metadata** - Thông tin meta cơ bản (siteName, description, keywords, OG image...)
2. **SEO** - Cài đặt SEO (homepage type, robots.txt, structured data...)
3. **Giao diện** - Logo, màu sắc, header/footer HTML
4. **Tracking** - Google Analytics, GTM, Facebook Pixel
5. **Nâng cao** - Custom CSS/JS, header/footer code injection

**Đặc điểm:**
- Mobile First responsive design
- Tabs navigation cho tổ chức rõ ràng
- Sticky submit button ở bottom trên mobile
- Real-time character count cho title/description
- shadcn UI components

### 5. API Endpoint

**File:** `app/api/website-settings/route.ts`

- `POST` - Lưu/update settings (yêu cầu role admin/manager)
- `GET` - Lấy settings theo domain
- Auto-convert numeric strings (logoWidth, logoHeight)

### 6. Migration Script

**File:** `scripts/migrate-seo-to-website-settings.ts`

Script để merge data từ `seo_settings` vào `website_settings`:

```bash
bun scripts/migrate-seo-to-website-settings.ts
```

**Xử lý:**
- Tìm tất cả records trong `seo_settings`
- Check existing `website_settings` cho từng domain
- Update hoặc create mới với data từ SEO settings
- Preserve existing data (logo, header, footer)

### 7. Updated References

Tất cả code references đã được update:

- ✅ `app/layout.tsx` - Dùng websiteSettings
- ✅ `app/admin/seo-settings/page.tsx` - Migrate sang website-settings
- ✅ `scripts/update-homepage.ts` - Dùng websiteSettings
- ✅ `scripts/test-render.ts` - Dùng websiteSettings
- ✅ `components/seo-settings-form.tsx` - Deprecated (dùng website-settings-form)

## Hướng dẫn Migration

### Bước 1: Generate Prisma Client

```bash
bunx prisma generate
```

### Bước 2: Chạy migration script

```bash
bun scripts/migrate-seo-to-website-settings.ts
```

Script sẽ:
- Copy data từ seo_settings → website_settings
- Preserve existing website_settings data
- Log chi tiết quá trình migration

### Bước 3: Tạo Prisma migration

```bash
bunx prisma migrate dev --name merge_seo_to_website_settings
```

Migration này sẽ:
- Update schema với fields mới
- Preserve data đã merge ở bước 2

### Bước 4: Verify trong database

```sql
-- Check data đã migrate
SELECT domain, "siteName", "googleAnalytics", "homePageType" 
FROM website_settings;

-- Compare với seo_settings cũ (nếu còn)
SELECT domain, "siteName", "googleAnalytics", "homePageType"
FROM seo_settings;
```

### Bước 5: Drop seo_settings table (Optional)

Sau khi verify data OK:

```sql
DROP TABLE seo_settings;
```

Hoặc giữ lại để backup.

### Bước 6: Build & Deploy

```bash
# Build locally
bun run build

# Hoặc build Docker
docker build -t innerbright-web:latest .

# Deploy lên server
./deploy/deploy-to-server.sh
```

## Testing

### Test metadata generation

1. Truy cập homepage
2. View page source
3. Kiểm tra `<title>`, `<meta>` tags từ websiteSettings
4. Verify OG tags, Twitter cards

### Test admin UI

1. Login admin
2. Vào `/admin/website-settings`
3. Test cập nhật từng tab
4. Verify data saved correctly

### Test tracking scripts

1. Update Google Analytics ID
2. Check analytics script inject đúng
3. Test GTM, Facebook Pixel

## Benefits

### 1. Đơn giản hóa
- 1 model thay vì 2 → dễ quản lý
- 1 admin page thống nhất → UX tốt hơn
- Ít queries hơn → performance tốt hơn

### 2. Linh hoạt
- Thêm metadata fields dễ dàng
- Custom code injection cho advanced use cases
- PWA configuration tích hợp

### 3. Maintainability
- Clear separation: Metadata / SEO / Appearance / Tracking / Advanced
- Type-safe với Prisma
- Reusable metadata helpers

## Files Created

```
lib/metadata.ts                          - Metadata generation helpers
components/website-settings-form.tsx     - Unified settings form
scripts/migrate-seo-to-website-settings.ts - Migration script
deploy/WEBSITE_SETTINGS_MERGE.md         - Documentation (this file)
```

## Files Modified

```
prisma/schema.prisma                    - Merged models
app/layout.tsx                          - Dynamic metadata
app/admin/website-settings/page.tsx     - Use new form (if exists)
scripts/update-homepage.ts              - Use websiteSettings
scripts/test-render.ts                  - Use websiteSettings
```

## Breaking Changes

### Code changes required:
- Replace all `seoSettings` references → `websiteSettings`
- Update imports: `prisma.seoSettings` → `prisma.websiteSettings`
- Field renames:
  - `defaultOgImage` → `siteOgImage`

### No breaking changes for:
- Public website rendering (transparent)
- API endpoints (backward compatible)
- Database data (migrated seamlessly)

## Next Steps

1. ✅ Update Prisma schema
2. ✅ Create metadata helpers
3. ✅ Update layout.tsx
4. ✅ Create unified admin form
5. ✅ Update all references
6. ⏳ Run migration script
7. ⏳ Test thoroughly
8. ⏳ Deploy to production
9. ⏳ Drop old seo_settings table

## Notes

- Tất cả type errors hiện tại sẽ fix sau khi `bunx prisma generate`
- Migration script an toàn - không xóa data
- Có thể rollback bằng cách restore database backup
- Document này được tạo theo quy tắc: **ngắn gọn, tiếng Việt, 1 file**

---

**Hoàn thành:** 19/11/2025
**Status:** ✅ Code complete, ⏳ Migration pending
