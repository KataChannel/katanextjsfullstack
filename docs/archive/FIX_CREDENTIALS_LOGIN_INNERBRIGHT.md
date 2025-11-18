# Fix Bug Đăng Nhập Credentials - InnerBright

## Vấn Đề
User `admin@example.com` / `admin123` đăng nhập thành công nhưng không vào được trang `/admin`.

## Nguyên Nhân
Cookie session không được lưu đúng trên production do cấu hình cookie phức tạp:
- Cookie prefix `__Secure-*` yêu cầu điều kiện nghiêm ngặt về HTTPS
- Cookie `domain` config có thể gây xung đột
- NextAuth v5 beta có thể có bug với custom cookie config

## Database Check
```sql
SELECT id, email, name, role, "emailVerified" FROM users WHERE email = 'admin@example.com';

-- Result:
id: 1071bc3d-d53d-450a-bb4e-d03683c65902
email: admin@example.com
name: Admin
role: admin
emailVerified: 2025-11-12 19:41:29.634
✅ User tồn tại và có đầy đủ quyền
```

## Fix Đã Thực Hiện

### 1. Đơn Giản Hóa Cookie Config trong `/lib/auth.ts`

**Before:**
```typescript
cookies: {
  sessionToken: {
    name: process.env.NODE_ENV === 'production' 
      ? '__Secure-next-auth.session-token'
      : 'next-auth.session-token',
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production' && process.env.NEXTAUTH_URL?.startsWith('https'),
    },
  },
},
```

**After:**
```typescript
session: {
  strategy: "jwt",
  maxAge: 30 * 24 * 60 * 60, // 30 days
},
trustHost: true,
useSecureCookies: process.env.NEXTAUTH_URL?.startsWith('https'),
// Removed custom cookies config - let NextAuth handle it automatically
```

**Giải thích:**
- Bỏ custom `cookies` config để NextAuth tự động xử lý
- Sử dụng `useSecureCookies` thay vì custom config
- NextAuth v5 sẽ tự động set cookie name và options phù hợp với production/development

### 2. Rebuild và Restart Container

```bash
# Upload file mới
scp lib/auth.ts root@116.118.48.208:/var/www/innerbright/lib/auth.ts

# Rebuild image
docker build -t innerbright-web:latest .

# Restart container
docker-compose restart innerbright-web
```

## Testing

### Bước 1: Clear Browser Data
```
1. Mở Chrome DevTools (F12)
2. Application tab > Storage > Clear site data
3. Hoặc dùng Incognito window
```

### Bước 2: Test Login
```
1. Go to: https://innerbright.vn/auth/login
2. Email: admin@example.com
3. Password: admin123
4. Click "Đăng nhập"
5. Should redirect to: https://innerbright.vn/admin
```

### Bước 3: Verify Session Cookie
```
1. Chrome DevTools > Application > Cookies
2. Check for cookie: __Secure-next-auth.session-token (production)
3. Should have:
   - Domain: innerbright.vn
   - Path: /
   - Secure: ✓
   - HttpOnly: ✓
   - SameSite: Lax
```

## Troubleshooting

### Issue: Cookie không được set
**Check nginx config:**
```bash
# On server
cat /etc/nginx/sites-available/innerbright.vn.conf

# Ensure proxy headers are correct:
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

### Issue: Vẫn không redirect sau login
**Check container logs:**
```bash
ssh root@116.118.48.208
docker logs --tail=100 5bb42ad49a4f_innerbright-web | grep -i "auth\|login\|session"
```

### Issue: Error "Email chưa được xác thực"
**Fix emailVerified:**
```sql
docker exec innerbright-postgres psql -U postgres -d innerv2core -c "UPDATE users SET \"emailVerified\" = NOW() WHERE email = 'admin@example.com';"
```

## Alternative Solutions (Nếu vẫn lỗi)

### Option 1: Tạm thời disable emailVerified check
```typescript
// In lib/auth.ts - authorize function
// Comment out:
// if (!user.emailVerified) {
//   throw new Error("Vui lòng xác thực email trước khi đăng nhập");
// }
```

### Option 2: Force cookie settings
```typescript
cookies: {
  sessionToken: {
    name: 'next-auth.session-token',
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: true,
    },
  },
},
```

### Option 3: Check middleware.ts
```typescript
// Ensure middleware allows /admin for authenticated users
if (isAdminRoute && token) {
  const userRole = token.role as string;
  const allowedRoles = ['admin', 'manager', 'editor'];
  
  if (!allowedRoles.includes(userRole)) {
    return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
  }
}
```

## Files Changed
- ✅ `/lib/auth.ts` - Simplified cookie config

## Production Status
- **Server**: 116.118.48.208
- **Container**: 5bb42ad49a4f_innerbright-web
- **Status**: Rebuilding...

---

**Date**: 18/11/2025  
**Issue**: Login succeeds but no redirect to admin  
**Root Cause**: Cookie configuration too complex for production  
**Solution**: Let NextAuth handle cookies automatically with `useSecureCookies`
