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
 * Cấu hình cho tất cả các domain
 */
export const DOMAIN_CONFIGS: Record<string, DomainConfig> = {
  'tazagroup.vn': {
    domain: 'tazagroup.vn',
    database: 'postgresql://postgres:postgres@116.118.49.243:13003/tazagroupvn',
    description: 'Nâng tầm giá trị và mang lại 1 cuộc sống tốt đẹp hơn cho phụ nữ Việt Nam với sứ mệnh 3T: Thay đổi, Tự tin, Tốt hơn',
    address: 'Tầng 6 Tòa nhà Thành Đô, 14-16 Bình Lợi - Phường 13 - Bình Thạnh',
    hotline: '02873003689',
    email: 'nhansu@tazagroup.vn',
    siteName: 'Taza Group',
    siteTitle: 'Taza Group - Nâng tầm giá trị phụ nữ Việt',
    devDomain: 'localhost',
    devPort: 3000,
  },
  'tazaskinclinic.com': {
    domain: 'tazaskinclinic.com',
    database: 'postgresql://postgres:postgres@116.118.49.243:13003/tazaskinclinic',
    description: '10 năm kinh nghiệm trong ngành thẩm mỹ, Taza Skin Clinic quy tụ đội ngũ bác sĩ chuyên khoa, chuyên gia tư vấn, kỹ thuật viên hùng hậu có tay nghề cao, giỏi',
    address: '169 Quang Trung, P, Gò Vấp, Hồ Chí Minh',
    hotline: '19002664',
    email: 'info@tazaskinclinic.com',
    siteName: 'Taza Skin Clinic',
    siteTitle: 'Taza Skin Clinic - Chuyên gia thẩm mỹ hàng đầu',
    devDomain: 'localhost',
    devPort: 3001,
  },
  'timona.edu.vn': {
    domain: 'timona.edu.vn',
    database: 'postgresql://postgres:postgres@116.118.49.243:13003/timona',
    description: 'Với tinh thần "Thay Đổi – Tự Tin – Tốt Hơn", Timona Academy là một trong những học viện hàng đầu trong lĩnh vực đào tạo thẩm mỹ, spa chuyên nghiệp tại Việt Nam.',
    address: '283/68+70 Cách Mạng Tháng Tám, P. Hòa Hưng, Tp. Hồ Chí Minh',
    hotline: '19002109',
    email: 'info@timona.edu.vn',
    siteName: 'Timona Academy',
    siteTitle: 'Timona Academy - Học viện đào tạo thẩm mỹ chuyên nghiệp',
    devDomain: 'localhost',
    devPort: 3002,
  },
  'hderma.vn': {
    domain: 'hderma.vn',
    database: 'postgresql://postgres:postgres@116.118.49.243:13003/hderma',
    description: 'Vẻ đẹp cốt lõi bắt nguồn từ sự phù hợp và hài hòa với chính bạn, H.Derma luôn đồng hành cùng bạn trên con đường khai phá vẻ đẹp riêng của chính bạn.',
    address: '1012-1014 Quang Trung, Phường 8, Quận Gò Vấp, TP. Hồ Chí Minh.',
    hotline: '0911754299 - 02873092585',
    email: 'info@hderma.vn',
    siteName: 'H.Derma',
    siteTitle: 'H.Derma - Khai phá vẻ đẹp riêng của bạn',
    devDomain: 'localhost',
    devPort: 3003,
  },
  'elasome.com': {
    domain: 'elasome.com',
    database: 'postgresql://postgres:postgres@116.118.49.243:13003/elasome',
    description: 'Elasome mang đến giải pháp chăm sóc toàn diện, nhẹ nhàng nhưng đạt hiệu quả tối ưu. Làn da được trị liệu và hỗ trợ quá trình phục hồi một cách đồng thời, giúp bạn cảm nhận sự cải thiện rõ rệt.',
    address: '1012-1014 Quang Trung, Phường 8, Quận Gò Vấp, TP. Hồ Chí Minh.',
    hotline: '0911754299 - 02873092585',
    email: 'info@hderma.vn',
    siteName: 'Elasome',
    siteTitle: 'Elasome - Giải pháp chăm sóc da toàn diện',
    devDomain: 'localhost',
    devPort: 3004,
  },
  'innerbright.vn': {
    domain: 'innerbright.vn',
    database: 'postgresql://postgres:postgres@116.118.49.243:13003/innerv2core',
    description: 'InnerBright Training & Coaching, Cuộc sống của Bạn là do chính Bạn tạo ra và Lập Trình Ngôn Ngữ Tư Duy - NLP (Neuro Linguistic Programming)',
    address: 'TP. Hồ Chí Minh.',
    hotline: '0908370968',
    email: 'info@innerbright.vn',
    siteName: 'InnerBright',
    siteTitle: 'InnerBright - Training & Coaching NLP',
    devDomain: 'localhost',
    devPort: 3005,
    storage: {
      type: 'minio',
      endpoint: '116.118.49.243',
      port: 12007,
      useSSL: false,
      bucketName: 'innerbright',
    },
  },
};

/**
 * Lấy cấu hình domain dựa trên hostname
 * @param hostname - Hostname từ request (có thể là production domain hoặc localhost:port)
 * @returns DomainConfig tương ứng
 */
export function getDomainConfig(hostname: string): DomainConfig {
  // Remove port nếu có
  const cleanHostname = hostname.split(':')[0];
  
  // Remove www. nếu có
  const domain = cleanHostname.replace(/^www\./, '');
  
  // Kiểm tra nếu là localhost - xác định dựa vào port
  if (domain === 'localhost' || domain === '127.0.0.1') {
    const port = hostname.split(':')[1];
    
    // Map port với domain tương ứng
    const portMap: Record<string, string> = {
      '3000': 'tazagroup.vn',
      '3001': 'tazaskinclinic.com',
      '3002': 'timona.edu.vn',
      '3003': 'hderma.vn',
      '3004': 'elasome.com',
      '3005': 'innerbright.vn',
    };
    
    const mappedDomain = port ? portMap[port] : 'tazagroup.vn';
    return DOMAIN_CONFIGS[mappedDomain] || DOMAIN_CONFIGS['tazagroup.vn'];
  }
  
  // Tìm cấu hình domain
  const config = DOMAIN_CONFIGS[domain];
  
  if (!config) {
    console.warn(`Domain ${domain} không có cấu hình, sử dụng tazagroup.vn làm mặc định`);
    return DOMAIN_CONFIGS['tazagroup.vn'];
  }
  
  return config;
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
