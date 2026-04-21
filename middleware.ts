import { NextResponse, type NextRequest } from 'next/server';
import { getAuthUserFromRequest, updateSession } from '@/lib/db/supabase-server';

/**
 * Middleware for session refresh and route protection
 */
export async function middleware(request: NextRequest) {
  // Refresh session
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  try {
    response = await updateSession(request);
  } catch (e) {
    // Continue without session update if it fails
  }

  const { pathname } = request.nextUrl;

  const { user } = await getAuthUserFromRequest(request);
  const isAuthenticated = Boolean(user);

  // Redirect unauthenticated users trying to access protected routes
  if (!isAuthenticated && pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Redirect authenticated users trying to access auth pages
  if (isAuthenticated && (pathname === '/auth/login' || pathname === '/auth/signup')) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Redirect root to dashboard if authenticated, otherwise to login
  if (pathname === '/') {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url));
    } else {
      return NextResponse.redirect(new URL('/auth/login', request.url));
    }
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
};
