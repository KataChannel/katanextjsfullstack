# 🌍 Environment Variables

Complete reference for all environment variables used in the project.

## Core Variables

### Database

```bash
# PostgreSQL connection string
DATABASE_URL="postgresql://user:password@host:port/database"

# Example for each domain
DATABASE_URL="postgresql://postgres:password@localhost:5432/tazav2core"
DATABASE_URL="postgresql://postgres:password@localhost:5432/innerv2core"
DATABASE_URL="postgresql://postgres:password@localhost:5432/hderma_db"
```

**Format:**
- `user`: PostgreSQL username (usually `postgres`)
- `password`: Database password
- `host`: Database host (`localhost` or IP)
- `port`: Database port (default `5432`)
- `database`: Database name (unique per domain)

### Authentication

```bash
# NextAuth secret key (REQUIRED)
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# NextAuth URL (REQUIRED)
NEXTAUTH_URL="http://localhost:3000"
# Production: NEXTAUTH_URL="https://domain.com"

# JWT expiration (optional)
JWT_EXPIRATION="30d"
```

**Generate Secret:**
```bash
openssl rand -base64 32
```

### Domain Configuration

```bash
# Current domain (REQUIRED)
NEXT_PUBLIC_DOMAIN="tazagroup.vn"

# Domain alternatives
NEXT_PUBLIC_DOMAIN="innerbright.vn"
NEXT_PUBLIC_DOMAIN="hderma.vn"
```

### Server Configuration

```bash
# Development port (default: 3000)
PORT=3000

# Node environment
NODE_ENV="development"  # or "production"

# Server hostname
HOSTNAME="0.0.0.0"
```

## Optional Variables

### MinIO (S3-compatible Storage)

```bash
# MinIO endpoint
MINIO_ENDPOINT="minio"           # or IP address
MINIO_PORT="9000"

# MinIO credentials
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"

# Bucket name (usually domain name)
MINIO_BUCKET="innerbright"
MINIO_USE_SSL="false"
```

### Redis (Caching)

```bash
REDIS_HOST="localhost"
REDIS_PORT="6379"
REDIS_PASSWORD=""
```

### Email (Optional)

```bash
# SMTP configuration
EMAIL_SERVER="smtp://user:password@smtp.example.com:587"
EMAIL_FROM="noreply@domain.com"

# Or individual settings
SMTP_HOST="smtp.gmail.com"
SMTP_PORT="587"
SMTP_USER="your-email@gmail.com"
SMTP_PASSWORD="app-password"
```

### Analytics (Optional)

```bash
# Google Analytics
NEXT_PUBLIC_GA_ID="G-XXXXXXXXXX"

# Google Tag Manager
NEXT_PUBLIC_GTM_ID="GTM-XXXXXXX"

# Facebook Pixel
NEXT_PUBLIC_FB_PIXEL_ID="123456789"
```

### SEO (Optional)

```bash
# Robots indexing
NEXT_PUBLIC_ROBOTS_ALLOW="true"

# Sitemap base URL
NEXT_PUBLIC_SITEMAP_BASE_URL="https://domain.com"
```

## Environment Files

### Development

Each domain has its own env file:

```
.env.local          → tazagroup.vn (port 3000)
.env.tazaskinclinic → tazaskinclinic.com (port 3001)
.env.timona         → timona.edu.vn (port 3002)
.env.hderma         → hderma.vn (port 3003)
.env.elasome        → elasome.com (port 3004)
.env.innerbright    → innerbright.vn (port 3005)
```

### Production

Add `.production` suffix:

```
.env.local.production
.env.innerbright.production
```

### Template

`.env.example` - Template for new domains:

```bash
# Database
DATABASE_URL="postgresql://postgres:password@localhost:5432/database_name"

# Authentication
NEXTAUTH_SECRET=""
NEXTAUTH_URL="http://localhost:3000"

# Domain
NEXT_PUBLIC_DOMAIN="domain.com"

# Server
PORT=3000
NODE_ENV="development"

# MinIO (Optional)
MINIO_ENDPOINT="minio"
MINIO_PORT="9000"
MINIO_ACCESS_KEY="minioadmin"
MINIO_SECRET_KEY="minioadmin"
MINIO_BUCKET="domain"
```

## Domain-specific Examples

### tazagroup.vn (.env.local)

```bash
DATABASE_URL="postgresql://postgres:2kOIU5HX98Nb@localhost:5432/tazav2core"
NEXTAUTH_SECRET="abc123xyz456..."
NEXTAUTH_URL="http://localhost:3000"
NEXT_PUBLIC_DOMAIN="tazagroup.vn"
PORT=3000
NODE_ENV="development"
```

### innerbright.vn (.env.innerbright)

```bash
DATABASE_URL="postgresql://postgres:2kOIU5HX98Nb@116.118.48.208:5432/innerv2core"
NEXTAUTH_SECRET="def789uvw012..."
NEXTAUTH_URL="http://localhost:3005"
NEXT_PUBLIC_DOMAIN="innerbright.vn"
PORT=3005
NODE_ENV="development"

# Production
NEXTAUTH_URL="https://innerbright.vn"
NODE_ENV="production"
```

