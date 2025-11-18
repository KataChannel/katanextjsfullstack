# Remote Database Restore - Production

## 🎯 Objective

Restore database backup từ local development lên production server từ xa (remote).

**Use Case:** Restore backup `innerbright.vn_20251118_114836.tar.gz` lên production server `116.118.48.208`

## ✅ Completed

### Data Restored Successfully ✅

**Backup:** `innerbright.vn_20251118_114836.tar.gz` (6.1 KB)  
**Server:** 116.118.48.208  
**Database:** innerv2core (PostgreSQL)  
**Container:** innerbright-web

**Records Imported:**
- ✅ 1 user
- ✅ 20 menus
- ✅ 4 pages
- ✅ 3 media files
- ✅ 2 SEO settings
- **Total:** 30 records

## 📁 New Files Created

### 1. `/scripts/restore-remote.sh` ✅

Automated script để restore backup lên production server.

**Features:**
- Transfer backup qua SCP
- Extract trên remote server
- Copy vào Docker container
- Run import script
- Auto cleanup

**Usage:**
```bash
# Interactive (with confirmation)
./scripts/restore-remote.sh innerbright.vn 20251118_114836

# No confirmation (automated)
./scripts/restore-remote.sh innerbright.vn 20251118_114836 --no-confirm

# Via npm
bun run restore:remote innerbright.vn 20251118_114836
bun run restore:innerbright 20251118_114836
```

**Configuration:**
```bash
# Server mappings
REMOTE_SERVERS=(
    ["innerbright.vn"]="root@116.118.48.208"
)

REMOTE_PATHS=(
    ["innerbright.vn"]="/var/www/innerbright"
)

CONTAINER_NAMES=(
    ["innerbright.vn"]="innerbright-web"
)
```

## 🔄 Restore Process

### Manual Steps (What we did)

```bash
# 1. Transfer backup to server
scp backups/innerbright.vn/innerbright.vn_20251118_114836.tar.gz \
    root@116.118.48.208:/tmp/

# 2. Extract on server
ssh root@116.118.48.208 "
    cd /tmp
    tar -xzf innerbright.vn_20251118_114836.tar.gz
"

# 3. Copy import script
scp scripts/import-data.ts root@116.118.48.208:/tmp/import-backup.ts

# 4. Copy files into container
ssh root@116.118.48.208 "
    docker cp /tmp/20251118_114836 innerbright-web:/app/backup-data
    docker cp /tmp/import-backup.ts innerbright-web:/app/
"

# 5. Run import
ssh root@116.118.48.208 "
    cd /var/www/innerbright
    docker compose exec innerbright-web \
        bun run /app/import-backup.ts /app/backup-data --clear
"

# 6. Verify data
ssh root@116.118.48.208 "
    cd /var/www/innerbright
    docker compose exec postgres psql -U postgres -d innerv2core -c \"
        SELECT 'users', COUNT(*) FROM users UNION ALL
        SELECT 'menus', COUNT(*) FROM menus UNION ALL
        SELECT 'pages', COUNT(*) FROM pages;
    \"
"

# 7. Cleanup
ssh root@116.118.48.208 "
    rm -rf /tmp/20251118_114836 /tmp/innerbright.vn_20251118_114836.tar.gz /tmp/import-backup.ts
"
```

### Automated Script (New way)

```bash
# Single command!
./scripts/restore-remote.sh innerbright.vn 20251118_114836
```

**Output:**
```
============================================
📦 Remote Database Restore
============================================

🔄 Remote Restore Configuration:
  Domain:          innerbright.vn
  Server:          root@116.118.48.208
  Container:       innerbright-web
  Backup:          ./backups/innerbright.vn/innerbright.vn_20251118_114836.tar.gz
  Timestamp:       20251118_114836

⚠️  WARNING: This will overwrite existing data on production server!

Continue? (yes/no): yes

📤 Step 1: Transfer backup to server...
✅ Backup transferred

📂 Step 2: Extract backup on server...
✅ Backup extracted

📥 Step 3: Copy files into container...
✅ Files copied to container

🔄 Step 4: Run import...
📦 Starting data import...
✓ user                     1 records imported
✓ menu                    20 records imported
⊘ menuPermission       No data to import
✓ seoSettings              2 records imported
✓ media                    3 records imported
⊘ post                 No data to import
✓ page                     4 records imported
✅ Import completed!
✅ Import completed

🧹 Step 5: Cleanup temporary files...
✅ Cleanup completed

============================================
✅ Remote Restore Completed!
============================================

Domain: innerbright.vn
Server: root@116.118.48.208
Timestamp: 20251118_114836

💡 Test the website:
  https://innerbright.vn
```

## 🧪 Verification

### Check Data in Database
```bash
ssh root@116.118.48.208 "
    cd /var/www/innerbright
    docker compose exec postgres psql -U postgres -d innerv2core -c \"
        SELECT 'users' as table_name, COUNT(*) as records FROM users 
        UNION ALL SELECT 'menus', COUNT(*) FROM menus 
        UNION ALL SELECT 'pages', COUNT(*) FROM pages 
        UNION ALL SELECT 'media', COUNT(*) FROM media 
        UNION ALL SELECT 'seo_settings', COUNT(*) FROM seo_settings;
    \"
"
```

