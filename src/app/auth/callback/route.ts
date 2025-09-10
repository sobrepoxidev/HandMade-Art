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

  // Limpiar posibles duplicados en la URL de redirección
  next = next.replace(/\/[a-z]{2}\/[a-z]{2}\/?/, '');

  // Asegurar que la URL de redirección tenga el locale correcto para el dominio
  if (origin.includes('artehechoamano.com')) {
    // Para el dominio español
    if (next === '/') {
      next = '/es';
    } else if (!next.startsWith('/es/')) {
      next = `/es${next.startsWith('/') ? next : `/${next}`}`;
    }
  } else if (origin.includes('handmadeart.store')) {
    // Para el dominio inglés
    if (next === '/') {
      next = '/en';
    } else if (!next.startsWith('/en/')) {
      next = `/en${next.startsWith('/') ? next : `/${next}`}`;
    }
  }

  // Verificar la sesión antes de redirigir
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    return NextResponse.redirect(`${origin}/login?error=session_missing`);
  }

  return NextResponse.redirect(`${origin}${next}`);
}

