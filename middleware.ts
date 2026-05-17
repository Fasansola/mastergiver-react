/**
 * Next.js middleware — session guard for business dashboard routes.
 *
 * Runs on the edge before any route handler or page is executed.
 * Protects all /business/dashboard/* routes by checking for an active session.
 *
 * If there is no session, the user is redirected to /business/signin.
 *
 * Status checks (PENDING → /business/confirm, SUSPENDED → /business/suspended)
 * require a database query and are handled in the dashboard layout, which runs
 * server-side after this middleware passes the request through.
 *
 * Phase 1 routes are NOT affected — the matcher is scoped exclusively to
 * /business/dashboard/* paths.
 */

import { auth } from '@/lib/auth/auth';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// NextAuth v5 exposes the session on req.auth when auth() wraps the handler
export default auth((req: NextRequest & { auth: unknown }) => {
  const { pathname } = req.nextUrl;
  const session = req.auth as { user?: { role?: string } } | null;
  const hasSession = !!session;

  // Admin routes — must be signed in with ADMIN role
  if (pathname.startsWith('/admin')) {
    if (!hasSession || session?.user?.role !== 'ADMIN') {
      const loginUrl = new URL('/login', req.url);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Business dashboard routes — must be signed in
  if (!hasSession) {
    const signinUrl = new URL('/business/signin', req.url);
    return NextResponse.redirect(signinUrl);
  }

  // Session exists — allow through.
  // Dashboard layout handles PENDING / SUSPENDED redirects.
  return NextResponse.next();
});

export const config = {
  matcher: ['/business/dashboard/:path*', '/admin/:path*'],
};
