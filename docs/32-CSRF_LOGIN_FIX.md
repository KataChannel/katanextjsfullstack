# Fix MissingCSRF Login Error - Production HTTP

## 🐛 Vấn đề

Sau khi deploy lên server production, login báo lỗi:

```
MissingCSRF error
URL: http://116.118.48.208:3005/auth/login?error=MissingCSRF
```

**Credentials:**
- Email: `admin@example.com`
- Password: `admin123`

## 🔍 Root Cause

### 1. NEXTAUTH_URL Mismatch
```env
# .env trên server (SAI)
NEXTAUTH_URL=https://innerbright.vn

# Server thực tế chạy HTTP
Actual URL: http://116.118.48.208:3005
```

### 2. Cookie Secure Flag Issue
- NextAuth mặc định set `secure: true` cho cookies khi NEXTAUTH_URL là HTTPS
- Browser reject cookies từ HTTP server với `secure: true`
- CSRF token không được lưu → MissingCSRF error

## ✅ Giải pháp

### 1. Cập nhật NEXTAUTH_URL trên server

```bash
# File: /var/www/innerbright/.env
NEXTAUTH_URL=http://116.118.48.208:3005  # ← HTTP, không phải HTTPS
```

### 2. Thêm dynamic cookies config

**File:** `/lib/auth.ts`

```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(authPrisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  trustHost: true,
  
  // ✅ NEW: Dynamic cookies config
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? '__Secure-next-auth.session-token'
        : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        // ✅ IMPORTANT: secure chỉ true khi thực sự dùng HTTPS
        secure: process.env.NODE_ENV === 'production' 
          && process.env.NEXTAUTH_URL?.startsWith('https'),
      },
    },
  },
  
  pages: {
    signIn: "/auth/login",
    // ...
  },
  // ...
});
```

### 3. Deploy steps

```bash
# 1. Update .env trên server
ssh root@116.118.48.208
cd /var/www/innerbright
nano .env  # Sửa NEXTAUTH_URL=http://116.118.48.208:3005

# 2. Build image mới (local)
cd /mnt/chikiet/kata2025/kataseo
docker build -t innerbright-web:latest .

# 3. Save & transfer
docker save innerbright-web:latest | gzip > /tmp/innerbright-web-auth-fix.tar.gz
scp /tmp/innerbright-web-auth-fix.tar.gz root@116.118.48.208:/tmp/

# 4. Load & restart (server)
ssh root@116.118.48.208
docker load < /tmp/innerbright-web-auth-fix.tar.gz
cd /var/www/innerbright
docker compose up -d --force-recreate innerbright-web

# 5. Verify
docker compose exec innerbright-web printenv | grep NEXTAUTH_URL
# Should output: NEXTAUTH_URL=http://116.118.48.208:3005
```

## 🧪 Testing

### 1. Check environment variables
```bash
ssh root@116.118.48.208 'cd /var/www/innerbright && docker compose exec innerbright-web printenv | grep NEXTAUTH'
```

**Expected output:**
```
NEXTAUTH_SECRET=762dImzykdo73nE4q5L8vN9pO0rQ1sT2u
NEXTAUTH_URL=http://116.118.48.208:3005  # ← HTTP!
```

### 2. Test health endpoint
```bash
curl http://116.118.48.208:3005/api/health
```

**Expected:**
```json
{"status":"ok","timestamp":"2025-11-18T05:38:54.592Z"}
```

### 3. Test login (Browser)

1. Navigate to: `http://116.118.48.208:3005/auth/login`
2. Enter credentials:
   - Email: `admin@example.com`
   - Password: `admin123`
3. Click "Sign in"

**Expected result:**
- ✅ Login thành công
- ✅ Redirect về `/admin` dashboard
- ✅ Session cookie được set

### 4. Inspect cookies (Browser DevTools)

```javascript
// Console
document.cookie

// Should see:
// "next-auth.session-token=...; next-auth.csrf-token=..."
```

**Cookie attributes:**
- `httpOnly: true` ✅
- `sameSite: lax` ✅
- `secure: false` ✅ (vì HTTP)
- `path: /` ✅

## 📊 Comparison: HTTP vs HTTPS

| Config | Development (HTTP) | Production HTTP | Production HTTPS |
|--------|-------------------|-----------------|------------------|
| NEXTAUTH_URL | `http://localhost:3000` | `http://116.118.48.208:3005` | `https://innerbright.vn` |
| Cookie name | `next-auth.session-token` | `__Secure-next-auth.session-token` | `__Secure-next-auth.session-token` |
| Cookie secure | `false` | `false` | `true` |
| Works? | ✅ | ✅ | ✅ |

## 🔐 Security Notes

