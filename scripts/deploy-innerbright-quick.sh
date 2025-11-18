#!/bin/bash

# ============================================
# QUICK DEPLOY SCRIPT
# Fast deployment without backup (use with caution)
# ============================================

set -e

# Configuration
REMOTE_SERVER="root@116.118.48.208"
REMOTE_DIR="/var/www/innerbright"
CONTAINER_NAME="innerbright-web"

echo "🚀 Quick Deploy to innerbright.vn"
echo "=================================="
echo ""

# Step 1: Git push
echo "📤 Pushing code..."
git add .
git commit -m "update: quick deploy $(date +%Y%m%d_%H%M%S)" || echo "No changes to commit"
git push origin webseo_dev3_alldomain
echo ""

# Step 2: Pull and rebuild on server
echo "🔄 Pulling and rebuilding on server..."
ssh $REMOTE_SERVER << 'EOF'
set -e
cd /var/www/innerbright

# Pull latest code
echo "📥 Pulling code..."
git pull origin webseo_dev3_alldomain

# Build and restart
echo "🔨 Building and restarting..."
docker compose build innerbright-web
docker compose up -d innerbright-web

# Wait for health
echo "⏳ Waiting for container..."
sleep 5

# Show status
docker compose ps innerbright-web
echo ""
echo "✅ Deployment completed!"
EOF

# Test
echo "🧪 Testing..."
curl -s https://innerbright.vn/api/health | jq .
echo ""
echo "✅ All done!"
