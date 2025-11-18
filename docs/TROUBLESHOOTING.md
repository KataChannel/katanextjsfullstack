# 🔧 Troubleshooting Guide

Giải pháp cho các vấn đề thường gặp.

## Authentication Issues

### Cannot Login to Admin

**Symptoms:**
- Sau khi login, redirect về `/auth/login`
- Token không được set
- Session không tồn tại

**Solutions:**

```bash
# 1. Check NEXTAUTH_SECRET
cat .env.local | grep NEXTAUTH_SECRET
# Must be set and same across restarts

# 2. Check NEXTAUTH_URL
cat .env.local | grep NEXTAUTH_URL
# Must match current URL: http://localhost:3000

# 3. Clear browser cookies
# Chrome: DevTools → Application → Cookies → Clear All

# 4. Check middleware.ts
# Make sure it's not blocking admin routes incorrectly

# 5. Verify JWT strategy in lib/auth.ts
# Should be: session: { strategy: 'jwt' }
```

### JWT Token Error

**Error:** `JsonWebTokenError: jwt malformed`

**Fix:**

```bash
# Regenerate NEXTAUTH_SECRET
openssl rand -base64 32

# Update .env.local
NEXTAUTH_SECRET="new-secret-here"

# Restart server
```

### Session Not Persisting

**Fix:**

```typescript
// Check session callback in lib/auth.ts
export const authOptions: NextAuthConfig = {
  session: { strategy: 'jwt' },
  callbacks: {
    jwt: async ({ token, user }) => {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    session: async ({ session, token }) => {
      if (session.user) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
  },
};
```

## Database Issues

### Cannot Connect to Database

**Error:** `Can't reach database server at localhost:5432`

**Solutions:**

```bash
# 1. Check PostgreSQL is running
docker ps | grep postgres
# Or: systemctl status postgresql

# 2. Start PostgreSQL
docker-compose -f docker-compose.infrastructure.yml up -d
# Or: systemctl start postgresql

# 3. Check DATABASE_URL
cat .env.local | grep DATABASE_URL

# 4. Test connection
psql "postgresql://postgres:password@localhost:5432/tazav2core"

# 5. Check firewall
sudo ufw status
sudo ufw allow 5432/tcp
```

### Prisma Client Not Generated

**Error:** `@prisma/client did not initialize yet`

**Fix:**

```bash
# Regenerate Prisma Client
bun prisma generate

# If still error, clear and reinstall
rm -rf node_modules/.prisma
bun install
bun prisma generate
```

### Migration Failed

**Error:** `Migration failed to apply`

**Solutions:**

```bash
# 1. Check migration status
bun prisma migrate status

# 2. Reset database (DEVELOPMENT ONLY)
bun prisma migrate reset

# 3. Or manually fix
bun prisma migrate resolve --applied "migration-name"

# 4. For production, use migrate deploy
bun prisma migrate deploy
```

### Wrong Database Selected

**Symptom:** Thấy data của domain khác

**Fix:**

```bash
# Check DATABASE_URL points to correct database
echo $DATABASE_URL

# Each domain should have separate database:
# tazagroup.vn    → tazav2core
# innerbright.vn  → innerv2core

# Update .env file if wrong
```

## Development Server Issues

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::3000`

**Solutions:**

```bash
# Find process using port
lsof -i :3000

# Kill process
kill -9 <PID>

# Or use different port
PORT=3010 bun dev
```

### Turbopack Build Error

**Error:** `Turbopack build failed`

**Fix:**

```bash
# 1. Clear cache
rm -rf .next

# 2. Clear node_modules
rm -rf node_modules
bun install

# 3. Update Next.js
bun add next@latest

# 4. Try without Turbopack
bun dev -- --no-turbopack
```

### Module Not Found

**Error:** `Module not found: Can't resolve '@/...'`

**Fix:**

```bash
# 1. Check tsconfig.json paths
{
  "compilerOptions": {
    "paths": {
      "@/*": ["./*"]
    }
  }
}

# 2. Restart TypeScript server in VS Code
# Cmd+Shift+P → TypeScript: Restart TS Server

# 3. Reinstall dependencies
rm -rf node_modules
bun install
```

## Docker Issues

### Container Not Starting

**Error:** `docker: Error response from daemon`

**Solutions:**

```bash
# 1. Check logs
docker logs container-name

# 2. Check if port is available
lsof -i :3005

# 3. Check env file exists
ls -la .env.innerbright

# 4. Try running without -d (see output)
docker run -p 3005:3005 --env-file .env.innerbright innerbright-web

# 5. Check image exists
docker images | grep innerbright-web
```

### Build Failed

**Error:** `ERROR [builder X/X] RUN bun run build`

**Solutions:**

```bash
# 1. Check Dockerfile for syntax errors

# 2. Build locally first to see errors
bun run build

# 3. Check memory allocation
docker system info | grep Memory

# 4. Increase memory in Docker settings
# Docker Desktop → Settings → Resources → Memory: 4GB+

# 5. Try multi-stage build
# (Already implemented in Dockerfile)
```

### Container Unhealthy

**Symptom:** `docker ps` shows "unhealthy"

**Fix:**

```bash
# 1. Check health endpoint
docker exec container-name curl http://localhost:3005/api/health

# 2. Check logs
docker logs container-name

# 3. Check database connection in container
docker exec container-name bun prisma db pull

# 4. Restart container
docker restart container-name
```

### Cannot Access Container from Host

**Symptom:** `curl: (7) Failed to connect to localhost port 3005`

**Fix:**

