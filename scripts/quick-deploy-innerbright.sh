#!/bin/bash

# ============================================
# Quick Deploy - Copy only changed files to server
# Faster than full rebuild
# ============================================

set -e

SERVER="root@116.118.48.208"
REMOTE_DIR="/var/www/innerbright"

echo "🚀 Quick deployment to InnerBright production..."

# Upload only modified files
echo ""
echo "📤 Uploading modified files..."

scp lib/auth.ts $SERVER:$REMOTE_DIR/lib/auth.ts
scp middleware.ts $SERVER:$REMOTE_DIR/middleware.ts

echo "✅ Files uploaded"

# Restart container
echo ""
echo "🔄 Restarting container..."

ssh $SERVER << 'ENDSSH'
cd /var/www/innerbright
docker-compose restart innerbright-web
sleep 5
docker ps | grep innerbright-web
echo "✅ Container restarted"
ENDSSH

echo ""
echo "============================================"
echo "✅ Quick deployment completed!"
echo "============================================"
echo ""
echo "Note: This only updated source files, not node_modules"
echo "For full deployment with dependencies, use full rebuild"
echo ""
