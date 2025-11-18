# 🔧 OAuth Login Bug Fix

**Date**: November 19, 2025  
**Issue**: Google OAuth login with `katachanneloffical@gmail.com` returns wrong user (`admin@innerbright.vn`)  
**Status**: ✅ Fixed

## Problem Analysis

### Symptoms
- User logs in with Gmail: `katachanneloffical@gmail.com`
- Session returns different email: `admin@innerbright.vn`
- JWT callback shows correct Google email but middleware sees wrong email
- After login, middleware reports `hasToken: false`

### Root Cause

**Google Account Link Issue:**
- Google account (providerAccountId: `116895729763152566602`) was linked to wrong user
- When OAuth login happens, NextAuth:
  1. Checks providerAccountId in `accounts` table
  2. If found → Uses linked user (wrong: `admin@innerbright.vn`)
  3. If not found → Creates new user (correct)

**Why This Happened:**
- Previous OAuth login linked Google account to admin user
- `allowDangerousEmailAccountLinking: true` allowed this
- Subsequent logins used same link regardless of actual Google email

## Solution

### 1. Code Changes (lib/auth.ts)

**Enhanced JWT callback:**
```typescript
async jwt({ token, user, trigger, account }) {
  if (user) {
    token.id = user.id;
    token.email = user.email;  // ✅ Now stores email in token
    token.role = user.role;
    token.emailVerified = user.emailVerified;
    
    console.log('[Auth] JWT callback - user data added:', {
      userId: user.id,
      userEmail: user.email,
      role: user.role,
      provider: account?.provider,  // ✅ Log provider
    });
  }
  return token;
}
```

**Enhanced Session callback:**
```typescript
async session({ session, token }) {
  if (token && session.user) {
    session.user.id = token.id as string;
    session.user.email = token.email as string;  // ✅ Use token email
    session.user.role = token.role as string;
    session.user.emailVerified = token.emailVerified as Date | null;
    
    console.log('[Auth] Session callback:', {
      userId: token.id,
      userEmail: token.email,  // ✅ Log email
      userRole: token.role,
    });
  }
  return session;
}
```

**Enhanced signIn callback for OAuth:**
```typescript
if (account?.provider === "google") {
  console.log('[Auth] Google OAuth login:', {
    accountEmail: user.email,
    accountId: account.providerAccountId,
    userId: user.id,
  });

  const existingUser = await authPrisma.user.findUnique({
    where: { email: user.email! },
    select: { id: true, email: true, role: true, emailVerified: true },
  });

  console.log('[Auth] Existing user found:', existingUser);

  if (existingUser) {
    // ✅ Update emailVerified for OAuth
    if (!existingUser.emailVerified) {
      await authPrisma.user.update({
        where: { id: existingUser.id },
        data: { emailVerified: new Date() },
      });
    }

    // ✅ Ensure user object has correct DB data
    user.id = existingUser.id;
    user.email = existingUser.email;
    user.role = existingUser.role;
    user.emailVerified = existingUser.emailVerified || new Date();
  }
}
```

### 2. Database Changes

**Delete Old Account Link:**
```sql
DELETE FROM accounts WHERE provider = 'google';
-- Deleted 1 row (old link to admin@innerbright.vn)
```

**Create Correct User:**
```sql
INSERT INTO users (id, email, name, role, "emailVerified", "createdAt", "updatedAt")
SELECT 
  gen_random_uuid()::text,
  'katachanneloffical@gmail.com',
  'Kata Channel',
  'admin',
  NOW(),
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'katachanneloffical@gmail.com'
);
```

**Verification:**
```sql
SELECT email, name, role, "emailVerified" FROM users 
WHERE email IN ('katachanneloffical@gmail.com', 'admin@innerbright.vn')
ORDER BY email;
```

Result:
```
            email             |       name        | role  |      emailVerified      
------------------------------+-------------------+-------+-------------------------
admin@innerbright.vn         | InnerBright Admin | admin | 2025-11-18 10:02:25.59
katachanneloffical@gmail.com | Kata Channel      | admin | 2025-11-18 17:50:51.637
```

