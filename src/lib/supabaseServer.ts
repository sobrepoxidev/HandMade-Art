// src/lib/supabaseServer.ts
import { createClient } from '@supabase/supabase-js'

// Cliente de Supabase para operaciones del servidor con service role
// Bypasea RLS y tiene permisos completos
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)