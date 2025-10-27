import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import QuotesManagement from '@/components/admin/QuotesManagement';

// Lista de correos electrónicos de administradores autorizados
const AUTHORIZED_ADMINS = ['sobrepoxidev@gmail.com', 'bryamlopez4@gmail.com'];

export default async function AdminQuotesPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = createServerComponentClient({ cookies });
  
  // const { data: { session } } = await supabase.auth.getSession();
  
  // if (!session) {
  //   const returnUrl = `/${locale}/admin/quotes`;
  //   redirect(`/${locale}/login?returnUrl=${returnUrl}`);
  // }
  
  // const userEmail = session.user?.email;
  
  // if (!userEmail || !AUTHORIZED_ADMINS.includes(userEmail)) {
  //   redirect(`/${locale}`);
  // }
  
  return <QuotesManagement locale={locale} />;
}