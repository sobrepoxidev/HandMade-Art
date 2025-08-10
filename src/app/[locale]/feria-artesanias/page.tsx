'use client';

import { useState } from 'react';
import { insertLead, addFollow, sendSummaryMail, Social } from './actions';
import Link from 'next/link';
import toast from 'react-hot-toast';


const socials = {
  facebook_followed: 'https://www.facebook.com/share/1Au8nNA2ho/',
  instagram_followed:
    'https://www.instagram.com/handmadeart.store/',
  tiktok_followed: 'https://www.tiktok.com/@handmadeart.store',
  youtube_followed: 'https://www.youtube.com/@handmadeartcr',
} as const;

export default function FeriaArtesaniasPage() {
  /* paso: 0=form | 1=social | 2=thanks */
  const [step, setStep] = useState<0 | 1 | 2>(0);
  const [leadId, setLeadId] = useState<string>();
  const [entries, setEntries] = useState(1);
  const [followed, setFollowed] = useState<Record<string, boolean>>({});
  const [userInfo, setUserInfo] = useState<{ name: string; email: string }>({
    name: '',
    email: ''
  });

  /* ------- paso 1 ------- */
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

  /* ------- paso 2 ------- */
  async function handleFollow(key: keyof typeof socials) {
    window.open(socials[key], '_blank', 'noopener,noreferrer');
    if (!followed[key] && leadId) {
      await addFollow(leadId, key, entries + 1);
      setFollowed(prev => ({ ...prev, [key]: true }));
      setEntries(entries + 1);
    }
  }

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

              {/* Checkbox de términos con mejor diseño */}
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

          {step === 1 && (
            <div className="space-y-3 text-center">
              {/* Celebración de participaciones */}
              <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-2xl px-6 p-3 border border-pink-200">
                <div className="text-4xl mb-1">🎉</div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                  ¡Excelente!
                </h2>
                <p className="text-lg text-pink-500">
                  Ya tienes <span className="font-bold text-pink-600 text-xl">{entries}</span> {entries === 1 ? 'participación' : 'participaciones'}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  💕 Sigue nuestras redes y gana más participaciones:
                </h3>

                {Object.entries(socials).map(([key]) => {
                  const socialNames = {
                    facebook_followed: 'Facebook',
                    instagram_followed: 'Instagram', 
                    tiktok_followed: 'TikTok',
                    youtube_followed: 'YouTube'
                  };
                  
                  const socialIcons = {
                    facebook_followed: '📘',
                    instagram_followed: '📸',
                    tiktok_followed: '🎵',
                    youtube_followed: '📺'
                  };

                  return (
                    <button
                      key={key}
                      onClick={() => handleFollow(key as keyof typeof socials)}
                      className={`w-full py-2 px-6 rounded-2xl font-semibold transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] ${
                        followed[key] 
                          ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg' 
                          : 'bg-white border-2 border-pink-300 text-pink-600 hover:bg-pink-50 shadow-md hover:shadow-lg'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-lg">{socialIcons[key as keyof typeof socialIcons]}</span>
                        <span>
                          {followed[key] ? '✓ Seguido' : `Seguir en ${socialNames[key as keyof typeof socialNames]}`}
                        </span>
                      </div>
                    </button>
                  );
                })}
              </div>

              <button
                onClick={async () => {
                  // 1) Enviar el mail (no bloquea la UI si falla)
                  if (leadId) {
                    await sendSummaryMail(
                      userInfo.email,
                      userInfo.name,
                      entries,
                      followed as Record<Social, boolean>   // pasamos el objeto de redes
                    ).catch(console.error);
                  }
                  // 2) Cambiar al paso final
                  setStep(2);
                }}
                className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 mt-6"
              >
                Finalizar 🎁
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-6">
              <div className="text-6xl mb-4">🎊</div>
              
              <div className="space-y-3">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  ¡Gracias por participar!
                </h2>
                <p className="text-gray-700 text-lg leading-relaxed">
                  ¡Ya estás participando para ganar un hermoso Espejo Artesanal por el Día de la Madre! 💐
                </p>
                <p className="text-gray-600">
                  Te avisaremos por correo o WhatsApp si resultas ganador(a).
                </p>
              </div>

              <div className="bg-gradient-to-r from-pink-100 to-purple-100 rounded-2xl p-4 border border-pink-200">
                <p className="font-semibold text-pink-700 mb-1">
                  Participaciones acumuladas: {entries} 🎯
                </p>
                <p className="text-sm text-purple-600 font-medium">
                  El sorteo se realizará el 17 de agosto de 2025 🗓️
                </p>
              </div>

              <Link 
                href="/" 
                className="inline-block w-full bg-gradient-to-r from-teal-500 to-cyan-500 hover:from-teal-600 hover:to-cyan-600 text-white font-bold py-4 px-6 rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200"
              >
                Explorar la tienda 🛍️
              </Link>
            </div>
          )}
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