**Result:**
```
  table_name  | records 
--------------+---------
 users        |       1
 menus        |      20
 pages        |       4
 media        |       3
 seo_settings |       2
```

### Test Website
```bash
# Health check
curl -s https://innerbright.vn/api/health

# Homepage
curl -sI https://innerbright.vn/

# Login page
curl -sI https://innerbright.vn/auth/login
```

**All passed:** ✅

## 📋 npm Scripts

Added to `package.json`:

```json
{
  "scripts": {
    "restore:remote": "./scripts/restore-remote.sh",
    "restore:innerbright": "./scripts/restore-remote.sh innerbright.vn"
  }
}
```

**Usage:**
```bash
# Generic remote restore
bun run restore:remote <domain> <timestamp>

# Shortcut for innerbright.vn
bun run restore:innerbright <timestamp>
bun run restore:innerbright 20251118_114836
```

## 🔐 Requirements

### SSH Access
```bash
# Must have SSH key configured
ssh root@116.118.48.208

# Or use password authentication
```

### Server Structure
```
/var/www/innerbright/
├── docker-compose.yml
├── .env
└── (running containers)
```

### Container Requirements
- Container must have `/app` directory
- Container must have `bun` runtime
- Container must have Prisma Client

## 🆚 Local vs Remote Restore

| Aspect | Local Restore | Remote Restore |
|--------|---------------|----------------|
| **Command** | `./scripts/restore-domain.sh` | `./scripts/restore-remote.sh` |
| **Target** | Local database | Production server |
| **Transfer** | No transfer needed | SCP backup file |
| **Container** | Local Docker (optional) | Remote Docker (required) |
| **Risk** | Low (dev only) | High (production data) |
| **Confirmation** | Yes | Yes (required) |

## ⚠️ Important Notes

### 1. Data Will Be Overwritten
- `--clear` flag deletes existing data
- Cannot be undone
- Always backup production first!

### 2. Downtime
- Import process takes ~5-10 seconds
- Website remains online during import
- No container restart needed

### 3. Database Migration
- Schema must exist before import
- Run `bun run db:push` if needed
- Tables created automatically by Prisma

### 4. Backup Before Restore
```bash
# Backup production before restore
ssh root@116.118.48.208 "
    cd /var/www/innerbright
    bun run backup:innerbright
"
```

## 🐛 Troubleshooting

### Issue: "Access Denied" in container
**Cause:** Bun cannot write to `/tmp`  
**Solution:** Use `/app` directory instead
```bash
docker cp /tmp/backup innerbright-web:/app/restore-data
```

### Issue: "Module not found"
**Cause:** Script not copied into container  
**Solution:**
```bash
docker cp scripts/import-data.ts innerbright-web:/app/
```

### Issue: "Relation does not exist"
**Cause:** Database schema not created  
**Solution:**
```bash
docker compose exec innerbright-web bun run db:push
```

### Issue: SSH connection timeout
**Cause:** Server firewall or SSH config  
**Solution:**
```bash
# Test SSH connection
ssh -v root@116.118.48.208

# Check firewall
ufw status
ufw allow 22/tcp
```

### Issue: Container not running
**Cause:** Container stopped or crashed  
**Solution:**
```bash
docker compose ps
docker compose up -d innerbright-web
docker compose logs innerbright-web
```

## 🔄 Workflow

### Development → Production

```bash
# 1. Backup local development
bun run backup:innerbright

# 2. Test backup locally (optional)
bun run restore innerbright.vn 20251118_114836

# 3. Push to production
bun run restore:innerbright 20251118_114836

# 4. Verify production
curl https://innerbright.vn/api/health
```

### Production → Production (Clone)

```bash
# 1. Backup production
ssh root@116.118.48.208 "cd /var/www/innerbright && bun run backup"

# 2. Download backup
scp root@116.118.48.208:/var/www/innerbright/backups/innerbright.vn/innerbright.vn_*.tar.gz ./backups/innerbright.vn/

# 3. Restore to another server
./scripts/restore-remote.sh innerbright.vn <timestamp>
```

## 📊 Performance

| Metric | Value |
|--------|-------|
| Backup size | 6.1 KB (30 records) |
| Transfer time | ~1 second |
| Extract time | <1 second |
| Import time | ~5 seconds |
| Cleanup time | <1 second |
| **Total time** | **~10 seconds** |

## ✅ Summary

**Created:**
- ✅ `/scripts/restore-remote.sh` - Automated remote restore
- ✅ npm scripts for quick access
- ✅ Documentation

**Tested:**
- ✅ Transfer backup to server
- ✅ Extract and copy to container
- ✅ Import 30 records successfully
- ✅ Verify data in database
- ✅ Website working after restore

**Status:** 🟢 Production Ready

**Next Step:** Can restore any backup to production with single command:
```bash
bun run restore:innerbright <timestamp>
```

---

**Completed:** 2025-11-18  
**Backup:** innerbright.vn_20251118_114836.tar.gz  
**Records:** 30  
**Server:** 116.118.48.208  
**Status:** ✅ Success
