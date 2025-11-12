import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';
import { getPrismaClient } from './database';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Lấy Prisma client dựa trên hostname hiện tại
 * @param defaultHostname - Hostname mặc định khi không có headers (build time)
 */
export async function getPrisma(defaultHostname?: string): Promise<PrismaClient> {
  // Nếu có defaultHostname (build time), sử dụng trực tiếp
  if (defaultHostname) {
    return getPrismaClient(defaultHostname);
  }
  
  // Ngược lại, lấy từ headers (runtime)
  try {
    const headersList = await headers();
    const hostname = headersList.get('x-hostname') || headersList.get('host') || 'localhost:3000';
    return getPrismaClient(hostname);
  } catch (error) {
    // Fallback khi headers không khả dụng (build time)
    console.warn('Headers not available, using default hostname');
    return getPrismaClient('localhost:3000');
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