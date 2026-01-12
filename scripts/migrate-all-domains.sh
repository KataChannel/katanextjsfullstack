#!/bin/bash

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}  Multi-Domain Database Migration${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo ""

# Read .env file
if [ ! -f ".env" ]; then
    echo -e "${RED}❌ .env file not found!${NC}"
    exit 1
fi

# Domain databases
declare -A DATABASES
DATABASES=(
    [tazagroup]="DATABASE_TAZAGROUP_URL"
    [tazaskin]="DATABASE_TAZASKIN_URL"
    [timona]="DATABASE_TIMONA_URL"
    [hderma]="DATABASE_HDERMA_URL"
    [elasome]="DATABASE_ELASOME_URL"
)

echo -e "${YELLOW}Choose migration action:${NC}"
echo ""
echo "  1) Push schema (db:push) - Quick sync without migration"
echo "  2) Create migration (db:migrate) - Create migration files"
echo "  3) Generate Prisma Client only"
echo "  4) Full setup (push + generate)"
echo "  0) Exit"
echo ""
echo -n "Select [0-4]: "
read action

case $action in
    0)
        echo -e "${YELLOW}Exit...${NC}"
        exit 0
        ;;
    1|2|4)
        echo ""
        echo -e "${YELLOW}Select domain(s) to migrate:${NC}"
        echo ""
        echo "  1) TazaGroup"
        echo "  2) TazaSkin"
        echo "  3) Timona"
        echo "  4) HDerma"
        echo "  5) Elasome"
        echo "  6) ALL domains"
        echo "  0) Cancel"
        echo ""
        echo -n "Select [0-6]: "
        read domain_choice
        
        if [ "$domain_choice" == "0" ]; then
            echo -e "${YELLOW}Cancelled${NC}"
            exit 0
        fi
        
        # Determine which domains to process
        SELECTED_DOMAINS=()
        
        if [ "$domain_choice" == "6" ]; then
            SELECTED_DOMAINS=("tazagroup" "tazaskin" "timona" "hderma" "elasome")
        else
            case $domain_choice in
                1) SELECTED_DOMAINS=("tazagroup") ;;
                2) SELECTED_DOMAINS=("tazaskin") ;;
                3) SELECTED_DOMAINS=("timona") ;;
                4) SELECTED_DOMAINS=("hderma") ;;
                5) SELECTED_DOMAINS=("elasome") ;;
                *)
                    echo -e "${RED}Invalid choice!${NC}"
                    exit 1
                    ;;
            esac
        fi
        
        echo ""
        echo -e "${GREEN}Processing domains: ${SELECTED_DOMAINS[@]}${NC}"
        echo ""
        
        # Process each selected domain
        for domain in "${SELECTED_DOMAINS[@]}"; do
            DB_VAR="${DATABASES[$domain]}"
            DB_URL=$(grep "^${DB_VAR}=" .env | cut -d '=' -f2- | tr -d '"')
            
            if [ -z "$DB_URL" ]; then
                echo -e "${RED}❌ ${domain}: Database URL not found in .env${NC}"
                continue
            fi
            
            echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            echo -e "${GREEN}Processing: ${domain}${NC}"
            echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
            
            # Export DATABASE_URL for this domain
            export DATABASE_URL="$DB_URL"
            
            if [ "$action" == "1" ]; then
                # db:push
                echo -e "${YELLOW}Running db:push...${NC}"
                bunx prisma db push --accept-data-loss
                
                if [ $? -eq 0 ]; then
                    echo -e "${GREEN}✅ ${domain}: Schema pushed successfully${NC}"
                else
                    echo -e "${RED}❌ ${domain}: Failed to push schema${NC}"
                fi
                
            elif [ "$action" == "2" ]; then
                # db:migrate
                echo -e "${YELLOW}Running db:migrate...${NC}"
                echo -n "Migration name for ${domain}: "
                read migration_name
                
                if [ -z "$migration_name" ]; then
                    migration_name="schema_update"
                fi
                
                bunx prisma migrate dev --name "${migration_name}"
                
                if [ $? -eq 0 ]; then
                    echo -e "${GREEN}✅ ${domain}: Migration created successfully${NC}"
                else
                    echo -e "${RED}❌ ${domain}: Migration failed${NC}"
                fi
                
            elif [ "$action" == "4" ]; then
                # Full setup
                echo -e "${YELLOW}Running full setup...${NC}"
                
                # Push schema
                bunx prisma db push --accept-data-loss
                
                if [ $? -eq 0 ]; then
                    echo -e "${GREEN}✅ ${domain}: Schema pushed${NC}"
                else
                    echo -e "${RED}❌ ${domain}: Schema push failed${NC}"
                    continue
                fi
            fi
            
            echo ""
        done
        
        # Generate Prisma Client once at the end
        echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
        echo -e "${YELLOW}Generating Prisma Client...${NC}"
        bunx prisma generate
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Prisma Client generated${NC}"
        else
            echo -e "${RED}❌ Failed to generate Prisma Client${NC}"
        fi
        ;;
    3)
        # Generate only
        echo ""
        echo -e "${YELLOW}Generating Prisma Client...${NC}"
        bunx prisma generate
        
        if [ $? -eq 0 ]; then
            echo -e "${GREEN}✅ Prisma Client generated${NC}"
        else
            echo -e "${RED}❌ Failed to generate Prisma Client${NC}"
        fi
        ;;
    *)
        echo -e "${RED}Invalid choice!${NC}"
        exit 1
        ;;
esac

echo ""
echo -e "${BLUE}════════════════════════════════════════${NC}"
echo -e "${GREEN}✅ Migration completed!${NC}"
echo -e "${BLUE}════════════════════════════════════════${NC}"
