import { NextRequest, NextResponse } from 'next/server'

const publicRoutes = ['/login', '/register']
const protectedRoutes = ['/dashboard']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const hasRefreshToken = request.cookies.get('refreshToken')

  if (publicRoutes.includes(pathname) && hasRefreshToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  } else if (protectedRoutes.includes(pathname) && !hasRefreshToken) {
    return NextResponse.redirect(new URL('/login', request.url))
  } else {
    return NextResponse.next()
  }
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
