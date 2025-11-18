#!/bin/bash
# Monitor logs for debug output

echo "=========================================="
echo "🔍 Debug Deployment với Logging"
echo "=========================================="
echo ""
echo "✅ Container deployed với debug logs"
echo "✅ Version: 22:31 ICT"
echo ""
echo "📋 Testing Steps:"
echo ""
echo "1. Clear Browser Cookies:"
echo "   - Chrome: F12 > Application > Storage > Clear site data"
echo "   - Firefox: F12 > Storage > Delete all cookies for innerbright.vn"
echo "   - Or use Incognito/Private window"
echo ""
echo "2. Login Again:"
echo "   URL: https://innerbright.vn/auth/login"
echo "   Email: admin@example.com"
echo "   Password: admin123"
echo ""
echo "3. Watch Logs (run this in another terminal):"
echo "   ssh root@116.118.48.208 'docker logs innerbright-web -f'"
echo ""
echo "4. Try to Access /admin"
echo "   Should see debug output in logs showing:"
echo "   - hasToken: true/false"
echo "   - email: admin@example.com"
echo "   - role: admin"
echo "   - isAllowed: true"
echo ""
echo "=========================================="
echo "🔍 Live Log Monitoring"
echo "=========================================="
echo ""
echo "Starting log monitor... (Ctrl+C to stop)"
echo ""

ssh root@116.118.48.208 'docker logs innerbright-web -f' &
LOG_PID=$!

echo ""
echo "Logs running in background (PID: $LOG_PID)"
echo "Now try to login and access /admin"
echo ""
echo "Press Enter when done to stop logs..."
read

kill $LOG_PID 2>/dev/null
echo ""
echo "=========================================="
echo "Debug session ended"
echo "=========================================="
