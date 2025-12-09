import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';
import { getPrismaClient } from './database';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

// Check if we're in build mode and should skip database
const isSkipDbBuild = process.env.SKIP_DB_DURING_BUILD === '1';

// Get default hostname at runtime (not build time)
// This function ensures the env variable is read at runtime
function getDefaultHostname(): string {
  return process.env.DEFAULT_HOSTNAME || 'innerbright.vn';
}

/**
 * Lấy Prisma client dựa trên hostname hiện tại
 * @param defaultHostname - Hostname mặc định khi không có headers (build time)
 */
export async function getPrisma(defaultHostname?: string): Promise<PrismaClient> {
  // Skip database connection during Docker build
  if (isSkipDbBuild) {
    throw new Error('Database connection skipped during build');
  }
  
  // Nếu có defaultHostname (build time), sử dụng trực tiếp
  if (defaultHostname) {
    return getPrismaClient(defaultHostname);
  }
  
  // Ngược lại, lấy từ headers (runtime)
  try {
    const headersList = await headers();
    const defaultHost = getDefaultHostname();
    const hostname = headersList.get('x-hostname') || headersList.get('host') || defaultHost;
    return getPrismaClient(hostname);
  } catch (error) {
    // Fallback khi headers không khả dụng (build time)
    // Use DEFAULT_HOSTNAME from environment variable instead of hardcoded localhost:3000
    const defaultHost = getDefaultHostname();
    console.warn(`Headers not available, using default hostname: ${defaultHost}`);
    return getPrismaClient(defaultHost);
  }
}

// Export default prisma client cho các trường hợp không cần multi-tenancy
export const prisma = globalForPrisma.prisma ?? new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
  // Disable tracing để tránh warning với Bun
  // @ts-ignore - Prisma internal config
  __internal: {
    engine: {
      enableTracing: false,
    },
  },
});

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}