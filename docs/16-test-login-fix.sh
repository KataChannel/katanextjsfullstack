#!/bin/bash

# Quick Test Script for Login Fix
# After container rebuild completes

echo "🧪 Testing InnerBright Login..."
echo ""

# Test 1: Check container is running
echo "1️⃣ Checking container status..."
ssh root@116.118.48.208 'docker ps | grep innerbright-web'

echo ""
echo "2️⃣ Checking container logs (last 20 lines)..."
ssh root@116.118.48.208 'docker logs --tail=20 5bb42ad49a4f_innerbright-web'

echo ""
echo "3️⃣ Checking auth.ts file was updated..."
ssh root@116.118.48.208 'cat /var/www/innerbright/lib/auth.ts | grep -A 2 "useSecureCookies"'

echo ""
echo "============================================"
echo "✅ Pre-checks completed!"
echo "============================================"
echo ""
echo "Now test manually:"
echo ""
echo "1. Open incognito window"
echo "2. Go to: https://innerbright.vn/auth/login"
echo "3. Login with:"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo "4. Click 'Đăng nhập'"
echo "5. Should redirect to: https://innerbright.vn/admin"
echo ""
echo "Check cookies in DevTools:"
echo "- Look for: __Secure-next-auth.session-token"
echo "- Should be: HttpOnly, Secure, SameSite=Lax"
echo ""
