# Cookie Configuration Fix - November 19, 2025

## Problem
User với role "admin" trong session không thể truy cập `/admin` routes. Middleware logs show: `[Middleware] No token, redirecting to login`

## Root Cause
NextAuth JWT cookie không được configuration cho production domain, dẫn đến:
- Cookie được set với wrong domain
- Middleware không đọc được token từ cookie
- User bị redirect về login dù đã đăng nhập

## Solution
Added cookie configuration to `lib/auth.ts`:

```typescript
cookies: {
  sessionToken: {
    name: `${process.env.NODE_ENV === 'production' ? '__Secure-' : ''}next-auth.session-token`,
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
      domain: process.env.NODE_ENV === 'production' ? '.innerbright.vn' : undefined,
    },
  },
},
```

## Docker Fix
Fixed Dockerfile CMD from `bun run server.js` to `node server.js` (Next.js standalone needs node)

## Deployment Steps
1. Added cookie config to NextAuth
2. Fixed Dockerfile CMD
3. Built new image: `innerbright-web:latest`
4. Deployed to production: Container `975a1856be54`
5. Health check: ✅ OK

## Testing
User needs to:
1. Logout from https://innerbright.vn
2. Login again with chikiet88@gmail.com
3. Access /admin route

New cookies will be set with `.innerbright.vn` domain and middleware will read token correctly.

## Monitoring
Check middleware logs:
```bash
ssh root@116.118.48.208 "docker logs -f innerbright-web 2>&1 | grep Middleware"
```

## Files Changed
- `lib/auth.ts` - Added cookies configuration
- `Dockerfile` - Changed CMD to use node instead of bun

## Container Info
- Image: innerbright-web:latest
- Container ID: 975a1856be54
- Port: 3005
- Status: Healthy
- Health: http://localhost:3005/api/health ✅
