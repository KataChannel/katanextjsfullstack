#!/bin/bash

# ============================================
# INNERBRIGHT.VN DEPLOYMENT SCRIPT
# Deploy Docker container to production server
# Server: 116.118.48.208
# Container: innerbright-web (port 3005)
# ============================================

set -e  # Exit on error

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Configuration
REMOTE_SERVER="root@116.118.48.208"
REMOTE_DIR="/var/www/innerbright"
CONTAINER_NAME="innerbright-web"
IMAGE_NAME="innerbright-web:latest"
BRANCH="webseo_dev3_alldomain"
LOCAL_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

# Functions
print_header() {
    echo -e "\n${BLUE}============================================${NC}"
    echo -e "${BLUE}$1${NC}"
    echo -e "${BLUE}============================================${NC}\n"
}

print_step() {
    echo -e "${CYAN}▶ $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Confirm deployment
print_header "🚀 InnerBright.vn Deployment"
echo -e "${YELLOW}Server:${NC}    $REMOTE_SERVER"
echo -e "${YELLOW}Directory:${NC} $REMOTE_DIR"
echo -e "${YELLOW}Container:${NC} $CONTAINER_NAME"
echo -e "${YELLOW}Branch:${NC}    $BRANCH"
echo ""
read -p "Continue with deployment? (y/n): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    print_error "Deployment cancelled"
    exit 1
fi

# ============================================
# STEP 1: Local Git Operations
# ============================================
print_header "📝 Step 1: Git Operations"

cd "$LOCAL_DIR"
print_step "Current directory: $(pwd)"

# Check for uncommitted changes
if [[ -n $(git status -s) ]]; then
    print_warning "You have uncommitted changes:"
    git status -s
    echo ""
    read -p "Commit changes? (y/n): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter commit message: " commit_msg
        git add .
        git commit -m "$commit_msg"
        print_success "Changes committed"
    fi
fi

# Push to remote
print_step "Pushing to remote repository..."
git push origin $BRANCH
print_success "Code pushed successfully"

# ============================================
# STEP 2: Pre-deployment Checks
# ============================================
print_header "🔍 Step 2: Pre-deployment Checks"

print_step "Checking server connectivity..."
if ssh -o ConnectTimeout=5 $REMOTE_SERVER "echo 'Connected'" > /dev/null 2>&1; then
    print_success "Server is reachable"
else
    print_error "Cannot connect to server"
    exit 1
fi

print_step "Checking disk space on server..."
ssh $REMOTE_SERVER << 'EOF'
DISK_USAGE=$(df -h / | awk 'NR==2 {print $5}' | sed 's/%//')
echo "Disk usage: ${DISK_USAGE}%"
if [ $DISK_USAGE -gt 85 ]; then
    echo "⚠️  High disk usage: ${DISK_USAGE}%"
    echo "Available space:"
    df -h / | awk 'NR==2 {print "  Free: " $4 " / " $2}'
fi
EOF

# ============================================
# STEP 3: Backup Current Database
# ============================================
print_header "💾 Step 3: Backup Current Database"

print_step "Creating database backup..."
ssh $REMOTE_SERVER << EOF
cd $REMOTE_DIR
TIMESTAMP=\$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="backups/\$TIMESTAMP"
mkdir -p \$BACKUP_DIR

echo "Backing up database to: \$BACKUP_DIR"
docker exec innerbright-postgres pg_dump -U postgres innerv2core > "\$BACKUP_DIR/database.sql"

if [ -f "\$BACKUP_DIR/database.sql" ]; then
    gzip "\$BACKUP_DIR/database.sql"
    echo "✅ Database backed up: \$BACKUP_DIR/database.sql.gz"
    ls -lh "\$BACKUP_DIR/database.sql.gz"
else
    echo "❌ Backup failed"
    exit 1
fi
EOF
print_success "Database backup completed"

# ============================================
# STEP 4: Pull Latest Code on Server
# ============================================
print_header "📥 Step 4: Pull Latest Code"

ssh $REMOTE_SERVER << EOF
set -e
cd $REMOTE_DIR

echo "Current directory: \$(pwd)"
echo "Current branch: \$(git branch --show-current)"

# Stash local changes
if [[ -n \$(git status -s) ]]; then
    echo "Stashing local changes..."
    git stash
fi

# Pull latest code
echo "Pulling latest code from $BRANCH..."
git fetch origin
git checkout $BRANCH
git pull origin $BRANCH

echo "✅ Latest commit:"
git log -1 --oneline
EOF
print_success "Code pulled successfully"

# ============================================
# STEP 5: Build Docker Image
# ============================================
print_header "🔨 Step 5: Build Docker Image"

ssh $REMOTE_SERVER << 'EOF'
set -e
cd /var/www/innerbright

echo "Building Docker image..."
docker build -t innerbright-web:latest -f- . << 'DOCKERFILE'
FROM node:20-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat python3 make g++
WORKDIR /app

COPY package*.json ./
RUN npm ci --legacy-peer-deps

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL="postgresql://postgres:postgres@postgres:5432/innerv2core"

RUN npx prisma generate
RUN npm run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public

RUN mkdir .next
RUN chown nextjs:nodejs .next

COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static
COPY --from=builder --chown=nextjs:nodejs /app/prisma ./prisma

USER nextjs

EXPOSE 3005

ENV PORT=3005
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
DOCKERFILE

if [ $? -eq 0 ]; then
    echo "✅ Docker image built successfully"
    docker images | grep innerbright-web | head -1
else
    echo "❌ Docker build failed"
    exit 1
fi
EOF
print_success "Docker image built"

# ============================================
# STEP 6: Stop Old Container
# ============================================
print_header "🛑 Step 6: Stop Old Container"

ssh $REMOTE_SERVER << EOF
cd $REMOTE_DIR

echo "Stopping old container..."
docker compose stop innerbright-web || true
docker compose rm -f innerbright-web || true

echo "✅ Old container stopped"
EOF
print_success "Old container stopped"

# ============================================
# STEP 7: Start New Container
# ============================================
print_header "🚀 Step 7: Start New Container"

ssh $REMOTE_SERVER << EOF
set -e
cd $REMOTE_DIR

echo "Starting new container..."
docker compose up -d innerbright-web

# Wait for container to be healthy
echo "Waiting for container to be healthy..."
for i in {1..30}; do
    STATUS=\$(docker inspect --format='{{.State.Health.Status}}' innerbright-web 2>/dev/null || echo "starting")
    echo "Attempt \$i/30: Status = \$STATUS"
    
    if [ "\$STATUS" = "healthy" ]; then
        echo "✅ Container is healthy"
        break
    fi
    
    if [ \$i -eq 30 ]; then
        echo "❌ Container failed to become healthy"
        echo "Container logs:"
        docker logs innerbright-web --tail 50
        exit 1
    fi
    
    sleep 2
done
EOF
print_success "New container started"

# ============================================
# STEP 8: Health Checks
# ============================================
print_header "🏥 Step 8: Health Checks"

print_step "Checking container status..."
ssh $REMOTE_SERVER << EOF
cd $REMOTE_DIR
echo "Container status:"
docker compose ps innerbright-web

echo ""
echo "Container health:"
docker inspect innerbright-web --format='Health: {{.State.Health.Status}}'
EOF

print_step "Testing HTTP endpoint..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" http://116.118.48.208:3005/api/health)
if [ "$HTTP_CODE" = "200" ]; then
    print_success "HTTP endpoint OK (status: $HTTP_CODE)"
else
    print_error "HTTP endpoint failed (status: $HTTP_CODE)"
fi

print_step "Testing HTTPS endpoint..."
HTTPS_CODE=$(curl -s -o /dev/null -w "%{http_code}" https://innerbright.vn/api/health)
if [ "$HTTPS_CODE" = "200" ]; then
    print_success "HTTPS endpoint OK (status: $HTTPS_CODE)"
else
    print_error "HTTPS endpoint failed (status: $HTTPS_CODE)"
fi

# ============================================
# STEP 9: Cleanup
# ============================================
print_header "🧹 Step 9: Cleanup"

ssh $REMOTE_SERVER << EOF
echo "Cleaning up old Docker images..."
docker image prune -af --filter "until=24h"

echo "Disk usage after cleanup:"
df -h / | awk 'NR==2 {print "  Used: " \$3 " / " \$2 " (" \$5 ")"}'
EOF
print_success "Cleanup completed"

# ============================================
# STEP 10: Show Logs
# ============================================
print_header "📋 Step 10: Recent Logs"

ssh $REMOTE_SERVER << EOF
docker logs innerbright-web --tail 30
EOF

# ============================================
# Deployment Summary
# ============================================
print_header "✅ Deployment Summary"

echo -e "${GREEN}Deployment completed successfully!${NC}\n"

echo -e "${CYAN}📊 Application Info:${NC}"
echo -e "  ${YELLOW}URL:${NC}       https://innerbright.vn"
echo -e "  ${YELLOW}Direct:${NC}    http://116.118.48.208:3005"
echo -e "  ${YELLOW}Admin:${NC}     https://innerbright.vn/admin"
echo ""

echo -e "${CYAN}🐳 Docker Info:${NC}"
ssh $REMOTE_SERVER "docker compose ps innerbright-web" | tail -1
echo ""

echo -e "${CYAN}📚 Useful Commands:${NC}"
echo -e "  ${BLUE}View logs:${NC}     ssh $REMOTE_SERVER 'docker logs -f innerbright-web'"
echo -e "  ${BLUE}Restart:${NC}       ssh $REMOTE_SERVER 'cd $REMOTE_DIR && docker compose restart innerbright-web'"
echo -e "  ${BLUE}Shell:${NC}         ssh $REMOTE_SERVER 'docker exec -it innerbright-web sh'"
echo -e "  ${BLUE}Status:${NC}        ssh $REMOTE_SERVER 'cd $REMOTE_DIR && docker compose ps'"
echo -e "  ${BLUE}Backup list:${NC}   ssh $REMOTE_SERVER 'ls -lh $REMOTE_DIR/backups/'"
echo ""

# Performance test
echo -e "${CYAN}⚡ Performance Test:${NC}"
echo -n "  HTTP response time:  "
time curl -s http://116.118.48.208:3005/api/health > /dev/null
echo -n "  HTTPS response time: "
time curl -s https://innerbright.vn/api/health > /dev/null
echo ""

print_success "All done! 🎉"
