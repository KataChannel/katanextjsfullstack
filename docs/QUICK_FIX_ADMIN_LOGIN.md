# Quick Fix - Admin Login Issue

## Vấn Đề
- User `admin@example.com` đăng nhập thành công nhưng không vào được trang admin
- Hiển thị "đăng nhập thành công" nhưng redirect về login page

## Nguyên Nhân Có Thể
1. Session không được lưu đúng (cookie issue)
2. Middleware redirect lại về login
3. emailVerified check blocking user

## Đã Kiểm Tra
✅ User tồn tại trong database:
- email: admin@example.com  
- role: admin
- emailVerified: có giá trị
- password: đã hash

✅ Code auth.ts đã có JWT callback load role từ DB
✅ Middleware cho phép role admin

## Giải Pháp Nhanh

### Option 1: Test Direct (Recommended)
1. Mở trình duyệt incognito
2. Truy cập: https://innerbright.vn/auth/login
3. Đăng nhập: admin@example.com / admin123
4. Kiểm tra:
   - Network tab xem response có session cookie không
   - Console xem có lỗi không
   - Redirect có hoạt động không

### Option 2: Fix trong Database
Đảm bảo user có đúng thông tin:

```bash
ssh root@116.118.48.208
docker exec innerbright-postgres psql -U postgres -d innerv2core -c "
UPDATE users 
SET 
  role = 'admin',
  \"emailVerified\" = COALESCE(\"emailVerified\", NOW()),
  \"updatedAt\" = NOW()
WHERE email = 'admin@example.com';
"
```

### Option 3: Tạo User Mới với Password Mới
```bash
ssh root@116.118.48.208
docker exec innerbright-postgres psql -U postgres -d innerv2core -c "
INSERT INTO users (id, email, name, password, role, \"emailVerified\", \"createdAt\", \"updatedAt\")
VALUES (
  gen_random_uuid(),
  'admin2@innerbright.vn',
  'Admin InnerBright',
  '\$2a\$10\$YourHashedPasswordHere',  -- Cần hash password trước
  'admin',
  NOW(),
  NOW(),
  NOW()
) ON CONFLICT (email) DO NOTHING;
"
```

## Debug Steps

### 1. Check Container Logs
```bash
ssh root@116.118.48.208
docker logs --tail=100 -f innerbright-web | grep -i "auth\|login\|session"
```

### 2. Check Session Cookie
Trong browser DevTools:
- Application > Cookies > https://innerbright.vn
- Tìm cookie: `__Secure-next-auth.session-token` hoặc `next-auth.session-token`
- Cookie phải có:
  - Domain: .innerbright.vn hoặc innerbright.vn
  - Path: /
  - HttpOnly: true
  - Secure: true (nếu HTTPS)
  - SameSite: Lax

### 3. Test API Direct
```bash
curl -X POST https://innerbright.vn/api/auth/signin/credentials \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"admin123","redirect":false}' \
  -v
```

## Known Issues

### Cookie Domain với HTTPS
Nếu cookie config có vấn đề với domain, thử:
- Remove domain từ cookie options
- Để NextAuth tự động detect domain
- Hoặc set domain: 'innerbright.vn' (không có dấu chấm đầu)

### SameSite với Nginx Proxy
Nếu có nginx proxy, đảm bảo:
```nginx
proxy_set_header Host $host;
proxy_set_header X-Real-IP $remote_addr;
proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
proxy_set_header X-Forwarded-Proto $scheme;
```

## Rebuild Image (Nếu Cần)
Vì server yếu, build ở local và copy lên server:

### Build Local
```bash
cd /chikiet/kata2025/kataseo
docker build -t innerbright-web:latest .
docker save innerbright-web:latest | gzip > innerbright-web.tar.gz
```

### Copy to Server
```bash
scp innerbright-web.tar.gz root@116.118.48.208:/tmp/
ssh root@116.118.48.208
cd /tmp
docker load < innerbright-web.tar.gz
cd /var/www/innerbright
docker-compose restart innerbright-web
```

## Test Credentials

### Test User 1
- Email: admin@example.com
- Password: admin123
- Role: admin

### Test User 2 (Google OAuth)
- Email: katachanneloffical@gmail.com
- Method: Google Sign-In
- Role: admin

---

**Status**: Chờ test trên production browser  
**Next**: Kiểm tra cookie và session sau khi login
