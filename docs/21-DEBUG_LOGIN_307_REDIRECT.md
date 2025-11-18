# Debug: Login Not Working After Successful Authentication

## Problem
- Login successful (credentials accepted)
- But redirected away from /admin with 307
- User has role='admin' in database ✅
- Code deployed with JWT callback fix ✅

## Possible Causes

### 1. JWT Token Missing Role
The JWT token might not contain the role field even though code is correct.

**Debug Steps:**
```bash
# Check if middleware can read token
ssh root@116.118.48.208 'docker logs innerbright-web -f'
# Then try to access /admin and watch logs
```

### 2. Old Session/Cookie
User might have old cookie from before OAuth fix.

**Solution:**
1. Clear all browser cookies for innerbright.vn
2. Clear browser cache
3. Try login again in incognito/private window

### 3. Middleware Token Validation
Middleware uses `getToken()` which might not be reading JWT correctly.

**Check:**
```typescript
// In middleware.ts line 47-49
const token = await getToken({ 
  req: request,
  secret: process.env.NEXTAUTH_SECRET 
});
```

### 4. Cookie Domain Mismatch
Cookies might not be set for correct domain.

**Check cookies should be:**
- Domain: `.innerbright.vn` or `innerbright.vn`  
- Path: `/`
- Secure: true (for HTTPS)
- HttpOnly: true

## Quick Fixes to Try

### Fix 1: Force Rebuild Token
Delete any existing sessions and re-login:

```sql
-- Not needed for JWT, but clear just in case
DELETE FROM sessions WHERE "userId" = (SELECT id FROM users WHERE email = 'admin@example.com');
```

### Fix 2: Test with curl
```bash
# Get session cookie
curl -c cookies.txt -X POST https://innerbright.vn/api/auth/callback/credentials \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "email=admin@example.com&password=admin123"

# Try to access admin with cookie
curl -b cookies.txt https://innerbright.vn/admin
```

### Fix 3: Add Debug Logging
Add console.log to middleware to see token content:

```typescript
// In middleware.ts after line 49
console.log('[DEBUG] Token:', JSON.stringify(token, null, 2));
console.log('[DEBUG] User Role:', token?.role);
console.log('[DEBUG] Allowed Roles:', allowedRoles);
```

Then rebuild and redeploy.

## Most Likely Solution

**The issue is probably OLD COOKIE from before the OAuth fix.**

### Steps to Resolve:
1. **Clear browser completely:**
   - Chrome: F12 > Application > Storage > Clear site data
   - Firefox: F12 > Storage > Cookies > Delete all for innerbright.vn

2. **Or try incognito mode**

3. **Login fresh:**
   - Go to https://innerbright.vn/auth/login
   - Enter: admin@example.com / admin123
   - Should work now

4. **If still fails, add debug logging and rebuild:**
```bash
# Edit middleware.ts to add logging
# Then rebuild
docker build -t innerbright-web:latest /chikiet/kata2025/kataseo
docker save innerbright-web:latest | gzip > innerbright-web-debug.tar.gz
scp innerbright-web-debug.tar.gz root@116.118.48.208:/tmp/
ssh root@116.118.48.208 'cd /tmp && gunzip -c innerbright-web-debug.tar.gz | docker load && cd /var/www/innerbright && docker-compose restart innerbright-web'
```

## Next Steps
1. Clear browser cookies/try incognito
2. If still fails, add debug logging to middleware
3. Rebuild and check logs to see what token contains
