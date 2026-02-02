/**
 * Server-side utilities để lấy domain config trong Server Components và Server Actions
 */

import { headers } from 'next/headers';
import { getDomainConfig, type DomainConfig } from './domain-config';

/**
 * Lấy domain config hiện tại trong Server Components
 * Sử dụng trong async server components
 * 
 * @example
 * ```tsx
 * import { getCurrentDomainConfig } from '@/lib/domain-helpers';
 * 
 * export default async function Page() {
 *   const config = await getCurrentDomainConfig();
 *   return <h1>{config.siteName}</h1>;
 * }
 * ```
 */
export async function getCurrentDomainConfig(): Promise<DomainConfig> {
  const headersList = await headers();
  const hostname = headersList.get('x-hostname') || headersList.get('host') || 'localhost:3000';
  return getDomainConfig(hostname);
}

/**
 * Lấy hostname hiện tại
 */
export async function getCurrentHostname(): Promise<string> {
  const headersList = await headers();
  return headersList.get('x-hostname') || headersList.get('host') || 'localhost:3000';
}

/**
 * Lấy domain hiện tại (không có www, không có port)
 */
export async function getCurrentDomain(): Promise<string> {
  const headersList = await headers();
  return headersList.get('x-domain') || 'innerbright.vn';
}

/**
 * Lấy site name hiện tại
 */
export async function getCurrentSiteName(): Promise<string> {
  const headersList = await headers();
  return headersList.get('x-site-name') || 'InnerBright';
}

/**
 * Check xem có phải domain cụ thể không
 */
export async function isDomain(checkDomain: string): Promise<boolean> {
  const domain = await getCurrentDomain();
  return domain === checkDomain;
}

/**
 * Lấy contact info cho domain hiện tại
 */
export async function getContactInfo() {
  const config = await getCurrentDomainConfig();
  return {
    address: config.address,
    hotline: config.hotline,
    email: config.email,
  };
}

/**
 * Lấy SEO metadata cho domain hiện tại
 */
export async function getSEOMetadata() {
  const config = await getCurrentDomainConfig();
  return {
    siteName: config.siteName,
    title: config.siteTitle,
    description: config.description,
  };
}
