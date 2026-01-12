#!/bin/bash

# ============================================
# DATABASE BACKUP SCRIPT
# Backup tất cả databases của multi-domain
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

# Config
DB_HOST="116.118.49.243"
DB_PORT="13003"
DB_USER="postgres"
BACKUP_DIR="/var/backups/postgres"
DATE=$(date +%Y%m%d_%H%M%S)
RETENTION_DAYS=30

# Databases to backup
DATABASES=("tazagroupvn" "tazaskinclinic" "timona" "hderma" "elasome")

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}💾 Multi-Domain Database Backup${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Create backup directory
mkdir -p $BACKUP_DIR

echo -e "${YELLOW}📂 Backup directory: $BACKUP_DIR${NC}"
echo -e "${YELLOW}📅 Date: $DATE${NC}"
echo ""

# Backup each database
for db in "${DATABASES[@]}"; do
    echo -e "${BLUE}📦 Backing up database: $db${NC}"
    
    BACKUP_FILE="$BACKUP_DIR/${db}_${DATE}.sql"
    
    # Run pg_dump
    PGPASSWORD="postgres" pg_dump \
        -h $DB_HOST \
        -p $DB_PORT \
        -U $DB_USER \
        -d $db \
        --no-owner \
        --no-acl \
        -F c \
        -f "$BACKUP_FILE.dump"
    
    if [ $? -eq 0 ]; then
        # Compress backup
        gzip "$BACKUP_FILE.dump"
        SIZE=$(du -h "$BACKUP_FILE.dump.gz" | cut -f1)
        echo -e "${GREEN}✅ Backup completed: $SIZE${NC}"
    else
        echo -e "${RED}❌ Backup failed for $db${NC}"
    fi
    echo ""
done

# Cleanup old backups
echo -e "${YELLOW}🧹 Cleaning up old backups (older than $RETENTION_DAYS days)...${NC}"
find $BACKUP_DIR -name "*.dump.gz" -mtime +$RETENTION_DAYS -delete
echo -e "${GREEN}✅ Cleanup completed${NC}"
echo ""

# Show backup summary
echo -e "${BLUE}📊 Backup Summary:${NC}"
echo -e "${YELLOW}Total backups:${NC}"
ls -lh $BACKUP_DIR/*_${DATE}.dump.gz 2>/dev/null | wc -l
echo ""
echo -e "${YELLOW}Total disk usage:${NC}"
du -sh $BACKUP_DIR
echo ""

echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Backup process completed!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""

# Show restore command example
echo -e "${BLUE}💡 To restore a backup:${NC}"
echo -e "${YELLOW}gunzip -c /path/to/backup.dump.gz | pg_restore -h $DB_HOST -p $DB_PORT -U $DB_USER -d database_name${NC}"
echo ""
