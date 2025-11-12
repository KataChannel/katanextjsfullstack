# Hệ Thống Xác Thực (Authentication System)

## Tổng Quan

Hệ thống xác thực đầy đủ cho dự án Kata SEO, sử dụng NextAuth v5 với nhiều phương thức đăng nhập, xác thực email OTP, và quản lý phân quyền người dùng.

## Tính Năng

### 1. Đăng Ký Tài Khoản (Registration)
- ✅ Đăng ký với email, mật khẩu, và tên (optional)
- ✅ Validation: Email hợp lệ, mật khẩu tối thiểu 8 ký tự
- ✅ Gửi mã OTP qua email để xác thực
- ✅ Mật khẩu được mã hóa bằng bcrypt (12 rounds)

### 2. Xác Thực Email (Email Verification)
- ✅ Mã OTP gồm 6 chữ số
- ✅ Thời gian hiệu lực: 10 phút
- ✅ Tính năng gửi lại OTP
- ✅ Gửi email chào mừng sau khi xác thực thành công

### 3. Đăng Nhập (Login)
- ✅ Đăng nhập bằng email/password
- ✅ Đăng nhập bằng Google OAuth
- ✅ Kiểm tra email đã được xác thực chưa
- ✅ Session JWT với thời hạn 30 ngày

### 4. Quên Mật Khẩu (Password Reset)
- ✅ Gửi link đặt lại mật khẩu qua email
- ✅ Token có thời hạn 1 giờ
- ✅ Đặt lại mật khẩu an toàn với token validation

### 5. Phân Quyền Người Dùng (Role-Based Access Control)
- ✅ 3 vai trò: `user`, `editor`, `admin`
- ✅ Middleware bảo vệ routes `/admin`
- ✅ Chỉ `admin` và `editor` được truy cập admin panel
- ✅ Session chứa thông tin role của user

## Cấu Trúc Database

### User Model
```prisma
model User {
  id            String    @id @default(uuid())
  email         String    @unique
  name          String?
  password      String?   // Nullable cho OAuth users
  role          String    @default("user")
  emailVerified DateTime?
  image         String?
  otp           String?
  otpExpiresAt  DateTime?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  accounts Account[]
  sessions Session[]
}
```

### Account Model (OAuth)
```prisma
model Account {
  id                String  @id @default(uuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@unique([provider, providerAccountId])
}
```

### Session Model
```prisma
model Session {
  id           String   @id @default(uuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

### VerificationToken Model
```prisma
model VerificationToken {
  identifier String
  token      String   @unique
  type       String   // 'email_verification' or 'password_reset'
  expires    DateTime
  
  @@unique([identifier, token])
}
```

## API Routes

### POST /api/auth/register
Đăng ký tài khoản mới

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "password123",
  "name": "Nguyễn Văn A" // optional
}
```

**Response:**
```json
{
  "success": true,
  "message": "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
  "user": {
    "email": "user@example.com",
    "name": "Nguyễn Văn A"
  }
}
```

### POST /api/auth/verify-otp
Xác thực OTP

**Request Body:**
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

### PUT /api/auth/verify-otp
Gửi lại OTP

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### POST /api/auth/forgot-password
Yêu cầu đặt lại mật khẩu

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

### POST /api/auth/reset-password
Đặt lại mật khẩu với token

**Request Body:**
```json
{
  "token": "reset-token-here",
  "password": "newpassword123"
}
```

## Auth Pages

### `/auth/login`
- Đăng nhập bằng email/password
- Đăng nhập bằng Google OAuth
- Link đến trang đăng ký
- Link quên mật khẩu

### `/auth/register`
- Form đăng ký với email, password, name
- Validation client-side
- Chuyển đến trang verify-otp sau khi đăng ký thành công

### `/auth/verify-otp`
- 6 ô nhập OTP số
- Auto-focus sang ô tiếp theo
- Hỗ trợ paste OTP
- Nút gửi lại OTP
- Countdown 10 phút

### `/auth/forgot-password`
- Nhập email để nhận link đặt lại mật khẩu
- Hiển thị thông báo sau khi gửi email thành công

### `/auth/reset-password`
- Nhập mật khẩu mới
- Validation: tối thiểu 8 ký tự
- Xác nhận mật khẩu phải khớp

## Middleware Protection

File: `/proxy.ts` (Next.js 15 sử dụng proxy thay vì middleware)

**Bảo vệ routes:**
- `/admin/*` - Yêu cầu đăng nhập + role `admin` hoặc `editor`
- `/auth/*` - Redirect nếu đã đăng nhập

**Logic:**
1. Lấy token từ request (NextAuth JWT)
2. Kiểm tra authentication cho admin routes
3. Kiểm tra role permission
4. Redirect về login nếu chưa xác thực
5. Redirect về admin nếu đã đăng nhập và truy cập auth pages
6. Xử lý multi-tenancy (thêm domain vào headers)
7. Thêm security headers

## Email Templates

### OTP Email
- Tiêu đề: "Mã xác thực tài khoản của bạn"
- Hiển thị mã OTP lớn, dễ đọc
- Thông báo thời gian hiệu lực 10 phút
- Design gradient chuyên nghiệp

### Password Reset Email
- Tiêu đề: "Yêu cầu đặt lại mật khẩu"
- Button link đặt lại mật khẩu
- URL copy được nếu button không hoạt động
- Thời gian hiệu lực 1 giờ

### Welcome Email
- Tiêu đề: "Chào mừng đến với Taza Group!"
- Thông báo đăng ký thành công
- Hướng dẫn bước tiếp theo

## Cấu Hình Environment Variables

