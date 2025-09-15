// src/components/SessionLayout.tsx
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { ReactNode } from 'react';

import SupabaseProvider from '@/app/supabase-provider/provider';

interface Props {
  children: ReactNode;
}

export default async function SessionLayout({ children }: Props) {
  const supabase = createServerComponentClient({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <SupabaseProvider session={session}>
      {children}
    </SupabaseProvider>
  );
}
