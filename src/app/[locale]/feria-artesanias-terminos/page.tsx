// src/app/feria-artesanias-terminos/page.tsx
export const metadata = {
  title: 'Términos y Condiciones - Sorteo Día de la Madre',
  description: 'Términos y condiciones del sorteo del Espejo Artesanal por el Día de la Madre - Handmade Art'
};

export default function Terminos() {
  return (
    <div className="min-h-screen bg-[#161210] px-4 py-8">
      <main className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#E0A83A] rounded-full mb-4 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)]">
            <span className="text-2xl">📋</span>
          </div>
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-[#F1E7D6] mb-2">
            Términos y Condiciones
          </h1>
          <p className="text-[#C9BBA5] font-medium">
            Sorteo del Espejo Artesanal - Día de la Madre 💐
          </p>
        </div>

        {/* Contenedor principal */}
        <div className="bg-[#1E1813]/85 backdrop-blur-sm rounded-sm shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)] border border-[#3A2E24] p-6 sm:p-8 space-y-8">

          {/* Responsable y finalidad */}
          <section className="bg-[#161210] rounded-sm p-6 border border-[#3A2E24]">
            <h2 className="font-display text-xl font-bold text-[#E0A83A] mb-4 flex items-center gap-2">
              <span>🏢</span> Responsable del Tratamiento
            </h2>
            <div className="space-y-3 text-[#C9BBA5] leading-relaxed">
              <p>
                <strong className="text-[#F1E7D6]">Responsable:</strong> HandMade Art Costa Rica
              </p>
              <p><strong className="text-[#F1E7D6]">Finalidades:</strong></p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Gestionar tu participación en el sorteo del <strong>Espejo Artesanal</strong> por el Día de la Madre</li>
                <li>Procesar y validar tu registro en la promoción</li>
                <li>Enviarte comunicaciones relacionadas con el sorteo</li>
                <li>Opcionalmente, enviarte novedades y promociones de nuestros productos artesanales</li>
              </ul>
              <p>
                <strong className="text-[#F1E7D6]">Datos recopilados:</strong> Nombre completo, correo electrónico y número de teléfono.
              </p>
              <p>
                <strong className="text-[#F1E7D6]">Derechos ARCO:</strong> Puedes ejercer tus derechos de acceso, rectificación, cancelación u oposición escribiendo a{' '}
                <a
                  className="text-[#E0A83A] underline font-medium hover:text-[#F3C56B] transition-colors"
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
          <section className="bg-[#161210] rounded-sm p-6 border border-[#3A2E24]">
            <h2 className="font-display text-xl font-bold text-[#E0A83A] mb-4 flex items-center gap-2">
              <span>🎁</span> Bases del Sorteo
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="bg-[#1E1813] rounded-sm p-4 border border-[#3A2E24]">
                <h3 className="font-semibold text-[#E0A83A] mb-2">🏆 Premio</h3>
                <p className="text-[#C9BBA5]">1 Espejo Artesanal hecho a mano por nuestros artesanos costarricenses</p>
              </div>

              <div className="bg-[#1E1813] rounded-sm p-4 border border-[#3A2E24]">
                <h3 className="font-semibold text-[#E0A83A] mb-2">📅 Fecha del Sorteo</h3>
                <p className="text-[#C9BBA5] font-medium">17 de agosto de 2025</p>
              </div>

              <div className="bg-[#1E1813] rounded-sm p-4 border border-[#3A2E24]">
                <h3 className="font-semibold text-[#E0A83A] mb-2">🎯 Participaciones</h3>
                <ul className="text-[#C9BBA5] text-sm space-y-1">
                  <li>• 1 entrada por registrarte</li>
                  <li>• +1 entrada por cada red social seguida</li>
                  <li>• Máximo 5 entradas por persona</li>
                </ul>
              </div>

              <div className="bg-[#1E1813] rounded-sm p-4 border border-[#3A2E24]">
                <h3 className="font-semibold text-[#E0A83A] mb-2">🎲 Selección</h3>
                <p className="text-[#C9BBA5] text-sm">Método aleatorio. Notificación por correo y/o WhatsApp el mismo día</p>
              </div>
            </div>
          </section>

          {/* Requisitos y condiciones */}
          <section className="bg-[#161210] rounded-sm p-6 border border-[#3A2E24]">
            <h2 className="font-display text-xl font-bold text-[#E0A83A] mb-4 flex items-center gap-2">
              <span>📋</span> Requisitos y Condiciones
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="font-semibold text-[#F1E7D6] mb-3">✅ Requisitos para participar:</h3>
                <ul className="space-y-2 text-[#C9BBA5]">
                  <li className="flex items-center gap-2">
                    <span className="text-[#3C9A70]">✓</span>
                    Ser mayor de 18 años
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#3C9A70]">✓</span>
                    Residir en Costa Rica
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#3C9A70]">✓</span>
                    Completar el formulario de registro
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#3C9A70]">✓</span>
                    Aceptar estos términos y condiciones
                  </li>
                </ul>
              </div>

              <div>
                <h3 className="font-semibold text-[#F1E7D6] mb-3">🎯 Condiciones importantes:</h3>
                <ul className="space-y-2 text-[#C9BBA5]">
                  <li className="flex items-center gap-2">
                    <span className="text-[#E0A83A]">💝</span>
                    Participación 100% gratuita
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#E0A83A]">🚫</span>
                    No requiere compra alguna
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#E0A83A]">📱</span>
                    Una participación por persona
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-[#E0A83A]">🎁</span>
                    El premio no es transferible
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* Conservación de datos */}
          <section className="bg-[#161210] rounded-sm p-6 border border-[#3A2E24]">
            <h2 className="font-display text-xl font-bold text-[#E0A83A] mb-4 flex items-center gap-2">
              <span>🔒</span> Protección y Conservación de Datos
            </h2>
            <div className="space-y-4 text-[#C9BBA5] leading-relaxed">
              <p>
                <strong className="text-[#F1E7D6]">Período de conservación:</strong> Tus datos se conservarán durante la vigencia de la promoción (hasta el 17 de agosto de 2025) y posteriormente para el envío de comunicaciones comerciales hasta que solicites la baja.
              </p>
              <p>
                <strong className="text-[#F1E7D6]">Cómo darte de baja:</strong> Puedes cancelar tu suscripción en cualquier momento:
              </p>
              <ul className="list-disc list-inside ml-4 space-y-1">
                <li>Haciendo clic en el enlace de baja incluido en cada correo</li>
                <li>Escribiendo a info@handmadeart.store</li>
                <li>Contactándonos a través de nuestras redes sociales</li>
              </ul>
            </div>
          </section>

          {/* Exoneración de redes sociales */}
          <section className="bg-[#161210] rounded-sm p-6 border border-[#3A2E24]">
            <h2 className="font-display text-xl font-bold text-[#F1E7D6] mb-4 flex items-center gap-2">
              <span>⚖️</span> Exoneración de Responsabilidad
            </h2>
            <p className="text-[#C9BBA5] leading-relaxed">
              <strong className="text-[#F1E7D6]">Importante:</strong> Meta (Facebook e Instagram), TikTok y YouTube no patrocinan, avalan ni administran esta promoción. Esta es una iniciativa independiente de HandMade Art Costa Rica para celebrar el Día de la Madre y promover el arte artesanal costarricense.
            </p>
          </section>

          {/* Footer de contacto */}
          <div className="text-center pt-6 border-t border-[#3A2E24]">
            <p className="text-[#C9BBA5] mb-2">
              ¿Tienes dudas sobre estos términos?
            </p>
            <a
              href="mailto:info@handmadeart.store"
              className="inline-flex items-center justify-center gap-2 min-h-[50px] bg-[#E0A83A] hover:bg-[#F3C56B] text-[#161210] font-bold px-6 rounded-sm transition-colors duration-200"
            >
              <span>📧</span>
              Contáctanos
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-2 text-sm text-[#8C7F6E]">
            <span>Hecho con</span>
            <span>💝</span>
            <span>por HandMade Art</span>
          </div>
        </div>
      </main>
    </div>
  );
}
