#!/bin/bash

# ============================================
# ROLLBACK SCRIPT
# Rollback to previous version
# ============================================

set -e

# Configuration
REMOTE_SERVER="root@116.118.48.208"
REMOTE_DIR="/var/www/innerbright"

echo "🔄 Rollback innerbright.vn"
echo "=================================="
echo ""

# List recent backups
echo "📋 Available backups:"
ssh $REMOTE_SERVER "ls -lt $REMOTE_DIR/backups/ | head -10"
echo ""

# Get backup timestamp
read -p "Enter backup timestamp (YYYYMMDD_HHMMSS) or 'latest': " BACKUP_TS

if [ "$BACKUP_TS" = "latest" ]; then
    BACKUP_TS=$(ssh $REMOTE_SERVER "ls -t $REMOTE_DIR/backups/ | head -1")
    echo "Using latest backup: $BACKUP_TS"
fi

# Confirm
read -p "Rollback to $BACKUP_TS? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Rollback cancelled"
    exit 1
fi

# Perform rollback
ssh $REMOTE_SERVER << EOF
set -e
cd $REMOTE_DIR

BACKUP_DIR="backups/$BACKUP_TS"

if [ ! -d "\$BACKUP_DIR" ]; then
    echo "❌ Backup not found: \$BACKUP_DIR"
    exit 1
fi

echo "🔄 Rolling back database..."
if [ -f "\$BACKUP_DIR/database.sql.gz" ]; then
    gunzip -c "\$BACKUP_DIR/database.sql.gz" | docker exec -i innerbright-postgres psql -U postgres innerv2core
    echo "✅ Database restored"
else
    echo "⚠️  No database backup found"
fi

echo "🔄 Rolling back code..."
# Get git commit from backup if available
if [ -f "\$BACKUP_DIR/commit.txt" ]; then
    COMMIT=\$(cat "\$BACKUP_DIR/commit.txt")
    echo "Checking out commit: \$COMMIT"
    git checkout \$COMMIT
else
    echo "⚠️  No commit info found, skipping code rollback"
fi

echo "🔨 Rebuilding container..."
docker compose build innerbright-web
docker compose up -d innerbright-web

sleep 5
docker compose ps innerbright-web

echo "✅ Rollback completed!"
EOF

echo ""
echo "🧪 Testing..."
curl -s https://innerbright.vn/api/health | jq .
echo ""
echo "✅ Rollback successful!"
