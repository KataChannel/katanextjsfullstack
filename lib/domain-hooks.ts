/**
 * Client-side hooks để sử dụng domain info trong Client Components
 * Sử dụng 'use client' directive
 */

'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

/**
 * Hook để lấy thông tin domain từ window.location (client-side only)
 * 
 * @example
 * ```tsx
 * 'use client';
 * import { useDomainInfo } from '@/lib/domain-hooks';
 * 
 * export function Header() {
 *   const { hostname, domain, port } = useDomainInfo();
 *   return <div>Running on {domain}</div>;
 * }
 * ```
 */
export function useDomainInfo() {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return {
        hostname: 'localhost:3005',
        domain: 'innerbright.vn',
        port: '3005',
      };
    }

    const hostname = window.location.hostname;
    const port = window.location.port;
    const fullHostname = port ? `${hostname}:${port}` : hostname;

    return {
      hostname: fullHostname,
      domain: 'innerbright.vn',
      port,
    };
  }, []);
}

/**
 * Hook để check xem đang ở domain nào
 */
export function useIsDomain(checkDomain: string): boolean {
  const { domain } = useDomainInfo();
  return domain === checkDomain;
}

/**
 * Hook để lấy base URL
 */
export function useBaseUrl(): string {
  return useMemo(() => {
    if (typeof window === 'undefined') {
      return 'http://localhost:3000';
    }
    return `${window.location.protocol}//${window.location.host}`;
  }, []);
}

/**
 * Hook để lấy current path
 */
export function useCurrentPath(): string {
  const pathname = usePathname();
  return pathname;
}

/**
 * Hook để build full URL
 */
export function useFullUrl(path: string = ''): string {
  const baseUrl = useBaseUrl();
  const pathname = usePathname();
  const finalPath = path || pathname;
  return `${baseUrl}${finalPath}`;
}
