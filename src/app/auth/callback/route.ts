import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  let next = searchParams.get("next") ?? "/";

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=code_missing`);
  }

  const supabase = createRouteHandlerClient({ cookies });

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("OAuth error:", error.message);
    return NextResponse.redirect(`${origin}/login?error=oauth`);
  }

  // Asegurar que la URL de redirección tenga el locale correcto para el dominio
  if (origin.includes('artehechoamano.com') && !next.startsWith('/es')) {
    // Si estamos en el dominio español y la URL no tiene /es, agregarlo
    if (next === '/') {
      next = '/es';
    } else if (next.startsWith('/admin')) {
      next = `/es${next}`;
    } else if (!next.startsWith('/es/')) {
      next = `/es${next}`;
    }
  } else if (origin.includes('handmadeart.store') && !next.startsWith('/en')) {
    // Si estamos en el dominio inglés y la URL no tiene /en, agregarlo
    if (next === '/') {
      next = '/en';
    } else if (next.startsWith('/admin')) {
      next = `/en${next}`;
    } else if (!next.startsWith('/en/')) {
      next = `/en${next}`;
    }
  }

  return NextResponse.redirect(`${origin}${next}`);
}

