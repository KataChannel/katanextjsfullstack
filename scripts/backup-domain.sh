#!/bin/bash

# ============================================
# Multi-Domain Backup Script
# Backup database to JSON for each domain
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
TIMESTAMP=$(date +%Y%m%d_%H%M%S)

# Domain configurations
declare -A DOMAINS=(
    ["tazagroup.vn"]="postgresql://postgres:postgres@116.118.49.243:13003/tazacore"
    ["innerbright.vn"]="postgresql://postgres:2kOIU5HX98Nb@116.118.48.208:5432/innerv2core"
    ["kataseo.com"]="postgresql://postgres:postgres@116.118.49.243:13003/kataseo"
)

echo -e "${BLUE}============================================${NC}"
echo -e "${BLUE}📦 Multi-Domain Database Backup${NC}"
echo -e "${BLUE}============================================${NC}"
echo ""

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Function to backup single domain
backup_domain() {
    local domain=$1
    local db_url=$2
    
    echo -e "${CYAN}🔄 Backing up: ${domain}${NC}"
    
    # Create domain-specific backup directory
    local domain_backup_dir="${BACKUP_DIR}/${domain}/${TIMESTAMP}"
    mkdir -p "$domain_backup_dir"
    
    # Export DATABASE_URL for this domain
    export DATABASE_URL="$db_url"
    
    # Backup each table to JSON
    echo -e "${YELLOW}  📊 Exporting tables...${NC}"
    
    # Use export-data.ts script
    DATABASE_URL="$db_url" bun run "${SCRIPT_DIR}/export-data.ts" "$domain_backup_dir" 2>&1 | tail -n 5
    
    local success_count=$(ls -1 "$domain_backup_dir"/*.json 2>/dev/null | grep -v metadata.json | wc -l)
    local total_count=7
    local total_records=0
    
    # Count total records
    for json_file in "$domain_backup_dir"/*.json; do
        if [ -f "$json_file" ] && [ "$(basename "$json_file")" != "metadata.json" ]; then
            local count=$(jq 'length' "$json_file" 2>/dev/null || echo 0)
            total_records=$((total_records + count))
        fi
    done
    
    # Create metadata file
    cat > "${domain_backup_dir}/metadata.json" << EOF
{
  "domain": "${domain}",
  "timestamp": "${TIMESTAMP}",
  "date": "$(date -Iseconds)",
  "database_url": "${db_url}",
  "tables_exported": ${success_count},
  "total_tables": ${total_count},
  "total_records": ${total_records}
}
EOF
    
    # Compress backup
    echo -e "${YELLOW}  🗜️  Compressing backup...${NC}"
    cd "${BACKUP_DIR}/${domain}"
    tar -czf "${domain}_${TIMESTAMP}.tar.gz" "${TIMESTAMP}"
    rm -rf "${TIMESTAMP}"
    cd - > /dev/null
    
    local backup_size=$(du -h "${BACKUP_DIR}/${domain}/${domain}_${TIMESTAMP}.tar.gz" | cut -f1)
    
    echo -e "${GREEN}  ✅ Backup completed: ${backup_size}${NC}"
    echo -e "${GREEN}     Location: ${BACKUP_DIR}/${domain}/${domain}_${TIMESTAMP}.tar.gz${NC}"
    echo ""
}

# Backup all domains or specific domain
if [ -n "$1" ]; then
    # Backup specific domain
    domain="$1"
    if [ -n "${DOMAINS[$domain]}" ]; then
        backup_domain "$domain" "${DOMAINS[$domain]}"
    else
        echo -e "${RED}❌ Unknown domain: $domain${NC}"
        echo -e "${YELLOW}Available domains:${NC}"
        for d in "${!DOMAINS[@]}"; do
            echo "  - $d"
        done
        exit 1
    fi
else
    # Backup all domains
    for domain in "${!DOMAINS[@]}"; do
        backup_domain "$domain" "${DOMAINS[$domain]}"
    done
fi

# Summary
echo -e "${GREEN}============================================${NC}"
echo -e "${GREEN}✅ Backup Completed!${NC}"
echo -e "${GREEN}============================================${NC}"
echo ""
echo -e "${CYAN}📁 Backup location: ${BACKUP_DIR}${NC}"
echo ""
echo -e "${YELLOW}📚 Usage:${NC}"
echo -e "  Backup all domains:       ${BLUE}./scripts/backup-domain.sh${NC}"
echo -e "  Backup specific domain:   ${BLUE}./scripts/backup-domain.sh tazagroup.vn${NC}"
echo -e "  Restore backup:           ${BLUE}./scripts/restore-domain.sh tazagroup.vn 20250118_120000${NC}"
echo ""
