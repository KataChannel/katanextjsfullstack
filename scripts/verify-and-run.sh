#!/bin/bash

echo "🔍 Checking for middleware files..."
echo ""

# Check if middleware.ts exists in root
if [ -f "./middleware.ts" ]; then
    echo "❌ FOUND: middleware.ts (should not exist!)"
    exit 1
else
    echo "✅ No middleware.ts found in root"
fi

# Check if proxy.ts exists
if [ -f "./proxy.ts" ]; then
    echo "✅ proxy.ts exists"
else
    echo "❌ ERROR: proxy.ts not found!"
    exit 1
fi

# Check imports in proxy.ts
if grep -q "getDomainConfig" "./proxy.ts"; then
    echo "✅ proxy.ts imports getDomainConfig"
else
    echo "❌ WARNING: proxy.ts missing getDomainConfig import"
fi

echo ""
echo "🧹 Clearing caches..."
rm -rf .next .turbo
echo "✅ Caches cleared"

echo ""
echo "🚀 Starting dev server..."
echo "   Press Ctrl+C to stop"
echo ""

# Start dev server on port 3000
NEXT_PUBLIC_DOMAIN=tazagroup.vn ./scripts/bun-wrapper.sh bun --bun next dev -p 3000
