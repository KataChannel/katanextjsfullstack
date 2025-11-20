#!/bin/bash

# Script to replace old MinIO URLs with new ones
# Old: http://116.118.49.243:12007 or https://116.118.49.243:12007
# New: http://116.118.48.208:9000

echo "🔄 Replacing MinIO URLs in TypeScript files..."

# Find all .ts and .tsx files and replace URLs
find app/ components/ lib/ -type f \( -name "*.ts" -o -name "*.tsx" \) -exec sed -i 's|https\?://116\.118\.49\.243:12007|http://116.118.48.208:9000|g' {} \; 2>/dev/null

# Also update JSON files
find test-export/ test-export-fixed/ backups/ -type f -name "*.json" -exec sed -i 's|https\?://116\.118\.49\.243:12007|http://116.118.48.208:9000|g' {} \; 2>/dev/null

echo "✅ URL replacement completed!"

# Show summary
echo ""
echo "📊 Files still containing old URLs:"
grep -r "116\.118\.49\.243:12007" app/ components/ lib/ 2>/dev/null | wc -l

echo ""
echo "✅ Done!"
