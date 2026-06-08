import { ReactNode } from 'react';

import SupabaseProvider from '@/app/supabase-provider/provider';
import { createClient } from '@/utils/supabase/server';

interface Props {
  children: ReactNode;
}

export default async function SessionLayout({ children }: Props) {
  const supabase = await createClient();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  return (
    <SupabaseProvider session={session}>
      {children}
    </SupabaseProvider>
  );
}