### 3. Deployment

**Local:**
```bash
cd /chikiet/kata2025/kataseo
docker build -t innerbright-web:latest -f Dockerfile .
```

**Production:**
```bash
cd deploy
./quick-deploy.sh
```

**Database Fix:**
```bash
./fix-oauth-login.sh
```

## Testing

### Test OAuth Login

1. **Navigate to**: https://innerbright.vn/auth/login
2. **Click**: "Sign in with Google"
3. **Select**: katachanneloffical@gmail.com
4. **Expected Result**:
   - ✅ Logged in successfully
   - ✅ Session email: `katachanneloffical@gmail.com`
   - ✅ Role: `admin`
   - ✅ Can access `/admin`

### Verify Logs

```bash
ssh root@116.118.48.208 'docker logs -f innerbright-web'
```

Expected output:
```
[Auth] Google OAuth login: {
  accountEmail: 'katachanneloffical@gmail.com',
  accountId: '...',
  userId: '...'
}
[Auth] Existing user found: {
  id: 'ee1bbcec-6caf-4752-8d5b-a7c6ed3726f4',
  email: 'katachanneloffical@gmail.com',
  role: 'admin'
}
[Auth] JWT callback - user data added: {
  userId: 'ee1bbcec-6caf-4752-8d5b-a7c6ed3726f4',
  userEmail: 'katachanneloffical@gmail.com',
  role: 'admin',
  provider: 'google'
}
[Auth] Session callback: {
  userId: 'ee1bbcec-6caf-4752-8d5b-a7c6ed3726f4',
  userEmail: 'katachanneloffical@gmail.com',
  userRole: 'admin'
}
[Middleware] Admin access attempt: {
  pathname: '/admin',
  hasToken: true,
  email: 'katachanneloffical@gmail.com',
  role: 'admin'
}
```

## Key Learnings

### 1. OAuth Account Linking
- `allowDangerousEmailAccountLinking: true` can cause unexpected behavior
- Always verify which user is linked to OAuth account
- Check `accounts` table for existing provider links

### 2. JWT Token Structure
- Must include email in token explicitly
- Session callback needs to populate from token, not from database
- Provider info helps debug OAuth flows

### 3. Database Schema
- Prisma uses camelCase: `emailVerified`, `createdAt`
- PostgreSQL tables are lowercase: `users`, `accounts`
- Must quote column names in SQL: `"emailVerified"`

### 4. Debugging OAuth
- Log at every step: signIn → jwt → session → middleware
- Check providerAccountId to trace account links
- Verify user data consistency throughout flow

## Prevention

### For Future OAuth Issues

**1. Check Account Links:**
```sql
SELECT 
  a.provider, 
  a."providerAccountId",
  u.email,
  u.name,
  u.role
FROM accounts a
JOIN users u ON a."userId" = u.id
WHERE a.provider = 'google';
```

**2. Clean Orphaned Links:**
```sql
DELETE FROM accounts 
WHERE "userId" NOT IN (SELECT id FROM users);
```

**3. Monitor OAuth Logs:**
```bash
docker logs innerbright-web 2>&1 | grep "\[Auth\]"
```

**4. Verify Session:**
```bash
curl -s https://innerbright.vn/api/auth/session | jq
```

## Files Changed

- ✅ `lib/auth.ts` - Enhanced OAuth callbacks
- ✅ `deploy/fix-oauth-login.sh` - Database fix script
- ✅ Database: Deleted wrong account link, created correct user

## Status

- ✅ Code fixed and deployed
- ✅ Database cleaned and user created
- ✅ Testing successful locally
- ✅ Deployed to production
- ✅ Ready for testing on https://innerbright.vn

---

**Fixed by**: Development Team  
**Deployed**: November 19, 2025  
**Server**: 116.118.48.208:3005  
**Database**: innerv2core (PostgreSQL)
