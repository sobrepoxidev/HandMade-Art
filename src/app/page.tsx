// app/page.tsx
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function RootPage() {
  const h = await headers();
  // Reconstruye el origin
  const host = h.get('x-forwarded-host')?.trim().toString() // definido si hay proxy
            ?? h.get('host')?.trim().toString()
            ?? 'localhost';           // fallback con valor por defecto
  
  // Redireccionar según el dominio
  if (host === 'artehechoamano.com' || host.includes('artehechoamano')) {
    redirect('/es');
  } else if (host === 'handmadeart.store' || host.includes('handmadeart')) {
    redirect('/en');
  } else {
    // Comportamiento por defecto para otros dominios o desarrollo local
    redirect('/es'); // Podemos usar español como idioma por defecto
  }
}