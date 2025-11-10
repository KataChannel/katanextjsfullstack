#!/bin/bash

# Script to setup all databases for multi-tenant domains

echo "🚀 Setting up databases for all domains..."

# List of databases
databases=(
  "tazagroupvn"
  "tazaskinclinic"
  "hderma"
  "elasome"
)

# Database connection details
DB_HOST="116.118.49.243"
DB_PORT="13003"
DB_USER="postgres"
DB_PASS="postgres"

for db in "${databases[@]}"; do
  echo ""
  echo "📦 Setting up database: $db"
  
  # Update .env with current database
  export DATABASE_URL="postgresql://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/$db"
  echo "DATABASE_URL=\"$DATABASE_URL\"" > .env
  
  # Push schema
  echo "  ⏳ Pushing Prisma schema..."
  npx prisma db push --skip-generate
  
  if [ $? -eq 0 ]; then
    echo "  ✅ Database $db setup completed"
  else
    echo "  ❌ Error setting up database $db"
  fi
done

# Restore default database
echo ""
echo "🔄 Restoring default database (tazagroupvn)..."
echo "DATABASE_URL=\"postgresql://$DB_USER:$DB_PASS@$DB_HOST:$DB_PORT/tazagroupvn\"" > .env

# Generate Prisma Client
echo ""
echo "⚙️  Generating Prisma Client..."
npx prisma generate

echo ""
echo "✨ All databases setup completed!"
echo ""
echo "📋 Databases created:"
for db in "${databases[@]}"; do
  echo "  - $db"
done
echo ""
echo "🎯 Current DATABASE_URL: tazagroupvn (default)"
