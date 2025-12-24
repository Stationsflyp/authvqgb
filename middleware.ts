import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  const verified = request.cookies.get('cloudflare_verify')?.value

  if (!verified && pathname !== '/verify' && !pathname.startsWith('/api/')) {
    const url = request.nextUrl.clone()
    url.pathname = '/verify'
    url.searchParams.set('redirect', pathname)
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
