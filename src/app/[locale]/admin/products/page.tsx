import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import AdminDashboard from '@/components/admin/AdminDashboard';

// Lista de correos electrónicos de administradores autorizados
const AUTHORIZED_ADMINS = ['sobrepoxidev@gmail.com', 'bryamlopez4@gmail.com'];



export default async function AdminProductsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    const returnUrl = `/${locale}/admin/products`;
    redirect(`/${locale}/login?returnUrl=${returnUrl}`);
  }
  
  const userEmail = session.user?.email;
  
  if (!userEmail || !AUTHORIZED_ADMINS.includes(userEmail)) {
    redirect(`/${locale}`);
  }
  
  return <AdminDashboard locale={locale} />;
}
