import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Image from 'next/image';

type tParams = Promise<{ locale: string }>;
export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";

  const pageTitle = currentLocale === 'es' ? 'Reinserción Sociolaboral | Proyecto de Ley 24870' : 'Social Reintegration | Law Project 24870';
  const pageDescription = currentLocale === 'es'
    ? 'Handmade Art apoya el Proyecto de Ley 24870 para la reinserción sociolaboral de personas en situación de vulnerabilidad en Costa Rica'
    : 'Handmade Art supports Law Project 24870 for the social and labor reintegration of vulnerable populations in Costa Rica';

  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/reinsercion-sociolaboral`,
    title: pageTitle,
    description: pageDescription,
  });
}

export default async function ReinsertionPage({ params }: { params: tParams }) {
  const { locale } = await params;
  const isSpanish = locale === 'es';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#F5F1EB]">
      <div className="container mx-auto px-4 py-8 text-[#2D2D2D]">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            {isSpanish ? 'Reinserción Sociolaboral' : 'Social Reintegration'}
          </h1>
          <p className="text-xl text-[#C9A962] font-medium">
            {isSpanish ? 'Proyecto de Ley 24870' : 'Law Project 24870'}
          </p>
          <div className="h-1 w-24 bg-[#C9A962] mx-auto mt-4 rounded-full"></div>
        </div>

        <section className="mb-12 bg-[#C9A962]/10 p-6 md:p-8 rounded-xl border border-[#C9A962]/30">
          <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#2D2D2D]">
            {isSpanish ? 'Nuestro Apoyo al Proyecto de Ley 24870' : 'Our Support for Law Project 24870'}
          </h2>
          <p className="text-lg mb-4 text-[#4A4A4A]">
            {isSpanish
              ? 'En Handmade Art, apoyamos encarecidamente el Proyecto de Ley 24870 que crea la figura de Empresa de Inserción Sociolaboral (EISL). Esta iniciativa busca regular un marco jurídico que fomente la integración y formación sociolaboral como tránsito hacia el empleo formal para poblaciones vulnerables.'
              : 'At Handmade Art, we strongly support Law Project 24870, which creates the concept of Social and Labor Integration Companies (EISL). This initiative seeks to regulate a legal framework that promotes social and labor integration as a transition to formal employment for vulnerable populations.'}
          </p>
          <p className="text-lg font-medium text-[#2D2D2D]">
            {isSpanish
              ? 'Creemos firmemente que el arte y la artesanía pueden ser poderosas herramientas de transformación social y reinserción laboral.'
              : 'We firmly believe that art and craftsmanship can be powerful tools for social transformation and labor reintegration.'}
          </p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 border-l-4 border-[#C9A962] pl-3">
            {isSpanish ? '¿Qué es el Proyecto de Ley 24870?' : 'What is Law Project 24870?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <p className="text-lg mb-4 text-[#4A4A4A]">
                {isSpanish
                  ? 'El Proyecto de Ley 24870 crea la figura de Empresa de Inserción Sociolaboral (EISL), organizaciones que producen bienes o servicios con el fin social de insertar a personas en situación de vulnerabilidad mediante un "convenio de inserción" personalizado.'
                  : 'Law Project 24870 creates the concept of Social and Labor Integration Companies (EISL), organizations that produce goods or services with the social purpose of integrating vulnerable individuals through personalized "integration agreements".'
                }
              </p>
              <p className="text-lg mb-4 text-[#4A4A4A]">
                {isSpanish ? 'Las poblaciones beneficiarias incluyen:' : 'The beneficiary populations include:'}
              </p>
              <ul className="space-y-2 text-lg text-[#4A4A4A]">
                {[
                  isSpanish ? 'Personas dependientes de sustancias psicoactivas' : 'People dependent on psychoactive substances',
                  isSpanish ? 'Personas en situación de calle' : 'Homeless individuals',
                  isSpanish ? 'Personas ex-privadas o privadas de libertad en régimen semiinstitucional' : 'Former inmates or those in semi-institutional prison regimes'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-[#C9A962] mr-3 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-[#FAF8F5] p-6 rounded-xl border border-[#E8E4E0]">
              <h3 className="text-xl font-semibold mb-4 text-[#2D2D2D]">{isSpanish ? 'Beneficios del Proyecto' : 'Project Benefits'}</h3>
              <ul className="space-y-2 text-[#4A4A4A]">
                {[
                  isSpanish ? 'Acceso a financiamiento de Banca para el Desarrollo' : 'Access to Development Banking financing',
                  isSpanish ? 'Capacitación a través del INA' : 'Training through INA (National Learning Institute)',
                  isSpanish ? 'Beneficios fiscales para empresas participantes' : 'Tax benefits for participating companies',
                  isSpanish ? 'Rebaja del 50% en primas de riesgos del trabajo' : '50% reduction in workplace risk insurance premiums',
                  isSpanish ? 'Exoneración arancelaria para equipos' : 'Tariff exemption for equipment',
                  isSpanish ? 'Certificado de impacto social para donantes' : 'Social impact certificate for donors'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-[#4A7C59] mr-3 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 border-l-4 border-[#C9A962] pl-3">
            {isSpanish ? 'Nuestra Colaboración con el Ministerio de Justicia y Paz' : 'Our Collaboration with the Ministry of Justice and Peace'}
          </h2>
          <p className="text-lg mb-6 text-[#4A4A4A]">
            {isSpanish
              ? 'Handmade Art ya colabora activamente con el Ministerio de Justicia y Paz de Costa Rica ofreciendo talleres y programas de capacitación a personas privadas de libertad. A través de estos programas, los participantes aprenden habilidades de artesanía, lo que les brinda una oportunidad de rehabilitación y una fuente de ingresos.'
              : 'Handmade Art already actively collaborates with the Costa Rican Ministry of Justice and Peace by offering workshops and training programs to incarcerated individuals. Through these programs, participants learn craft skills, providing them with an opportunity for rehabilitation and a source of income.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
            <Image src="/reinsercion-sociolaboral/Ministerio-de-Justicia y-Paz.webp" alt={isSpanish ? "Ministerio de Justicia y Paz" : "Ministry of Justice and Peace"} className="rounded-xl shadow-lg border border-[#E8E4E0]" width={300} height={250} />
            <Image src="/og-image.webp" alt={isSpanish ? "Logo de Handmade Art" : "Handmade Art Logo"} className="rounded-xl shadow-lg border border-[#E8E4E0]" width={270} height={250} />
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 border-l-4 border-[#C9A962] pl-3">
            {isSpanish ? 'Nuestros Talleres de Reinserción' : 'Our Reintegration Workshops'}
          </h2>
          <p className="text-lg mb-6 text-[#4A4A4A]">
            {isSpanish
              ? 'Ofrecemos una variedad de talleres que cubren diferentes técnicas de artesanía, desde el tallado en madera hasta la creación de chorreadores de café. Estos talleres no solo enseñan habilidades prácticas, sino que también fomentan la creatividad, la autoexpresión y el desarrollo de competencias sociolaborales.'
              : 'We offer a variety of workshops covering different craft techniques, from wood carving to creating traditional Costa Rican coffee makers (chorreadores). These workshops not only teach practical skills but also foster creativity, self-expression, and the development of social and labor competencies.'}
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <div className="bg-[#FAF8F5] rounded-xl shadow-sm overflow-hidden border border-[#E8E4E0] hover:shadow-md hover:border-[#C9A962]/30 transition-all">
              <Image src="/reinsercion-sociolaboral/Taller-de-creacion-de-chorreadores-de-cafe.webp" alt={isSpanish ? "Taller de creación de chorreadores de café" : "Coffee maker crafting workshop"} className="w-full h-48 object-cover" width={400} height={300} />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-[#2D2D2D]">{isSpanish ? 'Taller de Chorreadores de Café' : 'Coffee Maker Workshop'}</h3>
                <p className="text-[#4A4A4A]">{isSpanish
                  ? 'Enseñamos técnicas tradicionales para la creación de chorreadores de café, un producto con alta demanda en el mercado local e internacional.'
                  : 'We teach traditional techniques for creating Costa Rican coffee makers, a product with high demand in both local and international markets.'}</p>
              </div>
            </div>
            <div className="bg-[#FAF8F5] rounded-xl shadow-sm overflow-hidden border border-[#E8E4E0] hover:shadow-md hover:border-[#C9A962]/30 transition-all">
              <Image src="/reinsercion-sociolaboral/Taller-de-detalle-de-madera.webp" alt={isSpanish ? "Taller de detalle de madera" : "Wood detailing workshop"} className="w-full h-48 object-cover" width={400} height={300} />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-[#2D2D2D]">{isSpanish ? 'Taller de Tallado en Madera' : 'Wood Carving Workshop'}</h3>
                <p className="text-[#4A4A4A]">{isSpanish
                  ? 'Capacitamos en técnicas de tallado y acabado en madera, permitiendo crear piezas únicas con alto valor artístico y comercial.'
                  : 'We train in wood carving and finishing techniques, enabling the creation of unique pieces with high artistic and commercial value.'}</p>
              </div>
            </div>
            <div className="bg-[#FAF8F5] rounded-xl shadow-sm overflow-hidden border border-[#E8E4E0] hover:shadow-md hover:border-[#C9A962]/30 transition-all">
              <Image src="/reinsercion-sociolaboral/verq.webp" alt={isSpanish ? "Taller de exhibición" : "Exhibition workshop"} className="w-full h-48 object-cover" width={400} height={300} />
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-2 text-[#2D2D2D]">{isSpanish ? 'Exhibición y Comercialización' : 'Exhibition and Marketing'}</h3>
                <p className="text-[#4A4A4A]">{isSpanish
                  ? 'Enseñamos habilidades de presentación, marketing y venta de productos artesanales en diferentes canales de comercialización.'
                  : 'We teach presentation, marketing, and sales skills for artisanal products across different commercialization channels.'}</p>
              </div>
            </div>
          </div>
        </section>

        <section className="mb-12 bg-[#4A7C59]/10 p-6 md:p-8 rounded-xl border border-[#4A7C59]/30">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 text-[#2D2D2D]">
            {isSpanish ? '¿Cómo Apoyamos la Reinserción Sociolaboral?' : 'How Do We Support Social and Labor Reintegration?'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#2D2D2D]">{isSpanish ? 'Nuestro Compromiso' : 'Our Commitment'}</h3>
              <p className="text-lg mb-4 text-[#4A4A4A]">
                {isSpanish ? 'En Handmade Art nos comprometemos a:' : 'At Handmade Art, we commit to:'}
              </p>
              <ul className="space-y-2 text-[#4A4A4A]">
                {[
                  isSpanish ? 'Ofrecer capacitación técnica en artesanía' : 'Offer technical training in craftsmanship',
                  isSpanish ? 'Brindar acompañamiento psicosocial' : 'Provide psychosocial support',
                  isSpanish ? 'Proporcionar oportunidades de comercialización' : 'Provide marketing opportunities',
                  isSpanish ? 'Facilitar la inserción laboral en nuestra red de artesanos' : 'Facilitate job placement in our artisan network',
                  isSpanish ? 'Promover la certificación como EISL una vez aprobada la ley' : 'Promote EISL certification once the law is approved'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-[#4A7C59] mr-3 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-4 text-[#2D2D2D]">{isSpanish ? 'Resultados Esperados' : 'Expected Results'}</h3>
              <ul className="space-y-2 text-[#4A4A4A]">
                {[
                  isSpanish ? 'Reducción de la reincidencia delictiva' : 'Reduction in criminal recidivism',
                  isSpanish ? 'Desarrollo de habilidades técnicas y sociales' : 'Development of technical and social skills',
                  isSpanish ? 'Generación de ingresos sostenibles' : 'Generation of sustainable income',
                  isSpanish ? 'Reintegración efectiva a la sociedad' : 'Effective reintegration into society',
                  isSpanish ? 'Preservación de técnicas artesanales tradicionales' : 'Preservation of traditional craft techniques',
                  isSpanish ? 'Creación de productos con valor cultural y comercial' : 'Creation of products with cultural and commercial value'
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-[#C9A962] mr-3 mt-1 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl md:text-3xl font-semibold mb-6 border-l-4 border-[#C9A962] pl-3">
            {isSpanish ? 'Únete a Nuestra Iniciativa' : 'Join Our Initiative'}
          </h2>
          <p className="text-lg mb-6 text-[#4A4A4A]">
            {isSpanish
              ? 'Si eres una empresa o individuo interesado en apoyar el Proyecto de Ley 24870 y nuestras iniciativas de reinserción sociolaboral a través del arte y la artesanía, contáctanos para explorar formas de colaboración.'
              : 'If you are a company or individual interested in supporting Law Project 24870 and our social and labor reintegration initiatives through art and crafts, contact us to explore ways to collaborate.'}
          </p>
          <div className="bg-[#2D2D2D] p-6 md:p-8 rounded-xl text-center">
            <h3 className="text-xl font-semibold mb-4 text-[#F5F1EB]">{isSpanish ? 'Contacto para Alianzas' : 'Contact for Partnerships'}</h3>
            <p className="text-lg text-[#E8E4E0]">
              {isSpanish
                ? <>Escríbenos a <a href="mailto:info@handmadeart.store" className="text-[#C9A962] hover:underline">info@handmadeart.store</a> o llámanos al <a href="tel:+50685850000" className="text-[#C9A962] hover:underline">+506 8585-0000</a></>
                : <>Email us at <a href="mailto:info@handmadeart.store" className="text-[#C9A962] hover:underline">info@handmadeart.store</a> or call us at <a href="tel:+50685850000" className="text-[#C9A962] hover:underline">+506 8585-0000</a></>}
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
