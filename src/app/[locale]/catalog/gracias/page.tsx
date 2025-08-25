'use client';

import { useSearchParams } from 'next/navigation';
import { CheckCircle, ArrowLeft, Mail, Phone } from 'lucide-react';
import Link from 'next/link';

export default function GraciasPage() {
  const searchParams = useSearchParams();
  const requestId = searchParams.get('solicitud');

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
          {/* Icono de éxito */}
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-6">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>

          {/* Título */}
          <h1 className="text-2xl font-bold text-gray-900 mb-4">
            ¡Solicitud enviada con éxito!
          </h1>

          {/* Mensaje */}
          <div className="text-gray-600 mb-6 space-y-3">
            <p>
              Tu solicitud de cotización ha sido recibida y será procesada por nuestro equipo.
            </p>
            
            {requestId && (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm font-medium text-gray-700">
                  Número de solicitud:
                </p>
                <p className="text-lg font-mono font-bold text-teal-600">
                  #{requestId}
                </p>
              </div>
            )}

            <p className="text-sm">
              Nos pondremos en contacto contigo en las próximas 24-48 horas con una cotización personalizada.
            </p>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-4">
              <p className="text-sm text-yellow-800">
                <strong>📧 Importante:</strong> Revisa tu carpeta de spam o correo no deseado, ya que algunos proveedores de correo pueden filtrar nuestros mensajes.
              </p>
            </div>
          </div>

          {/* Información de contacto */}
          <div className="bg-teal-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-teal-900 mb-3">
              ¿Tienes alguna pregunta?
            </h3>
            <div className="space-y-2 text-sm text-teal-700">
              <div className="flex items-center justify-center gap-2">
                <Mail className="h-4 w-4" />
                <span>info@handmadeart.store</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Phone className="h-4 w-4" />
                <span>+506 8423 7555</span>
              </div>
            </div>
          </div>

          {/* Botones de acción */}
          <div className="space-y-3">
            <Link
              href="/catalog"
              className="w-full bg-teal-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center justify-center gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al catálogo
            </Link>
            
            <Link
              href="/"
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center"
            >
              Ir al inicio
            </Link>
          </div>
        </div>

        {/* Información adicional */}
        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            HandMade Art - Artesanías hechas con amor y dedicación en Costa Rica
          </p>
        </div>
      </div>
    </div>
  );
}