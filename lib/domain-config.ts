/**
 * Cấu hình multi-domain cho hệ thống
 * Support cả môi trường Development và Production
 */

export interface DomainConfig {
  domain: string;
  database: string;
  description: string;
  address: string;
  hotline: string;
  email: string;
  // SEO settings
  siteName: string;
  siteTitle: string;
  // Development settings
  devDomain?: string;
  devPort?: number;
  // MinIO storage settings
  storage?: {
    type: 'minio' | 'local';
    endpoint?: string;
    port?: number;
    useSSL?: boolean;
    bucketName?: string;
  };
}

/**
 * Cấu hình domain cho hệ thống InnerBright
 */
export const DOMAIN_CONFIGS: Record<string, DomainConfig> = {
  'innerbright.vn': {
    domain: 'innerbright.vn',
    database: 'postgresql://postgres:2kOIU5HX98Nb@116.118.48.208:5432/innerv2core',
    description: 'InnerBright Training & Coaching, Cuộc sống của Bạn là do chính Bạn tạo ra và Lập Trình Ngôn Ngữ Tư Duy - NLP (Neuro Linguistic Programming)',
    address: 'TP. Hồ Chí Minh.',
    hotline: '0908370968',
    email: 'info@innerbright.vn',
    siteName: 'InnerBright',
    siteTitle: 'InnerBright - Training & Coaching NLP',
    devDomain: 'localhost',
    devPort: 3005,
    storage: {
      type: 'local',
      bucketName: 'innerbright',
    },
  },
};

/**
 * Lấy cấu hình domain - Mặc định luôn là innerbright.vn
 */
export function getDomainConfig(hostname?: string): DomainConfig {
  return DOMAIN_CONFIGS['innerbright.vn'];
}

/**
 * Lấy danh sách tất cả các domain được hỗ trợ
 */
export function getAllDomains(): string[] {
  return Object.keys(DOMAIN_CONFIGS);
}

/**
 * Kiểm tra xem có phải môi trường development không
 */
export function isDevelopment(): boolean {
  return process.env.NODE_ENV === 'development';
}

/**
 * Kiểm tra xem có phải môi trường production không
 */
export function isProduction(): boolean {
  return process.env.NODE_ENV === 'production';
}

/**
 * Lấy base URL cho domain hiện tại
 */
export function getBaseUrl(config: DomainConfig): string {
  if (isDevelopment()) {
    return `http://${config.devDomain}:${config.devPort}`;
  }
  return `https://${config.domain}`;
}

/**
 * Lấy database URL cho domain
 */
export function getDatabaseUrl(config: DomainConfig): string {
  // Trong production, có thể override bằng environment variable
  if (isProduction()) {
    const envDbUrl = process.env[`DATABASE_URL_${config.domain.toUpperCase().replace(/\./g, '_')}`];
    if (envDbUrl) {
      return envDbUrl;
    }
  }
  
  return config.database;
}
