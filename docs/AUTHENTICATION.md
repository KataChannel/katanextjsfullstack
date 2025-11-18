# 🔐 Authentication & Authorization

## Overview

Hệ thống authentication sử dụng **NextAuth 5** với JWT strategy và role-based access control.

## Features

- ✅ **JWT Authentication** - Fast, stateless sessions
- ✅ **Multiple Providers** - Credentials, Google OAuth
- ✅ **Role-Based Access** - Admin, Manager, Editor
- ✅ **Email Verification** - OTP-based verification
- ✅ **Password Reset** - Secure password recovery
- ✅ **Domain Isolation** - Per-domain authentication

## Authentication Flow

### 1. Registration

```typescript
// POST /api/auth/register
{
  name: "John Doe",
  email: "john@example.com",
  password: "********"
}

// Response: OTP sent to email
{
  message: "OTP sent to email",
  userId: "user_123"
}
```

### 2. Email Verification

```typescript
// POST /api/auth/verify-otp
{
  email: "john@example.com",
  otp: "123456"
}

// Response: Email verified
{
  message: "Email verified successfully"
}
```

### 3. Login

```typescript
// Credentials Login
const result = await signIn('credentials', {
  email: 'john@example.com',
  password: '********',
  redirect: false,
});

// Google OAuth
await signIn('google', {
  callbackUrl: '/admin',
});
```

## User Roles

### Role Hierarchy

```
Admin > Manager > Editor
```

### Permissions Matrix

| Feature | Admin | Manager | Editor |
|---------|-------|---------|--------|
| Dashboard | ✅ | ✅ | ✅ |
| Pages/Posts | ✅ | ✅ | ✅ |
| Page Builder | ✅ | ✅ | ✅ |
| Media | ✅ | ✅ | ✅ |
| Menus | ✅ | ✅ | ❌ |
| Block Templates | ✅ | ✅ | ❌ |
| Users | ✅ | ❌ | ❌ |
| Analytics | ✅ | ❌ | ❌ |
| SEO Settings | ✅ | ❌ | ❌ |
| Website Settings | ✅ | ❌ | ❌ |

## Configuration

### NextAuth Setup

```typescript
// lib/auth.ts
export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(authPrisma),
  session: {
    strategy: "jwt", // JWT for performance
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      async authorize(credentials) {
        // Validate credentials
        // Return user object
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // Add user data to JWT
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.emailVerified = user.emailVerified;
      }
      return token;
    },
    async session({ session, token }) {
      // Add token data to session
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
        session.user.emailVerified = token.emailVerified;
      }
      return session;
    },
  },
});
```

### Environment Variables

```bash
# NextAuth
NEXTAUTH_URL="https://innerbright.vn"
NEXTAUTH_SECRET="your-secret-key"

# Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."
```

## Middleware Protection

```typescript
// proxy.ts
export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Get JWT token
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });
  
  // Protect admin routes
  if (pathname.startsWith('/admin')) {
    if (!token) {
      // Redirect to login
      const url = new URL('/auth/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }
    
    // Check role permissions
    const userRole = token.role as string;
    const allowedRoles = ['admin', 'manager', 'editor'];
    
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.redirect(
        new URL('/auth/unauthorized', request.url)
      );
    }
  }
  
  return NextResponse.next();
}
```

## API Protection

### Server Components

```typescript
import { auth } from '@/lib/auth';

export default async function AdminPage() {
  const session = await auth();
  
  if (!session) {
    redirect('/auth/login');
  }
  
  if (session.user.role !== 'admin') {
    return <div>Access denied</div>;
  }
  
  return <AdminDashboard />;
}
```

### API Routes

```typescript
import { auth } from '@/lib/auth';

export async function GET() {
  const session = await auth();
  
  if (!session) {
    return Response.json(
      { error: 'Unauthorized' },
      { status: 401 }
    );
  }
  
  // Check role
  if (session.user.role !== 'admin') {
    return Response.json(
      { error: 'Forbidden' },
      { status: 403 }
    );
  }
  
  // Continue with request
}
```

## User Management

### Create User

```typescript
import { hash } from 'bcryptjs';
import { getPrisma } from '@/lib/prisma';

const prisma = await getPrisma();

const user = await prisma.user.create({
  data: {
    name: 'John Doe',
    email: 'john@example.com',
    password: await hash('password', 10),
    role: 'editor',
    emailVerified: new Date(),
  },
});
```

