/**
 * MinIO Configuration & Helper Functions
 * Support multi-domain với MinIO bucket riêng cho mỗi domain
 */

import * as Minio from 'minio';

export interface MinioConfig {
  endpoint: string;
  port: number;
  useSSL: boolean;
  accessKey: string;
  secretKey: string;
  bucketName: string;
}

/**
 * Cấu hình MinIO cho từng domain
 */
export const MINIO_CONFIGS: Record<string, MinioConfig> = {
  'innerbright.vn': {
    endpoint: '116.118.48.208',
    port: 9000,
    useSSL: false,
    accessKey: 'minioadmin',
    secretKey: '97G6UiPTilf2',
    bucketName: 'innerbright',
  },
  // TODO: Thêm config cho các domain khác khi cần
  // 'tazagroup.vn': {
  //   endpoint: '116.118.48.208',
  //   port: 9000,
  //   useSSL: false,
  //   accessKey: 'minio-admin',
  //   secretKey: 'minio-secret-2025',
  //   bucketName: 'tazagroup',
  // },
};

/**
 * Lấy MinIO client cho domain cụ thể
 */
export function getMinioClient(domain: string): Minio.Client {
  const config = MINIO_CONFIGS[domain];
  
  if (!config) {
    throw new Error(`MinIO config not found for domain: ${domain}`);
  }

  return new Minio.Client({
    endPoint: config.endpoint,
    port: config.port,
    useSSL: config.useSSL,
    accessKey: config.accessKey,
    secretKey: config.secretKey,
  });
}

/**
 * Đảm bảo bucket tồn tại, tạo mới nếu chưa có
 * Set bucket policy thành public read để tránh AccessDenied
 */
export async function ensureBucket(client: Minio.Client, bucketName: string): Promise<void> {
  const bucketExists = await client.bucketExists(bucketName);
  
  if (!bucketExists) {
    await client.makeBucket(bucketName, 'us-east-1');
    console.log(`✅ Created MinIO bucket: ${bucketName}`);
  }
  
  // Set bucket policy cho public read access
  // Điều này cho phép tất cả mọi người đọc (read/download) files từ bucket
  const publicReadPolicy = {
    Version: '2012-10-17',
    Statement: [
      {
        Effect: 'Allow',
        Principal: { AWS: ['*'] },
        Action: ['s3:GetObject'],
        Resource: [`arn:aws:s3:::${bucketName}/*`],
      },
    ],
  };
  
  try {
    await client.setBucketPolicy(bucketName, JSON.stringify(publicReadPolicy));
    console.log(`✅ Set public read policy for bucket: ${bucketName}`);
  } catch (error) {
    console.warn(`⚠️ Could not set bucket policy (may already be set):`, error);
  }
}

/**
 * Convert MinIO internal URL to public HTTPS URL via Next.js API proxy
 */
export function getPublicMinioUrl(domain: string, bucketName: string, filename: string): string {
  // For innerbright.vn, use HTTPS via Next.js API proxy
  if (domain === 'innerbright.vn') {
    return `https://innerbright.vn/api/minio-proxy/${bucketName}/${filename}`;
  }
  
  // Fallback to direct MinIO URL for other domains
  const config = MINIO_CONFIGS[domain];
  if (!config) {
    throw new Error(`MinIO config not found for domain: ${domain}`);
  }
  
  const protocol = config.useSSL ? 'https' : 'http';
  return `${protocol}://${config.endpoint}:${config.port}/${bucketName}/${filename}`;
}

/**
 * Upload file lên MinIO
 * @returns URL của file đã upload (HTTPS via proxy for production)
 */
export async function uploadToMinio(
  client: Minio.Client,
  bucketName: string,
  filename: string,
  buffer: Buffer,
  mimeType: string,
  domain: string,
  metadata?: Record<string, string>
): Promise<string> {
  await ensureBucket(client, bucketName);
  
  // Upload file
  await client.putObject(bucketName, filename, buffer, buffer.length, {
    'Content-Type': mimeType,
    ...metadata,
  });

  // Return public HTTPS URL
  return getPublicMinioUrl(domain, bucketName, filename);
}

/**
 * Xóa file từ MinIO
 */
export async function deleteFromMinio(
  client: Minio.Client,
  bucketName: string,
  filename: string
): Promise<void> {
  await client.removeObject(bucketName, filename);
}

/**
 * Lấy MinIO config và client cho domain
 */
export function getMinioConfigForDomain(domain: string): { config: MinioConfig; client: Minio.Client } {
  const config = MINIO_CONFIGS[domain];
  
  if (!config) {
    throw new Error(`MinIO config not found for domain: ${domain}`);
  }

  const client = getMinioClient(domain);
  
  return { config, client };
}
