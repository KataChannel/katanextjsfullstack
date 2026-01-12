#!/bin/bash

# ============================================
# Quick Fix - Chỉ cần restart container
# Vì user đã được fix trong database rồi
# ============================================

echo "🚀 Restarting InnerBright container..."

# Restart container để clear cache
ssh root@116.118.48.208 << 'ENDSSH'
cd /var/www/innerbright

# Stop container
echo "Stopping container..."
docker-compose stop innerbright-web

# Start container
echo "Starting container..."
docker-compose up -d innerbright-web

# Wait for container to be ready
echo "Waiting for container to start..."
sleep 5

# Check status
echo ""
echo "Container status:"
docker ps | grep innerbright-web

echo ""
echo "✅ Container restarted!"
ENDSSH

echo ""
echo "============================================"
echo "✅ Quick fix completed!"
echo "============================================"
echo ""
echo "Test now:"
echo "1. Go to: https://innerbright.vn/auth/login"
echo "2. Login with: katachanneloffical@gmail.com"
echo "3. Should redirect to /admin"
echo ""
