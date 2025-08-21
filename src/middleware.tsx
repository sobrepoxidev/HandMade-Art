// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import createIntlMiddleware from "next-intl/middleware";
import { createMiddlewareClient } from "@supabase/auth-helpers-nextjs";
import { routing } from "./i18n/routing";

const intlMiddleware = createIntlMiddleware(routing);

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

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
  for (const [k, v] of intlRes.headers) if (!res.headers.has(k)) res.headers.set(k, v);

  const supabase = createMiddlewareClient({ req, res });
  await supabase.auth.getSession();
  return res;
}

/* Mantén tu matcher original */
export const config = {
  matcher: "/((?!api|trpc|_next|_vercel|.*\\..*).*)",
};
