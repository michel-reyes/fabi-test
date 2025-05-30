import { NextResponse, type NextRequest } from 'next/server';

/**
 * Middleware function that handles CORS and other request preprocessing
 * 
 * @param request The incoming request
 * @returns Response with appropriate headers or the original request
 */
export function middleware(request: NextRequest): NextResponse {
  // Handle CORS preflight requests
  if (request.method === 'OPTIONS') {
    return NextResponse.json({}, { 
      status: 200,
      headers: {
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Max-Age': '86400' // 24 hours
      }
    });
  }

  // Add CORS headers to all responses
  const response = NextResponse.next();
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  return response;
}

/**
 * Configure which paths this middleware runs on
 */
export const config = {
  matcher: '/api/:path*',
};
