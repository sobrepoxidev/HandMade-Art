import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Link } from '@/i18n/navigation';
import { Package, ArrowRight, Users, CreditCard } from 'lucide-react';

// Lista de correos electrónicos de administradores autorizados
const AUTHORIZED_ADMINS = ['sobrepoxidev@gmail.com', 'bryamlopez4@gmail.com'];

const AdminCard = ({
  title,
  href,
  description,
  icon: Icon,
  locale
}: {
  title: string;
  href: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  locale: string;
}) => (
  <Link href={href} className="block group transition-transform hover:scale-[1.02]">
    <div className="h-full p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-500 flex flex-col">
      <div className="flex items-center mb-4">
        <div className="p-2 bg-blue-50 rounded-lg text-blue-600">
          <Icon className="w-6 h-6" />
        </div>
        <h3 className="ml-3 text-xl font-semibold text-gray-800 group-hover:text-blue-600">
          {title}
        </h3>
      </div>
      <p className="flex-grow text-gray-600">{description}</p>
      <div className="mt-4 text-blue-600 font-medium flex items-center group-hover:translate-x-1 transition-transform">
        {locale === 'es' ? 'Ir a' : 'Go to'} {title}
        <ArrowRight className="ml-1 w-4 h-4" />
      </div>
    </div>
  </Link>
);

export default async function AdminPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = createServerComponentClient({ cookies });

  const { data: { session } } = await supabase.auth.getSession();

  if (!session) {
    const returnUrl = `/${locale}/admin`;
    redirect(`/${locale}/login?returnUrl=${encodeURIComponent(returnUrl)}`);
  }

  const userEmail = session.user?.email;

  if (!userEmail || !AUTHORIZED_ADMINS.includes(userEmail)) {
    redirect(`/${locale}`);
  }
  return (
    <div className="container mx-auto px-3 py-3">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">{locale === 'es' ? 'Panel de Administración' : 'Admin Panel'}</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <AdminCard
          href={`/${locale}/admin/direct-payments`}
          title={locale === 'es' ? 'Pagos Directos' : 'Direct Payments'}
          description={locale === 'es' ? 'Administra los pagos directos de los clientes.' : 'Manage the direct payments from customers.'}
          icon={CreditCard}
          locale={locale}
        />
        <AdminCard
          href={`/${locale}/admin/quotes`}
          title={locale === 'es' ? 'Cotizaciones' : 'Quotes'}
          description={locale === 'es' ? 'Administra las cotizaciones de los clientes.' : 'Manage the quotes from customers.'}
          icon={Users}
          locale={locale}
        />
        <AdminCard
          href={`/${locale}/admin/products`}
          title={locale === 'es' ? 'Productos' : 'Products'}
          description={locale === 'es' ? 'Administra los productos de la tienda, incluyendo su información, precios y disponibilidad.' : 'Manage the products in the store, including their information, prices, and availability.'}
          icon={Package}
          locale={locale}
        />
        {/* <AdminCard
          href={`/${locale}/admin/events`}
          title={locale === 'es' ? 'Eventos' : 'Events'}
          description={locale === 'es' ? 'Gestiona los eventos y actividades programadas.' : 'Manage the events and activities scheduled.'}
          icon={Calendar}
          locale={locale}
        /> */}
      </div>
    </div>
  );

}