### hderma.vn (.env.hderma)

```bash
DATABASE_URL="postgresql://postgres:password@localhost:5432/hderma_db"
NEXTAUTH_SECRET="ghi345rst678..."
NEXTAUTH_URL="http://localhost:3003"
NEXT_PUBLIC_DOMAIN="hderma.vn"
PORT=3003
NODE_ENV="development"
```

## Usage

### Load Specific Environment

```bash
# Using menu script
./menu.sh

# Or directly with Bun
bun --env-file=.env.local dev
bun --env-file=.env.innerbright dev

# Or with npm
npm run dev -- --env-file=.env.local
```

### Access in Code

**Server-side only:**
```typescript
const dbUrl = process.env.DATABASE_URL;
const secret = process.env.NEXTAUTH_SECRET;
```

**Client-side (must use NEXT_PUBLIC_ prefix):**
```typescript
const domain = process.env.NEXT_PUBLIC_DOMAIN;
const gaId = process.env.NEXT_PUBLIC_GA_ID;
```

### Docker

Pass env file to Docker:

```bash
# Build time
docker build --build-arg DATABASE_URL=$DATABASE_URL .

# Runtime
docker run --env-file .env.innerbright innerbright-web

# Or individual vars
docker run -e DATABASE_URL="..." -e PORT=3005 innerbright-web
```

## Security Best Practices

### 1. Never Commit Secrets

```bash
# .gitignore
.env*
!.env.example
```

### 2. Use Strong Secrets

```bash
# Generate strong secrets
openssl rand -base64 32
openssl rand -hex 64
```

### 3. Different Secrets per Environment

```bash
# Development
NEXTAUTH_SECRET="dev-secret-123"

# Production
NEXTAUTH_SECRET="prod-secret-456"  # Different!
```

### 4. Rotate Secrets Regularly

```bash
# Update NEXTAUTH_SECRET every 3-6 months
# Restart all servers after rotation
```

### 5. Validate Required Variables

```typescript
// lib/env.ts
const requiredEnvs = [
  'DATABASE_URL',
  'NEXTAUTH_SECRET',
  'NEXTAUTH_URL',
  'NEXT_PUBLIC_DOMAIN',
] as const;

for (const env of requiredEnvs) {
  if (!process.env[env]) {
    throw new Error(`Missing required env variable: ${env}`);
  }
}
```

## Troubleshooting

### Variable Not Found

```bash
# Check env file exists
ls -la .env.local

# Check variable is set
cat .env.local | grep VARIABLE_NAME

# Check loading correct env file
echo "Running with: $ENV_FILE"
```

### Variable Not Working

**Client-side:**
- Must use `NEXT_PUBLIC_` prefix
- Restart dev server after adding

**Server-side:**
- Don't use `NEXT_PUBLIC_` prefix
- Restart required after changes

### Production vs Development

```typescript
// Check environment
const isProd = process.env.NODE_ENV === 'production';

// Use different values
const apiUrl = isProd
  ? 'https://api.domain.com'
  : 'http://localhost:3000';
```

### Docker Environment Issues

```bash
# Check env vars in container
docker exec container-name env | grep DATABASE_URL

# If empty, check --env-file path
docker run --env-file /absolute/path/.env.innerbright ...

# Or use docker-compose
docker-compose --env-file .env.innerbright up
```

## Reference

### Complete Variable List

| Variable | Required | Type | Description |
|----------|----------|------|-------------|
| `DATABASE_URL` | ✅ | Server | PostgreSQL connection |
| `NEXTAUTH_SECRET` | ✅ | Server | Auth encryption key |
| `NEXTAUTH_URL` | ✅ | Server | Auth callback URL |
| `NEXT_PUBLIC_DOMAIN` | ✅ | Both | Current domain |
| `PORT` | ❌ | Server | Server port (default 3000) |
| `NODE_ENV` | ❌ | Both | Environment mode |
| `MINIO_ENDPOINT` | ❌ | Server | MinIO server |
| `MINIO_ACCESS_KEY` | ❌ | Server | MinIO username |
| `MINIO_SECRET_KEY` | ❌ | Server | MinIO password |
| `MINIO_BUCKET` | ❌ | Server | Storage bucket |
| `NEXT_PUBLIC_GA_ID` | ❌ | Client | Google Analytics |
| `EMAIL_SERVER` | ❌ | Server | Email SMTP |

### Type Reference

- **Server**: Only available server-side
- **Client**: Available client-side (requires `NEXT_PUBLIC_`)
- **Both**: Available everywhere

---

**See Also:**
- [Quick Start](./QUICK_START.md)
- [Add New Domain](./ADD_DOMAIN.md)
- [Deployment Guide](./DEPLOYMENT.md)
