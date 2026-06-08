import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import  Link  from 'next/link';
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
  icon: React.ComponentType<{ className?: string; strokeWidth?: number }>;
  locale: string;
}) => (
  <Link href={href} className="group block h-full">
    <div className="flex h-full flex-col border border-[#E8E4E0] bg-[#F5F1EB] p-5 transition-[border-color,box-shadow,transform] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 hover:border-[#C9A962]/45 hover:shadow-[0_8px_24px_-12px_rgba(61,46,32,0.22)]">
      <div className="mb-4 flex items-center gap-3">
        <div className="grid h-11 w-11 place-items-center border border-[#E8E4E0] bg-[#FAF6EF] text-[#A08848]">
          <Icon className="h-5 w-5" strokeWidth={1.5} />
        </div>
        <h2 className="font-display text-2xl font-medium text-[#2D2D2D]">
          {title}
        </h2>
      </div>
      <p className="flex-grow text-sm leading-relaxed text-[#4A4A4A]">{description}</p>
      <div className="mt-5 flex items-center gap-2 text-sm font-semibold tracking-wide text-[#A08848] transition-transform group-hover:translate-x-1">
        {locale === 'es' ? 'Ir a' : 'Go to'} {title}
        <ArrowRight className="h-4 w-4" strokeWidth={1.5} />
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
    redirect(`/${locale}/login?returnUrl=${returnUrl}`);
  }

  const userEmail = session.user?.email;

  if (!userEmail || !AUTHORIZED_ADMINS.includes(userEmail)) {
    redirect(`/${locale}`);
  }
  return (
    <main className="min-h-screen bg-[#FAF6EF] px-4 py-10 text-[#2D2D2D] sm:px-8 lg:px-12">
      <div className="mx-auto max-w-screen-xl">
        <header className="border-b border-[#E8E4E0] pb-8">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
            {locale === 'es' ? 'Gestión interna' : 'Internal management'}
          </p>
          <h1 className="mt-2 font-display text-4xl font-medium text-[#2D2D2D] md:text-5xl">
            {locale === 'es' ? 'Panel de administración' : 'Admin panel'}
          </h1>
          <p className="mt-3 max-w-[68ch] text-sm leading-relaxed text-[#4A4A4A] md:text-base">
            {locale === 'es'
              ? 'Gestioná la operación diaria de Handmade Art: productos, cotizaciones y pagos directos desde módulos separados.'
              : 'Manage Handmade Art daily operations: products, quotes and direct payments from separated modules.'}
          </p>
        </header>

        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
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
    </main>
  );

}
