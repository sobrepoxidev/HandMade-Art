import { Link } from '@/i18n/navigation';
import Image from 'next/image';
import { buildMetadata } from '@/lib/metadata';
import type { Metadata } from "next";

type tParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";

  const pageTitle = currentLocale === 'es'
    ? 'Acerca de HandMade Art - Reinserción Social en CAI Carlos Luis Fallas | SobrePoxi'
    : 'About HandMade Art - Social Reintegration at CAI Carlos Luis Fallas | SobrePoxi';

  const pageDescription = currentLocale === 'es'
    ? 'HandMade Art opera en CAI Carlos Luis Fallas brindando segundas oportunidades a personas privadas de libertad a través del arte y artesanías. Patrocinado por SobrePoxi, ofrecemos capacitación, seguimiento post-liberación y un programa completo de reinserción social.'
    : 'HandMade Art operates at CAI Carlos Luis Fallas providing second chances to incarcerated individuals through art and crafts. Sponsored by SobrePoxi, we offer training, post-release follow-up, and a complete social reintegration program.';

  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/about`,
    title: pageTitle,
    description: pageDescription,
    image: {
      url: "/impact/Taller-de-creacion-de-chorreadores-de-cafe.webp",
      width: 1200,
      height: 630,
      alt: currentLocale === 'es'
        ? "Taller de creación de chorreadores de café en CAI Carlos Luis Fallas"
        : "Coffee maker creation workshop at CAI Carlos Luis Fallas"
    }
  });
}

function JsonLd({ locale }: { locale: string }) {
  const isEs = locale === 'es';
  const data = {
    '@context': 'https://schema.org',
    '@type': 'NGO',
    name: 'Handmade Art',
    url: 'https://handmadeart.store',
    sameAs: ['https://artehechoamano.com/es', 'https://handmadeart.store/en'],
    areaServed: 'CR',
    description: isEs
      ? 'Iniciativa social que impulsa la reinserción a través de la formación artesanal, trabajo digno y acompañamiento postpenitenciario.'
      : 'Social initiative that promotes reintegration through artisanal training, dignified work and post-release support.',
    sponsor: {
      '@type': 'Organization',
      name: 'SobrePoxi',
      url: 'https://sobrepoxi.com/es'
    }
  };
  return (
    <script
      type="application/ld+json"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function About({ params }: { params: tParams }) {
  const { locale } = await params;
  const isEs = locale === 'es';

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FAF8F5] via-white to-[#F5F1EB]">
      <JsonLd locale={locale} />

      {/* HERO */}
      <section className="relative overflow-hidden py-10 sm:py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col-reverse lg:flex-row items-center gap-8 lg:gap-14">
            {/* Texto */}
            <div className="w-full lg:w-7/12">
              <span className="inline-block mb-4 rounded-full bg-[#C9A962]/10 px-4 py-1 text-sm font-medium text-[#C9A962] border border-[#C9A962]/30">
                {isEs ? 'Misión y propósito' : 'Mission & Purpose'}
              </span>
              <h1 className="mb-4 text-4xl sm:text-5xl font-bold tracking-tight text-[#2D2D2D]">
                {isEs
                  ? 'Reinserción social a través del trabajo artesanal'
                  : 'Social reintegration through craftsmanship'}
              </h1>
              <p className="mb-6 text-lg text-[#4A4A4A]">
                {isEs
                  ? 'En Handmade Art, la persona es el centro. Acompañamos a quienes viven en condición de vulnerabilidad —ya sea en situación de calle o privados de libertad— con formación, ocupación productiva e ingresos legales que abren camino a una vida autosostenible.'
                  : 'At Handmade Art, people come first. We support those living in vulnerable conditions—either experiencing homelessness or incarceration—through training, productive work and lawful income that pave the way to a self-sustaining life.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <Link
                  href="/products"
                  className="rounded-md bg-gradient-to-r from-[#C9A962] to-[#A08848] px-6 py-3 text-[#1A1A1A] font-medium shadow-lg hover:shadow-xl transition-all hover:from-[#D4C4A8] hover:to-[#C9A962] text-center"
                >
                  {isEs ? 'Explorar productos' : 'Explore products'}
                </Link>
              </div>
            </div>

            {/* Imagen */}
            <div className="w-full lg:w-5/12 flex justify-center">
              <div className="relative">
                <Image
                  src="/about/smoke.webp"
                  alt={isEs ? 'Personas aprendiendo oficios artesanales' : 'People learning artisanal crafts'}
                  width={480}
                  height={560}
                  className="rounded-xl shadow-lg object-cover border border-[#E8E4E0]"
                  priority
                />
                <div className="absolute -bottom-4 -right-4 hidden sm:block h-24 w-24 rounded-xl bg-[#C9A962]/40 blur-xl" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* QUÉ HACEMOS */}
      <section className="pb-6 lg:pb-10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                titleEs: 'Formación con propósito',
                titleEn: 'Purposeful training',
                textEs:
                  'Talleres técnicos y socioemocionales: madera, cerámica, telas y más; junto con habilidades blandas, finanzas básicas y preparación laboral.',
                textEn:
                  'Technical and socio-emotional workshops: wood, ceramics, textiles and more; plus soft skills, basic finance and job readiness.',
              },
              {
                titleEs: 'Trabajo digno e ingresos legales',
                titleEn: 'Dignified work & lawful income',
                textEs:
                  'Ocupación productiva dentro de centros penales y espacios aliados, con estándares de calidad, precios justos y trazabilidad.',
                textEn:
                  'Productive work within prisons and partner spaces, with quality standards, fair pricing and traceability.',
              },
              {
                titleEs: 'Acompañamiento post-penal',
                titleEn: 'Post-release support',
                textEs:
                  'Seguimiento después de la liberación hasta alcanzar autonomía: vinculación laboral, mentoría y redes de apoyo.',
                textEn:
                  'Follow-up after release until autonomy: job placement, mentoring and support networks.',
              },
            ].map((f, i) => (
              <div key={i} className="bg-[#FAF8F5] p-6 rounded-lg shadow-sm border border-[#E8E4E0] hover:shadow-md hover:border-[#C9A962]/30 transition-all">
                <h3 className="text-xl font-semibold text-[#2D2D2D] mb-3">
                  {isEs ? f.titleEs : f.titleEn}
                </h3>
                <p className="text-[#4A4A4A]">
                  {isEs ? f.textEs : f.textEn}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SEDE ACTUAL — CAI Carlos Luis Fallas */}
      <section className="py-14 bg-[#FAF8F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-[#2D2D2D]">
              {isEs ? 'Operamos en el CAI Carlos Luis Fallas' : 'Operating at CAI Carlos Luis Fallas'}
            </h2>
            <div className="mt-2 h-1 w-24 bg-[#C9A962] mx-auto rounded-full"></div>
            <p className="mt-4 text-lg text-[#4A4A4A]">
              {isEs
                ? 'Actualmente desarrollamos nuestro programa integral dentro del CAI Carlos Luis Fallas. A través de las artesanías, las personas acceden a una segunda oportunidad real con ocupación productiva e ingresos legales.'
                : 'We currently run our integrated program within the Carlos Luis Fallas facility. Through craftsmanship, people access a real second chance with productive work and lawful income.'}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            <div className="grid grid-cols-2 gap-4">
              <Image
                src="/impact/Taller-de-creacion-de-chorreadores-de-cafe.webp"
                alt={isEs ? 'Taller de chorreadores' : 'Coffee dripper workshop'}
                width={280}
                height={200}
                className="rounded-lg shadow-md object-cover border border-[#E8E4E0]"
              />
              <Image
                src="/impact/Taller-de-detalle-de-madera.webp"
                alt={isEs ? 'Detalle en madera' : 'Wood detail workshop'}
                width={280}
                height={200}
                className="rounded-lg shadow-md object-cover border border-[#E8E4E0]"
              />
              <Image
                src="/impact/Taller-de-marcos-y-espejos.webp"
                alt={isEs ? 'Marcos y espejos' : 'Frames and mirrors'}
                width={280}
                height={200}
                className="rounded-lg shadow-md object-cover border border-[#E8E4E0]"
              />
              <Image
                src="/impact/Taller-de-exhibicion.webp"
                alt={isEs ? 'Exhibición de productos' : 'Product exhibition'}
                width={280}
                height={200}
                className="rounded-lg shadow-md object-cover border border-[#E8E4E0]"
              />
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-[#2D2D2D] mb-4">
                {isEs ? 'Un programa integral de reinserción' : 'An integrated reintegration program'}
              </h3>
              <ul className="space-y-3">
                {[
                  isEs
                    ? 'Formación técnica y socioemocional'
                    : 'Technical and socio-emotional training',
                  isEs
                    ? 'Ocupación productiva con estándares de calidad'
                    : 'Productive work with quality standards',
                  isEs
                    ? 'Ingresos legales y educación financiera'
                    : 'Lawful income and financial literacy',
                  isEs
                    ? 'Acompañamiento post-liberación hacia autonomía'
                    : 'Post-release accompaniment towards autonomy',
                ].map((item, idx) => (
                  <li key={idx} className="flex items-start">
                    <svg className="w-5 h-5 text-[#C9A962] mr-3 mt-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#4A4A4A]">{item}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-[#9C9589]">
                {isEs
                  ? 'Nota: La sección legal se desarrolla en una página específica. Aquí presentamos la visión general de "Acerca de".'
                  : 'Note: Legal topics are detailed on a dedicated page. This "About" section presents the general overview.'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SOBREPOXI — patrocinio e impulso fundador */}
      <section className="py-16 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#2D2D2D]">
              {isEs ? 'Impulsada y patrocinada por SobrePoxi' : 'Powered and sponsored by SobrePoxi'}
            </h2>
            <div className="mt-2 h-1 w-24 bg-[#C9A962] mx-auto rounded-full"></div>
          </div>

          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="w-full lg:w-1/2">
              <p className="text-lg text-[#4A4A4A] mb-4">
                {isEs
                  ? 'SobrePoxi, marca líder en Costa Rica en pisos epóxicos industriales y mobiliario de lujo en resina, es nuestro patrocinador principal y socio impulsor. Su apoyo financiero, técnico y logístico permite sostener los talleres, asegurar materiales y amplificar el impacto social.'
                  : 'SobrePoxi, a leading brand in Costa Rica for industrial epoxy flooring and luxury resin furniture, is our main sponsor and driving partner. Their financial, technical and logistical support sustains workshops, secures materials and amplifies social impact.'}
              </p>
              <p className="text-lg text-[#4A4A4A] mb-6">
                {isEs
                  ? 'Esta alianza también abre la puerta a nuevas líneas productivas —incluida la industria textil— siempre en armonía con el marco legal y las autoridades correspondientes.'
                  : 'This alliance also opens the door to new productive lines—including textiles—always aligned with the legal framework and the relevant authorities.'}
              </p>
              <a
                href="https://sobrepoxi.com/es"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center px-6 py-3 border border-[#C9A962] text-[#C9A962] rounded-md hover:bg-[#C9A962] hover:text-[#1A1A1A] transition-all"
              >
                {isEs ? 'Conoce más sobre SobrePoxi' : 'Learn more about SobrePoxi'}
                <svg className="ml-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>

            <div className="w-full lg:w-1/2">
              <div className="bg-gradient-to-br from-[#FAF8F5] to-[#F5F1EB] p-8 rounded-lg border border-[#E8E4E0]">
                <h3 className="text-xl font-semibold text-[#2D2D2D] mb-4">
                  {isEs ? 'Alcance de la alianza' : 'Scope of the alliance'}
                </h3>
                <ul className="space-y-3">
                  {[
                    isEs ? 'Financiamiento de talleres y materiales' : 'Funding for workshops and materials',
                    isEs ? 'Apoyo técnico especializado' : 'Specialized technical support',
                    isEs ? 'Calidad, trazabilidad y estándares de producción' : 'Quality, traceability and production standards',
                    isEs ? 'Exploración de nuevas industrias (p. ej., textil)' : 'Exploration of new industries (e.g., textiles)',
                    isEs ? 'Sostenibilidad e impacto medible' : 'Sustainability and measurable impact',
                  ].map((b, i) => (
                    <li key={i} className="flex items-center">
                      <svg className="w-5 h-5 text-[#C9A962] mr-3" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                      <span className="text-[#4A4A4A]">{b}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MISIÓN · VISIÓN · VALORES */}
      <section className="py-16 bg-[#FAF8F5]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-[#2D2D2D]">{isEs ? 'Misión, visión y valores' : 'Mission, vision & values'}</h2>
            <div className="mt-2 h-1 w-24 bg-[#C9A962] mx-auto rounded-full"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Misión */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E8E4E0] hover:shadow-md hover:border-[#C9A962]/30 transition-all">
              <h3 className="text-xl font-semibold text-[#2D2D2D] mb-3 text-center">{isEs ? 'Misión' : 'Mission'}</h3>
              <p className="text-[#4A4A4A] text-center">
                {isEs
                  ? 'Generar segundas oportunidades a través del trabajo artesanal, conectando talento con mercado y acompañando cada proceso hasta la autosuficiencia.'
                  : 'Create second chances through artisanal work, connecting talent with market demand and accompanying each process until self-sufficiency.'}
              </p>
            </div>

            {/* Visión */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E8E4E0] hover:shadow-md hover:border-[#C9A962]/30 transition-all">
              <h3 className="text-xl font-semibold text-[#2D2D2D] mb-3 text-center">{isEs ? 'Visión' : 'Vision'}</h3>
              <p className="text-[#4A4A4A] text-center">
                {isEs
                  ? 'Ser referente en reinserción socio-productiva en Costa Rica y la región, integrando oficios, calidad y dignidad para transformar vidas.'
                  : 'Be a benchmark for socio-productive reintegration in Costa Rica and the region, blending craft, quality and dignity to transform lives.'}
              </p>
            </div>

            {/* Valores */}
            <div className="bg-white p-6 rounded-lg shadow-sm border border-[#E8E4E0] hover:shadow-md hover:border-[#C9A962]/30 transition-all">
              <h3 className="text-xl font-semibold text-[#2D2D2D] mb-3 text-center">{isEs ? 'Valores' : 'Values'}</h3>
              <ul className="text-[#4A4A4A] space-y-2">
                <li>• <strong className="text-[#2D2D2D]">{isEs ? 'Dignidad' : 'Dignity'}</strong> — {isEs ? 'cada persona importa.' : 'every person matters.'}</li>
                <li>• <strong className="text-[#2D2D2D]">{isEs ? 'Transparencia' : 'Transparency'}</strong> — {isEs ? 'procesos claros y medibles.' : 'clear, measurable processes.'}</li>
                <li>• <strong className="text-[#2D2D2D]">{isEs ? 'Excelencia' : 'Excellence'}</strong> — {isEs ? 'estándares altos en cada pieza.' : 'high standards in every piece.'}</li>
                <li>• <strong className="text-[#2D2D2D]">{isEs ? 'Inclusión' : 'Inclusion'}</strong> — {isEs ? 'segundas oportunidades reales.' : 'real second chances.'}</li>
                <li>• <strong className="text-[#2D2D2D]">{isEs ? 'Sostenibilidad' : 'Sustainability'}</strong> — {isEs ? 'impacto duradero.' : 'lasting impact.'}</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* FUTURO */}
      <section className="py-16 bg-gradient-to-br from-[#FAF8F5] via-white to-[#F5F1EB]">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-[#2D2D2D]">
              {isEs ? 'Miramos hacia adelante' : 'Looking ahead'}
            </h2>
            <div className="mt-2 h-1 w-24 bg-[#C9A962] mx-auto rounded-full"></div>
            <p className="mt-4 text-lg text-[#4A4A4A] max-w-3xl mx-auto">
              {isEs
                ? 'Exploramos expansiones a actividades permitidas por ley —como la industria textil— para diversificar la formación y los ingresos de la población atendida.'
                : 'We explore expansions to legally permitted activities—such as the textile industry—to diversify training and income for the people we serve.'}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            <div className="bg-white rounded-lg p-8 shadow-sm border border-[#E8E4E0]">
              <h3 className="text-xl font-semibold text-[#2D2D2D] mb-4">
                {isEs ? 'Posibles líneas de expansión' : 'Potential expansion lines'}
              </h3>
              <ul className="space-y-3">
                {[
                  isEs
                    ? 'Textil: confección básica, bordado, serigrafía y reparación.'
                    : 'Textiles: basic sewing, embroidery, screen printing and repair.',
                  isEs
                    ? 'Complementos: empaques, etiquetado, kits y acabados.'
                    : 'Complements: packaging, labeling, kits and finishing.',
                  isEs
                    ? 'Servicios creativos: diseño de patrones y prototipado.'
                    : 'Creative services: pattern design and prototyping.',
                ].map((x, i) => (
                  <li key={i} className="flex items-start">
                    <svg className="w-5 h-5 text-[#C9A962] mr-3 mt-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span className="text-[#4A4A4A]">{x}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-[#9C9589]">
                {isEs
                  ? 'Cada expansión se implementará según viabilidad técnica, demanda del mercado y autorización de las autoridades competentes.'
                  : 'Each expansion will be implemented based on technical feasibility, market demand and authorization from the relevant authorities.'}
              </p>
            </div>

            <div className="rounded-lg p-8">
              <h3 className="text-xl font-semibold text-[#2D2D2D] mb-4">
                {isEs ? 'Calidad y catálogo actual' : 'Quality and current catalog'}
              </h3>
              <p className="text-[#4A4A4A] mb-4">
                {isEs
                  ? 'Nuestro catálogo incluye piezas en madera (chorreadores, marcos, espejos), cerámica y textiles artesanales seleccionados, con control de calidad y trazabilidad de origen.'
                  : 'Our catalog includes wood pieces (coffee drippers, frames, mirrors), ceramics and curated textiles, with quality control and origin traceability.'}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <a
                  href="https://artehechoamano.com/es"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md bg-gradient-to-r from-[#C9A962] to-[#A08848] px-6 py-3 text-[#1A1A1A] font-medium shadow hover:shadow-lg transition-all hover:from-[#D4C4A8] hover:to-[#C9A962] text-center"
                >
                  {isEs ? 'Ver tienda en español' : 'Shop (Spanish)'}
                </a>
                <a
                  href="https://handmadeart.store/en"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-md border border-[#C9A962] px-6 py-3 text-[#C9A962] hover:bg-[#C9A962] hover:text-[#1A1A1A] text-center transition-all"
                >
                  {isEs ? 'Ver tienda en inglés' : 'Shop (English)'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-12 bg-[#2D2D2D] text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4 text-[#F5F1EB]">
            {isEs ? 'Sé parte de la segunda oportunidad' : 'Be part of the second chance'}
          </h2>
          <p className="text-lg mb-8 max-w-3xl mx-auto text-[#E8E4E0]">
            {isEs
              ? 'Cada compra, donación o difusión cuenta. Tu apoyo convierte el talento en oportunidades reales de vida.'
              : 'Every purchase, donation or share counts. Your support turns talent into real life opportunities.'}
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/products"
              className="rounded-md bg-gradient-to-r from-[#C9A962] to-[#A08848] text-[#1A1A1A] px-6 py-3 shadow transition-all hover:from-[#D4C4A8] hover:to-[#C9A962] font-medium"
            >
              {isEs ? 'Explorar productos' : 'Explore products'}
            </Link>
            <Link
              href="/reinsercion-sociolaboral"
              className="rounded-md bg-transparent border-2 border-[#C9A962] text-[#C9A962] px-6 py-3 transition hover:bg-[#C9A962] hover:text-[#1A1A1A] font-medium"
            >
              {isEs ? 'Conocer nuestro impacto' : 'Learn our impact'}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