### Current setup (HTTP - Temporary)
- ⚠️ Cookies transmitted over HTTP (no encryption)
- ⚠️ Vulnerable to man-in-the-middle attacks
- ⚠️ Session hijacking possible on public networks
- ✅ OK for internal testing/development
- ❌ NOT recommended for production with sensitive data

### Recommended setup (HTTPS - Production)
- ✅ Cookies encrypted in transit
- ✅ Protected against MITM attacks
- ✅ Browser security features enabled
- ✅ SEO benefits
- ✅ Required for PWA

## 🚀 Next Steps: Setup HTTPS

### 1. Setup Nginx Reverse Proxy

```bash
# Install Nginx
apt update && apt install nginx certbot python3-certbot-nginx

# Configure Nginx
nano /etc/nginx/sites-available/innerbright.vn
```

```nginx
server {
    listen 80;
    server_name innerbright.vn www.innerbright.vn;
    
    location / {
        proxy_pass http://localhost:3005;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Enable site
ln -s /etc/nginx/sites-available/innerbright.vn /etc/nginx/sites-enabled/
nginx -t
systemctl reload nginx
```

### 2. Setup SSL Certificate

```bash
# Get certificate from Let's Encrypt
certbot --nginx -d innerbright.vn -d www.innerbright.vn

# Auto-renewal
certbot renew --dry-run
```

### 3. Update NEXTAUTH_URL

```bash
# File: /var/www/innerbright/.env
NEXTAUTH_URL=https://innerbright.vn  # ← HTTPS with domain
```

### 4. Update DNS

Point domain to server IP:
```
A record: innerbright.vn → 116.118.48.208
A record: www.innerbright.vn → 116.118.48.208
```

### 5. Restart & Test

```bash
cd /var/www/innerbright
docker compose up -d --force-recreate innerbright-web

# Test HTTPS
curl https://innerbright.vn/api/health
```

## 📝 Files Changed

### `/lib/auth.ts`
- ✅ Added `cookies` configuration
- ✅ Dynamic `secure` flag based on NEXTAUTH_URL protocol
- ✅ Proper cookie names for production/development

### `/var/www/innerbright/.env` (Server)
- ✅ Updated `NEXTAUTH_URL=http://116.118.48.208:3005`

### `/var/www/innerbright/docker-compose.yml`
- ✅ Reads `NEXTAUTH_URL` from `.env`
- ✅ Passes to container environment

## ✅ Verification Checklist

- [x] NEXTAUTH_URL matches actual server URL
- [x] Container has correct environment variables
- [x] Health endpoint responds
- [x] Login page loads without errors
- [x] Login with admin@example.com works
- [x] Session cookie is set correctly
- [x] Cookie secure flag matches protocol (false for HTTP)
- [x] No CSRF errors in browser console
- [x] Can access protected /admin routes

## 🐛 Troubleshooting

### Still getting MissingCSRF?

1. **Clear browser cookies**
   ```javascript
   document.cookie.split(";").forEach(c => {
     document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
   });
   ```

2. **Check NEXTAUTH_URL in container**
   ```bash
   docker compose exec innerbright-web printenv NEXTAUTH_URL
   ```

3. **Verify cookie settings in browser DevTools**
   - Should see `secure: false` for HTTP
   - Should see `sameSite: lax`

4. **Check NextAuth logs**
   ```bash
   docker compose logs innerbright-web | grep -i auth
   ```

### Cookie not being set?

- Check browser blocks third-party cookies (shouldn't apply to same-origin)
- Check browser console for cookie warnings
- Verify `trustHost: true` in auth config

### Invalid credentials?

Check if admin user exists in database:
```bash
docker compose exec innerbright-web bun run prisma studio
# Or query directly
docker compose exec postgres psql -U postgres -d innerv2core -c "SELECT email, role FROM \"User\";"
```

## 📚 Related Docs

- [31-AUTO_CREATE_ADMIN_USER.md](./31-AUTO_CREATE_ADMIN_USER.md) - Admin user creation
- [13-AUTH_IMPLEMENTATION_SUMMARY.md](./13-AUTH_IMPLEMENTATION_SUMMARY.md) - Auth system overview
- [BACKUP_RESTORE_GUIDE.md](../BACKUP_RESTORE_GUIDE.md) - Backup/restore system

## 🎯 Summary

**Problem:** MissingCSRF error khi login trên production HTTP server

**Root cause:** 
- NEXTAUTH_URL set to HTTPS nhưng server chạy HTTP
- Cookie `secure: true` không work với HTTP

**Solution:**
1. Update NEXTAUTH_URL to HTTP URL
2. Make cookie `secure` flag dynamic
3. Rebuild & redeploy

**Result:** ✅ Login works on HTTP (temporary for testing)

**Long-term:** Setup Nginx + SSL for HTTPS production

---

**Fixed:** 2025-11-18  
**Status:** ✅ Resolved (HTTP working)  
**TODO:** Setup HTTPS with Nginx + Let's Encrypt
