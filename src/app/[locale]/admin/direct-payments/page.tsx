import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import DirectPaymentManagement from '@/components/admin/DirectPaymentManagement';

// Lista de correos autorizados para acceder a la sección de admin
const ADMIN_EMAILS = [
  'sobrepoxidev@gmail.com',
  'bryamguzman@gmail.com',
  'admin@example.com'
];


export default async function AdminDirectPaymentsPage({ params }: {  params: Promise<{ locale: string }>; }) {
  const { locale } = await params;

  // const supabase = createServerComponentClient({ cookies });
  // const { data: { session } } = await supabase.auth.getSession();
  
  // // Si no hay sesión o el correo no está en la lista de administradores, redirigir
  // if (!session || !ADMIN_EMAILS.includes(session.user.email || '')) {
  //   redirect(`/${locale}`);
  // }
  
  return (
    <DirectPaymentManagement locale={locale} />
  );
}