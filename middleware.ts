import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware để xử lý multi-tenancy
 * Thêm thông tin domain vào headers để sử dụng trong app
 */
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  
  // Lấy domain từ hostname
  const domain = extractDomainFromHostname(hostname);
  
  // Clone headers và thêm domain info
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-domain', domain);
  requestHeaders.set('x-hostname', hostname);
  
  // Tạo response với headers mới
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
  
  // Thêm security headers
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  
  return response;
}

/**
 * Lấy domain từ hostname
 */
function extractDomainFromHostname(hostname: string): string {
  // Loại bỏ port nếu có
  const withoutPort = hostname.split(':')[0];
  
  // Loại bỏ www. nếu có
  const withoutWww = withoutPort.replace(/^www\./, '');
  
  // Xử lý localhost
  if (withoutWww.includes('localhost') || withoutWww.includes('127.0.0.1')) {
    return 'tazagroup.vn'; // Mặc định cho development
  }
  
  return withoutWww;
}

// Cấu hình matcher cho middleware
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
