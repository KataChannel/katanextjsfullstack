# 🔧 Fix User Role Issue

**User**: chikiet88@gmail.com  
**Issue**: Cannot access `/admin` after OAuth login  
**Cause**: User created with default role "user" instead of "admin"  
**Status**: ✅ Fixed

## Problem

When user logs in with Google OAuth for the first time:
1. NextAuth creates new user in database
2. Default role is set to "user" (from Prisma schema default)
3. User gets JWT token with role: "user"
4. Middleware blocks access to `/admin` (requires admin role)

## Root Cause

**Prisma Schema Default:**
```prisma
model User {
  role String @default("user")  // ❌ Default is "user"
}
```

When OAuth login creates new user:
- No role specified → Uses default "user"
- JWT token contains role: "user"
- Admin routes blocked by middleware

## Solution

### 1. Update Database Role

```bash
# Update user role to admin
./deploy/update-user-role.sh chikiet88@gmail.com
```

Or manually:
```sql
UPDATE users SET role = 'admin' WHERE email = 'chikiet88@gmail.com';
```

**Result:**
```
        email        |     name      | role  
---------------------+---------------+-------
 chikiet88@gmail.com | Kiet Pham Chi | admin
```

### 2. Clear JWT Token

**Problem**: JWT token still contains old role "user"

**Solution**: User must logout and login again

**Option 1: Use Signout URL**
```
https://innerbright.vn/api/auth/signout
→ Click "Sign out"
→ Login again
```

**Option 2: Clear Browser Cookies**
```
1. Open DevTools (F12)
2. Application → Cookies → innerbright.vn
3. Delete all cookies
4. Login again
```

**Option 3: Incognito Mode**
```
1. Open new Incognito window
2. Login with chikiet88@gmail.com
3. ✅ Will have admin role
```

### 3. Verify Access

After re-login:
```bash
curl https://innerbright.vn/api/auth/session
```

**Expected:**
```json
{
  "user": {
    "email": "chikiet88@gmail.com",
    "name": "Kiet Pham Chi",
    "role": "admin",  // ✅ Changed from "user"
    "emailVerified": "2025-11-18T18:38:27.952Z"
  }
}
```

Access admin:
```
https://innerbright.vn/admin
✅ Should work now
```

## Prevention

### Option 1: Set Admin Role During OAuth Login

Update `lib/auth.ts` signIn callback:

```typescript
if (account?.provider === "google") {
  const existingUser = await authPrisma.user.findUnique({
    where: { email: user.email! },
  });

  if (!existingUser) {
    // New user created by OAuth
    // Check if this is an admin email
    const adminEmails = [
      'chikiet88@gmail.com',
      'katachanneloffical@gmail.com',
      'admin@innerbright.vn'
    ];
    
    if (adminEmails.includes(user.email!)) {
      // Update role to admin
      await authPrisma.user.update({
        where: { email: user.email! },
        data: { role: 'admin' }
      });
      
      // Update user object for JWT
      user.role = 'admin';
    }
  }
}
```

### Option 2: Change Schema Default for Specific Domains

```prisma
model User {
  role String @default("admin")  // For admin-only sites
}
```

Then run migration:
```bash
bun prisma migrate dev
```

### Option 3: Admin Approval Workflow

Keep default "user" role, require admin approval:

1. User registers with role: "user"
2. Admin reviews in `/admin/users`
3. Admin changes role to "admin" or "manager"
4. User gets email notification
5. User logout/login to get new role

## Quick Fix Script

Created: **`deploy/update-user-role.sh`**

**Usage:**
```bash
cd deploy
./update-user-role.sh chikiet88@gmail.com
```

**What it does:**
- ✅ Connects to server
- ✅ Updates user role to admin
- ✅ Shows result
- ✅ Provides logout instructions

## Multiple Users Fix

If multiple users need admin role:

```bash
# Update multiple users at once
ssh root@116.118.48.208 "docker exec 0722cb3694fe psql -U postgres -d innerv2core -c \"
UPDATE users 
SET role = 'admin' 
WHERE email IN (
  'chikiet88@gmail.com',
  'katachanneloffical@gmail.com',
  'admin@innerbright.vn'
);

SELECT email, role FROM users WHERE email IN (
  'chikiet88@gmail.com',
  'katachanneloffical@gmail.com',
  'admin@innerbright.vn'
);
\""
```

## Verification Checklist

After role update:

- [ ] Database role updated to "admin"
- [ ] User logged out (cleared JWT token)
- [ ] User logged in again
- [ ] Session API shows role: "admin"
- [ ] Can access `/admin` URL
- [ ] Can access admin features

**Test:**
```bash
# 1. Check database
ssh root@116.118.48.208 "docker exec 0722cb3694fe psql -U postgres -d innerv2core -c 'SELECT email, role FROM users WHERE email = \"chikiet88@gmail.com\";'"

# 2. Check session (after re-login)
curl https://innerbright.vn/api/auth/session | jq .user.role
# Expected: "admin"

# 3. Try accessing admin
curl -I https://innerbright.vn/admin
# Should NOT redirect to /auth/login
```

## Technical Notes

### Why JWT Strategy Requires Re-login

**JWT Token Structure:**
```javascript
// JWT contains user data at login time
{
  id: "76d33602-684c-48ad-8780-42d1b83b2978",
  email: "chikiet88@gmail.com",
  role: "user",  // ← This is CACHED in token
  iat: 1700411927,
  exp: 1702849927
}
```

**When role is updated in database:**
- ✅ Database: role = "admin" 
- ❌ JWT token: role = "user" (still cached)
- ❌ Session API: Returns role from JWT token

**Token is only refreshed when:**
1. User logs out and logs in again
2. Token expires (30 days later)
3. `update()` called with trigger="update" (requires code)

### Middleware Check

```typescript
// middleware.ts
if (isAdminRoute && !token) {
  return redirect('/auth/login');
}

if (isAdminRoute && token.role !== 'admin') {
  return redirect('/auth/unauthorized');  // ← Blocks non-admin
}
```

## Related Issues

- **OAuth_Login_Bug_Fix.md** - OAuth account linking issue
- **Session_Email_Fix.md** - JWT token caching issue

## Summary

**Fixed:** ✅ Database role updated to "admin"

**Action Required:** User must logout and login again to get new JWT token with admin role

**Quick Command:**
```bash
./deploy/update-user-role.sh chikiet88@gmail.com
```

---

**Fixed**: November 19, 2025  
**Next Login**: User will have admin access
