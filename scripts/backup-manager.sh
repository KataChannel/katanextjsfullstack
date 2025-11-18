#!/bin/bash

# ============================================
# Domain Backup Manager - Interactive Menu
# ============================================

set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m'

BACKUP_DIR="./backups"

# Domain configurations
declare -A DOMAINS=(
    ["tazagroup.vn"]="postgresql://postgres:postgres@116.118.49.243:13003/tazacore"
    ["innerbright.vn"]="postgresql://postgres:2kOIU5HX98Nb@116.118.48.208:5432/innerv2core"
    ["kataseo.com"]="postgresql://postgres:postgres@116.118.49.243:13003/kataseo"
)

# Function to list backups
list_backups() {
    echo -e "${BLUE}============================================${NC}"
    echo -e "${BLUE}📦 Available Backups${NC}"
    echo -e "${BLUE}============================================${NC}"
    echo ""
    
    for domain in "${!DOMAINS[@]}"; do
        echo -e "${CYAN}${domain}:${NC}"
        if [ -d "${BACKUP_DIR}/${domain}" ]; then
            local backup_files=($(ls -1t "${BACKUP_DIR}/${domain}/"*.tar.gz 2>/dev/null || true))
            
            if [ ${#backup_files[@]} -eq 0 ]; then
                echo -e "  ${YELLOW}No backups found${NC}"
            else
                for backup in "${backup_files[@]}"; do
                    local filename=$(basename "$backup")
                    local size=$(du -h "$backup" | cut -f1)
                    local date=$(stat -c %y "$backup" | cut -d. -f1)
                    echo -e "  ${GREEN}✓${NC} $filename (${size}) - $date"
                done
            fi
        else
            echo -e "  ${YELLOW}No backups found${NC}"
        fi
        echo ""
    done
}

# Function to backup single domain
backup_single() {
    echo -e "${CYAN}Select domain to backup:${NC}"
    local i=1
    local domain_array=()
    
    for domain in "${!DOMAINS[@]}"; do
        echo "  $i) $domain"
        domain_array[$i]=$domain
        ((i++))
    done
    echo "  0) Cancel"
    echo ""
    
    read -p "Enter choice: " choice
    
    if [ "$choice" = "0" ]; then
        return
    fi
    
    if [ -n "${domain_array[$choice]}" ]; then
        local selected_domain="${domain_array[$choice]}"
        echo ""
        ./scripts/backup-domain.sh "$selected_domain"
    else
        echo -e "${RED}Invalid choice${NC}"
    fi
}

# Function to backup all domains
backup_all() {
    echo -e "${YELLOW}Backing up all domains...${NC}"
    echo ""
    ./scripts/backup-domain.sh
}

# Function to restore domain
restore_domain() {
    echo -e "${CYAN}Select domain to restore:${NC}"
    local i=1
    local domain_array=()
    
    for domain in "${!DOMAINS[@]}"; do
        echo "  $i) $domain"
        domain_array[$i]=$domain
        ((i++))
    done
    echo "  0) Cancel"
    echo ""
    
    read -p "Enter choice: " choice
    
    if [ "$choice" = "0" ]; then
        return
    fi
    
    if [ -n "${domain_array[$choice]}" ]; then
        local selected_domain="${domain_array[$choice]}"
        echo ""
        
        # List available backups for selected domain
        echo -e "${CYAN}Available backups for ${selected_domain}:${NC}"
        
        if [ ! -d "${BACKUP_DIR}/${selected_domain}" ]; then
            echo -e "${RED}No backups found${NC}"
            return
        fi
        
        local backup_files=($(ls -1t "${BACKUP_DIR}/${selected_domain}/"*.tar.gz 2>/dev/null || true))
        
        if [ ${#backup_files[@]} -eq 0 ]; then
            echo -e "${RED}No backups found${NC}"
            return
        fi
        
        local j=1
        local backup_array=()
        
        for backup in "${backup_files[@]}"; do
            local filename=$(basename "$backup" .tar.gz)
            local timestamp=$(echo "$filename" | sed "s/${selected_domain}_//")
            local size=$(du -h "$backup" | cut -f1)
            local date=$(stat -c %y "$backup" | cut -d. -f1)
            echo "  $j) $timestamp (${size}) - $date"
            backup_array[$j]=$timestamp
            ((j++))
        done
        echo "  0) Cancel"
        echo ""
        
        read -p "Enter choice: " backup_choice
        
        if [ "$backup_choice" = "0" ]; then
            return
        fi
        
        if [ -n "${backup_array[$backup_choice]}" ]; then
            local selected_timestamp="${backup_array[$backup_choice]}"
            echo ""
            ./scripts/restore-domain.sh "$selected_domain" "$selected_timestamp"
        else
            echo -e "${RED}Invalid choice${NC}"
        fi
    else
        echo -e "${RED}Invalid choice${NC}"
    fi
}

# Function to clean old backups
clean_backups() {
    echo -e "${CYAN}Select domain to clean backups:${NC}"
    local i=1
    local domain_array=()
    
    for domain in "${!DOMAINS[@]}"; do
        echo "  $i) $domain"
        domain_array[$i]=$domain
        ((i++))
    done
    echo "  $i) All domains"
    echo "  0) Cancel"
    echo ""
    
    read -p "Enter choice: " choice
    
    if [ "$choice" = "0" ]; then
        return
    fi
    
    echo ""
    read -p "Keep how many recent backups? (default: 5): " keep_count
    keep_count=${keep_count:-5}
    
    if [ "$choice" = "$i" ]; then
        # Clean all domains
        for domain in "${!DOMAINS[@]}"; do
            clean_domain_backups "$domain" "$keep_count"
        done
    elif [ -n "${domain_array[$choice]}" ]; then
        # Clean specific domain
        clean_domain_backups "${domain_array[$choice]}" "$keep_count"
    else
        echo -e "${RED}Invalid choice${NC}"
    fi
}

clean_domain_backups() {
    local domain=$1
    local keep_count=$2
    
    if [ ! -d "${BACKUP_DIR}/${domain}" ]; then
        return
    fi
    
    local backup_files=($(ls -1t "${BACKUP_DIR}/${domain}/"*.tar.gz 2>/dev/null || true))
    local total_backups=${#backup_files[@]}
    
    if [ $total_backups -le $keep_count ]; then
        echo -e "${YELLOW}${domain}: No backups to clean (${total_backups} backups)${NC}"
        return
    fi
    
    echo -e "${CYAN}${domain}: Keeping ${keep_count} most recent backups...${NC}"
    
    local delete_count=$((total_backups - keep_count))
    local deleted=0
    
    for ((i=keep_count; i<total_backups; i++)); do
        local backup="${backup_files[$i]}"
        echo -e "  ${RED}Deleting:${NC} $(basename "$backup")"
        rm -f "$backup"
        ((deleted++))
    done
    
    echo -e "${GREEN}${domain}: Deleted ${deleted} old backups${NC}"
    echo ""
}

# Main menu
main_menu() {
    while true; do
        clear
        echo -e "${BLUE}============================================${NC}"
        echo -e "${BLUE}📦 Domain Backup Manager${NC}"
        echo -e "${BLUE}============================================${NC}"
        echo ""
        echo "  1) List all backups"
        echo "  2) Backup single domain"
        echo "  3) Backup all domains"
        echo "  4) Restore domain"
        echo "  5) Clean old backups"
        echo "  0) Exit"
        echo ""
        read -p "Enter choice: " choice
        echo ""
        
        case $choice in
            1)
                list_backups
                read -p "Press Enter to continue..."
                ;;
            2)
                backup_single
                read -p "Press Enter to continue..."
                ;;
            3)
                backup_all
                read -p "Press Enter to continue..."
                ;;
            4)
                restore_domain
                read -p "Press Enter to continue..."
                ;;
            5)
                clean_backups
                read -p "Press Enter to continue..."
                ;;
            0)
                echo -e "${GREEN}Goodbye!${NC}"
                exit 0
                ;;
            *)
                echo -e "${RED}Invalid choice${NC}"
                read -p "Press Enter to continue..."
                ;;
        esac
    done
}

# Run main menu
main_menu
