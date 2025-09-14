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
  session,
}: {
  children: React.ReactNode
  session: Session | null
}) {
  const [supabase] = React.useState(() =>
    createClientComponentClient()
  )

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