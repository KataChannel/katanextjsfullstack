# Cookie Name Fix - November 19, 2025

## Problem (Round 2)
Session API returns correct user data but middleware still cannot read token:
- Session: `{role: "admin", email: "katachanneloffical@gmail.com"}` ✅
- Middleware: `[Middleware] No token, redirecting to login` ❌

## Root Cause
**Cookie name mismatch** between NextAuth and middleware:

### NextAuth Configuration (auth.ts)
```typescript
cookies: {
  sessionToken: {
    name: '__Secure-next-auth.session-token', // Production
    // OR 'next-auth.session-token' // Development
  }
}
```

### Middleware (middleware.ts) - Before Fix
```typescript
const token = await getToken({ 
  req: request,
  secret: process.env.NEXTAUTH_SECRET,
  // ❌ No cookieName specified - uses default '__Secure-authjs.session-token'
});
```

The default cookie name for `getToken()` in NextAuth v5 is `__Secure-authjs.session-token`, but we configured NextAuth to use `__Secure-next-auth.session-token`.

## Solution
Explicitly specify cookie name in middleware to match NextAuth config:

```typescript
const cookieName = process.env.NODE_ENV === 'production' 
  ? '__Secure-next-auth.session-token'
  : 'next-auth.session-token';
    
const token = await getToken({ 
  req: request,
  secret: process.env.NEXTAUTH_SECRET,
  cookieName, // ✅ Now matches NextAuth config
});
```

## Deployment
1. Updated middleware.ts with explicit cookieName
2. Built image: `28eba8796445` (374MB)
3. Deployed: Container `b2867ecbfdc5`
4. Status: Healthy ✅

## Testing Steps
1. Clear browser cookies OR use incognito
2. Login: katachanneloffical@gmail.com
3. Access: https://innerbright.vn/admin
4. Expected: Access granted with role="admin"

## Monitoring
Watch middleware logs in real-time:
```bash
./deploy/monitor-middleware.sh
```

Or manually:
```bash
ssh root@116.118.48.208 "docker logs -f innerbright-web 2>&1 | grep Middleware"
```

Expected logs after fix:
```
[Middleware] Admin access attempt: {
  pathname: '/admin',
  hasToken: true,        ✅ Should be true now
  email: 'katachanneloffical@gmail.com',
  role: 'admin'
}
```

## Files Changed
- `middleware.ts` - Added explicit cookieName parameter to getToken()

## Container Info
- Image: innerbright-web:latest (28eba8796445)
- Container ID: b2867ecbfdc5
- Port: 3005
- ENV: NODE_ENV=production
- Health: ✅ http://localhost:3005/api/health

## Technical Details
NextAuth v5 (next-auth@beta) changed default cookie naming:
- Old default: `next-auth.session-token`
- New default: `authjs.session-token`
- Our config: `next-auth.session-token` (backward compatible)
- **Must specify in middleware's getToken() call!**
