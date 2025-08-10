// src/app/feria-artesanias-terminos/page.tsx
export const metadata = { 
  title: 'Términos y Condiciones - Sorteo Día de la Madre',
  description: 'Términos y condiciones del sorteo del Espejo Artesanal por el Día de la Madre - Handmade Art'
};

export default function Terminos() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 px-4 py-8">
      <main className="mx-auto max-w-4xl">
        {/* Header decorativo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full mb-4 shadow-lg">
            <span className="text-2xl">📋</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent mb-2">
            Términos y Condiciones
          </h1>
          <p className="text-gray-600 font-medium">
            Sorteo del Espejo Artesanal - Día de la Madre 💐
          </p>
        </div>

        {/* Contenedor principal con glassmorphism */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sm:p-8 space-y-8">
          
          {/* Responsable y finalidad */}
          <section className="bg-pink-50/50 rounded-2xl p-6 border border-pink-100">
            <h2 className="text-xl font-bold text-pink-700 mb-4 flex items-center gap-2">
              <span>🏢</span> Responsable del Tratamiento
            </h2>
            <div className="space-y-3 text-gray-700 leading-relaxed">
              <p>
                <strong className="text-pink-600">Responsable:</strong> HandMade Art Costa Rica
              </p>
              <p><strong className="text-pink-600">Finalidades:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Gestionar tu participación en el sorteo del <strong>Espejo Artesanal</strong> por el Día de la Madre</li>
                <li>Procesar y validar tu registro en la promoción</li>
                <li>Enviarte comunicaciones relacionadas con el sorteo</li>
                <li>Opcionalmente, enviarte novedades y promociones de nuestros productos artesanales</li>
              </ul>
              <p>
                <strong className="text-pink-600">Datos recopilados:</strong> Nombre completo, correo electrónico y número de teléfono.
              </p>
              <p>
                <strong className="text-pink-600">Derechos ARCO:</strong> Puedes ejercer tus derechos de acceso, rectificación, cancelación u oposición escribiendo a{' '}
                <a
                  className="text-pink-600 underline font-medium hover:text-pink-700 transition-colors"
                  href="mailto:info@handmadeart.store"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  info@handmadeart.store
                </a>
              </p>
            </div>
          </section>

          {/* Bases del sorteo */}
          <section className="bg-rose-50/50 rounded-2xl p-6 border border-rose-100">
            <h2 className="text-xl font-bold text-rose-700 mb-4 flex items-center gap-2">
              <span>🎁</span> Bases del Sorteo
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-white/60 rounded-xl p-4 border border-rose-200">
                <h3 className="font-semibold text-rose-600 mb-2">🏆 Premio</h3>
                <p className="text-gray-700">1 Espejo Artesanal hecho a mano por nuestros artesanos costarricenses</p>
              </div>
              
              <div className="bg-white/60 rounded-xl p-4 border border-rose-200">
                <h3 className="font-semibold text-rose-600 mb-2">📅 Fecha del Sorteo</h3>
                <p className="text-gray-700 font-medium">17 de agosto de 2025</p>
              </div>
              
              <div className="bg-white/60 rounded-xl p-4 border border-rose-200">
                <h3 className="font-semibold text-rose-600 mb-2">🎯 Participaciones</h3>
                <ul className="text-gray-700 text-sm space-y-1">
                  <li>• 1 entrada por registrarte</li>
                  <li>• +1 entrada por cada red social seguida</li>
                  <li>• Máximo 5 entradas por persona</li>
                </ul>
              </div>
              
              <div className="bg-white/60 rounded-xl p-4 border border-rose-200">
                <h3 className="font-semibold text-rose-600 mb-2">🎲 Selección</h3>
                <p className="text-gray-700 text-sm">Método aleatorio. Notificación por correo y/o WhatsApp el mismo día</p>
              </div>
            </div>
          </section>

          {/* Requisitos y condiciones */}
          <section className="bg-purple-50/50 rounded-2xl p-6 border border-purple-100">
            <h2 className="text-xl font-bold text-purple-700 mb-4 flex items-center gap-2">
              <span>📋</span> Requisitos y Condiciones
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold text-purple-600 mb-3">✅ Requisitos para participar:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Ser mayor de 18 años
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Residir en Costa Rica
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Completar el formulario de registro
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-500">✓</span>
                    Aceptar estos términos y condiciones
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-purple-600 mb-3">🎯 Condiciones importantes:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">💝</span>
                    Participación 100% gratuita
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">🚫</span>
                    No requiere compra alguna
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">📱</span>
                    Una participación por persona
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-500">🎁</span>
                    El premio no es transferible
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Conservación de datos */}
          <section className="bg-teal-50/50 rounded-2xl p-6 border border-teal-100">
            <h2 className="text-xl font-bold text-teal-700 mb-4 flex items-center gap-2">
              <span>🔒</span> Protección y Conservación de Datos
            </h2>
            <div className="space-y-4 text-gray-700 leading-relaxed">
              <p>
                <strong className="text-teal-600">Período de conservación:</strong> Tus datos se conservarán durante la vigencia de la promoción (hasta el 17 de agosto de 2025) y posteriormente para el envío de comunicaciones comerciales hasta que solicites la baja.
              </p>
              <p>
                <strong className="text-teal-600">Cómo darte de baja:</strong> Puedes cancelar tu suscripción en cualquier momento:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Haciendo clic en el enlace de baja incluido en cada correo</li>
                <li>Escribiendo a info@handmadeart.store</li>
                <li>Contactándonos a través de nuestras redes sociales</li>
              </ul>
            </div>
          </section>

          {/* Exoneración de redes sociales */}
          <section className="bg-gray-50/50 rounded-2xl p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-700 mb-4 flex items-center gap-2">
              <span>⚖️</span> Exoneración de Responsabilidad
            </h2>
            <p className="text-gray-700 leading-relaxed">
              <strong>Importante:</strong> Meta (Facebook e Instagram), TikTok y YouTube no patrocinan, avalan ni administran esta promoción. Esta es una iniciativa independiente de HandMade Art Costa Rica para celebrar el Día de la Madre y promover el arte artesanal costarricense.
            </p>
          </section>

          {/* Footer de contacto */}
          <div className="text-center pt-6 border-t border-pink-200">
            <p className="text-gray-600 mb-2">
              ¿Tienes dudas sobre estos términos?
            </p>
            <a 
              href="mailto:info@handmadeart.store"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-semibold py-2 px-4 rounded-xl transition-all duration-200 transform hover:scale-105"
            >
              <span>📧</span>
              Contáctanos
            </a>
          </div>
        </div>

        {/* Footer decorativo */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-sm text-gray-500">
            <span>Hecho con</span>
            <span className="text-pink-500">💝</span>
            <span>por HandMade Art</span>
          </div>
        </div>
      </main>
    </div>
  );
}

