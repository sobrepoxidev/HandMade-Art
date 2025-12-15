"use client"

import React from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Session, SupabaseClient } from '@supabase/supabase-js'

type SupabaseContextProps = {
  supabase: SupabaseClient
  session: Session | null
}

const Context = React.createContext<SupabaseContextProps | undefined>(undefined)

export default function SupabaseProvider({
  children,
  session: initialSession,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  const [supabase] = React.useState(() =>
    createClientComponentClient()
  )
  
  const [session, setSession] = React.useState<Session | null>(initialSession)

  // Escuchar cambios de autenticación y actualizar la sesión en el contexto
  // IMPORTANT: Do NOT include `session` in dependencies to avoid infinite loops
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, newSession) => {
        console.log('SupabaseProvider: Auth state changed', event, newSession?.user?.email)
        setSession(newSession)
      }
    )

    // Obtener la sesión actual al montar
    const getCurrentSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (currentSession) {
        console.log('SupabaseProvider: Initial session found', currentSession.user?.email)
        setSession(currentSession)
      }
    }

    getCurrentSession()

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  return (
    <Context.Provider value={{ supabase, session }}>
      {children}
    </Context.Provider>
  )
}

// Hook para usar el contexto
export const useSupabase = () => {
  const context = React.useContext(Context)
  if (!context) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }
  return context
}