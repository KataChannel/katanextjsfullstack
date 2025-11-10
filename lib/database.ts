import { PrismaClient } from '@prisma/client';

// Database configuration cho từng domain
const databaseConfig: Record<string, string> = {
  'tazagroup.vn': 'postgresql://postgres:postgres@116.118.49.243:13003/tazagroupvn',
  'tazaskinclinic.com': 'postgresql://postgres:postgres@116.118.49.243:13003/tazaskinclinic',
  'timona.edu.vn': 'postgresql://postgres:postgres@116.118.49.243:13003/tazagroupvn',
  'hderma.vn': 'postgresql://postgres:postgres@116.118.49.243:13003/hderma',
  'elasome.com': 'postgresql://postgres:postgres@116.118.49.243:13003/elasome',
};

// Cache Prisma clients cho mỗi database
const prismaClients = new Map<string, PrismaClient>();

/**
 * Lấy database URL dựa trên domain
 */
export function getDatabaseUrl(domain: string): string {
  // Loại bỏ www. nếu có
  const cleanDomain = domain.replace(/^www\./, '');
  
  // Tìm database URL tương ứng
  const dbUrl = databaseConfig[cleanDomain];
  
  if (!dbUrl) {
    // Mặc định sử dụng tazagroup.vn nếu không tìm thấy
    console.warn(`Domain ${domain} không có cấu hình, sử dụng database mặc định`);
    return databaseConfig['tazagroup.vn'];
  }
  
  return dbUrl;
}

/**
 * Lấy Prisma client cho domain cụ thể
 */
export function getPrismaClient(domain: string): PrismaClient {
  const cleanDomain = domain.replace(/^www\./, '');
  
  // Kiểm tra cache
  if (prismaClients.has(cleanDomain)) {
    return prismaClients.get(cleanDomain)!;
  }
  
  // Tạo client mới
  const databaseUrl = getDatabaseUrl(cleanDomain);
  const client = new PrismaClient({
    datasources: {
      db: {
        url: databaseUrl,
      },
    },
  });
  
  // Lưu vào cache
  prismaClients.set(cleanDomain, client);
  
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
