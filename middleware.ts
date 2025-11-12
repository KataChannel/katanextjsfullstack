import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getDomainConfig } from './lib/domain-config';

/**
 * Middleware để detect domain và set headers
 * Hỗ trợ multi-domain cho cả development và production
 */
export function middleware(request: NextRequest) {
  // Lấy hostname từ request
  const hostname = request.headers.get('host') || 'localhost:3000';
  
  // Lấy cấu hình domain
  const config = getDomainConfig(hostname);
  
  // Clone request headers
  const requestHeaders = new Headers(request.headers);
  
  // Set domain info vào headers để sử dụng trong app
  requestHeaders.set('x-hostname', hostname);
  requestHeaders.set('x-domain', config.domain);
  requestHeaders.set('x-site-name', config.siteName);
  
  // Log trong development
  if (process.env.NODE_ENV === 'development') {
    console.log(`[Middleware] Hostname: ${hostname} -> Domain: ${config.domain}`);
  }
  
  // Tạo response với headers đã update
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // Set response headers cho SEO và security
  response.headers.set('x-domain', config.domain);
  response.headers.set('x-powered-by', config.siteName);
  
  return response;
}

/**
 * Cấu hình matcher - áp dụng middleware cho các routes
 * Exclude static files, images, và API routes không cần domain detection
 */
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder files
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2)$).*)',
  ],
};
