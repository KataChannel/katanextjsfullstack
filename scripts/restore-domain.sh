#!/bin/bash

# ============================================
# Multi-Domain Restore Script
# Restore database from JSON backup
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

# Config
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BACKUP_DIR="./backups"

# Database configurations
declare -A DOMAINS=(
    ["tazagroup.vn"]="postgresql://postgres:postgres@116.118.49.243:13003/tazacore"
    ["innerbright.vn"]="postgresql://postgres:2kOIU5HX98Nb@116.118.48.208:5432/innerv2core"
    ["kataseo.com"]="postgresql://postgres:postgres@116.118.49.243:13003/kataseo"
)

echo "============================================"
echo "📦 Multi-Domain Database Restore"
echo "============================================"
echo ""

# Check arguments
if [ $# -ne 2 ]; then
    echo -e "${RED}❌ Usage: $0 <domain> <timestamp>${NC}"
    echo ""
    echo -e "${CYAN}Available domains:${NC}"
    for domain in "${!DOMAINS[@]}"; do
        echo -e "  - ${BLUE}${domain}${NC}"
    done
    echo ""
    echo -e "${CYAN}Available backups:${NC}"
    for domain in "${!DOMAINS[@]}"; do
        if [ -d "${BACKUP_DIR}/${domain}" ]; then
            echo -e "${YELLOW}  ${domain}:${NC}"
            ls -1 "${BACKUP_DIR}/${domain}/" 2>/dev/null | grep ".tar.gz" | sed 's/.tar.gz$//' | sed "s/${domain}_/    /" || echo "    (none)"
        fi
    done
    echo ""
    echo -e "${YELLOW}Example:${NC}"
    echo -e "  ${BLUE}$0 tazagroup.vn 20250118_120000${NC}"
    echo ""
    exit 1
fi

DOMAIN=$1
TIMESTAMP=$2

# Validate domain
if [ -z "${DOMAINS[$DOMAIN]}" ]; then
    echo -e "${RED}❌ Unknown domain: $DOMAIN${NC}"
    exit 1
fi

DB_URL="${DOMAINS[$DOMAIN]}"
BACKUP_FILE="${BACKUP_DIR}/${DOMAIN}/${DOMAIN}_${TIMESTAMP}.tar.gz"

# Check if backup exists
if [ ! -f "$BACKUP_FILE" ]; then
    echo -e "${RED}❌ Backup file not found: $BACKUP_FILE${NC}"
    exit 1
fi

echo -e "${CYAN}🔄 Restoring: ${DOMAIN} (${TIMESTAMP})${NC}"
echo -e "${YELLOW}⚠️  WARNING: This will overwrite existing data!${NC}"
echo ""
read -p "Continue? (yes/no): " confirm

if [ "$confirm" != "yes" ]; then
    echo -e "${YELLOW}❌ Restore cancelled${NC}"
    exit 0
fi

echo ""
echo -e "${BLUE}📂 Extracting backup...${NC}"

# Create temp directory
TEMP_DIR=$(mktemp -d)
tar -xzf "$BACKUP_FILE" -C "$TEMP_DIR"

RESTORE_DIR="${TEMP_DIR}/${TIMESTAMP}"

if [ ! -d "$RESTORE_DIR" ]; then
    echo -e "${RED}❌ Invalid backup structure${NC}"
    rm -rf "$TEMP_DIR"
    exit 1
fi

# Export DATABASE_URL
export DATABASE_URL="$DB_URL"

echo -e "${BLUE}📊 Loading metadata...${NC}"
if [ -f "${RESTORE_DIR}/metadata.json" ]; then
    cat "${RESTORE_DIR}/metadata.json"
    echo ""
fi

echo -e "${BLUE}🔄 Restoring tables...${NC}"

# Use import-data.ts script with --clear flag
DATABASE_URL="$DB_URL" bun run "${SCRIPT_DIR}/import-data.ts" "$RESTORE_DIR" --clear

success_count=$(ls -1 "$RESTORE_DIR"/*.json 2>/dev/null | grep -v metadata.json | wc -l)
total_count=$success_count

# Cleanup
rm -rf "$TEMP_DIR"

echo ""
echo "============================================"
echo "✅ Restore Completed!"
echo "============================================"
echo ""
echo "Domain: ${DOMAIN}"
echo "Tables restored: ${success_count}/${total_count}"
echo "Backup timestamp: ${TIMESTAMP}"
