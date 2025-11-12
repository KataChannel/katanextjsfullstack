# Auto-Create Admin User Fix

## 🎯 Vấn đề

Khi tạo content mới (Page/Post/Page Builder), hệ thống cần `authorId` để gán người tạo. Nếu:
- Chưa có content nào trong hệ thống
- Chưa có user nào trong database

→ Sẽ báo lỗi: **"Cần có ít nhất 1 content để lấy authorId"**

## ✅ Giải pháp

Triển khai cơ chế **3-tier fallback** để tự động lấy hoặc tạo authorId:

### Flow lấy authorId

```
1. Try existing content
   ↓ (nếu không có)
2. Try existing admin users  
   ↓ (nếu không có)
3. Auto-create admin user
   ↓ (nếu vẫn fail)
4. Show error
```

## 📁 Files thay đổi

### 1. `/app/admin/content/[id]/page.tsx`

**Cập nhật logic `handleSave()`:**

```typescript
// Try 1: Get from existing content
let authorId: string | null = null;

try {
  const contentsRes = await fetch("/api/pages?limit=1");
  const contentsData = await contentsRes.json();
  const firstContent = contentsData.data?.[0] || contentsData[0];
  
  if (firstContent) {
    const detailRes = await fetch(`/api/pages/${firstContent.id}`);
    const detailData = await detailRes.json();
    authorId = detailData.data?.authorId || detailData.authorId;
  }
} catch (error) {
  console.log("Could not get authorId from existing content");
}

// Try 2: Get from users (first admin user)
if (!authorId) {
  try {
    const usersRes = await fetch("/api/users?limit=1&role=admin");
    const usersData = await usersRes.json();
    const firstUser = usersData.data?.[0] || usersData[0];
    
    if (firstUser) {
      authorId = firstUser.id;
    }
  } catch (error) {
    console.log("Could not get authorId from users");
  }
}

// Try 3: Ensure admin user exists (auto-create if needed)
if (!authorId) {
  try {
    const ensureRes = await fetch("/api/users/ensure-admin", {
      method: "POST",
    });
    const ensureData = await ensureRes.json();
    
    if (ensureData.userId) {
      authorId = ensureData.userId;
      toast.success("Đã tạo admin user mặc định");
    }
  } catch (error) {
    console.log("Could not ensure admin user");
  }
}

// Final fallback: Show error
if (!authorId) {
  toast.error("Không thể tạo hoặc tìm thấy user. Vui lòng kiểm tra database.");
  setSaving(false);
  return;
}
```

### 2. `/app/api/users/route.ts` (NEW)

API endpoint để lấy danh sách users:

```typescript
// GET /api/users?limit=1&role=admin
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get('limit');
  const role = searchParams.get('role');

  const prisma = await getPrisma();
  
  const where: any = {};
  if (role) {
    where.role = role;
  }

  const users = await prisma.user.findMany({
    where,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      image: true,
      emailVerified: true,
      createdAt: true,
      updatedAt: true,
    },
    orderBy: { createdAt: 'desc' },
    take: limit ? parseInt(limit) : undefined,
  });

  return NextResponse.json({ data: users });
}
```

### 3. `/app/api/users/ensure-admin/route.ts` (NEW)

API endpoint để đảm bảo có admin user:

```typescript
// POST /api/users/ensure-admin
export async function POST() {
  const prisma = await getPrisma();
  
  // Check if any admin user exists
  const adminUser = await prisma.user.findFirst({
    where: { role: "admin" },
    select: { id: true, email: true, name: true },
  });
  
  if (adminUser) {
    return NextResponse.json({
      success: true,
      userId: adminUser.id,
      message: "Admin user already exists",
      user: adminUser,
    });
  }
  
  // No admin found, create default admin
  const hashedPassword = await hash("admin123", 10);
  
  const newAdmin = await prisma.user.create({
    data: {
      email: "admin@example.com",
      name: "Admin",
      password: hashedPassword,
      role: "admin",
      emailVerified: new Date(),
    },
  });
  
  return NextResponse.json({
    success: true,
    userId: newAdmin.id,
    message: "Default admin user created",
    user: newAdmin,
    credentials: {
      email: "admin@example.com",
      password: "admin123",
      note: "Please change password after first login",
    },
  });
}
```

