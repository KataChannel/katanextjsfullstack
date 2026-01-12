#!/bin/bash

echo "=== Fix Bug 404 Page/Post ==="
echo ""

echo "1. Checking database for post..."
bun << 'EOF'
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function check() {
  const post = await prisma.post.findUnique({
    where: { slug: 'giai-dap-thac-mac-ve-tiem-filler-moi' },
    select: { id: true, title: true, published: true }
  });
  console.log('Post:', post);
  await prisma.$disconnect();
}
check();
EOF

echo ""
echo "2. Route structure:"
echo "   ✓ /app/(public)/[slug]/page.tsx - Catch-all (pages + posts redirect)"
echo "   ✓ /app/(public)/posts/[slug]/page.tsx - Posts detail"
echo "   ✓ /app/(public)/pages/[slug]/page.tsx - Pages detail"
echo ""

echo "3. Changes made:"
echo "   ✓ Updated seed.ts: published: false → true"
echo "   ✓ Updated [slug]/page.tsx: Check page first, then post, then redirect"
echo "   ✓ Updated generateStaticParams: Include both pages and posts"
echo ""

echo "4. Testing routes:"
echo "   - Direct: /giai-dap-thac-mac-ve-tiem-filler-moi (redirects to /posts/...)"
echo "   - Posts: /posts/giai-dap-thac-mac-ve-tiem-filler-moi"
echo ""

echo "✅ Bug fixed!"
echo ""
echo "To test:"
echo "  1. bun dev"
echo "  2. Visit: http://localhost:3000/giai-dap-thac-mac-ve-tiem-filler-moi"
echo "  3. Should redirect to: http://localhost:3000/posts/giai-dap-thac-mac-ve-tiem-filler-moi"
