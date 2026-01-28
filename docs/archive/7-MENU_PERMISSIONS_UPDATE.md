# Quản Lý Menu và Phân Quyền

## Tổng Quan
Đã triển khai hệ thống quản lý menu với phân quyền chi tiết cho từng user. Admin (katachanneloffical@gmail.com) có full quyền tất cả menu.

## Thay Đổi Database

### Model MenuPermission (Mới)
```prisma
model MenuPermission {
  id              String   @id @default(uuid())
  userId          String
  allowedMenus    Json     // Array URLs: ["/nlp", "/khoa-hoc"]
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  @@unique([userId])
}
```

### Cập Nhật User Model
- Thêm relation: `menuPermissions MenuPermission[]`

## File Mới

### 1. API Routes
**app/api/menu-permissions/route.ts**
- GET: Lấy menu permissions của user hiện tại
- Admin tự động có full quyền
- User thường lấy từ MenuPermission table

**app/api/admin/menu-permissions/route.ts**
- GET: List tất cả users + permissions (Admin only)
- POST: Cập nhật permissions cho user (Admin only)

### 2. Admin Page
**app/admin/menu-permissions/page.tsx**
- 2 panels: Danh sách users + Panel phân quyền
- Checkbox để chọn menu
- Real-time update
- Mobile-first responsive
- shadcn UI components

### 3. Seed Data
**prisma/seed-menu-permissions.ts**
- Admin: katachanneloffical@gmail.com
  - Password: Admin@123456
  - Role: admin
  - Full 9 menu items
- Demo User: user@example.com
  - Password: User@123456  
  - Role: user
  - Chỉ 3 menu: /innerbright, /lien-he, /thu-vien

## File Đã Cập Nhật

### 1. components/header.tsx
**Tính năng mới:**
- Import `useSession` from next-auth
- Fetch menu permissions từ API
- Filter menu items dựa trên:
  - Unauthenticated: Hiện tất cả (public)
  - Admin: Hiện tất cả menu
  - User: Chỉ hiện menu được phép

**Logic:**
```typescript
const getFilteredMenus = () => {
  if (!session) return allMenus; // Public
  if (isAdmin) return allMenus;  // Admin full
  return allMenus.filter(menu => 
    allowedMenus.includes(menu.url) // User filtered
  );
};
```

### 2. components/admin-sidebar.tsx
- Thêm icon Shield và Globe
- Thêm menu "Quyền Menu" → `/admin/menu-permissions`
- Thêm menu "Website Settings" → `/admin/website-settings`

## Migration
```bash
bunx prisma migrate dev --name add_menu_permissions
bun prisma/seed-menu-permissions.ts
```

## Tính Năng

### Admin
1. **Quản lý Quyền Menu** (`/admin/menu-permissions`)
   - Xem danh sách tất cả users
   - Hiển thị role (admin/user)
   - Số lượng menu được phép
   - Click user để phân quyền
   - Checkbox chọn menu
   - Auto-save permissions

2. **Admin Auto Full Access**
   - Không cần phân quyền riêng
   - Tự động có quyền tất cả menu
   - UI hiển thị "Admin có full quyền"

### Frontend
1. **Dynamic Menu với Permissions**
   - Check session status
   - Fetch permissions từ API
   - Filter menu real-time
   - Ẩn menu không có quyền

2. **Role-based Access**
   - Admin: Full menu
   - User: Chỉ menu được phép
   - Guest: Tất cả menu (public)

3. **API Protection**
   - GET /api/menu-permissions: User phải login
   - GET /api/admin/menu-permissions: Chỉ admin
   - POST /api/admin/menu-permissions: Chỉ admin

## Accounts Mặc Định

### Admin Account
```
Email: katachanneloffical@gmail.com
Password: Admin@123456
Role: admin
Menu: Tất cả (9 items)
```

### Demo User Account
```
Email: user@example.com
Password: User@123456  
Role: user
Menu: 3 items (/innerbright, /lien-he, /thu-vien)
```

