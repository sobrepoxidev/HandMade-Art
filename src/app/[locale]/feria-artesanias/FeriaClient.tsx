'use client';

// import { useState } from 'react';
// import { insertLead, addFollow, sendSummaryMail, Social } from './actions';
import { Link } from '@/i18n/navigation';
// import toast from 'react-hot-toast';


// const socials = {
//   facebook_followed: 'https://www.facebook.com/share/1Au8nNA2ho/',
//   instagram_followed:
//     'https://www.instagram.com/handmadeart.store/',
//   tiktok_followed: 'https://www.tiktok.com/@handmadeart.store',
//   youtube_followed: 'https://www.youtube.com/@handmadeartcr',
//   kenia_basilis_followed: 'https://www.instagram.com/keniabasilistv?igsh=OGQ3bzcwOWd5emY5',
// } as const;

export default function FeriaClient() {
  // FORMULARIO TEMPORALMENTE DESHABILITADO - El evento ha finalizado
  // Para reactivar, descomenta las siguientes líneas y el código del formulario

  /*
  // paso: 0=form | 1=social | 2=thanks
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [leadId, setLeadId] = useState<string>();
  const [entries, setEntries] = useState(1);
  const [followed, setFollowed] = useState<Record<string, boolean>>({});
  const [userInfo, setUserInfo] = useState<{ name: string; email: string }>({
    name: '',
    email: ''
  });
  */

  /*
  // ------- paso 1 -------
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form  = new FormData(e.currentTarget);
    const name  = form.get('name')  as string;
    const email = form.get('email') as string;
    const phone = form.get('phone') as string;

    const res = await insertLead(name, email, phone);

    if (!res.ok) {
      toast.error('Correo ya está registrado. Usa otro o pregunta a nuestro staff 😊');
      return;                    // no avanza al paso siguiente
    }

    // éxito → continuar
    setLeadId(res.id);
    setEntries(res.entries);
    setUserInfo({ name, email });
    setStep(1);
  }

  // ------- paso 2 -------
  async function handleFollow(key: keyof typeof socials) {
    window.open(socials[key], '_blank', 'noopener,noreferrer');
    if (!followed[key] && leadId) {
      await addFollow(leadId, key, entries + 1);
      setFollowed(prev => ({ ...prev, [key]: true }));
      setEntries(entries + 1);
    }
  }
  */

  return (
    <div className="min-h-screen bg-[#161210] px-4 py-2 flex items-center justify-center">
      <main className="w-full max-w-md mx-auto">
        {/* Header */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-[#E0A83A] rounded-full mb-2 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)]">
            <span className="text-3xl">💐</span>
          </div>
          <div className="space-y-1">
            <h1 className="font-display text-2xl sm:text-3xl font-bold text-[#F1E7D6] leading-tight">
              ¡Celebra a Mamá con nuestro Sorteo GRATIS!
            </h1>
            <p className="text-[#C9BBA5] text-sm sm:text-base font-medium">
              Participa para ganar un hermoso Espejo Artesanal
            </p>
            <p className="text-xs text-[#8C7F6E]">
              de Handmade Art
            </p>
          </div>
        </div>

        {/* Contenedor principal */}
        <div className="bg-[#1E1813]/85 backdrop-blur-sm rounded-sm shadow-[0_8px_24px_-12px_rgba(0,0,0,0.4)] border border-[#3A2E24] px-6 py-3 sm:p-8">
          {/* MENSAJE DE EVENTO FINALIZADO */}
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🎊</div>

            <div className="space-y-4">
              <h2 className="font-display text-2xl font-bold text-[#F1E7D6]">
                ¡Gracias por su participación!
              </h2>
              <p className="text-[#F1E7D6] text-lg leading-relaxed">
                El sorteo del Espejo Artesanal por el Día de la Madre ha finalizado. 💐
              </p>
              <p className="text-[#C9BBA5]">
                ¡Gracias a todos los que participaron! Manténganse atentos para nuestros próximos eventos especiales.
              </p>
            </div>

            <div className="bg-[#1E1813] rounded-sm p-6 border border-[#D9563B]/40">
              <div className="text-4xl mb-3">🎪</div>
              <h3 className="font-display text-xl font-bold text-[#D9563B] mb-3">
                ¡Nos vemos en las Fiestas Patronales!
              </h3>
              <p className="text-[#F1E7D6] mb-4">
                Estamos participando en las <strong>Fiestas Patronales de San Ramón 2025</strong> del 21 al 31 de Agosto.
              </p>
              <p className="text-[#8C7F6E] text-sm mb-4">
                Celebrando 100 años de tradición con artesanías únicas y descuentos especiales.
              </p>
              <Link
                href="https://handmadeart.store/es/fiestas-patronales-de-san-ramon"
                className="inline-flex w-full items-center justify-center min-h-[50px] bg-[#E0A83A] hover:bg-[#F3C56B] text-[#161210] font-bold px-6 rounded-sm transition-colors duration-200"
              >
                Ver detalles del evento 🎪
              </Link>
            </div>

            <Link
              href="/"
              className="inline-flex w-full items-center justify-center min-h-[50px] border border-[#F1E7D6]/45 hover:border-[#F1E7D6] text-[#F1E7D6] font-bold px-6 rounded-sm transition-colors duration-200"
            >
              Explorar la tienda 🛍️
            </Link>
          </div>

          {/* CÓDIGO DEL FORMULARIO COMENTADO PARA REACTIVACIÓN FUTURA */}
          {/*
          {step === 0 && (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="space-y-3">
                <div className="relative">
                  <input
                    name="name"
                    placeholder="Nombre completo"
                    className="w-full px-4 py-4 bg-[#1E1813] border border-[#3A2E24] rounded-sm focus:outline-none focus:border-[#F3C56B] focus:ring-2 focus:ring-[#F3C56B]/25 transition-all duration-200 text-[#F1E7D6] placeholder:text-[#8C7F6E]"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-[#E0A83A]">👤</span>
                  </div>
                </div>

                <div className="relative">
                  <input
                    name="email"
                    type="email"
                    placeholder="Correo electrónico"
                    className="w-full px-4 py-4 bg-[#1E1813] border border-[#3A2E24] rounded-sm focus:outline-none focus:border-[#F3C56B] focus:ring-2 focus:ring-[#F3C56B]/25 transition-all duration-200 text-[#F1E7D6] placeholder:text-[#8C7F6E]"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-[#E0A83A]">📧</span>
                  </div>
                </div>

                <div className="relative">
                  <input
                    name="phone"
                    placeholder="Número de celular"
                    className="w-full px-4 py-4 bg-[#1E1813] border border-[#3A2E24] rounded-sm focus:outline-none focus:border-[#F3C56B] focus:ring-2 focus:ring-[#F3C56B]/25 transition-all duration-200 text-[#F1E7D6] placeholder:text-[#8C7F6E]"
                    required
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-[#E0A83A]">📱</span>
                  </div>
                </div>
              </div>

              <div className="bg-[#1E1813] rounded-sm p-4 border border-[#3A2E24]">
                <label className="flex items-start gap-3 text-sm text-[#C9BBA5] cursor-pointer">
                  <input
                    type="checkbox"
                    name="terms"
                    required
                    className="mt-1 h-5 w-5 rounded-sm border-2 border-[#3A2E24] text-[#E0A83A] focus:ring-[#F3C56B] focus:ring-2 transition-all duration-200"
                  />
                  <span className="leading-relaxed">
                    He leído y acepto los{' '}
                    <Link
                      href="/feria-artesanias-terminos"
                      target="_blank"
                      className="text-[#E0A83A] underline font-medium hover:text-[#F3C56B] transition-colors"
                    >
                      Términos y Condiciones
                    </Link>
                    . Autorizo a Handmade Art a participar en el sorteo del Espejo Artesanal (17 de agosto de 2025) y recibir novedades o promociones relacionadas con la marca.
                  </span>
                </label>
              </div>

              <button className="w-full min-h-[50px] bg-[#E0A83A] hover:bg-[#F3C56B] text-[#161210] font-bold px-6 rounded-sm transition-colors duration-200">
                Continuar 🌸
              </button>
            </form>
          )}
          */}
        </div>

        {/* Footer */}
        <div className="text-center mt-6">
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
