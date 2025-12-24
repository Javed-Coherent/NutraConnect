import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Get the token from the cookie (works in Edge Runtime without Prisma)
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET
  })

  const isLoggedIn = !!token

  // Define route types
  const protectedRoutes = ['/dashboard']
  const authRoutes = ['/auth/login', '/auth/signup']
  const verifyRoutes = ['/auth/verify-email', '/auth/verify-phone']

  // Check route type
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route))
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route))
  const isVerifyRoute = verifyRoutes.some(route => pathname.startsWith(route))

  // Redirect unauthenticated users from protected routes to login
  if (isProtectedRoute && !isLoggedIn) {
    const loginUrl = new URL('/auth/login', request.nextUrl.origin)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // NOTE: Email verification check moved to dashboard layout (server component)
  // This is because middleware reads JWT cookie directly without running callbacks,
  // so it can't see fresh emailVerified status from database after verification.

  // Allow access to verify routes for logged-in users
  if (isVerifyRoute && isLoggedIn) {
    return NextResponse.next()
  }

  // Redirect authenticated users from auth routes to home
  if (isAuthRoute && isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.nextUrl.origin))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    // Match dashboard and all subroutes
    '/dashboard/:path*',
    // Match auth routes
    '/auth/login',
    '/auth/signup',
    // Match verify routes
    '/auth/verify-email',
    '/auth/verify-phone',
  ]
}
