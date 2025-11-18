# 📦 Hướng Dẫn Backup & Restore Multi-Domain

## 🎯 Tổng quan

Hệ thống backup/restore cho phép sao lưu và khôi phục dữ liệu JSON riêng biệt cho từng domain trong dự án multi-tenant.

## 🏗️ Cấu trúc

### Domains được hỗ trợ:
- **tazagroup.vn** → Database: `tazacore`
- **innerbright.vn** → Database: `innerv2core`
- **kataseo.com** → Database: `kataseo`

### Cấu trúc backup:
```
backups/
├── tazagroup.vn/
│   ├── tazagroup.vn_20250118_120000.tar.gz
│   └── tazagroup.vn_20250118_150000.tar.gz
├── innerbright.vn/
│   └── innerbright.vn_20250118_120000.tar.gz
└── kataseo.com/
    └── kataseo.com_20250118_120000.tar.gz
```

Mỗi backup chứa:
- JSON files cho từng table (User, Menu, Post, Page, Media, etc.)
- metadata.json (thông tin về backup)

## 🚀 Sử dụng

### 1. Interactive Menu (Đơn giản nhất)

```bash
./scripts/backup-manager.sh
```

Menu bao gồm:
1. List all backups - Xem tất cả backup
2. Backup single domain - Backup 1 domain
3. Backup all domains - Backup tất cả domains
4. Restore domain - Khôi phục từ backup
5. Clean old backups - Xóa backup cũ

### 2. Command Line - Backup

#### Backup tất cả domains:
```bash
./scripts/backup-domain.sh
```

#### Backup domain cụ thể:
```bash
./scripts/backup-domain.sh tazagroup.vn
./scripts/backup-domain.sh innerbright.vn
./scripts/backup-domain.sh kataseo.com
```

**Output:**
```
============================================
📦 Multi-Domain Database Backup
============================================

🔄 Backing up: tazagroup.vn
  📊 Exporting tables...
  ✓ Exported User: 15 records
  ✓ Exported Menu: 8 records
  ✓ Exported Post: 42 records
  ...
  🗜️  Compressing backup...
  ✅ Backup completed: 2.3MB
     Location: backups/tazagroup.vn/tazagroup.vn_20250118_120000.tar.gz
```

### 3. Command Line - Restore

#### List available backups:
```bash
ls -lh backups/tazagroup.vn/
```

#### Restore từ backup:
```bash
./scripts/restore-domain.sh tazagroup.vn 20250118_120000
```

**Sẽ hỏi confirm:**
```
🔄 Restoring: tazagroup.vn (20250118_120000)
⚠️  WARNING: This will overwrite existing data!

Continue? (yes/no): yes
```

**Output:**
```
📂 Extracting backup...
📊 Loading metadata...
🔄 Restoring tables...
  📥 Importing User...
  ✓ Imported User: 15 records
  📥 Importing Menu...
  ✓ Imported Menu: 8 records
  ...

============================================
✅ Restore Completed!
============================================
Domain: tazagroup.vn
Tables restored: 10/10
```

## 🔧 Advanced Usage

### 4. TypeScript Scripts (Direct database access)

#### Export data:
```bash
# Export với DATABASE_URL từ .env
bun run scripts/export-data.ts ./my-export

# Export domain cụ thể
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:13003/tazacore" \
  bun run scripts/export-data.ts ./taza-export
```

#### Import data:
```bash
# Import (giữ data cũ)
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:13003/tazacore" \
  bun run scripts/import-data.ts ./taza-export

# Import và xóa data cũ
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:13003/tazacore" \
  bun run scripts/import-data.ts ./taza-export --clear
```

## 📋 Tables được backup

- **User** - Người dùng
- **Menu** - Menu hệ thống
- **MenuPermission** - Quyền menu
- **Post** - Bài viết
- **Page** - Trang static
- **Media** - File upload
- **SeoSettings** - Cấu hình SEO
- **Contact** - Liên hệ
- **BlockTemplate** - Template blocks
- **PageBuilderBlock** - Page builder blocks

## ⚠️ Lưu ý quan trọng

