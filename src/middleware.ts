import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options as CookieOptions)
          )
        },
      },
    }
  )

  // IMPORTANT: Do NOT run code between createServerClient and
  // supabase.auth.getUser(). A simple mistake could make it very hard to debug
  // issues with users being randomly logged out.

  // Refreshes the auth token if expired
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // If user is not logged in and trying to access protected routes, redirect to login
  const protectedPaths = ['/checkout', '/account', '/orders', '/profile']
  const isProtectedPath = protectedPaths.some(path =>
    request.nextUrl.pathname.includes(path)
  )

  if (!user && isProtectedPath) {
    const url = request.nextUrl.clone()
    const returnUrl = encodeURIComponent(request.nextUrl.pathname + request.nextUrl.search)

    // Detect locale from pathname
    const locale = request.nextUrl.pathname.startsWith('/es') ? 'es' : 'en'
    url.pathname = `/${locale}/login`
    url.searchParams.set('returnUrl', returnUrl)

    return NextResponse.redirect(url)
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     * - api routes that don't need auth
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
