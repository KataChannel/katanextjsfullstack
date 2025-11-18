# Test Authentication - InnerBright.vn

## Deployment Status
✅ **Container**: innerbright-web running and healthy
✅ **Site**: https://innerbright.vn accessible
✅ **Build**: Completed successfully with auth fixes

## Test Steps

### 1. Test Credentials Login (admin@example.com)
1. Open: https://innerbright.vn/auth/login
2. Enter credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Click "Đăng nhập"
4. Expected: Should redirect to `/admin` dashboard
5. Verify: Can see admin sidebar and content

### 2. Test Google OAuth Login (katachanneloffical@gmail.com)
1. Open: https://innerbright.vn/auth/login
2. Click "Đăng nhập bằng Google"
3. Login with: `katachanneloffical@gmail.com`
4. Expected: Account will be created automatically
5. After first login, promote to admin:
   ```bash
   ssh root@116.118.48.208 "docker exec innerbright-postgres psql -U postgres -d innerv2core -c \"UPDATE users SET role = 'admin' WHERE email = 'katachanneloffical@gmail.com';\""
   ```
6. Logout and login again
7. Expected: Should redirect to `/admin` dashboard
8. Verify: Can see admin sidebar and content

## Database Info
- Server: 116.118.48.208
- Container: innerbright-postgres
- Database: innerv2core
- Password: 2kOIU5HX98Nb

## Check Logs
```bash
ssh root@116.118.48.208 'docker logs innerbright-web --tail 50'
```

## Check Database Users
```bash
ssh root@116.118.48.208 "docker exec innerbright-postgres psql -U postgres -d innerv2core -c 'SELECT id, email, role, created_at FROM users ORDER BY created_at DESC LIMIT 5;'"
```

## Troubleshooting

### If Google OAuth fails with "OAuthAccountNotLinked"
User already exists without OAuth link. Delete and recreate:
```bash
ssh root@116.118.48.208 "docker exec innerbright-postgres psql -U postgres -d innerv2core -c \"DELETE FROM users WHERE email = 'katachanneloffical@gmail.com';\""
```

### If credentials login fails
Check password hash is correct:
```bash
ssh root@116.118.48.208 "docker exec innerbright-postgres psql -U postgres -d innerv2core -c \"SELECT email, role, LENGTH(password) FROM users WHERE email = 'admin@example.com';\""
```

### If session doesn't persist
Check cookies and JWT configuration in lib/auth.ts - already fixed in this deployment.

## What Was Fixed
1. ✅ lib/auth.ts JWT callback - loads role from database
2. ✅ lib/auth.ts cookie configuration - proper domain settings
3. ✅ Dockerfile - Prisma Client generation with retry logic
4. ✅ TypeScript errors - fixed implicit any types
5. ✅ Database - reset admin password, deleted problematic OAuth user
6. ✅ Deployment - built locally and uploaded to weak server

## Next Steps After Testing
- If both logins work → Issue resolved ✅
- If issues persist → Check logs and database state
- Consider adding email verification for OAuth users
- Monitor container health and performance
