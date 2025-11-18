import { getToken } from 'next-auth/jwt';

// Test JWT token decoding
async function testToken() {
  console.log('Testing JWT token...');
  console.log('NEXTAUTH_SECRET:', process.env.NEXTAUTH_SECRET?.substring(0, 10) + '...');
  console.log('NEXTAUTH_URL:', process.env.NEXTAUTH_URL);
  
  // This would need actual cookie value to test
  // Run this on server with actual request
}

testToken();
