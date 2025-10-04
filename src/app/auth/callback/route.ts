import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

type Locale = "es" | "en";

function collapseSlashes(s: string) {
  return s.replace(/\/{2,}/g, "/");
}

function splitPathAndQuery(path: string): { p: string; q: string } {
  const i = path.indexOf("?");
  if (i === -1) return { p: path, q: "" };
  return { p: path.slice(0, i), q: path.slice(i) };
}

/**
 * Quita EXACTAMENTE un locale inicial (/es|/en) y devuelve el path sin locale.
 * No toca locales en medio del path (ej: "/producto/especial" queda igual).
 */
function stripLeadingLocale(path: string): string {
  return path.replace(/^\/(es|en)(?=\/|$)/, "");
}

/**
 * Normaliza una ruta local:
 *  - Asegura slash inicial
 *  - Colapsa dobles slashes
 *  - Quita un locale si lo trae y agrega el locale objetivo
 */
function normalizeLocalePath(pathWithQuery: string, targetLocale: Locale): string {
  if (!pathWithQuery.startsWith("/")) pathWithQuery = "/" + pathWithQuery;
  pathWithQuery = collapseSlashes(pathWithQuery);

  const { p, q } = splitPathAndQuery(pathWithQuery);
  const pathNoLocale = stripLeadingLocale(p);

  // Si la ruta “real” queda vacía o "/", vamos a la raíz del idioma
  const withLocale =
    "/" + targetLocale + (pathNoLocale === "" || pathNoLocale === "/" ? "" : pathNoLocale);

  return collapseSlashes(withLocale) + q;
}

/**
 * Convierte "next" (que puede ser relativo o absoluto) a una ruta local segura,
 * con el locale correcto para el dominio actual.
 */
function sanitizeNext(rawNext: string, reqOrigin: string, targetLocale: Locale): string {
  try {
    const req = new URL(reqOrigin);
    const u = new URL(rawNext, reqOrigin); // soporta relativo y absoluto

    // Anti open-redirect: si el origin NO coincide, ignora y manda a raíz del idioma
    if (u.origin !== req.origin) {
      return `/${targetLocale}`;
    }

    // Solo usamos pathname + search. (hash no importa para navegación SSR)
    return normalizeLocalePath(u.pathname + (u.search || ""), targetLocale);
  } catch {
    // Si no parsea, trátalo como path local
    return normalizeLocalePath(rawNext, targetLocale);
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const { searchParams, origin, hostname } = url;

  const code = searchParams.get("code");
  const rawNext = searchParams.get("next") ?? "/";

  // Determina el locale objetivo por dominio
  const targetLocale: Locale = hostname.includes("artehechoamano") ? "es" : "en";

  console.log('OAuth Callback - Starting process:', { code: !!code, rawNext, targetLocale, hostname });

  if (!code) {
    console.error('OAuth Callback - Missing code parameter');
    return NextResponse.redirect(`${origin}/${targetLocale}/login?error=code_missing`);
  }

  const supabase = createRouteHandlerClient({ cookies });

  try {
    // Intercambiar código por sesión
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("OAuth Callback - Exchange error:", error.message);
      return NextResponse.redirect(`${origin}/${targetLocale}/login?error=oauth`);
    }

    console.log('OAuth Callback - Session exchanged successfully:', { 
      userId: data.session?.user?.id,
      email: data.session?.user?.email 
    });

    // Verificar la sesión múltiples veces para asegurar persistencia
    let session = data.session;
    let attempts = 0;
    const maxAttempts = 3;

    while (!session && attempts < maxAttempts) {
      attempts++;
      console.log(`OAuth Callback - Attempt ${attempts} to get session`);
      
      // Esperar un poco antes de reintentar
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const { data: sessionData } = await supabase.auth.getSession();
      if (sessionData.session) {
        session = sessionData.session;
      }
    }

    if (!session) {
      console.error('OAuth Callback - Session not found after multiple attempts');
      return NextResponse.redirect(`${origin}/${targetLocale}/login?error=session_missing`);
    }

    // Normaliza "next" para que sea local, sin duplicar locale ni codificar de más
    const next = sanitizeNext(rawNext, origin, targetLocale);

    console.log('OAuth Callback - Redirecting to:', `${origin}${next}`);

    // Crear respuesta con headers adicionales para forzar actualización de sesión
    const response = NextResponse.redirect(`${origin}${next}`);
    
    // Agregar headers para forzar actualización de sesión en el cliente
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');
    
    return response;

  } catch (error) {
    console.error('OAuth Callback - Unexpected error:', error);
    return NextResponse.redirect(`${origin}/${targetLocale}/login?error=unexpected`);
  }
}
