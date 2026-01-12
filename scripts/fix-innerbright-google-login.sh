#!/bin/bash

# ============================================
# Fix Google Login Bug - InnerBright Production
# Server: 116.118.48.208
# ============================================

set -e

SERVER="root@116.118.48.208"
REMOTE_DIR="/var/www/innerbright"
CONTAINER_NAME="innerbright-app"

echo "🚀 Starting fix deployment for InnerBright..."

# Step 1: Upload updated files
echo ""
echo "📤 Step 1: Uploading updated files to server..."
scp lib/auth.ts $SERVER:$REMOTE_DIR/lib/auth.ts
scp scripts/fix-admin-user.ts $SERVER:$REMOTE_DIR/scripts/fix-admin-user.ts
echo "✅ Files uploaded successfully"

# Step 2: Fix admin user in database (run inside container)
echo ""
echo "🔧 Step 2: Fixing admin user in production database..."
ssh $SERVER << 'ENDSSH'
cd /var/www/innerbright

# Check if container is running
if docker ps | grep -q innerbright-app; then
    echo "✅ Container is running"
    
    # Run fix script inside container
    echo "Running fix-admin-user script..."
    docker exec innerbright-app sh -c "DATABASE_URL='postgresql://postgres:2kOIU5HX98Nb@postgres:5432/innerv2core' bun run scripts/fix-admin-user.ts"
    
    echo "✅ Admin user fixed"
else
    echo "⚠️  Container not running, will fix after rebuild"
fi
ENDSSH

# Step 3: Rebuild and restart container
echo ""
echo "🔄 Step 3: Rebuilding and restarting container..."
ssh $SERVER << 'ENDSSH'
cd /var/www/innerbright

echo "Stopping container..."
docker-compose down innerbright-app || true

echo "Rebuilding container with new code..."
docker-compose build --no-cache innerbright-app

echo "Starting container..."
docker-compose up -d innerbright-app

echo "Waiting for container to be ready..."
sleep 10

# Check if container is running
if docker ps | grep -q innerbright-app; then
    echo "✅ Container started successfully"
    
    # Show container status
    docker ps | grep innerbright-app
    
    # If script wasn't run earlier, run it now
    echo ""
    echo "Running fix-admin-user script (final check)..."
    docker exec innerbright-app sh -c "DATABASE_URL='postgresql://postgres:2kOIU5HX98Nb@postgres:5432/innerv2core' bun run scripts/fix-admin-user.ts" || true
else
    echo "❌ Container failed to start"
    docker-compose logs --tail=50 innerbright-app
    exit 1
fi
ENDSSH

# Step 4: Verify deployment
echo ""
echo "✅ Step 4: Verifying deployment..."
ssh $SERVER << 'ENDSSH'
cd /var/www/innerbright

echo ""
echo "📊 Container Status:"
docker ps | grep innerbright || echo "⚠️  No innerbright containers found"

echo ""
echo "📝 Recent Logs:"
docker logs --tail=20 innerbright-app 2>&1 || echo "⚠️  Cannot fetch logs"
ENDSSH

echo ""
echo "============================================"
echo "🎉 Deployment completed!"
echo "============================================"
echo ""
echo "Next steps:"
echo "1. Open https://innerbright.vn in incognito/private window"
echo "2. Click 'Đăng nhập bằng Google'"
echo "3. Login with katachanneloffical@gmail.com"
echo "4. Verify you can access /admin"
echo ""
echo "If login still fails, check:"
echo "  - Google OAuth redirect URI: https://innerbright.vn/api/auth/callback/google"
echo "  - Container logs: ssh root@116.118.48.208 'docker logs innerbright-app'"
echo ""
