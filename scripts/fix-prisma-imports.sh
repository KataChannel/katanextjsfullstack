#!/bin/bash

# Script to replace default prisma with getPrisma in all API routes

echo "🔧 Updating API routes to use getPrisma() instead of default prisma..."

# Array of files to update
files=(
  "app/api/pages-v2/[id]/route.ts"
  "app/api/block-templates-v2/route.ts"
  "app/api/block-templates-v2/[id]/route.ts"
  "app/api/admin/block-templates/route.ts"
  "app/api/block-templates/route.ts"
)

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    echo "Processing: $file"
    
    # Replace import statement
    sed -i "s/import { prisma } from '@\/lib\/prisma';/import { getPrisma } from '@\/lib\/prisma';/g" "$file"
    
    # Add getPrisma() call at start of each function that needs it
    # This is a simple replacement - may need manual review
    
    echo "✅ Updated: $file"
  else
    echo "⚠️  Not found: $file"
  fi
done

echo ""
echo "✨ Done! Please review the changes manually."
echo "⚠️  Note: You may need to add 'const prisma = await getPrisma();' in functions that use prisma."
