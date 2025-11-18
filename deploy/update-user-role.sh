#!/bin/bash

echo "=========================================="
echo "  Quick Fix: Update User Role to Admin"
echo "=========================================="

if [ -z "$1" ]; then
  echo "Usage: $0 <email>"
  echo "Example: $0 chikiet88@gmail.com"
  exit 1
fi

EMAIL="$1"

echo ""
echo "📧 Email: $EMAIL"
echo ""
echo "Connecting to server..."

# SSH to server and update role
ssh root@116.118.48.208 << EOF
docker exec 0722cb3694fe psql -U postgres -d innerv2core -c "UPDATE users SET role = 'admin' WHERE email = '$EMAIL'; SELECT email, name, role FROM users WHERE email = '$EMAIL';"
EOF

echo ""
echo "=========================================="
echo "✅ Role updated to admin!"
echo "=========================================="
echo ""
echo "⚠️  IMPORTANT: User must logout and login again"
echo ""
echo "Steps:"
echo "1. Visit: https://innerbright.vn/api/auth/signout"
echo "2. Click 'Sign out'"
echo "3. Login again: https://innerbright.vn/auth/login"
echo "4. Access admin: https://innerbright.vn/admin"
echo ""
echo "Or clear browser cookies:"
echo "- Open DevTools (F12)"
echo "- Application → Cookies → innerbright.vn"
echo "- Delete all cookies"
echo "- Login again"
echo ""
