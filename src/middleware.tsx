// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(req: NextRequest) {
  const { pathname, host } = req.nextUrl;
  const url = req.nextUrl.clone();
  
  // Verificar el dominio y asegurar que el idioma sea el correcto
  const isSpanishDomain = host === 'artehechoamano.com' || host.includes('artehechoamano');
  const isEnglishDomain = host === 'handmadeart.store' || host.includes('handmadeart');
  const pathLocale = pathname.startsWith('/es') ? 'es' : pathname.startsWith('/en') ? 'en' : null;

  // Redireccionar según el dominio si el idioma en la URL no coincide
  if (isSpanishDomain && pathLocale === 'en') {
    // Si estamos en dominio español pero la URL es /en, redirigir a /es con la misma ruta
    const newPath = pathname.replace(/^\/en/, '/es');
    url.pathname = newPath;
    return NextResponse.redirect(url);
  }
  
  if (isEnglishDomain && pathLocale === 'es') {
    // Si estamos en dominio inglés pero la URL es /es, redirigir a /en con la misma ruta
    const newPath = pathname.replace(/^\/es/, '/en');
    url.pathname = newPath;
    return NextResponse.redirect(url);
  }

  /* --- 1. Si es /auth → omite intl, sólo Supabase --- */
  if (pathname.startsWith("/auth")) {
    const res = NextResponse.next();
    const supabase = createMiddlewareClient({ req, res });
    await supabase.auth.getSession();
    return res;
  }

  /* --- 2. Resto del sitio → intl + Supabase --- */
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

  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  return res;
}

/* Mantén tu matcher original */
export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
