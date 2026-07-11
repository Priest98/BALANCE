import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect all /admin/* routes (except /admin/login)
  if (path.startsWith('/admin') && !path.startsWith('/admin/login')) {
    const adminKey = request.cookies.get('admin_key')?.value;
    const expectedKey = process.env.ADMIN_SECRET_KEY;

    if (!expectedKey || adminKey !== expectedKey) {
      const loginUrl = new URL('/admin/login', request.url);
      loginUrl.searchParams.set('from', path);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
