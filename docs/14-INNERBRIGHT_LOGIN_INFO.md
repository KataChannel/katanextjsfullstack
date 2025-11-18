# 🔐 InnerBright Login Information

## Production Access

### Admin Panel
- **URL:** https://innerbright.vn/admin
- **Login Page:** https://innerbright.vn/auth/login

### Admin Credentials
```
Email: admin@innerbright.vn
Password: Admin@2025!
```

⚠️ **SECURITY REMINDER:**
- Change password immediately after first login
- Use strong password with mix of uppercase, lowercase, numbers, and symbols
- Enable 2FA if available

---

## Alternative Login Methods

### Google OAuth
- Configured with Google OAuth
- Redirect URI: `https://innerbright.vn/api/auth/callback/google`
- Status: ✅ Configured
- Client ID and Secret: See environment variables on server

### Email/Password (Credentials)
- Status: ✅ Working
- Email verification: Required for new users
- Password requirements: Min 8 characters

---

## Existing Users

Users from previous deployment (tazagroup.vn):
```
1. admin@example.com (verified: 2025-11-12)
2. admin@tazagroup.vn (verified: 2025-11-18)
3. editor@tazagroup.vn (verified: 2025-11-18)
```

**Note:** These users can also login to innerbright.vn if needed (same database)

---

## User Management

### Create New User
```bash
# Using script
node scripts/create-innerbright-admin.js

# Or via admin panel
https://innerbright.vn/admin/users/create
```

### Reset Password
```sql
-- Connect to database
docker exec innerbright-postgres psql -U postgres -d innerv2core

-- Update password (bcrypt hashed)
UPDATE users 
SET password = '$2a$12$...' 
WHERE email = 'user@example.com';
```

### Change User Role
```sql
UPDATE users 
SET role = 'admin' 
WHERE email = 'user@example.com';
```

Available roles:
- `user` - Basic user access
- `editor` - Can create/edit content
- `manager` - Can manage users and settings
- `admin` - Full system access

---

## Troubleshooting

### Cannot Login - "Email chưa được xác thực"
**Solution:** Update emailVerified field
```sql
UPDATE users 
SET "emailVerified" = NOW() 
WHERE email = 'your@email.com';
```

### Google OAuth Not Working
**Check:**
1. GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in .env
2. Redirect URI in Google Console: `https://innerbright.vn/api/auth/callback/google`
3. Authorized domains include `innerbright.vn`

### Password Reset Not Working
**Check:**
1. SMTP settings in .env
2. Email delivery logs: `docker logs innerbright-web | grep smtp`

---

## Security Notes

### Environment Variables
Required for authentication:
```bash
NEXTAUTH_URL=https://innerbright.vn
NEXTAUTH_SECRET=<stored in server .env>
GOOGLE_CLIENT_ID=<stored in server .env>
GOOGLE_CLIENT_SECRET=<stored in server .env>
```

**Note:** Actual values are stored securely in server environment variables and not committed to git.

### Database Connection
```bash
DATABASE_URL=postgresql://postgres:2kOIU5HX98Nb@116.118.48.208:5432/innerv2core
```

### Session Configuration
- Strategy: JWT
- Max Age: 30 days
- Cookie: `__Secure-next-auth.session-token` (production)

---

**Last Updated:** 2025-11-18  
**Status:** ✅ All authentication systems operational
