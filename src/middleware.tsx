// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

// Paths that actually need a live Supabase session in the middleware
// (auth-gated or user-specific). Everything else is public and cacheable,
// so skip the extra getSession() round-trip (a network call per request)
// for it — it was previously running on every single request, including
// static/product/category pages that never read the session.
const PRIVATE_PATH_SEGMENTS = [
  "account",
  "admin",
  "checkout",
  "auth",
  "quote",
  "direct-quote",
  "pay",
  "cart",
  "viewed-history",
  "login",
  "register",
  "order-confirmation",
];

function isPrivatePath(pathname: string): boolean {
  // Strip an optional leading locale segment ("/es" or "/en") before matching.
  const withoutLocale = pathname.replace(/^\/(es|en)(?=\/|$)/, "") || "/";
  return PRIVATE_PATH_SEGMENTS.some(
    (segment) =>
      withoutLocale === `/${segment}` || withoutLocale.startsWith(`/${segment}/`)
  );
}

function createSupabaseMiddlewareClient(req: NextRequest, res: NextResponse) {
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options);
          });
        },
      },
    }
  );
}

export async function middleware(req: NextRequest) {
  const { pathname, host } = req.nextUrl;
  const url = req.nextUrl.clone();
  const userAgent = req.headers.get('user-agent') || '';
  
  // Detectar si la solicitud viene de WhatsApp
  const isWhatsAppRequest = userAgent.toLowerCase().includes('whatsapp');
  
  // Si es WhatsApp, mostrar la página de vista previa
  if (isWhatsAppRequest) {
    // Preservar el dominio original y la ruta en la URL de vista previa
    url.pathname = '/whatsapp-preview.html';
    // Agregar el dominio original y la ruta como parámetros de consulta
    url.searchParams.set('domain', host);
    url.searchParams.set('path', pathname);
    return NextResponse.rewrite(url);
  }
  
  // Verificar el dominio y asegurar que el idioma sea el correcto
  const isSpanishDomain = host === 'artehechoamano.com' || host.includes('artehechoamano');
  const isEnglishDomain = host === 'handmadeart.store' || host.includes('handmadeart');
  const pathLocale = pathname.startsWith('/es') ? 'es' : pathname.startsWith('/en') ? 'en' : null;

  // www → apex: keep the path/host so the rest of the pipeline still
  // resolves correctly on the canonical hostname.
  if (host.startsWith('www.')) {
    const apex = host.slice(4);
    url.host = apex;
    url.hostname = apex;
    return NextResponse.redirect(url, 301);
  }

  // Redireccionar según el dominio si el idioma en la URL no coincide.
  // 308 (permanente): la asociación dominio↔locale es fija, no un estado
  // temporal, así que el equity de crawl/SEO debe consolidarse en la URL
  // correcta en vez de tratarse como un redirect transitorio.
  if (isSpanishDomain && pathLocale === 'en') {
    // Si estamos en dominio español pero la URL es /en, redirigir a /es con la misma ruta
    const newPath = pathname.replace(/^\/en/, '/es');
    url.pathname = newPath;
    return NextResponse.redirect(url, 308);
  }

  if (isEnglishDomain && pathLocale === 'es') {
    // Si estamos en dominio inglés pero la URL es /es, redirigir a /en con la misma ruta
    const newPath = pathname.replace(/^\/es/, '/en');
    url.pathname = newPath;
    return NextResponse.redirect(url, 308);
  }

  /* --- 1. Si es /auth → omite intl, sólo Supabase --- */
  if (pathname.startsWith("/auth")) {
    const res = NextResponse.next();
    const supabase = createSupabaseMiddlewareClient(req, res);
    await supabase.auth.getSession();
    return res;
  }

  /* --- 2. Resto del sitio → intl (+ Supabase solo en rutas privadas) --- */
  const intlRes = intlMiddleware(req);
  // Create response with the correct status code from the start
  const res = NextResponse.next({
    request: { headers: intlRes.headers },
    status: intlRes.status
  });

  // Copy headers (redirect/location) from next-intl
  res.headers.set("x-middleware-next-intl", "processed");
  // Agregar pathname para que esté disponible en componentes del servidor
  res.headers.set("x-pathname", pathname);
  // Agregar el host para que esté disponible en componentes del servidor
  res.headers.set("x-host", host);
  for (const [k, v] of intlRes.headers) if (!res.headers.has(k)) res.headers.set(k, v);

  // Public, cacheable pages (home, products, categories, guides, product
  // detail, static content, etc.) never read the Supabase session, so skip
  // the getSession() call for them — only auth-gated or user-specific
  // paths need it here.
  if (isPrivatePath(pathname)) {
    const supabase = createSupabaseMiddlewareClient(req, res);
    await supabase.auth.getSession();
  }

  return res;
}

/* Mantén tu matcher original */
export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
