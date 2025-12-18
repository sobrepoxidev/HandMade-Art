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
    // Get current session immediately on mount
    const initSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (currentSession) {
        console.log('SupabaseProvider: Found session on mount:', currentSession.user?.email)
        setSession(currentSession)
      }
    }

    initSession()

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, newSession) => {
        console.log('SupabaseProvider: Auth event:', event, newSession?.user?.email)

        if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
          setSession(newSession)
        } else if (event === 'SIGNED_OUT') {
          setSession(null)
        } else if (event === 'INITIAL_SESSION') {
          // This fires when the page loads and there's an existing session
          if (newSession) {
            setSession(newSession)
          }
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  // Also update when initialSession prop changes (server-side session)
  React.useEffect(() => {
    if (initialSession && !session) {
      setSession(initialSession)
    }
  }, [initialSession, session])

  return (
    <Context.Provider value={{ supabase, session }}>
      {children}
    </Context.Provider>
  )
}

export const useSupabase = () => {
  const context = React.useContext(Context)
  if (!context) {
    throw new Error('useSupabase must be used inside SupabaseProvider')
  }
  return context
}