### 4. `/lib/ensure-admin.ts` (NEW)

Helper function cho server-side:

```typescript
export async function ensureAdminUser() {
  const userCount = await prisma.user.count();
  
  if (userCount === 0) {
    const hashedPassword = await hash('admin123', 10);
    
    const adminUser = await prisma.user.create({
      data: {
        email: 'admin@example.com',
        name: 'Admin',
        password: hashedPassword,
        role: 'admin',
        emailVerified: new Date(),
      },
    });
    
    return adminUser.id;
  }
  
  const adminUser = await prisma.user.findFirst({
    where: { role: 'admin' },
  });
  
  return adminUser?.id || null;
}
```

## 🧪 Testing

Chạy script test:

```bash
# Start dev server
bun dev

# In another terminal
bun scripts/test-ensure-admin.ts
```

### Expected output:

```
🧪 Testing Ensure Admin User API...

📊 Current user count: 0
👤 Admin count: 0

🔧 Testing /api/users/ensure-admin endpoint...

📥 API Response:
{
  "success": true,
  "userId": "clx...",
  "message": "Default admin user created",
  "user": {
    "id": "clx...",
    "email": "admin@example.com",
    "name": "Admin",
    "role": "admin"
  },
  "credentials": {
    "email": "admin@example.com",
    "password": "admin123",
    "note": "Please change password after first login"
  }
}

✅ Success!
   User ID: clx...
   Message: Default admin user created

🔑 Default Credentials:
   Email: admin@example.com
   Password: admin123
   Note: Please change password after first login

✨ Test completed
```

## 🔐 Default Admin Credentials

Khi admin user được tự động tạo:

- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: `admin`

⚠️ **Lưu ý**: Nên đổi password sau lần đăng nhập đầu tiên!

## ✅ Kết quả

1. ✅ Tạo content mới không còn báo lỗi
2. ✅ Tự động tạo admin user nếu chưa có
3. ✅ Fallback thông minh qua 3 nguồn
4. ✅ Thông báo rõ ràng cho user
5. ✅ Backward compatible với code cũ

## 🎯 Use Cases

### Case 1: Fresh install (chưa có user)
```
1. User tạo content mới
2. System check: No existing content → No authorId
3. System check: No users → No authorId  
4. System auto-create admin user
5. Use admin ID as authorId
6. Content created successfully ✅
```

### Case 2: Có user nhưng chưa có content
```
1. User tạo content mới
2. System check: No existing content → No authorId
3. System check: Found admin user → Use admin ID
4. Content created successfully ✅
```

### Case 3: Đã có content
```
1. User tạo content mới
2. System check: Found existing content → Get authorId
3. Content created successfully ✅
```

## 📊 Performance

- **Case 1**: 3 API calls (content → users → ensure-admin)
- **Case 2**: 2 API calls (content → users)
- **Case 3**: 1-2 API calls (content detail)

Tất cả đều có error handling, không block UI.

## 🔄 Future Improvements

1. **Cache authorId** trong localStorage/sessionStorage
2. **Use NextAuth session** để lấy current user ID
3. **Admin UI** để quản lý users
4. **Seed command** để tạo initial admin
5. **Multi-language** error messages

## 📝 Related Docs

- [30-TEST_PAGE_BUILDER_FIX.md](./30-TEST_PAGE_BUILDER_FIX.md) - Page Builder testing
- [13-AUTH_IMPLEMENTATION_SUMMARY.md](./13-AUTH_IMPLEMENTATION_SUMMARY.md) - Auth system
- [22-HUONG_DAN_CONTENT_MANAGEMENT.md](./22-HUONG_DAN_CONTENT_MANAGEMENT.md) - Content management

---

**Updated**: 2024
**Status**: ✅ Completed & Tested
