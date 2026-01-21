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
 * - /innerbright/image.webp 
 *   → /innerbright/image.webp
 * 
 * - /innerbright/image.webp 
 *   → /innerbright/image.webp (unchanged)
 */
export function getImageUrl(url: string): string {
  // Return empty string or fallback if url is invalid
  if (!url || typeof url !== 'string') {
    return '';
  }

  // If starts with /innerbright/, return as-is (this is our target)
  if (url.startsWith('/innerbright/')) {
    return url;
  }

  // If it's a legacy proxy URL, convert to direct public path
  if (url.startsWith('/api/minio-proxy/innerbright/')) {
    return url.replace('/api/minio-proxy/innerbright/', '/innerbright/');
  }

  // If relative URL starting with /, return as-is
  if (url.startsWith('/') && !url.startsWith('//')) {
    return url;
  }

  // Handle URLs with domain (e.g., https://innerbright.vn/api/minio-proxy/innerbright/...)
  if (url.includes('/api/minio-proxy/innerbright/')) {
    const match = url.match(/\/api\/minio-proxy\/innerbright\/.*$/);
    if (match) {
      return match[0].replace('/api/minio-proxy/innerbright/', '/innerbright/');
    }
  }

  // Convert production MinIO URL to direct public path
  for (const server of MINIO_SERVERS) {
    if (url.startsWith(server)) {
      // Extract path after server (e.g., /innerbright/image.webp)
      const path = url.substring(server.length);
      if (path.startsWith('/innerbright/')) {
        return path;
      }
      // Fallback if it's some other bucket? For now assuming innerbright
      return path;
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
