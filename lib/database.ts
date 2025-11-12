import { PrismaClient } from '@prisma/client';
import { getDomainConfig, getDatabaseUrl as getDbUrl } from './domain-config';

// Cache Prisma clients cho mỗi domain
const prismaClients = new Map<string, PrismaClient>();

/**
 * Lấy database URL dựa trên hostname
 * Hỗ trợ cả development (localhost:port) và production (domain)
 */
export function getDatabaseUrl(hostname: string): string {
  const config = getDomainConfig(hostname);
  return getDbUrl(config);
}

/**
 * Lấy Prisma client cho hostname cụ thể
 * @param hostname - Có thể là production domain hoặc localhost:port
 */
export function getPrismaClient(hostname: string): PrismaClient {
  const config = getDomainConfig(hostname);
  const cacheKey = config.domain;
  
  // Kiểm tra cache
  if (prismaClients.has(cacheKey)) {
    return prismaClients.get(cacheKey)!;
  }
  
  // Tạo client mới
  const databaseUrl = getDbUrl(config);
  const client = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
    // Disable tracing để tránh warning với Bun
    // @ts-ignore - Prisma internal config
    __internal: {
      engine: {
        enableTracing: false,
      },
    },
  });
  
  // Lưu vào cache
  prismaClients.set(cacheKey, client);
  
  return client;
}

/**
 * Lấy domain từ hostname
 */
export function extractDomain(hostname: string): string {
  // Loại bỏ port nếu có
  const withoutPort = hostname.split(':')[0];
  
  // Loại bỏ subdomain (giữ lại 2 phần cuối cùng)
  const parts = withoutPort.split('.');
  if (parts.length > 2) {
    return parts.slice(-2).join('.');
  }
  
  return withoutPort;
}

/**
 * Cleanup - đóng tất cả connections
 */
export async function disconnectAllPrismaClients() {
  const disconnectPromises = Array.from(prismaClients.values()).map(client => 
    client.$disconnect()
  );
  
  await Promise.all(disconnectPromises);
  prismaClients.clear();
}

// Cleanup khi process kết thúc
if (typeof window === 'undefined') {
  process.on('beforeExit', () => {
    disconnectAllPrismaClients();
  });
}
