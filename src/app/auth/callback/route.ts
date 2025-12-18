import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerClient, type CookieOptions } from "@supabase/ssr";

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
 */
function stripLeadingLocale(path: string): string {
  return path.replace(/^\/(es|en)(?=\/|$)/, "");
}

/**
 * Normaliza una ruta local con el locale objetivo
 */
function normalizeLocalePath(pathWithQuery: string, targetLocale: Locale): string {
  if (!pathWithQuery.startsWith("/")) pathWithQuery = "/" + pathWithQuery;
  pathWithQuery = collapseSlashes(pathWithQuery);

  const { p, q } = splitPathAndQuery(pathWithQuery);
  const pathNoLocale = stripLeadingLocale(p);

  const withLocale =
    "/" + targetLocale + (pathNoLocale === "" || pathNoLocale === "/" ? "" : pathNoLocale);

  return collapseSlashes(withLocale) + q;
}

/**
 * Convierte "next" a una ruta local segura con el locale correcto
 */
function sanitizeNext(rawNext: string, reqOrigin: string, targetLocale: Locale): string {
  try {
    const req = new URL(reqOrigin);
    const u = new URL(rawNext, reqOrigin);

    // Anti open-redirect
    if (u.origin !== req.origin) {
      return `/${targetLocale}`;
    }

    return normalizeLocalePath(u.pathname + (u.search || ""), targetLocale);
  } catch {
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

  const cookieStore = await cookies();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options?: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options as CookieOptions)
            );
          } catch {
            // Ignore errors from Server Component context
          }
        },
      },
    }
  );

  try {
    // Exchange code for session
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("OAuth Callback - Exchange error:", error.message);
      return NextResponse.redirect(`${origin}/${targetLocale}/login?error=oauth`);
    }

    console.log('OAuth Callback - Session exchanged successfully:', {
      userId: data.session?.user?.id,
      email: data.session?.user?.email
    });

    if (!data.session) {
      console.error('OAuth Callback - No session returned');
      return NextResponse.redirect(`${origin}/${targetLocale}/login?error=session_missing`);
    }

    // Normalize the return URL
    const next = sanitizeNext(rawNext, origin, targetLocale);

    console.log('OAuth Callback - Redirecting to:', `${origin}${next}`);

    // Create response with cache headers to prevent stale session
    const response = NextResponse.redirect(`${origin}${next}`);
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (error) {
    console.error('OAuth Callback - Unexpected error:', error);
    return NextResponse.redirect(`${origin}/${targetLocale}/login?error=unexpected`);
  }
}
