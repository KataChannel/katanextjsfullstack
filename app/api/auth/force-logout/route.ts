import { NextResponse } from 'next/server';

/**
 * Force logout endpoint - clears all auth cookies
 * Use this to invalidate current session when JWT needs refresh
 */
export async function GET() {
  const response = NextResponse.json({ 
    message: 'Logged out successfully',
    instructions: 'Please login again'
  });
  
  // Clear all NextAuth cookies
  const cookieOptions = {
    path: '/',
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax' as const,
  };
  
  response.cookies.set('next-auth.session-token', '', cookieOptions);
  response.cookies.set('__Secure-next-auth.session-token', '', cookieOptions);
  response.cookies.set('next-auth.csrf-token', '', cookieOptions);
  response.cookies.set('__Host-next-auth.csrf-token', '', cookieOptions);
  
  return response;
}
