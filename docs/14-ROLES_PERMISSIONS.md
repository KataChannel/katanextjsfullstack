# 🔐 Phân Quyền Người Dùng (Role-Based Access Control)

## Tổng Quan

Hệ thống hỗ trợ 4 vai trò (roles) với các quyền hạn khác nhau:

## 🎭 Các Vai Trò

### 1. 👤 User (Người dùng)
**Role**: `user` (mặc định)

**Quyền hạn:**
- ❌ Không có quyền truy cập admin panel
- ✅ Có thể đăng nhập vào hệ thống
- ✅ Xem nội dung công khai

**Thông báo:**
Khi truy cập `/admin` → Redirect đến `/auth/unauthorized` với thông báo liên hệ admin

---

### 2. ✏️ Editor (Biên tập viên)
**Role**: `editor`

**Quyền hạn:**
- ✅ Truy cập admin panel
- ✅ Quản lý nội dung (Content)
- ✅ Quản lý media (Media)
- ✅ Sử dụng Page Builder
- ❌ Không thể quản lý users
- ❌ Không thể xem analytics
- ❌ Không thể cài đặt SEO

**Menu khả dụng:**
- `/admin` - Tổng quan
- `/admin/content` - Quản lý nội dung
- `/admin/page-builder` - Page Builder
- `/admin/media` - Quản lý media

---

### 3. 📊 Manager (Người quản lý)
**Role**: `manager`

**Quyền hạn:**
- ✅ Truy cập admin panel
- ✅ Quản lý nội dung (Content)
- ✅ Quản lý media (Media)
- ✅ Sử dụng Page Builder
- ❌ Không thể quản lý users
- ❌ Không thể xem analytics
- ❌ Không thể cài đặt SEO

**Menu khả dụng:**
- `/admin` - Tổng quan
- `/admin/content` - Quản lý nội dung
- `/admin/page-builder` - Page Builder
- `/admin/media` - Quản lý media

**Note:** Giống Editor nhưng có thể được mở rộng thêm quyền trong tương lai.

---

### 4. 👑 Admin (Quản trị viên)
**Role**: `admin`

**Quyền hạn:**
- ✅ Toàn quyền truy cập tất cả chức năng
- ✅ Quản lý users
- ✅ Xem analytics
- ✅ Cài đặt SEO
- ✅ Quản lý nội dung, media, page builder

**Menu khả dụng:**
- Tất cả menu trong admin panel

---

## 🛠️ Cách Set Role

### Sử dụng Script

```bash
# Set admin
node scripts/set-admin-role.js user@example.com admin

# Set manager
node scripts/set-admin-role.js user@example.com manager

# Set editor
node scripts/set-admin-role.js user@example.com editor

# Set user (remove admin access)
node scripts/set-admin-role.js user@example.com user
```

### Sử dụng Prisma Studio

```bash
bunx prisma studio
```

1. Mở table **User**
2. Tìm user cần cập nhật
3. Edit field `role`
4. Chọn: `admin`, `manager`, `editor`, hoặc `user`
5. Save

### Sử dụng SQL

```sql
-- Set admin
UPDATE "User" SET role = 'admin' WHERE email = 'user@example.com';

-- Set manager
UPDATE "User" SET role = 'manager' WHERE email = 'user@example.com';

-- Set editor
UPDATE "User" SET role = 'editor' WHERE email = 'user@example.com';

-- Set user
UPDATE "User" SET role = 'user' WHERE email = 'user@example.com';
```

---

## 📋 Bảng So Sánh Quyền

| Quyền hạn | User | Editor | Manager | Admin |
|-----------|------|--------|---------|-------|
| Truy cập Admin | ❌ | ✅ | ✅ | ✅ |
| Quản lý Content | ❌ | ✅ | ✅ | ✅ |
| Quản lý Media | ❌ | ✅ | ✅ | ✅ |
| Page Builder | ❌ | ✅ | ✅ | ✅ |
| Quản lý Users | ❌ | ❌ | ❌ | ✅ |
| Xem Analytics | ❌ | ❌ | ❌ | ✅ |
| Cài đặt SEO | ❌ | ❌ | ❌ | ✅ |

---

## 🔒 Xử Lý Không Có Quyền

### Khi user không có quyền truy cập:

1. **Chưa đăng nhập** → Redirect đến `/auth/login?callbackUrl=/admin`
2. **Role = user** → Redirect đến `/auth/unauthorized`
3. **Truy cập menu bị hạn chế** → Redirect đến `/auth/unauthorized`

### Trang Unauthorized (`/auth/unauthorized`)

Hiển thị:
- ❌ Thông báo không có quyền
- 📋 Danh sách roles có thể truy cập
- 📧 Thông tin liên hệ admin: `admin@tazagroup.vn`
- 🏠 Nút "Về Trang Chủ"
- 🚪 Nút "Đăng Xuất"

---

## 🎯 Use Cases

### Trường hợp 1: Tuyển dụng Editor
```bash
# 1. Editor đăng ký tài khoản qua /auth/register
# 2. Xác thực email với OTP
# 3. Admin set role:
node scripts/set-admin-role.js editor@company.com editor

# 4. Editor logout và login lại
# 5. Editor có thể truy cập /admin/content, /admin/media, /admin/page-builder
```

### Trường hợp 2: Thăng cấp User thành Manager
```bash
# User hiện tại với role = "user"
node scripts/set-admin-role.js user@company.com manager

# User cần logout và login lại để cập nhật session
```

### Trường hợp 3: Thu hồi quyền Admin
```bash
# Hạ cấp admin xuống user
node scripts/set-admin-role.js former-admin@company.com user
```

---

## 🚀 Development Notes

### Thêm quyền mới cho Role

File: `lib/permissions.ts`

```typescript
export function getRolePermissions(role: UserRole): RolePermissions {
  // Thêm permission mới
  canDoSomething: boolean;
  
  // Cập nhật cho từng role
  manager: {
    // ...
    canDoSomething: true,
  }
}
```

### Thêm route restriction

File: `proxy.ts`

```typescript
function getRestrictedRoutes(role: string): string[] {
  switch (role) {
    case 'manager':
      return [
        '/admin/new-restricted-route',
      ];
  }
}
```

---

## 🐛 Troubleshooting

### Issue: Role đã thay đổi nhưng vẫn bị chặn
**Solution:**
- Logout: `/auth/logout`
- Login lại để refresh session
- Session JWT cache role cũ

### Issue: Script không tìm thấy user
**Solution:**
- Kiểm tra email đúng chính xác
- User đã đăng ký và xác thực email chưa?
- Sử dụng Prisma Studio để xác nhận

### Issue: Menu không hiển thị sau khi set role
**Solution:**
- Clear browser cache
- Hard refresh: `Ctrl + Shift + R`
- Kiểm tra console logs

---

## 📞 Liên Hệ Admin

Nếu cần được cấp quyền quản trị:
- **Email**: admin@tazagroup.vn
- **Ghi rõ**: Họ tên, email đăng ký, vai trò cần xin

---

**Last Updated**: 2024-11-12  
**Version**: 1.0.0
