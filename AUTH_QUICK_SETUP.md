# 🚀 Quick Setup Guide - Authentication System

## Bước 1: Cấu hình Environment Variables

Copy file `.env.example` thành `.env` và điền các thông tin:

```bash
cp .env.example .env
```

### 1.1. Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

Copy kết quả vào `.env`:
```env
NEXTAUTH_SECRET="kết-quả-ở-đây"
```

### 1.2. Setup Google OAuth (5 phút)

1. Truy cập: https://console.cloud.google.com/
2. Tạo project mới hoặc chọn project
3. Sidebar → **APIs & Services** → **Credentials**
4. Click **Create Credentials** → **OAuth client ID**
5. Application type: **Web application**
6. Name: "Kata SEO Login"
7. **Authorized redirect URIs**, thêm:
   ```
   http://localhost:3000/api/auth/callback/google
   ```
8. Click **Create**
9. Copy **Client ID** và **Client Secret** vào `.env`:
   ```env
   GOOGLE_CLIENT_ID="your-client-id"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   ```

### 1.3. Setup Gmail SMTP (3 phút)

1. Truy cập: https://myaccount.google.com/security
2. Bật **2-Step Verification** (nếu chưa)
3. Truy cập: https://myaccount.google.com/apppasswords
4. App: **Mail**, Device: **Other (Kata SEO)**
5. Click **Generate**
6. Copy mật khẩu 16 ký tự vào `.env`:
   ```env
   SMTP_USER="your-email@gmail.com"
   SMTP_PASSWORD="abcd efgh ijkl mnop"
   SMTP_FROM_EMAIL="your-email@gmail.com"
   ```

## Bước 2: Chạy Migration

```bash
bunx prisma migrate dev
```

**Output mong đợi:**
```
✔ Generated Prisma Client
Applying migration `20251112124949_add_authentication_system`
Your database is now in sync with your schema.
```

## Bước 3: Start Development Server

```bash
bun run dev
```

Truy cập: http://localhost:3000

## Bước 4: Test Authentication

### Test 1: Đăng ký tài khoản mới
1. Truy cập: http://localhost:3000/auth/register
2. Nhập:
   - Email: test@example.com
   - Password: password123
   - Name: Test User
3. Click **Đăng Ký**
4. Kiểm tra email → Nhận mã OTP 6 số
5. Nhập OTP tại trang verify-otp
6. Xác thực thành công → Redirect về login

### Test 2: Đăng nhập
1. Truy cập: http://localhost:3000/auth/login
2. Nhập email + password vừa đăng ký
3. Click **Đăng Nhập**
4. Redirect về `/admin` (hoặc callbackUrl)

### Test 3: Google OAuth
1. Truy cập: http://localhost:3000/auth/login
2. Click nút **Google**
3. Chọn tài khoản Google
4. Auto verify → Redirect về `/admin`

### Test 4: Quên mật khẩu
1. Truy cập: http://localhost:3000/auth/forgot-password
2. Nhập email
3. Click **Gửi Link Đặt Lại Mật Khẩu**
4. Kiểm tra email → Click link
5. Nhập mật khẩu mới
6. Click **Đặt Lại Mật Khẩu**
7. Redirect về login → Login với mật khẩu mới

## Bước 5: Kiểm tra Middleware Protection

### Test Protected Route
1. **Chưa đăng nhập**: Truy cập http://localhost:3000/admin
   - ✅ Redirect về `/auth/login?callbackUrl=/admin`

2. **Đã đăng nhập (role: user)**: Truy cập http://localhost:3000/admin
   - ✅ Redirect về `/` (không có quyền)

3. **Đã đăng nhập (role: admin/editor)**: Truy cập http://localhost:3000/admin
   - ✅ Hiển thị admin panel

### Test Auth Routes khi đã đăng nhập
1. Đăng nhập với tài khoản bất kỳ
2. Truy cập: http://localhost:3000/auth/login
   - ✅ Redirect về `/admin`

## Bước 6: Tạo Admin User

### Option 1: Sử dụng Prisma Studio
```bash
bunx prisma studio
```

1. Mở table **User**
2. Tìm user cần set admin
3. Edit `role` → `admin`
4. Save

### Option 2: Sử dụng SQL
```sql
UPDATE "User" 
SET role = 'admin' 
WHERE email = 'your-email@example.com';
```

## 🎉 Hoàn Thành!

Authentication system đã sẵn sàng với:
- ✅ Đăng ký + OTP verification
- ✅ Đăng nhập email/password
- ✅ Đăng nhập Google OAuth
- ✅ Quên mật khẩu
- ✅ Role-based access control
- ✅ Middleware protection
- ✅ Email templates (OTP, Reset Password, Welcome)

## 📚 Tài liệu đầy đủ

Xem file `AUTHENTICATION_SYSTEM.md` để biết thêm chi tiết về:
- Database schema
- API endpoints
- Security features
- Troubleshooting
- Customization options

## 🐛 Common Issues

### Issue: Email không gửi được
**Solution:**
- Kiểm tra SMTP credentials trong `.env`
- Kiểm tra 2FA đã bật
- Kiểm tra app password đúng (16 ký tự, không có khoảng trắng)
- Check console logs: `bun run dev`

### Issue: Google OAuth redirect lỗi
**Solution:**
- Kiểm tra redirect URI: `http://localhost:3000/api/auth/callback/google`
- Kiểm tra Client ID/Secret
- Enable Google+ API trong console

### Issue: Session không lưu
**Solution:**
- Kiểm tra `NEXTAUTH_SECRET` trong `.env`
- Kiểm tra `NEXTAUTH_URL="http://localhost:3000"`
- Clear browser cookies + cache

### Issue: Middleware redirect loop
**Solution:**
- Restart dev server: `Ctrl+C` → `bun run dev`
- Clear browser cache
- Check console logs

## 📞 Need Help?

1. Check `AUTHENTICATION_SYSTEM.md` - Full documentation
2. Check browser console for errors (F12)
3. Check terminal logs for server errors
4. Check email logs for SMTP errors

---

**Setup Time:** ~15 minutes  
**Last Updated:** 2024-01-12
