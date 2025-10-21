import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const protectedRoutes = ['/predictions'];
const authRoutes = ['/login'];

const secret = new TextEncoder().encode(process.env.AUTH_SECRET);

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtectedRoute = protectedRoutes.some(route => path.startsWith(route));
  const isAuthRoute = authRoutes.includes(path);

  // Get session token
  const token = request.cookies.get('session')?.value;
  
  let session = null;
  if (token) {
    try {
      const verified = await jwtVerify(token, secret);
      session = verified.payload;
    } catch (error) {
      // Invalid token, treat as no session
      session = null;
    }
  }

  // Redirect to login if accessing protected route without session
  if (isProtectedRoute && !session) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Redirect to home if accessing login while already logged in
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};