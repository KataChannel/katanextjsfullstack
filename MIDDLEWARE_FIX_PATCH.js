// Quick patch for middleware - add cookieName to getToken
// This will be applied directly on server

// Lines to add after line 47 in middleware compiled code:
const cookieName = process.env.NODE_ENV === 'production' 
  ? '__Secure-next-auth.session-token'
  : 'next-auth.session-token';

const token = await getToken({ 
  req: request,
  secret: process.env.NEXTAUTH_SECRET,
  cookieName: cookieName,  // <-- This is the fix!
});

// Instead of just:
const token = await getToken({ 
  req: request,
  secret: process.env.NEXTAUTH_SECRET 
});
