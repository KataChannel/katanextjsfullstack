import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

/**
 * Get restricted routes based on user role
 * Returns array of route prefixes that the role CANNOT access
 */
function getRestrictedRoutes(role: string): string[] {
  switch (role) {
    case 'admin':
      // Admin has access to everything
      return [];
    
    case 'manager':
      // Manager cannot access: users management, analytics, seo settings
      return [
        '/admin/users',
        '/admin/analytics',
        '/admin/seo-settings',
      ];
    
    case 'editor':
      // Editor can only access: content, page-builder, media
      // Cannot access: users, analytics, seo-settings
      return [
        '/admin/users',
        '/admin/analytics',
        '/admin/seo-settings',
      ];
    
    default:
      // Unknown roles cannot access anything
      return ['/admin'];
  }
}

/**
 * Proxy để xử lý multi-tenancy và authentication
 * Thêm thông tin domain vào headers và bảo vệ routes
 */
export async function proxy(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const { pathname } = request.nextUrl;
  
  // ============ AUTHENTICATION MIDDLEWARE ============
  // Get the token from the request
  const token = await getToken({ 
    req: request,
    secret: process.env.NEXTAUTH_SECRET 
  });

  // Protected admin routes
  const isAdminRoute = pathname.startsWith('/admin');
  const isAuthRoute = pathname.startsWith('/auth');
  const isUnauthorizedPage = pathname === '/auth/unauthorized';

  // Redirect to login if accessing admin without authentication
  if (isAdminRoute && !token) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(url);
  }

  // Redirect to admin if authenticated user tries to access auth pages (except unauthorized)
  if (isAuthRoute && token && !isUnauthorizedPage) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  // Check admin role for admin routes with granular permissions
  if (isAdminRoute && token) {
    const userRole = token.role as string;
    
    // Define allowed roles for admin panel
    const allowedRoles = ['admin', 'manager', 'editor'];
    
    if (!allowedRoles.includes(userRole)) {
      return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
    }
    
    // Role-based route restrictions
    const restrictedRoutes = getRestrictedRoutes(userRole);
    
    if (restrictedRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/auth/unauthorized', request.url));
    }
  }

  // ============ MULTI-TENANCY ============
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

// Cấu hình matcher cho proxy
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, etc)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
