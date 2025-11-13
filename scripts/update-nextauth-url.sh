#!/bin/bash

# Script tự động cập nhật NEXTAUTH_URL theo PORT
# Sử dụng: ./scripts/update-nextauth-url.sh 3005

PORT=${1:-3000}

echo "🔧 Updating NEXTAUTH_URL to port $PORT..."

# Update .env.local
if [ -f .env.local ]; then
  # Backup
  cp .env.local .env.local.bak
  
  # Update NEXTAUTH_URL
  sed -i "s|NEXTAUTH_URL=\"http://localhost:[0-9]*\"|NEXTAUTH_URL=\"http://localhost:$PORT\"|g" .env.local
  
  echo "✅ Updated .env.local"
  echo "   NEXTAUTH_URL=http://localhost:$PORT"
else
  echo "❌ .env.local not found"
  exit 1
fi

echo ""
echo "⚠️  IMPORTANT: Bạn cần thêm redirect URI vào Google Console:"
echo "   http://localhost:$PORT/api/auth/callback/google"
echo ""
echo "   Truy cập: https://console.cloud.google.com/apis/credentials"
echo "   Chọn OAuth 2.0 Client ID của bạn"
echo "   Thêm URI vào 'Authorized redirect URIs'"
echo ""
echo "✨ Done! Restart dev server để áp dụng."