### 1. Database Connection
Scripts sử dụng connection strings được cấu hình sẵn:
```bash
tazagroup.vn   → postgresql://postgres:postgres@116.118.49.243:13003/tazacore
innerbright.vn → postgresql://postgres:postgres@116.118.49.243:13003/innerv2core
kataseo.com    → postgresql://postgres:postgres@116.118.49.243:13003/kataseo
```

### 2. Restore sẽ XÓA dữ liệu cũ
Restore sẽ xóa toàn bộ data trong table trước khi import data mới. **Luôn backup trước khi restore!**

### 3. Relations & Dependencies
Import được thực hiện theo thứ tự dependency để tránh lỗi foreign key:
1. User (không phụ thuộc)
2. Menu → MenuPermission
3. Media → Post → Page
4. Etc.

### 4. Disk Space
Mỗi backup thường chiếm 1-5MB (tùy dữ liệu). Nên clean backup cũ định kỳ.

## 🧹 Maintenance

### Clean old backups

#### Interactive:
```bash
./scripts/backup-manager.sh
# Chọn option 5
```

#### Auto clean (giữ 5 backups mới nhất):
```bash
# Add to cron job
0 0 * * 0 cd /path/to/project && ./scripts/backup-domain.sh && \
  find backups/ -name "*.tar.gz" -type f -mtime +30 -delete
```

### Automated Backups

#### Daily backup cron job:
```bash
# Edit crontab
crontab -e

# Add line (backup all domains at 2 AM daily)
0 2 * * * cd /path/to/project && ./scripts/backup-domain.sh >> /var/log/backup.log 2>&1
```

## 🔍 Troubleshooting

### Error: "Backup file not found"
```bash
# List available backups
ls -lh backups/tazagroup.vn/

# Check timestamp format (YYYYMMDD_HHMMSS)
./scripts/restore-domain.sh tazagroup.vn 20250118_120000
```

### Error: "Table does not exist"
Bình thường - table chưa được tạo trong database. Script sẽ skip table đó.

### Error: "Cannot connect to database"
```bash
# Check database connection
psql "postgresql://postgres:postgres@116.118.49.243:13003/tazacore" -c "SELECT 1;"
```

### Error: "Prisma Client out of sync"
```bash
# Regenerate Prisma Client
bun run db:generate
```

## 📊 Example Workflow

### Migrate data từ production về local:

```bash
# 1. Backup từ production
ssh root@production-server
cd /var/www/project
./scripts/backup-domain.sh tazagroup.vn

# 2. Download backup về local
scp root@production-server:/var/www/project/backups/tazagroup.vn/tazagroup.vn_*.tar.gz \
  ./backups/tazagroup.vn/

# 3. Restore trên local
./scripts/restore-domain.sh tazagroup.vn 20250118_120000
```

### Clone data từ domain này sang domain khác:

```bash
# 1. Backup domain nguồn
./scripts/backup-domain.sh tazagroup.vn

# 2. Extract backup
cd backups/tazagroup.vn
tar -xzf tazagroup.vn_20250118_120000.tar.gz

# 3. Import vào domain đích
DATABASE_URL="postgresql://postgres:postgres@116.118.49.243:13003/innerv2core" \
  bun run scripts/import-data.ts backups/tazagroup.vn/20250118_120000 --clear
```

## ✅ Best Practices

1. **Backup trước khi deploy** - Luôn backup trước khi deploy code mới
2. **Test restore** - Định kỳ test restore trên staging
3. **Multiple backups** - Giữ ít nhất 3-5 backups gần nhất
4. **Off-site backup** - Copy backup quan trọng ra ngoài server
5. **Document changes** - Ghi chú metadata trong mỗi backup quan trọng

## 🎯 Quick Commands

```bash
# Backup all
./scripts/backup-domain.sh

# Backup one
./scripts/backup-domain.sh tazagroup.vn

# List backups
ls -lht backups/*/

# Restore
./scripts/restore-domain.sh tazagroup.vn 20250118_120000

# Interactive menu
./scripts/backup-manager.sh
```

---

**⚡ Tip:** Sử dụng `backup-manager.sh` cho interface đơn giản và dễ dùng!
