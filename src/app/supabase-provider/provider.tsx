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
  React.useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('SupabaseProvider: Auth state changed', event, session?.user?.email)
        setSession(session)
        
        // Si es un evento de SIGNED_IN, forzar una verificación adicional
        if (event === 'SIGNED_IN' && session) {
          console.log('SupabaseProvider: User signed in, forcing session refresh')
          // Pequeño delay para asegurar que la sesión se propague
          setTimeout(() => {
            supabase.auth.getSession().then(({ data: { session: refreshedSession } }) => {
              if (refreshedSession && refreshedSession.user?.id === session.user?.id) {
                console.log('SupabaseProvider: Session refreshed after sign in')
                setSession(refreshedSession)
              }
            })
          }, 500)
        }
      }
    )

    // Obtener la sesión actual al montar
    const getCurrentSession = async () => {
      const { data: { session: currentSession } } = await supabase.auth.getSession()
      if (currentSession && currentSession !== session) {
        console.log('SupabaseProvider: Initial session found', currentSession.user?.email)
        setSession(currentSession)
      }
    }

    getCurrentSession()

    // Verificación adicional después del OAuth redirect
    // Detectar si venimos de un OAuth redirect
    const urlParams = new URLSearchParams(window.location.search)
    const hasOAuthParams = urlParams.has('code') || window.location.pathname.includes('/auth/callback')
    
    if (hasOAuthParams || window.location.hash.includes('access_token')) {
      console.log('SupabaseProvider: OAuth redirect detected, forcing session check')
      // Verificación más agresiva después de OAuth
      const checkSessionAfterOAuth = async () => {
        let attempts = 0
        const maxAttempts = 5
        
        while (attempts < maxAttempts) {
          attempts++
          await new Promise(resolve => setTimeout(resolve, 200 * attempts)) // Backoff exponencial
          
          const { data: { session: oauthSession } } = await supabase.auth.getSession()
          if (oauthSession) {
            console.log(`SupabaseProvider: OAuth session found on attempt ${attempts}`, oauthSession.user?.email)
            setSession(oauthSession)
            break
          }
          
          console.log(`SupabaseProvider: OAuth session check attempt ${attempts} failed`)
        }
      }
      
      checkSessionAfterOAuth()
    }

    // Listener para detectar cuando la página regresa del OAuth
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        console.log('SupabaseProvider: Page became visible, checking session')
        supabase.auth.getSession().then(({ data: { session: visibleSession } }) => {
          if (visibleSession && (!session || visibleSession.user?.id !== session.user?.id)) {
            console.log('SupabaseProvider: New session detected on visibility change', visibleSession.user?.email)
            setSession(visibleSession)
          }
        })
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      subscription.unsubscribe()
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [supabase, session])

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