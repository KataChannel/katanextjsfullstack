# 🔧 Session Email Issue - Quick Fix

**Issue**: `/api/auth/session` returns old user email `admin@innerbright.vn` instead of Google email `katachanneloffical@gmail.com`

## Why This Happens

### JWT Token Lifecycle

```
Old Login (before fix):
1. User logged in → JWT created with user: admin@innerbright.vn
2. JWT stored in browser cookie
3. JWT expires in 30 days

Current Situation:
1. Database fixed ✅
2. Code fixed ✅
3. BUT: Browser still has OLD JWT token
4. Session API reads OLD JWT → returns OLD user data
```

### JWT Token Structure

```javascript
// JWT cookie contains:
{
  id: "75bc1a72-02ef-402d-b607-db1d2d892e4d",  // Old user ID
  email: "admin@innerbright.vn",               // Old email (CACHED)
  role: "admin",
  emailVerified: "2025-11-18T10:02:25.590Z",
  iat: ...,
  exp: ...  // Expires in 30 days
}
```

When you call `/api/auth/session`:
1. NextAuth reads JWT from cookie
2. Decodes JWT
3. Returns data from JWT (not from database)
4. Result: Old email appears

## Solution

### Option 1: Force Logout (Recommended)

**For Testing:**
```bash
# Visit this URL in browser
https://innerbright.vn/api/auth/force-logout

# Then login again
https://innerbright.vn/auth/login
```

**What it does:**
- Clears all NextAuth cookies
- Forces browser to delete old JWT
- Next login creates fresh JWT with correct user

### Option 2: Manual Cookie Clear

**In Browser:**
1. Open DevTools (F12)
2. Go to Application → Cookies
3. Delete all cookies for `innerbright.vn`
4. Refresh page
5. Login again

### Option 3: Wait for Token Expiry

JWT expires in 30 days from last login. After expiry:
- Token becomes invalid
- User must login again
- New token created with correct data

**Not recommended** - too slow for testing

## Testing Steps

### 1. Clear Old Session

```bash
# Visit force-logout endpoint
curl https://innerbright.vn/api/auth/force-logout

# Or in browser
https://innerbright.vn/api/auth/force-logout
```

### 2. Verify Logout

```bash
# Should return null user
curl https://innerbright.vn/api/auth/session
# Expected: {"user":null}
```

### 3. Login Again

```
https://innerbright.vn/auth/login
→ Click "Sign in with Google"
→ Select: katachanneloffical@gmail.com
```

### 4. Verify New Session

```bash
curl https://innerbright.vn/api/auth/session
```

**Expected Result:**
```json
{
  "user": {
    "name": "Kata Channel",
    "email": "katachanneloffical@gmail.com",
    "image": "https://...",
    "id": "ee1bbcec-6caf-4752-8d5b-a7c6ed3726f4",
    "role": "admin",
    "emailVerified": "2025-11-18T17:50:51.637Z"
  },
  "expires": "..."
}
```

## Why JWT Strategy Behaves This Way

### JWT vs Database Sessions

**Database Sessions (old approach):**
```
Login → Create session in database
Each request → Query database for session
Logout → Delete session from database
✅ Always fresh data from database
❌ Database query on every request
```

**JWT Sessions (current approach):**
```
Login → Create JWT token
Each request → Decode JWT token (no database)
Logout → Clear JWT cookie
✅ No database query needed
❌ Token data cached until expiry
```

### Trade-offs

**Advantages:**
- ✅ Faster (no database queries)
- ✅ Stateless (scales better)
- ✅ Works across multiple servers

**Disadvantages:**
- ❌ User data cached in token
- ❌ Changes don't reflect until re-login
- ❌ Must manually clear cookies to force refresh

## Technical Details

### JWT Decode Flow

```typescript
// When you call /api/auth/session
GET /api/auth/session

↓

NextAuth reads cookie: next-auth.session-token

↓

JWT.decode(token) → {
  id: "...",
  email: "admin@innerbright.vn",  // This is from TOKEN
  role: "admin"
}

↓

session callback({ session, token }) {
  session.user.email = token.email;  // Uses TOKEN data
  return session;
}

↓

Returns: { user: { email: token.email } }
```

### Why Database Fix Didn't Work Immediately

```
Database: ✅ Fixed (has correct user)
Code:     ✅ Fixed (correct callbacks)
Token:    ❌ Still old (cached in browser cookie)

Result: Session shows old data from token
```

## Prevention

### For Future Updates

**1. Use trigger="update" to refresh token:**
```typescript
// When user data changes
await update({ trigger: "update" });
```

**2. Shorter token expiry:**
```typescript
session: {
  maxAge: 7 * 24 * 60 * 60, // 7 days instead of 30
}
```

**3. Force re-authentication for critical changes:**
```typescript
if (userDataChanged) {
  await signOut({ callbackUrl: '/auth/login' });
}
```

## Deployment

### Build & Deploy

```bash
# Build with new force-logout endpoint
docker build -t innerbright-web:latest .

# Deploy
cd deploy
./quick-deploy.sh
```

### Verify Deployment

```bash
# Check force-logout endpoint exists
curl https://innerbright.vn/api/auth/force-logout

# Expected: { "message": "Logged out successfully" }
```

## Summary

**Problem**: JWT token cached in browser has old user data

**Root Cause**: JWT strategy doesn't update token until re-login

**Solution**: Clear cookies with force-logout endpoint, then login again

**Long-term**: Consider shorter token expiry or use database sessions for admin

---

**Quick Fix**: Visit https://innerbright.vn/api/auth/force-logout then login again
