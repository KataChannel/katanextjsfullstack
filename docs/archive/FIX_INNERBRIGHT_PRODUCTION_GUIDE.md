# Hướng Dẫn Fix Google Login - InnerBright Production

## Server Information
- **Server IP**: 116.118.48.208
- **Domain**: https://innerbright.vn
- **Database**: postgresql://postgres:2kOIU5HX98Nb@postgres:5432/innerv2core
- **Container**: innerbright-app

## Quick Fix Steps

### Option 1: Automatic Script (Recommended)
```bash
cd /chikiet/kata2025/kataseo
./scripts/fix-innerbright-google-login.sh
```

### Option 2: Manual Steps

#### Step 1: SSH to Server
```bash
ssh root@116.118.48.208
cd /var/www/innerbright
```

#### Step 2: Upload Updated Files
**On your local machine**, open a new terminal:
```bash
cd /chikiet/kata2025/kataseo

# Upload auth.ts
scp lib/auth.ts root@116.118.48.208:/var/www/innerbright/lib/auth.ts

# Upload fix script
scp scripts/fix-admin-user.ts root@116.118.48.208:/var/www/innerbright/scripts/fix-admin-user.ts
```

#### Step 3: Fix Admin User (On Server)
```bash
# Check if container is running
docker ps | grep innerbright

# Run fix script inside container
docker exec innerbright-app sh -c "DATABASE_URL='postgresql://postgres:2kOIU5HX98Nb@postgres:5432/innerv2core' bun run scripts/fix-admin-user.ts"
```

Expected output:
```
🔍 Checking user katachanneloffical@gmail.com...
✅ User found/created with admin role
```

#### Step 4: Rebuild Container
```bash
cd /var/www/innerbright

# Stop container
docker-compose down innerbright-app

# Rebuild with new code
docker-compose build --no-cache innerbright-app

# Start container
docker-compose up -d innerbright-app

# Check logs
docker logs -f innerbright-app
```

#### Step 5: Verify Container is Running
```bash
# Check container status
docker ps | grep innerbright

# Should see something like:
# innerbright-app    running    0.0.0.0:3005->3005/tcp
```

### Option 3: Quick One-Liner Commands

**Upload files:**
```bash
cd /chikiet/kata2025/kataseo && scp lib/auth.ts scripts/fix-admin-user.ts root@116.118.48.208:/var/www/innerbright/
```

**Fix user (run on server):**
```bash
docker exec innerbright-app sh -c "DATABASE_URL='postgresql://postgres:2kOIU5HX98Nb@postgres:5432/innerv2core' bun run scripts/fix-admin-user.ts"
```

**Restart container (run on server):**
```bash
cd /var/www/innerbright && docker-compose restart innerbright-app
```

## Testing

1. **Clear browser cache** or open incognito window
2. Go to: https://innerbright.vn/auth/login
3. Click "Đăng nhập bằng Google"
4. Login with: katachanneloffical@gmail.com
5. Should redirect to: https://innerbright.vn/admin
6. Verify admin access works

## Troubleshooting

### Issue: "User not found" after Google login
**Check database:**
```bash
docker exec -it postgres psql -U postgres -d innerv2core -c "SELECT id, email, role, \"emailVerified\" FROM users WHERE email = 'katachanneloffical@gmail.com';"
```

### Issue: Container won't start
**Check logs:**
```bash
docker logs --tail=100 innerbright-app
```

**Common issues:**
- Port 3005 already in use
- Database connection failed
- Environment variables missing

### Issue: Still can't access admin after login
**Check session/token:**
```bash
# View recent logs
docker logs --tail=50 innerbright-app | grep -i "auth\|login\|role"
```

**Verify middleware:**
- Make sure user has role="admin" in database
- Check middleware.ts allows admin role
- Clear browser cookies for innerbright.vn

### Issue: Google OAuth redirect error
**Check Google Console:**
- Authorized redirect URIs must include: https://innerbright.vn/api/auth/callback/google
- Google Client ID and Secret match .env.innerbright

## Verification Checklist

- [ ] Files uploaded to server
- [ ] Admin user exists in database with role="admin"
- [ ] Container rebuilt and restarted
- [ ] Can login with Google
- [ ] Redirected to /admin after login
- [ ] Can access admin pages
- [ ] No errors in container logs

## Rollback (If needed)

```bash
# On server
cd /var/www/innerbright
git checkout lib/auth.ts
docker-compose restart innerbright-app
```

## Notes

- **Database password**: 2kOIU5HX98Nb (from .env.innerbright)
- **Container network**: Database is accessible via hostname `postgres` inside Docker network
- **Restart time**: Container usually takes 5-10 seconds to restart
- **Zero downtime**: Use `docker-compose up -d` to avoid downtime

---

**Created**: 18/11/2025  
**Purpose**: Fix Google OAuth login for katachanneloffical@gmail.com on production
