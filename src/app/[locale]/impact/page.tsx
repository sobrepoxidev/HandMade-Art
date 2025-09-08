import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Image from "next/image";

type tParams = Promise<{ locale: string }>;
export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";
  
  const pageTitle = currentLocale === 'es' ? 'Impacto Social' : 'Social Impact';

  return buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/impact`,
    title: pageTitle,
  });
}

export default function ImpactPage() {
  return (
    <div className="container mx-auto px-4 py-8 text-gray-800">
      <h1 className="text-4xl font-bold text-center mb-8">Nuestro Impacto Social</h1>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Empoderando a los Artesanos Locales</h2>
        <p className="text-lg">
          En Handmade Art, estamos comprometidos a apoyar a los artesanos de Costa Rica, brindándoles una plataforma para mostrar su talento y vender sus creaciones a un público más amplio. Creemos en el poder del arte para transformar vidas y comunidades.
        </p>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Colaboración con el Ministerio de Justicia y Paz</h2>
        <p className="text-lg">
          Nos enorgullece colaborar con el Ministerio de Justicia y Paz de Costa Rica para ofrecer talleres y programas de capacitación a personas privadas de libertad. A través de estos programas, los participantes aprenden habilidades de artesanía, lo que les brinda una oportunidad de rehabilitación y una fuente de ingresos.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-6">
          <Image src="/impact/Ministerio-de-Justicia y-Paz.webp" alt="Ministerio de Justicia y Paz" className="rounded-lg shadow-lg" width={192} height={192} />
          <Image src="/impact/Taller-de-capacitacion-tecnica.webp" alt="Taller de capacitación técnica" className="rounded-lg shadow-lg" width={192} height={192} />
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-3xl font-semibold mb-4">Talleres y Capacitación</h2>
        <p className="text-lg">
          Ofrecemos una variedad de talleres que cubren diferentes técnicas de artesanía, desde el tallado en madera hasta la creación de chorreadores de café. Estos talleres no solo enseñan habilidades prácticas, sino que también fomentan la creatividad y la autoexpresión.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-6">
          <Image src="/impact/Taller-de-creacion-de-chorreadores-de-cafe.webp" alt="Taller de creación de chorreadores de café" className="rounded-lg shadow-lg" width={192} height={192} />
          <Image src="/impact/Taller-de-detalle-de-madera.webp" alt="Taller de detalle de madera" className="rounded-lg shadow-lg" width={192} height={192} />
          <Image src="/impact/Taller-de-exhibicion.webp" alt="Taller de exhibición" className="rounded-lg shadow-lg" width={192} height={192} />
        </div>
      </section>

      
    </div>
  );
}