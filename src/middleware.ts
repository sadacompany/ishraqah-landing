import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip tracking for API routes, static files, and admin pages
  if (
    pathname.startsWith('/api/') ||
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/admin') ||
    pathname.includes('.') // static files
  ) {
    return NextResponse.next();
  }

  // Track page view asynchronously (fire and forget)
  const trackUrl = new URL('/api/analytics/track', request.url);
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  // Forward client IP headers
  const forwarded = request.headers.get('x-forwarded-for');
  if (forwarded) headers['x-forwarded-for'] = forwarded;
  const realIp = request.headers.get('x-real-ip');
  if (realIp) headers['x-real-ip'] = realIp;
  const userAgent = request.headers.get('user-agent');
  if (userAgent) headers['user-agent'] = userAgent;

  try {
    fetch(trackUrl.toString(), {
      method: 'POST',
      headers,
      body: JSON.stringify({
        path: pathname,
        referrer: request.headers.get('referer') || '',
        sessionId: '',
      }),
    }).catch(() => {});
  } catch {
    // Best-effort tracking
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
