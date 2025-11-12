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
        hostname: 'localhost:3000',
        domain: 'tazagroup.vn',
        port: '3000',
      };
    }

    const hostname = window.location.hostname;
    const port = window.location.port;
    const fullHostname = port ? `${hostname}:${port}` : hostname;

    // Map localhost:port to actual domain
    const portToDomain: Record<string, string> = {
      '3000': 'tazagroup.vn',
      '3001': 'tazaskinclinic.com',
      '3002': 'timona.edu.vn',
      '3003': 'hderma.vn',
      '3004': 'elasome.com',
    };

    let actualDomain = hostname;
    if (hostname === 'localhost' && port) {
      actualDomain = portToDomain[port] || 'tazagroup.vn';
    }

    return {
      hostname: fullHostname,
      domain: actualDomain.replace(/^www\./, ''),
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
