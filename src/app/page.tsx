// app/page.tsx
import { permanentRedirect } from 'next/navigation';
import { headers } from 'next/headers';

export default async function RootPage() {
  const h = await headers();
  // Reconstruye el origin
  const host = h.get('x-forwarded-host')?.trim().toString() // definido si hay proxy
            ?? h.get('host')?.trim().toString()
            ?? 'localhost';           // fallback con valor por defecto

  // Redireccionar según el dominio (308 permanente: la raíz siempre resuelve
  // al mismo locale para un dominio dado, así que el equity de crawl/SEO
  // debe consolidarse ahí en vez de tratarse como un redirect temporal).
  if (host === 'artehechoamano.com' || host.includes('artehechoamano')) {
    permanentRedirect('/es');
  } else if (host === 'handmadeart.store' || host.includes('handmadeart')) {
    permanentRedirect('/en');
  } else {
    // Comportamiento por defecto para otros dominios o desarrollo local
    permanentRedirect('/es'); // Podemos usar español como idioma por defecto
  }
}