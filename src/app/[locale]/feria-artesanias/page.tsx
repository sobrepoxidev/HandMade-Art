'use client';

import { useState } from 'react';
import { insertLead, addFollow, sendSummaryMail, Social } from './actions';
import Link from 'next/link';
import toast from 'react-hot-toast';


const socials = {
  facebook_followed: 'https://www.facebook.com/share/1Au8nNA2ho/',
  instagram_followed:
    'https://www.instagram.com/handmadeart.store?utm_source=qr&igsh=MThjbTBhdGVxZ2FnNQ==',
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
    <main className="mx-auto max-w-sm px-4 py-8">
      {step === 0 && (
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* ---------- un titulo h1 para un serteo deldia de la amdre con el estilo hands-made-art ---------- */}
          <h1 className="text-2xl font-bold text-center text-gray-800">
            ¡Sorteo <span className="text-teal-600">GRATIS</span>!
          </h1>

          <input name="name" placeholder="Nombre" className="input text-gray-800" required />
          <input name="email" type="email" placeholder="Correo" className="input text-gray-800" required />
          <input name="phone" placeholder="Celular" className="input text-gray-800" required />

          {/* ---------- checkbox de términos ---------- */}
          <label className="flex items-start gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              name="terms"
              required          /* bloquea submit si no marca */
              className="mt-1 h-4 w-4 rounded border-gray-300
                   text-teal-600 focus:ring-teal-500"
            />
            <span>
              He leído y acepto los&nbsp;
              <Link
                href="/feria-artesanias-terminos"
                target="_blank"
                className="text-teal-600 underline"
              >
                Términos y Condiciones
              </Link>
              . Autorizo a HandMade Art a enviarme mi video 360°, participar en el
              sorteo del Marco de Espejo (15 de junio de 2025) y recibir novedades
              o promociones relacionadas con la marca.
            </span>
          </label>

          <button className="btn-primary w-full">Continuar</button>
        </form>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-center text-gray-800">
            ¡Ya tienes <span className="text-teal-600">{entries}</span> {entries === 1 ? 'participación' : 'participaciones'}!
          </h2>
          <p className="text-center text-gray-800">Sigue nuestras redes y gana más:</p>

          {Object.entries(socials).map(([key, url]) => (
            <button
              key={key}
              onClick={() => handleFollow(key as keyof typeof socials)}
              className={`btn-outline w-full ${followed[key] ? 'bg-teal-600 text-white' : ''}`}
            >
              {followed[key] ? '✓ Seguido' : `Seguir en ${new URL(url).hostname.split('.')[1]}`}
            </button>
          ))}

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
            className="btn-primary w-full mt-4"
          >
            Listo
          </button>

        </div>
      )}

      {step === 2 && (
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">¡Gracias!</h2>
          <p className="text-gray-800">
            Estás participando por el Marco de Espejo y puedes disfrutar del Photo Booth.
          </p>
          <p className="text-gray-800">Te enviaremos tu video a tu correo o WhatsApp.</p>
          <p className="text-sm text-teal-600">Participaciones acumuladas: {entries}</p>
          <p className="text-sm text-teal-600">El sorteo se realizará el domingo 15 de junio de 2025.</p>
          {/* boton para ir a exploar la tienda / */}
          <Link href="/" className="btn-primary w-full mt-4">Explorar la tienda</Link>
        </div>
      )}
    </main>
  );
}
