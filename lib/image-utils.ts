/**
 * Image URL utilities for InnerBright domain
 * Handles conversion between production MinIO URLs and local proxy URLs
 */

// Production MinIO servers
const MINIO_SERVERS = [
  'https://116.118.48.208:9000',
  'http://116.118.48.208:9000',
  'https://116.118.49.243:12007',
  'http://116.118.49.243:12007',
];

/**
 * Convert production MinIO URL to local proxy URL for development
 * @param url - Original image URL from data
 * @returns Proxy URL that works in both dev and production
 * 
 * Examples:
 * - https://116.118.48.208:9000/innerbright/image.webp 
 *   → /api/minio-proxy/innerbright/image.webp
 * 
 * - /api/minio-proxy/innerbright/image.webp 
 *   → /api/minio-proxy/innerbright/image.webp (unchanged)
 */
export function getImageUrl(url: string): string {
  // Return empty string or fallback if url is invalid
  if (!url || typeof url !== 'string') {
    return '';
  }

  // If already a proxy URL, return as-is
  if (url.startsWith('/api/minio-proxy/')) {
    return url;
  }

  // If relative URL, return as-is
  if (url.startsWith('/') && !url.startsWith('//')) {
    return url;
  }

  // Handle URLs with domain (e.g., https://innerbright.vn/api/minio-proxy/...)
  // Extract just the path part
  if (url.includes('/api/minio-proxy/')) {
    const match = url.match(/\/api\/minio-proxy\/.*$/);
    if (match) {
      return match[0];
    }
  }

  // Convert production MinIO URL to proxy URL
  for (const server of MINIO_SERVERS) {
    if (url.startsWith(server)) {
      // Extract path after server (e.g., /innerbright/image.webp)
      const path = url.substring(server.length);
      return `/api/minio-proxy${path}`;
    }
  }

  // For external URLs or unrecognized formats, return as-is
  return url;
}

/**
 * Convert multiple image URLs (useful for data transformation)
 */
export function getImageUrls(urls: string[]): string[] {
  return urls.map(getImageUrl);
}

/**
 * Check if URL is a MinIO production URL
 */
export function isMinioUrl(url: string): boolean {
  return MINIO_SERVERS.some(server => url.startsWith(server));
}

/**
 * Get the MinIO proxy path from a full URL
 * Returns null if not a MinIO URL
 */
export function getMinioProxyPath(url: string): string | null {
  for (const server of MINIO_SERVERS) {
    if (url.startsWith(server)) {
      return url.substring(server.length);
    }
  }
  return null;
}
