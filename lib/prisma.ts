import { PrismaClient } from '@prisma/client';
import { headers } from 'next/headers';
import { getPrismaClient } from './database';

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

/**
 * Lấy Prisma client dựa trên domain hiện tại
 */
export async function getPrisma(): Promise<PrismaClient> {
  const headersList = await headers();
  const domain = headersList.get('x-domain') || 'tazagroup.vn';
  
  return getPrismaClient(domain);
}

// Export default prisma client cho các trường hợp không cần multi-tenancy
export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}