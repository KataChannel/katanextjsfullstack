import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';
import { getPrismaClient } from './database';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Lấy Prisma client dựa trên domain hiện tại
 * @param defaultDomain - Domain mặc định khi không có headers (build time)
 */
export async function getPrisma(defaultDomain?: string): Promise<PrismaClient> {
  // Nếu có defaultDomain (build time), sử dụng trực tiếp
  if (defaultDomain) {
    return getPrismaClient(defaultDomain);
  }
  
  // Ngược lại, lấy từ headers (runtime)
  try {
    const headersList = await headers();
    const domain = headersList.get('x-domain') || 'tazagroup.vn';
    return getPrismaClient(domain);
  } catch (error) {
    // Fallback khi headers không khả dụng (build time)
    console.warn('Headers not available, using default domain');
    return getPrismaClient('tazagroup.vn');
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