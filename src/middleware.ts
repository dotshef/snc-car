import { NextResponse, type NextRequest } from 'next/server';
import { parseSessionCookie } from '@/lib/auth/session';

export function middleware(request: NextRequest) {
  const sessionCookie = request.cookies.get('admin-session');
  const hasSession = sessionCookie ? !!parseSessionCookie(sessionCookie.value) : false;

  const isLoginPage = request.nextUrl.pathname === '/admin/login';

  if (isLoginPage) {
    if (hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/admin';
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (!hasSession) {
    const url = request.nextUrl.clone();
    url.pathname = '/admin/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const runtime = 'nodejs';

export const config = {
  matcher: ['/admin/:path*'],
};