```bash
# 1. Check port mapping
docker port container-name

# 2. Check container is running
docker ps | grep container-name

# 3. Check firewall
sudo ufw allow 3005/tcp

# 4. Try 0.0.0.0 instead of localhost
curl http://0.0.0.0:3005/api/health
```

## Page Builder Issues

### Blocks Not Saving

**Symptom:** Blocks disappear after save

**Fix:**

```typescript
// Check saveBlocks function in lib/page-builder-store.ts
const saveBlocks = async () => {
  const blocks = get().blocks;
  
  // Make sure blocks are serializable
  const serializedBlocks = JSON.parse(JSON.stringify(blocks));
  
  await fetch(`/api/pages/${pageId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ blocks: serializedBlocks }),
  });
};
```

### Drag & Drop Not Working

**Fix:**

```bash
# 1. Check @dnd-kit is installed
bun list | grep dnd-kit

# 2. Reinstall if needed
bun add @dnd-kit/core @dnd-kit/sortable

# 3. Check z-index conflicts in CSS
```

### Template Not Loading

**Fix:**

```typescript
// Check template exists in lib/block-templates.ts
export const BLOCK_TEMPLATES = {
  'template-name': {
    // Must have all required fields
    type: 'hero',
    content: { ... },
  },
};
```

## Menu Issues

### Menu Not Showing

**Check:**

```typescript
// 1. Menu is visible
isVisible: true

// 2. Correct position
position: 'header' // Not 'Header'

// 3. Order is set
order: 0, 1, 2...

// 4. Query includes correct position
const menus = await prisma.menu.findMany({
  where: { position: 'header', isVisible: true },
});
```

### Submenu Not Showing

**Fix:**

```typescript
// Include children in query
const menus = await prisma.menu.findMany({
  where: { parentId: null },
  include: {
    children: {
      orderBy: { order: 'asc' },
    },
  },
});
```

## Performance Issues

### Slow Page Load

**Solutions:**

```bash
# 1. Enable caching
import { unstable_cache } from 'next/cache';

export const getData = unstable_cache(
  async () => { /* ... */ },
  ['cache-key'],
  { revalidate: 3600 }
);

# 2. Use Next.js Image component
import Image from 'next/image';

# 3. Check database queries
# Add indexes to frequently queried columns

# 4. Enable Turbopack
bun dev --turbo
```

### High Memory Usage

**Fix:**

```bash
# 1. Increase Node memory limit
NODE_OPTIONS="--max-old-space-size=4096" bun dev

# 2. Clear Next.js cache
rm -rf .next

# 3. Check for memory leaks
# Use Chrome DevTools Memory Profiler
```

## Production Issues

### 502 Bad Gateway (Nginx)

**Check:**

```bash
# 1. Container is running
docker ps | grep web

# 2. App is listening on correct port
docker logs container-name | grep "ready"

# 3. Nginx config correct
cat /etc/nginx/sites-enabled/domain.conf

# 4. Nginx error log
tail -f /var/log/nginx/error.log

# 5. Test backend directly
curl http://localhost:3005
```

### SSL Certificate Error

**Fix:**

```bash
# 1. Check certificate exists
ls -la /etc/letsencrypt/live/domain.com/

# 2. Renew certificate
certbot renew

# 3. Check certificate expiry
echo | openssl s_client -servername domain.com -connect domain.com:443 2>/dev/null | openssl x509 -noout -dates

# 4. Reload Nginx
systemctl reload nginx
```

### Environment Variables Not Working

**Symptom:** `process.env.VAR_NAME` is undefined

**Fix:**

```bash
# 1. Prefix with NEXT_PUBLIC_ for client-side
NEXT_PUBLIC_API_URL="..."

# 2. Check env file is loaded
echo $DATABASE_URL

# 3. Restart server after changing env
docker restart container-name

# 4. For Docker, pass with --env-file
docker run --env-file .env.production ...
```

## Quick Fixes

### Reset Everything

```bash
# Development
rm -rf node_modules .next
bun install
bun prisma generate
bun prisma migrate reset
bun dev
```

### Reset Database

```bash
# DEVELOPMENT ONLY
bun prisma migrate reset

# Or manually
psql -U postgres
DROP DATABASE dbname;
CREATE DATABASE dbname;
\q

bun prisma migrate deploy
bun prisma db seed
```

### Clear All Caches

```bash
# Next.js cache
rm -rf .next

# Bun cache
rm -rf node_modules/.cache

# Prisma cache
rm -rf node_modules/.prisma

# Browser cache
# Chrome: Ctrl+Shift+Del → Clear browsing data
```

### Emergency Debug Commands

```bash
# Check all services
docker ps -a
systemctl status postgresql
systemctl status nginx

# Check ports
netstat -tulpn | grep LISTEN

# Check disk space
df -h

# Check memory
free -h

# Check logs
docker logs container-name --tail 100
journalctl -xe
tail -f /var/log/nginx/error.log
```

## Getting Help

1. **Check Logs**: Always check logs first
   ```bash
   docker logs container-name
   bun dev # See console output
   ```

2. **Search Docs**: Check `/docs` folder

3. **Database Tools**: Use Prisma Studio
   ```bash
   bun prisma studio
   ```

4. **Network Tools**: Test endpoints
   ```bash
   curl -v http://localhost:3000/api/health
   ```

5. **Create Issue**: If still stuck, create GitHub issue with:
   - Error message
   - Steps to reproduce
   - Environment details
   - Relevant logs

---

**See Also:**
- [Quick Start](./QUICK_START.md)
- [Deployment Guide](./DEPLOYMENT.md)
- [Database Schema](./DATABASE_SCHEMA.md)
