import { redirect } from 'next/navigation';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { Calendar, Plus, Clock, MapPin, Users } from 'lucide-react';
import { Link } from '@/i18n/navigation';

// Lista de correos electrónicos de administradores autorizados
const AUTHORIZED_ADMINS = ['sobrepoxidev@gmail.com', 'bryamlopez4@gmail.com'];

export default async function AdminEventsPage({
  params
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const supabase = createServerComponentClient({ cookies });
  
  const { data: { session } } = await supabase.auth.getSession();
  
  if (!session) {
    const returnUrl = encodeURIComponent(`/${locale}/admin/eventos`);
    redirect(`/${locale}/login?returnUrl=${returnUrl}`);
  }
  
  const userEmail = session.user?.email;
  
  if (!userEmail || !AUTHORIZED_ADMINS.includes(userEmail)) {
    redirect(`/${locale}`);
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 flex items-center">
            <Calendar className="w-8 h-8 mr-3 text-blue-600" />
            Gestión de Eventos
          </h1>
          <p className="text-gray-500 mt-1">
            Administra los eventos y actividades de la plataforma
          </p>
        </div>
        <Link
          href={`/admin/events/new`}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Evento
        </Link>
      </div>
      
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-6">
          <div className="text-center py-12">
            <div className="mx-auto flex items-center justify-center h-24 w-24 rounded-full bg-blue-50 mb-4">
              <Calendar className="h-12 w-12 text-blue-600" />
            </div>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No hay eventos programados</h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando tu primer evento para mostrar aquí.
            </p>
            <div className="mt-6">
              <Link
                href={`/admin/events/new`}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Evento
              </Link>
            </div>
          </div>
          
          {/* Evento de ejemplo (puedes eliminarlo cuando tengas eventos reales) */}
          <div className="mt-8 border border-gray-200 rounded-lg overflow-hidden">
            <div className="p-4 bg-gray-50 border-b border-gray-200">
              <h4 className="text-sm font-medium text-gray-500">EJEMPLO</h4>
            </div>
            <div className="p-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 bg-blue-100 p-3 rounded-lg">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Taller de Artesanías</h3>
                  <div className="mt-2 space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      <span>25 de Junio, 2024 - 10:00 AM a 2:00 PM</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 text-gray-400 mr-2" />
                      <span>Centro Cultural de la Ciudad</span>
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 text-gray-400 mr-2" />
                      <span>15 participantes registrados</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