## Menu Items Mẫu (9 items)
1. /innerbright - Về InnerBright
2. /nlp - NLP
3. /time-line-therapy - Time Line Therapy®
4. /dao-tao-doanh-nghiep - Đào tạo doanh nghiệp
5. /khai-van-ca-nhan - Khái vận cá nhân
6. /khoa-hoc - Khoá học
7. /bo-the-nlp - Bộ thẻ NLP
8. /thu-vien - Thư viện
9. /lien-he - Liên hệ

## Luồng Hoạt Động

### 1. User Login
```
1. User login (credentials/Google OAuth)
2. NextAuth tạo session
3. Lưu userId, role vào session
```

### 2. Load Menu
```
1. Header component mount
2. useSession() check authentication
3. Nếu authenticated:
   - Fetch /api/menu-permissions
   - Nhận allowedMenus array
   - Filter navigation items
4. Render menu đã filter
```

### 3. Admin Assign Permissions
```
1. Admin vào /admin/menu-permissions
2. Click chọn user
3. Checkbox chọn/bỏ menu items
4. Click "Lưu quyền"
5. POST /api/admin/menu-permissions
6. Upsert MenuPermission record
7. User refresh → thấy menu mới
```

## Security

### API Protection
- Session check với `await auth()`
- Role check: `session.user.role === 'admin'`
- 401 Unauthorized nếu không login
- 403 Forbidden nếu không phải admin

### Database
- Unique constraint: 1 user = 1 MenuPermission record
- Cascade delete: Xóa user → xóa permissions
- JSON validation: allowedMenus phải array

## Performance
- Client-side caching với useState
- Single API call khi mount
- Không re-fetch mỗi navigation
- Conditional rendering (ẩn menu)

## Kiến Trúc
- **Clean Architecture**: Separation API/UI/Logic
- **Type Safety**: TypeScript interfaces đầy đủ
- **Mobile First**: Responsive 2-column → 1-column
- **UX**: Loading states, toast notifications, icon indicators

## Best Practices Tuân Thủ
✅ Principal Engineer code  
✅ Clean Architecture  
✅ Mobile First + Responsive  
✅ shadcn UI components  
✅ Giao diện tiếng Việt  
✅ Checkbox thay vì Select (UI đơn giản hơn)  
✅ Không testing (theo yêu cầu)  
✅ Không git (theo yêu cầu)  

## Sử Dụng

### 1. Login as Admin
```
1. Truy cập /auth/login
2. Email: katachanneloffical@gmail.com
3. Password: Admin@123456
4. Redirect /admin
```

### 2. Phân Quyền Menu cho User
```
1. Vào /admin/menu-permissions
2. Click user trong danh sách bên trái
3. Panel bên phải hiện danh sách menu
4. Click checkbox để chọn/bỏ menu
5. Click "Lưu quyền (X menu)"
6. Toast confirm "Đã cập nhật quyền menu"
```

### 3. Test Permissions
```
1. Logout
2. Login bằng user@example.com
3. Header chỉ hiện 3 menu: Về InnerBright, Thư viện, Liên hệ
4. Các menu khác bị ẩn
```

### 4. Thêm User Mới
```
1. User register/login
2. Mặc định: Không có permissions (allowedMenus = [])
3. Admin vào /admin/menu-permissions
4. Assign menu cho user mới
```

## Troubleshooting

### Menu không filter
- Check session có active không
- Check API /api/menu-permissions response
- Check browser console errors
- Hard refresh (Ctrl+Shift+R)

### Admin không thấy menu
- Verify role === 'admin' trong database
- Check API response có isAdmin: true không
- Logout/login lại

### Permissions không save
- Check role admin trong session
- Check API response status code
- Check database có record chưa
- Check allowedMenus format (phải array)

## Kết Quả
- ✅ Admin auto full quyền tất cả menu
- ✅ User chỉ thấy menu được phép
- ✅ UI quản lý permissions hoàn chỉnh
- ✅ Mobile-first responsive
- ✅ Type-safe với TypeScript
- ✅ Protected APIs
- ✅ Real-time permission updates
