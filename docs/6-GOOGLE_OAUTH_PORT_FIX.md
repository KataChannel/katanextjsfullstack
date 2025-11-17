# Fix Bug Google OAuth Redirect về localhost:3000

## Vấn Đề
Khi chạy app trên port 3005 (`http://localhost:3005`) và đăng nhập bằng Google, NextAuth redirect về `http://localhost:3000` thay vì giữ nguyên port 3005.

## Nguyên Nhân
1. `NEXTAUTH_URL` trong `.env.local` hardcode là `http://localhost:3000`
2. NextAuth không tự động detect port từ request
3. Google OAuth redirect URI chưa cấu hình cho port 3005

## Giải Pháp Đã Áp Dụng

### 1. Enable Dynamic Host Detection
**File**: `lib/auth.ts`
```typescript
export const { handlers, signIn, signOut, auth } = NextAuth({
  // ...other config
  trustHost: true, // ✅ Allow dynamic host detection
  // ...
});
```

### 2. Cập nhật NEXTAUTH_URL
**File**: `.env.local`
```bash
NEXTAUTH_URL="http://localhost:3005"  # ✅ Updated to port 3005
```

### 3. Script Tự Động
**File**: `scripts/update-nextauth-url.sh`
```bash
# Sử dụng:
./scripts/update-nextauth-url.sh 3005
```

## Cách Fix Manual

### Bước 1: Cập nhật .env.local
```bash
# Mở file .env.local
nano .env.local

# Tìm dòng:
NEXTAUTH_URL="http://localhost:3000"

# Đổi thành port bạn đang dùng:
NEXTAUTH_URL="http://localhost:3005"
```

### Bước 2: Cập nhật Google OAuth Console
1. Truy cập: https://console.cloud.google.com/apis/credentials
2. Chọn OAuth 2.0 Client ID của project
3. Trong phần **Authorized redirect URIs**, thêm:
   ```
   http://localhost:3005/api/auth/callback/google
   ```
4. Click **Save**

### Bước 3: Restart Dev Server
```bash
# Kill server hiện tại (Ctrl+C)
# Restart với port 3005
bun dev -p 3005
```

## Sử Dụng Script Tự Động

```bash
# Cập nhật NEXTAUTH_URL cho port 3005
./scripts/update-nextauth-url.sh 3005

# Restart server
bun dev -p 3005
```

## Kiểm Tra

1. Mở trình duyệt: http://localhost:3005
2. Click "Đăng nhập bằng Google"
3. Sau khi chọn tài khoản Google, kiểm tra URL
4. ✅ Phải redirect về: http://localhost:3005 (không phải 3000)

## Google OAuth Redirect URIs Chuẩn

Nên thêm tất cả các URIs sau vào Google Console:

### Development
- `http://localhost:3000/api/auth/callback/google`
- `http://localhost:3005/api/auth/callback/google`
- `http://127.0.0.1:3000/api/auth/callback/google`

### Production
- `https://tazagroup.vn/api/auth/callback/google`
- `https://www.tazagroup.vn/api/auth/callback/google`

## Lưu Ý

### trustHost: true
Option này cho phép NextAuth tự động detect hostname và port từ request headers. An toàn cho development, nhưng production nên set NEXTAUTH_URL cụ thể.

### Multiple Ports
Nếu thường xuyên đổi port, có thể:
1. Thêm tất cả ports vào Google Console
2. Hoặc dùng script `update-nextauth-url.sh` để tự động cập nhật

### Environment Variables
Bun đọc biến môi trường từ `.env.local` khi restart. Nếu thay đổi `.env.local`, **bắt buộc** phải restart server.

## Troubleshooting

### Vẫn redirect về 3000
1. Kiểm tra `.env.local` đã save chưa
2. Đã restart server chưa
3. Clear browser cache/cookies
4. Kiểm tra Google Console có URI đúng chưa

### Error: redirect_uri_mismatch
Google OAuth báo lỗi này khi redirect URI không match:
1. Copy chính xác error message (có URL redirect)
2. Add URL đó vào Google Console
3. Format phải chính xác: `http://localhost:3005/api/auth/callback/google`

### Session vẫn trỏ về 3000
1. Sign out khỏi app
2. Clear cookies cho localhost
3. Sign in lại

## Files Đã Sửa

1. ✅ `lib/auth.ts` - Thêm `trustHost: true`
2. ✅ `.env.local` - Update `NEXTAUTH_URL` từ 3000 → 3005
3. ✅ `scripts/update-nextauth-url.sh` - Script tự động (NEW)

## Kết Quả

- ✅ Login Google redirect về đúng port
- ✅ Session giữ nguyên port
- ✅ Callbacks work properly
- ✅ Development experience improved