### Update User Role

```typescript
await prisma.user.update({
  where: { id: userId },
  data: { role: 'manager' },
});
```

### Automatic Admin Creation

First user becomes admin automatically:

```typescript
// GET /api/users/ensure-admin
// Creates admin@{domain} if no users exist
```

## Password Reset Flow

### 1. Request Reset

```typescript
// POST /api/auth/forgot-password
{
  email: "user@example.com"
}

// Generates reset token, sends email
```

### 2. Reset Password

```typescript
// POST /api/auth/reset-password
{
  token: "reset_token_here",
  newPassword: "new_password"
}
```

## Email Verification

### OTP Generation

```typescript
// Generate 6-digit OTP
const otp = Math.floor(100000 + Math.random() * 900000).toString();

// Store with expiry (10 minutes)
await prisma.user.update({
  where: { email },
  data: {
    otp,
    otpExpiry: new Date(Date.now() + 10 * 60 * 1000),
  },
});

// Send email
await sendOTPEmail(email, otp);
```

### OTP Verification

```typescript
// Verify OTP
const user = await prisma.user.findUnique({
  where: { email },
});

if (!user.otp || user.otp !== otp) {
  throw new Error('Invalid OTP');
}

if (user.otpExpiry < new Date()) {
  throw new Error('OTP expired');
}

// Mark as verified
await prisma.user.update({
  where: { email },
  data: {
    emailVerified: new Date(),
    otp: null,
    otpExpiry: null,
  },
});
```

## Session Management

### Get Current Session

```typescript
// Server Component
const session = await auth();

// Client Component
const { data: session } = useSession();
```

### Session Data Structure

```typescript
interface Session {
  user: {
    id: string;
    email: string;
    name: string;
    role: 'admin' | 'manager' | 'editor';
    emailVerified: Date | null;
    image?: string;
  };
  expires: string;
}
```

### Logout

```typescript
import { signOut } from 'next-auth/react';

await signOut({
  callbackUrl: '/auth/login',
});
```

## Role-Based UI

### Show/Hide based on Role

```typescript
import { useSession } from 'next-auth/react';

export function AdminOnlyButton() {
  const { data: session } = useSession();
  
  if (session?.user.role !== 'admin') {
    return null;
  }
  
  return <button>Admin Action</button>;
}
```

### Conditional Routing

```typescript
// components/admin-sidebar.tsx
const menuItems = [
  { label: 'Dashboard', href: '/admin', roles: ['admin', 'manager', 'editor'] },
  { label: 'Content', href: '/admin/content', roles: ['admin', 'manager', 'editor'] },
  { label: 'Users', href: '/admin/users', roles: ['admin'] },
  { label: 'Analytics', href: '/admin/analytics', roles: ['admin'] },
];

const visibleItems = menuItems.filter(item =>
  item.roles.includes(session.user.role)
);
```

## Security Best Practices

### 1. Password Hashing

```typescript
import { hash, compare } from 'bcryptjs';

// Hash password (10 rounds)
const hashedPassword = await hash(password, 10);

// Verify password
const isValid = await compare(inputPassword, hashedPassword);
```

### 2. CSRF Protection

NextAuth provides built-in CSRF protection via tokens.

### 3. Rate Limiting

```typescript
// Implement rate limiting for login attempts
const MAX_ATTEMPTS = 5;
const WINDOW = 15 * 60 * 1000; // 15 minutes
```

### 4. Secure Cookies

```typescript
// Cookies are httpOnly, secure, sameSite
cookies: {
  sessionToken: {
    name: 'authjs.session-token',
    options: {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      secure: process.env.NODE_ENV === 'production',
    },
  },
}
```

## Troubleshooting

### Login Redirects to Login

**Cause:** JWT token not being read correctly

**Fix:** Ensure `NEXTAUTH_SECRET` is set and matches

### Session Not Persisting

**Cause:** Cookie domain mismatch

**Fix:** Check `NEXTAUTH_URL` matches current domain

### Role Permissions Not Working

**Cause:** JWT callback not adding role to token

**Fix:** Verify `jwt()` callback in auth config

---

**See Also:**
- [User Guide](./QUICK_START.md)
- [API Documentation](./API_DOCS.md)
- [Troubleshooting](./TROUBLESHOOTING.md)
