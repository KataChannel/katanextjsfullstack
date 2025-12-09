# ============================================
# Multi-stage Dockerfile for InnerBright
# Optimized for production Next.js with Bun
# ============================================

# Stage 1: Dependencies
FROM oven/bun:1 AS deps
WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy package files
COPY package.json bun.lock* ./
COPY prisma ./prisma/

# Set environment for Prisma
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Install dependencies - use frozen lockfile for speed
RUN bun install --frozen-lockfile

# Generate Prisma Client
RUN bunx prisma generate || echo "Warning: Prisma generate failed"

# Stage 2: Builder
FROM oven/bun:1 AS builder
WORKDIR /app

# Install OpenSSL for Prisma
RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

# Copy dependencies AND generated Prisma Client from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/package.json ./package.json

# Copy prisma schema
COPY prisma ./prisma/

# Copy source code
COPY . .

# Set Prisma environment
ENV PRISMA_ENGINES_CHECKSUM_IGNORE_MISSING=1

# Ensure Prisma Client exists - generate if needed with retry
RUN if [ ! -d "node_modules/.prisma/client" ]; then \
        bunx prisma generate || \
        (sleep 5 && bunx prisma generate) || \
        (sleep 10 && bunx prisma generate) || \
        echo "ERROR: Failed to generate Prisma Client"; \
    fi

# Build application
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
# Skip database connection during build - will use runtime values
ENV SKIP_DB_DURING_BUILD=1
ENV DATABASE_URL="postgresql://skip:skip@localhost:5432/skip?schema=public"

RUN bun run build

# Stage 3: Runner
FROM oven/bun:1-slim AS runner
WORKDIR /app

# Install curl for healthcheck and shadow package for user management
RUN apt-get update && apt-get install -y curl && rm -rf /var/lib/apt/lists/*

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user using useradd (available in slim image)
RUN groupadd --system --gid 1001 nodejs
RUN useradd --system --uid 1001 --gid nodejs nextjs

# Copy necessary files from builder
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Create uploads directory
RUN mkdir -p ./public/uploads && chown -R nextjs:nodejs ./public/uploads

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3005

ENV PORT=3005
ENV HOSTNAME="0.0.0.0"

# Health check endpoint
HEALTHCHECK --interval=30s --timeout=10s --start-period=40s --retries=3 \
  CMD curl -f http://localhost:3005/api/health || exit 1

# Start application
CMD ["node", "server.js"]
