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
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export default async function About({ params }: { params: tParams }) {
  const { locale } = await params;
  const isEs = locale === 'es';
  const copy = {
    eyebrow: isEs ? 'Handmade Art · Costa Rica' : 'Handmade Art · Costa Rica',
    title: isEs
      ? 'Piezas hechas a mano, trabajo digno y una historia real detrás de cada compra.'
      : 'Handmade pieces, dignified work and a real story behind every purchase.',
    lead: isEs
      ? 'Somos una tienda de artesanía costarricense nacida alrededor de talleres de reinserción. Vendemos espejos tallados, chorreadores de café, decoración y piezas únicas que pagan horas reales de oficio.'
      : 'We are a Costa Rican craft store built around reintegration workshops. We sell carved mirrors, coffee drippers, decor and one-of-a-kind pieces that pay for real hours of craft.',
    shopCta: isEs ? 'Comprar piezas' : 'Shop pieces',
    impactCta: isEs ? 'Ver impacto social' : 'See social impact',
    storeLabel: isEs ? 'Tienda, no donación' : 'Store, not donation',
    storeTitle: isEs
      ? 'Compras una pieza terminada, no una promesa.'
      : 'You buy a finished piece, not a promise.',
    storeText: isEs
      ? 'Cada producto pasa por diseño, selección de materiales, acabado y control de calidad. El impacto existe porque la pieza se vende bien y llega a una casa donde se usa, se ve y se conserva.'
      : 'Every product moves through design, material selection, finishing and quality control. The impact exists because the piece sells well and reaches a home where it is used, seen and kept.',
    workshopTitle: isEs ? 'Del taller al catálogo' : 'From workshop to catalog',
    workshopText: isEs
      ? 'Trabajamos con oficios que tienen demanda: madera, acabados, chorreadores, espejos, decoración y piezas pequeñas para regalo. El catálogo se diseña para vender, repetir y sostener el programa.'
      : 'We work with crafts that have demand: wood, finishing, coffee drippers, mirrors, decor and small gift pieces. The catalog is designed to sell, repeat and sustain the program.',
    sponsorTitle: isEs ? 'Impulsada por SobrePoxi' : 'Powered by SobrePoxi',
    sponsorText: isEs
      ? 'SobrePoxi aporta soporte técnico, materiales, logística y experiencia productiva. Esa alianza ayuda a convertir talleres aislados en una operación comercial con estándares.'
      : 'SobrePoxi contributes technical support, materials, logistics and production experience. That partnership helps turn isolated workshops into a commercial operation with standards.',
    sponsorCta: isEs ? 'Conocer SobrePoxi' : 'Learn about SobrePoxi',
    qualityTitle: isEs ? 'Lo que cuidamos en cada pieza' : 'What we protect in every piece',
    galleryTitle: isEs ? 'Talleres y piezas en proceso' : 'Workshops and pieces in progress',
    finalTitle: isEs ? 'Lleva una pieza con historia a tu casa.' : 'Bring home a piece with a story.',
    finalText: isEs
      ? 'Explora el catálogo actual. Si ves una pieza única, lo mejor es apartarla, muchas no vuelven a repetirse.'
      : 'Browse the current catalog. If you see a unique piece, the best move is to reserve it, many are never repeated.',
  };

  const qualities = [
    {
      title: isEs ? 'Material honesto' : 'Honest material',
      text: isEs
        ? 'Madera, resina, tela y acabados escogidos por durabilidad, textura y presencia.'
        : 'Wood, resin, cloth and finishes chosen for durability, texture and presence.',
    },
    {
      title: isEs ? 'Oficio visible' : 'Visible craft',
      text: isEs
        ? 'Las manos que tallan, lijan y pintan siguen presentes en la pieza terminada.'
        : 'The hands that carve, sand and paint remain visible in the finished piece.',
    },
    {
      title: isEs ? 'Impacto comprable' : 'Buyable impact',
      text: isEs
        ? 'El programa se sostiene cuando el producto compite por calidad, no por lástima.'
        : 'The program is sustained when the product competes on quality, not pity.',
    },
  ];

  const gallery = [
    {
      src: '/impact/Taller-de-creacion-de-chorreadores-de-cafe.webp',
      alt: isEs ? 'Taller de creación de chorreadores de café' : 'Coffee dripper workshop',
    },
    {
      src: '/impact/Taller-de-detalle-de-madera.webp',
      alt: isEs ? 'Detalle de talla en madera' : 'Wood carving detail',
    },
    {
      src: '/impact/Taller-de-marcos-y-espejos.webp',
      alt: isEs ? 'Taller de marcos y espejos' : 'Frames and mirrors workshop',
    },
    {
      src: '/impact/Taller-de-exhibicion.webp',
      alt: isEs ? 'Exhibición de piezas terminadas' : 'Finished pieces exhibition',
    },
  ];

  return (
    <main className="bg-[#FAF6EF] text-[#2D2D2D]">
      <JsonLd locale={locale} />

      <section className="relative isolate min-h-[620px] overflow-hidden bg-[#1A1A1A]">
        <Image
          src="/impact/banner-lg.webp"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover object-[center_38%] opacity-55"
        />
        <div aria-hidden className="absolute inset-0 bg-[#1A1A1A]/52" />
        <div className="relative mx-auto flex min-h-[620px] max-w-screen-xl items-end px-4 pb-16 pt-28 sm:px-8 lg:px-12 lg:pb-20">
          <div className="max-w-3xl">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#C9A962]">
              {copy.eyebrow}
            </p>
            <h1 className="font-display text-[40px] font-medium leading-[1.04] tracking-[-0.005em] text-[#F5F1EB] sm:text-5xl lg:text-[64px]">
              {copy.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-[#E8E4E0] sm:text-lg">
              {copy.lead}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                locale={locale}
                className="inline-flex min-h-[48px] items-center justify-center rounded-sm bg-[#C9A962] px-6 py-3 text-sm font-semibold tracking-wide text-[#1A1A1A] transition-colors hover:bg-[#A08848] hover:text-[#F5F1EB]"
              >
                {copy.shopCta}
              </Link>
              <Link
                href="/reinsercion-sociolaboral"
                locale={locale}
                className="inline-flex min-h-[48px] items-center justify-center rounded-sm border border-[#F5F1EB]/35 px-6 py-3 text-sm font-semibold tracking-wide text-[#F5F1EB] transition-colors hover:border-[#F5F1EB] hover:bg-[#F5F1EB]/10"
              >
                {copy.impactCta}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#E8E4E0] bg-[#FAF6EF] py-14 sm:py-18 lg:py-20">
        <div className="mx-auto grid max-w-screen-xl gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-5">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
              {copy.storeLabel}
            </p>
            <h2 className="font-display text-3xl font-medium leading-[1.12] tracking-[-0.005em] text-[#2D2D2D] sm:text-4xl">
              {copy.storeTitle}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="max-w-3xl text-base leading-relaxed text-[#4A4A4A] sm:text-lg">
              {copy.storeText}
            </p>
            <div className="mt-10 grid gap-8 sm:grid-cols-3">
              {qualities.map((quality, index) => (
                <article key={quality.title} className="border-t border-[#C9A962]/45 pt-5">
                  <span className="font-display text-3xl text-[#C9A962]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <h3 className="mt-4 font-display text-xl font-medium tracking-[-0.005em] text-[#2D2D2D]">
                    {quality.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#4A4A4A]">
                    {quality.text}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#F5F1EB] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-screen-xl items-center gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-6">
            <div className="relative aspect-[4/3] overflow-hidden rounded-sm border border-[#E8E4E0] bg-[#2D2D2D]">
              <Image
                src="/impact/Taller-de-tallado-animales.webp"
                alt={isEs ? 'Taller de tallado de animales en madera' : 'Wood animal carving workshop'}
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className="font-display text-3xl font-medium leading-[1.12] tracking-[-0.005em] text-[#2D2D2D] sm:text-4xl">
              {copy.workshopTitle}
            </h2>
            <p className="mt-5 text-base leading-relaxed text-[#4A4A4A] sm:text-lg">
              {copy.workshopText}
            </p>
            <Link
              href="/catalog"
              locale={locale}
              className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-sm bg-[#2D2D2D] px-6 py-3 text-sm font-semibold tracking-wide text-[#F5F1EB] transition-colors hover:bg-[#1A1A1A]"
            >
              {isEs ? 'Explorar catálogo' : 'Browse catalog'}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-[#FAF6EF] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
              {copy.galleryTitle}
            </p>
            <h2 className="font-display text-3xl font-medium leading-[1.12] tracking-[-0.005em] text-[#2D2D2D] sm:text-4xl">
              {copy.qualityTitle}
            </h2>
          </div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {gallery.map((image) => (
              <div key={image.src} className="relative aspect-[4/5] overflow-hidden rounded-sm border border-[#E8E4E0] bg-[#2D2D2D]">
                <Image
                  src={image.src}
                  alt={image.alt}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-y border-[#E8E4E0] bg-[#F5F1EB] py-16 sm:py-20 lg:py-24">
        <div className="mx-auto grid max-w-screen-xl gap-10 px-4 sm:px-8 lg:grid-cols-12 lg:px-12">
          <div className="lg:col-span-5">
            <h2 className="font-display text-3xl font-medium leading-[1.12] tracking-[-0.005em] text-[#2D2D2D] sm:text-4xl">
              {copy.sponsorTitle}
            </h2>
          </div>
          <div className="lg:col-span-7">
            <p className="max-w-3xl text-base leading-relaxed text-[#4A4A4A] sm:text-lg">
              {copy.sponsorText}
            </p>
            <a
              href="https://sobrepoxi.com/es"
              target="_blank"
              rel="noopener noreferrer"
              className="mt-8 inline-flex min-h-[48px] items-center justify-center rounded-sm border border-[#A08848] px-6 py-3 text-sm font-semibold tracking-wide text-[#A08848] transition-colors hover:bg-[#A08848] hover:text-[#F5F1EB]"
            >
              {copy.sponsorCta}
            </a>
          </div>
        </div>
      </section>

      <section className="bg-[#2D2D2D] py-16 text-[#F5F1EB] sm:py-20">
        <div className="mx-auto flex max-w-screen-xl flex-col gap-8 px-4 sm:px-8 lg:flex-row lg:items-center lg:justify-between lg:px-12">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl font-medium leading-[1.12] tracking-[-0.005em] sm:text-4xl">
              {copy.finalTitle}
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[#E8E4E0]">
              {copy.finalText}
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
            <Link
              href="/products"
              locale={locale}
              className="inline-flex min-h-[48px] items-center justify-center rounded-sm bg-[#C9A962] px-6 py-3 text-sm font-semibold tracking-wide text-[#1A1A1A] transition-colors hover:bg-[#D4C4A8]"
            >
              {copy.shopCta}
            </Link>
            <Link
              href="/contact"
              locale={locale}
              className="inline-flex min-h-[48px] items-center justify-center rounded-sm border border-[#F5F1EB]/35 px-6 py-3 text-sm font-semibold tracking-wide text-[#F5F1EB] transition-colors hover:border-[#F5F1EB] hover:bg-[#F5F1EB]/10"
            >
              {isEs ? 'Contactar' : 'Contact us'}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