```bash
# NextAuth
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="<generate-with-openssl-rand-base64-32>"

# Google OAuth
GOOGLE_CLIENT_ID="<from-google-console>"
GOOGLE_CLIENT_SECRET="<from-google-console>"

# SMTP Email
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_SECURE="false"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="<gmail-app-password>"
SMTP_FROM_NAME="Taza Group"
SMTP_FROM_EMAIL="your-email@gmail.com"
```

## Hướng Dẫn Setup

### 1. Generate NEXTAUTH_SECRET
```bash
openssl rand -base64 32
```

### 2. Setup Google OAuth
1. Truy cập https://console.cloud.google.com/
2. Tạo project mới hoặc chọn project có sẵn
3. Enable Google+ API
4. Tạo OAuth 2.0 credentials
5. Thêm Authorized redirect URI:
   - `http://localhost:3000/api/auth/callback/google`
   - `https://yourdomain.com/api/auth/callback/google` (production)
6. Copy Client ID và Client Secret

### 3. Setup Gmail SMTP
1. Bật 2-factor authentication cho tài khoản Google
2. Truy cập https://myaccount.google.com/apppasswords
3. Tạo app password cho "Mail"
4. Sử dụng password này cho `SMTP_PASSWORD`

### 4. Run Migration
```bash
bunx prisma migrate dev
```

### 5. Start Development Server
```bash
bun run dev
```

## Testing Flow

### Test Registration Flow
1. Truy cập `http://localhost:3000/auth/register`
2. Nhập email, password, name
3. Click "Đăng Ký"
4. Kiểm tra email nhận mã OTP
5. Nhập OTP vào trang verify-otp
6. Xác thực thành công → Redirect về login

### Test Login Flow
1. Truy cập `http://localhost:3000/auth/login`
2. Nhập email và password đã đăng ký
3. Click "Đăng Nhập"
4. Redirect về `/admin` nếu thành công

### Test Google OAuth
1. Truy cập `http://localhost:3000/auth/login`
2. Click nút "Google"
3. Chọn tài khoản Google
4. Auto verify email → Redirect về `/admin`

### Test Forgot Password
1. Truy cập `http://localhost:3000/auth/forgot-password`
2. Nhập email
3. Kiểm tra email nhận link reset
4. Click link → Redirect đến reset-password page
5. Nhập mật khẩu mới → Redirect về login

## Security Features

### Password Security
- ✅ Bcrypt hashing với 12 salt rounds
- ✅ Minimum 8 ký tự
- ✅ Never stored in plain text

### Session Security
- ✅ JWT tokens với secret key
- ✅ 30-day expiration
- ✅ HTTP-only cookies
- ✅ CSRF protection

### Email Verification
- ✅ OTP thay vì simple email links
- ✅ Time-limited tokens (10 minutes)
- ✅ One-time use only

### Password Reset
- ✅ Secure random tokens (32 bytes)
- ✅ 1-hour expiration
- ✅ Token deleted after use
- ✅ Token type validation

### Role-Based Access
- ✅ Middleware protection
- ✅ Server-side role checking
- ✅ API route protection

## Troubleshooting

### Email không gửi được
- Kiểm tra SMTP credentials
- Kiểm tra Gmail app password
- Kiểm tra 2FA đã bật chưa
- Check console logs

### Google OAuth lỗi
- Kiểm tra redirect URI đúng chưa
- Kiểm tra Client ID/Secret
- Ensure Google+ API enabled

### Session không lưu
- Kiểm tra NEXTAUTH_SECRET đã set
- Kiểm tra cookies enabled
- Clear browser cache

### Middleware redirect loop
- Kiểm tra token validation
- Kiểm tra matcher config
- Check NEXTAUTH_URL

## Files Created

### Core Configuration
- `lib/auth.ts` - NextAuth config
- `lib/auth-helpers.ts` - Helper functions
- `lib/email.ts` - Email service
- `middleware.ts` - Route protection

### API Routes
- `app/api/auth/[...nextauth]/route.ts` - NextAuth handler
- `app/api/auth/register/route.ts` - Registration
- `app/api/auth/verify-otp/route.ts` - OTP verification
- `app/api/auth/forgot-password/route.ts` - Password reset request
- `app/api/auth/reset-password/route.ts` - Password reset

### Pages
- `app/auth/login/page.tsx` - Login page
- `app/auth/register/page.tsx` - Registration page
- `app/auth/verify-otp/page.tsx` - OTP verification page
- `app/auth/forgot-password/page.tsx` - Forgot password page
- `app/auth/reset-password/page.tsx` - Reset password page

### Database
- `prisma/schema.prisma` - Extended with auth models
- `prisma/migrations/20251112124949_add_authentication_system/` - Migration

## Next Steps

### Tính năng mở rộng có thể thêm:
- [ ] Email change với verification
- [ ] Phone number + SMS OTP
- [ ] 2-Factor Authentication (TOTP)
- [ ] Session management (xem các thiết bị đã đăng nhập)
- [ ] Social login khác (Facebook, GitHub)
- [ ] Remember me functionality
- [ ] Account deletion
- [ ] Admin user management UI
- [ ] Audit logs cho security events
- [ ] Rate limiting cho API routes

## Liên Hệ & Support

Nếu gặp vấn đề hoặc cần hỗ trợ, vui lòng:
1. Kiểm tra phần Troubleshooting
2. Xem logs trong console
3. Kiểm tra `.env` configuration
4. Đọc NextAuth documentation: https://next-auth.js.org/

---

**Version:** 1.0.0  
**Last Updated:** 2024-01-12  
**Author:** Kata SEO Team
