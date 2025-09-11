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

export default function FeriaArtesaniasPage() {
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
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-rose-50 to-purple-50 px-4 py-2 flex items-center justify-center">
      <main className="w-full max-w-md mx-auto">
        {/* Header con decoración floral */}
        <div className="text-center mb-2">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-pink-400 to-rose-500 rounded-full mb-2 shadow-lg">
            <span className="text-3xl">💐</span>
          </div>
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-pink-600 via-rose-500 to-purple-600 bg-clip-text text-transparent leading-tight">
              ¡Celebra a Mamá con nuestro Sorteo GRATIS!
            </h1>
            <p className="text-gray-600 text-sm sm:text-base font-medium">
              Participa para ganar un hermoso Espejo Artesanal
            </p>
            <p className="text-xs text-gray-500">
              de Handmade Art
            </p>
          </div>
        </div>

        {/* Contenedor principal con glassmorphism */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 px-6 py-3 sm:p-8">
          {/* MENSAJE DE EVENTO FINALIZADO */}
          <div className="text-center space-y-6">
            <div className="text-6xl mb-4">🎊</div>
            
            <div className="space-y-4">
              <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                ¡Gracias por su participación!
              </h2>
              <p className="text-gray-700 text-lg leading-relaxed">
                El sorteo del Espejo Artesanal por el Día de la Madre ha finalizado. 💐
              </p>
              <p className="text-gray-600">
                ¡Gracias a todos los que participaron! Manténganse atentos para nuestros próximos eventos especiales.
              </p>
            </div>

            <div className="bg-gradient-to-r from-orange-100 to-red-100 rounded-2xl p-6 border border-orange-200">
              <div className="text-4xl mb-3">🎪</div>
              <h3 className="text-xl font-bold text-orange-800 mb-3">
                ¡Nos vemos en las Fiestas Patronales!
              </h3>
              <p className="text-orange-700 mb-4">
                Estamos participando en las <strong>Fiestas Patronales de San Ramón 2025</strong> del 21 al 31 de Agosto.
              </p>
              <p className="text-orange-600 text-sm mb-4">
                Celebrando 100 años de tradición con artesanías únicas y descuentos especiales.
              </p>
              <Link 
                href="https://handmadeart.store/es/fiestas-patronales-de-san-ramon"
                className="inline-block w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Ver detalles del evento 🎪
              </Link>
            </div>

            <Link 
              href="/" 
              className="inline-block w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
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
                    className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
                    required 
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-pink-400">👤</span>
                  </div>
                </div>

                <div className="relative">
                  <input 
                    name="email" 
                    type="email" 
                    placeholder="Correo electrónico" 
                    className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
                    required 
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-pink-400">📧</span>
                  </div>
                </div>

                <div className="relative">
                  <input 
                    name="phone" 
                    placeholder="Número de celular" 
                    className="w-full px-4 py-4 bg-gray-50/80 border border-gray-200 rounded-2xl focus:outline-none focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all duration-200 text-gray-800 placeholder-gray-500"
                    required 
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                    <span className="text-pink-400">📱</span>
                  </div>
                </div>
              </div>

              <div className="bg-pink-50/50 rounded-2xl p-4 border border-pink-100">
                <label className="flex items-start gap-3 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    name="terms"
                    required
                    className="mt-1 h-5 w-5 rounded-lg border-2 border-pink-300 text-pink-500 focus:ring-pink-400 focus:ring-2 transition-all duration-200"
                  />
                  <span className="leading-relaxed">
                    He leído y acepto los{' '}
                    <Link
                      href="/feria-artesanias-terminos"
                      target="_blank"
                      className="text-pink-600 underline font-medium hover:text-pink-700 transition-colors"
                    >
                      Términos y Condiciones
                    </Link>
                    . Autorizo a Handmade Art a participar en el sorteo del Espejo Artesanal (17 de agosto de 2025) y recibir novedades o promociones relacionadas con la marca.
                  </span>
                </label>
              </div>

              <button className="w-full bg-gradient-to-r from-pink-500 to-rose-500 hover:from-pink-600 hover:to-rose-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                Continuar 🌸
              </button>
            </form>
          )}
          */}
        </div>

        {/* Footer decorativo */}
        <div className="text-center mt-6">
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
