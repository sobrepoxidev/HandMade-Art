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

  React.useEffect(() => {
    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('Auth state changed:', event, newSession?.user?.email)

        // Update session on any auth event
        setSession(newSession)

        // On sign out, clear the session
        if (event === 'SIGNED_OUT') {
          setSession(null)
        }
      }
    )

    // Get current session on mount
    const getSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (currentSession) {
        setSession(currentSession)
      }
    }

    getSession()

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
