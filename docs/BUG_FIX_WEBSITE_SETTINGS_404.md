# Bug Fix: API Website Settings 404 Error

**Date:** 2025-01-17  
**Issue:** `GET /api/website-settings` returns 404 Not Found  
**Status:** ✅ FIXED

## Problem

Request to `/api/website-settings` returns 404:
```
Request URL: http://localhost:3005/api/website-settings
Request Method: GET
Status Code: 404 Not Found
```

Components affected:
- `components/header.tsx` - Fetches logo settings
- `components/footer.tsx` - Fetches footer settings
- `app/admin/website-settings/page.tsx` - Admin settings page

## Root Causes

### 1. Missing Domain Parameter
API route expected `domain` query parameter but client components called without it:
```typescript
// ❌ Client component - no domain param
fetch('/api/website-settings')

// ✅ API route expected
fetch('/api/website-settings?domain=innerbright.vn')
```

### 2. No Database Records
Database had 0 `WebsiteSettings` records, so even after fixing domain detection, API returned 404.

## Solutions

### Solution 1: Auto-detect Domain from Request Headers

**File:** `/app/api/website-settings/route.ts`

Added helper function to extract domain from hostname:

```typescript
// Helper: Extract domain from hostname
function extractDomain(hostname: string): string {
  // Remove port
  const withoutPort = hostname.split(':')[0];
  
  // Remove www prefix
  const withoutWww = withoutPort.replace(/^www\./, '');
  
  // For localhost, return default domain
  if (withoutWww === 'localhost' || withoutWww === '127.0.0.1') {
    return 'innerbright.vn'; // Default domain for local development
  }
  
  return withoutWww;
}
```

Updated GET handler to auto-detect domain:

```typescript
export async function GET(request: NextRequest) {
  try {
    // Get domain from query param or detect from request headers
    const searchParams = request.nextUrl.searchParams;
    let domain = searchParams.get('domain');
    
    if (!domain) {
      // Auto-detect domain from request headers (multi-domain support)
      const hostname = request.headers.get('x-hostname') || 
                      request.headers.get('host') || 
                      'localhost:3000';
      
      domain = extractDomain(hostname);
    }

    const prisma = await getPrisma(domain);
    // ... rest of logic
  }
}
```

**Benefits:**
- ✅ Client components don't need to know domain
- ✅ Works in multi-domain setup
- ✅ Backward compatible (still accepts `?domain=` param)
- ✅ Auto-detects from request headers

### Solution 2: Created Default Database Record

**File:** `/scripts/check-website-settings.ts` (NEW)

Created script to check and initialize default settings:

```typescript
const created = await prisma.websiteSettings.create({
  data: {
    domain: 'innerbright.vn',
    logo: '/logo.png',
    logoAlt: 'InnerBright',
    footerText: 'Copyright © 2025 InnerBright. All rights reserved.',
  }
});
```

Run with:
```bash
bun run scripts/check-website-settings.ts
```

## Testing

### Test 1: API Endpoint
```bash
curl http://localhost:3005/api/website-settings
```

**Expected Result:**
```json
{
  "id": "...",
  "domain": "innerbright.vn",
  "logo": "/logo.png",
  "logoAlt": "InnerBright",
  "footerText": "Copyright © 2025 InnerBright. All rights reserved.",
  ...
}
```

✅ **Status:** PASS

### Test 2: Client Component (Header)
1. Open http://localhost:3005/
2. Check browser console for errors
3. Verify logo loads correctly

✅ **Status:** Should work now

### Test 3: Multiple Domains
```bash
# Test with explicit domain param
curl "http://localhost:3005/api/website-settings?domain=tazagroup.vn"

# Test auto-detection
curl -H "Host: innerbright.vn" http://localhost:3005/api/website-settings
```

## Domain Detection Logic

```
Request → Headers → Extract Domain → Database Query

localhost:3005     → innerbright.vn (default)
innerbright.vn     → innerbright.vn
www.tazagroup.vn   → tazagroup.vn (strip www)
tazagroup.vn:3000  → tazagroup.vn (strip port)
```

## Files Changed

### 1. `/app/api/website-settings/route.ts`
**Changes:**
- Added `extractDomain()` helper function
- Updated GET handler to auto-detect domain from headers
- Falls back to query param if provided
- Defaults to 'innerbright.vn' for localhost

**Before:**
```typescript
const domain = searchParams.get('domain') || 'tazagroup.vn';
```

**After:**
```typescript
let domain = searchParams.get('domain');
if (!domain) {
  const hostname = request.headers.get('host') || 'localhost:3000';
  domain = extractDomain(hostname);
}
```

### 2. `/scripts/check-website-settings.ts` (NEW)
**Purpose:**
- Check if WebsiteSettings exist in database
- Create default settings if missing
- Useful for initial setup and debugging

## Migration Guide

### For New Domains

When adding a new domain, create WebsiteSettings record:

```typescript
await prisma.websiteSettings.create({
  data: {
    domain: 'newdomain.com',
    logo: '/logo-newdomain.png',
    logoAlt: 'New Domain',
    footerText: 'Copyright © 2025 New Domain.',
  }
});
```

Or use the admin UI at `/admin/website-settings`.

### For Existing Client Code

No changes needed! Client components can continue calling:
```typescript
fetch('/api/website-settings')
```

The API will auto-detect domain from request headers.

## Related APIs

All these patterns should use domain auto-detection:

- ✅ `/api/website-settings` - Fixed
- `/api/seo-settings` - Already has domain logic
- `/api/menus` - Check if needs similar fix
- `/api/pages` - Check if needs similar fix
- `/api/posts` - Check if needs similar fix

## Production Checklist

- [x] API route auto-detects domain from headers
- [x] Default domain set for localhost (innerbright.vn)
- [x] Database has initial WebsiteSettings record
- [x] Helper script created for checking/creating settings
- [ ] Test with real domain (not localhost)
- [ ] Verify all domains have WebsiteSettings records
- [ ] Test header/footer components load correctly
- [ ] Test admin settings page works

## Notes

- Domain detection works without middleware by reading `Host` header
- Default domain for local development: `innerbright.vn`
- Each domain needs its own `WebsiteSettings` record in database
- The API maintains backward compatibility with `?domain=` query param
- Consider creating middleware to set `x-domain` header for consistency
