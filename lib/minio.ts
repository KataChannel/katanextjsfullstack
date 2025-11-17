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
    endpoint: '116.118.49.243',
    port: 12007,
    useSSL: false,
    accessKey: 'minio-admin',
    secretKey: 'minio-secret-2025',
    bucketName: 'innerbright',
  },
  // TODO: Thêm config cho các domain khác khi cần
  // 'tazagroup.vn': {
  //   endpoint: '116.118.49.243',
  //   port: 12007,
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
 */
export async function ensureBucket(client: Minio.Client, bucketName: string): Promise<void> {
  const bucketExists = await client.bucketExists(bucketName);
  
  if (!bucketExists) {
    await client.makeBucket(bucketName, 'us-east-1');
    console.log(`✅ Created MinIO bucket: ${bucketName}`);
  }
}

/**
 * Upload file lên MinIO
 * @returns URL của file đã upload
 */
export async function uploadToMinio(
  client: Minio.Client,
  bucketName: string,
  filename: string,
  buffer: Buffer,
  mimeType: string,
  metadata?: Record<string, string>
): Promise<string> {
  await ensureBucket(client, bucketName);
  
  // Upload file
  await client.putObject(bucketName, filename, buffer, buffer.length, {
    'Content-Type': mimeType,
    ...metadata,
  });

  // Generate public URL
  // Format: http://endpoint:port/bucket/filename
  const config = Object.values(MINIO_CONFIGS).find(c => c.bucketName === bucketName);
  if (!config) {
    throw new Error(`Config not found for bucket: ${bucketName}`);
  }

  const protocol = config.useSSL ? 'https' : 'http';
  const url = `${protocol}://${config.endpoint}:${config.port}/${bucketName}/${filename}`;
  
  return url;
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
