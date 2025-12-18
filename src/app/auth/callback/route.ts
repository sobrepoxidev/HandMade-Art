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

function stripLeadingLocale(path: string): string {
  return path.replace(/^\/(es|en)(?=\/|$)/, "");
}

function normalizeLocalePath(pathWithQuery: string, targetLocale: Locale): string {
  if (!pathWithQuery.startsWith("/")) pathWithQuery = "/" + pathWithQuery;
  pathWithQuery = collapseSlashes(pathWithQuery);

  const { p, q } = splitPathAndQuery(pathWithQuery);
  const pathNoLocale = stripLeadingLocale(p);

  const withLocale =
    "/" + targetLocale + (pathNoLocale === "" || pathNoLocale === "/" ? "" : pathNoLocale);

  return collapseSlashes(withLocale) + q;
}

function sanitizeNext(rawNext: string, reqOrigin: string, targetLocale: Locale): string {
  try {
    const req = new URL(reqOrigin);
    const u = new URL(rawNext, reqOrigin);

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

  const targetLocale: Locale = hostname.includes("artehechoamano") ? "es" : "en";

  console.log('OAuth Callback - Starting:', { code: !!code, rawNext, targetLocale });

  if (!code) {
    console.error('OAuth Callback - Missing code');
    return NextResponse.redirect(`${origin}/${targetLocale}/login?error=code_missing`);
  }

  const cookieStore = await cookies();

  // Collect cookies to set on the response
  const cookiesToSet: { name: string; value: string; options: CookieOptions }[] = [];

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookies: { name: string; value: string; options?: CookieOptions }[]) {
          cookies.forEach(({ name, value, options }) => {
            // Store for later - we'll set them on the redirect response
            cookiesToSet.push({ name, value, options: options || {} });
            // Also try to set on cookieStore
            try {
              cookieStore.set(name, value, options as CookieOptions);
            } catch {
              // Ignore - we'll set on redirect response
            }
          });
        },
      },
    }
  );

  try {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      console.error("OAuth Callback - Exchange error:", error.message);
      return NextResponse.redirect(`${origin}/${targetLocale}/login?error=oauth`);
    }

    console.log('OAuth Callback - Session created:', {
      userId: data.session?.user?.id,
      email: data.session?.user?.email
    });

    if (!data.session) {
      console.error('OAuth Callback - No session');
      return NextResponse.redirect(`${origin}/${targetLocale}/login?error=session_missing`);
    }

    const next = sanitizeNext(rawNext, origin, targetLocale);
    console.log('OAuth Callback - Redirecting to:', `${origin}${next}`);

    // Create redirect response and SET THE COOKIES on it
    const response = NextResponse.redirect(`${origin}${next}`);

    // Apply all collected cookies to the redirect response
    cookiesToSet.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });

    // Prevent caching
    response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
    response.headers.set('Pragma', 'no-cache');
    response.headers.set('Expires', '0');

    return response;

  } catch (error) {
    console.error('OAuth Callback - Error:', error);
    return NextResponse.redirect(`${origin}/${targetLocale}/login?error=unexpected`);
  }
}
