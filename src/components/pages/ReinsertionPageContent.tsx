import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Mail, Phone } from "lucide-react";

/**
 * Self-contained content of the social-reintegration page.
 *
 * The same component is rendered by two route folders:
 *   - app/[locale]/reinsercion-sociolaboral/page.tsx  (canonical for ES)
 *   - app/[locale]/social-reintegration/page.tsx       (canonical for EN)
 *
 * Each route folder handles the redirect to the other locale's canonical
 * URL so we don't get duplicate-content indexing.
 */

const COPY = {
  es: {
    eyebrow: "Proyecto de Ley 24870",
    h1: "Detrás de cada pieza, un oficio que cambia vidas.",
    sub:
      "Handmade Art es una empresa de inserción sociolaboral. Cada espejo, cada chorreador, cada talla nace en talleres dentro de centros de rehabilitación, donde personas en proceso de reinserción aprenden un oficio y vuelven a creer en sí mismas.",
    ctaPrimary: "Conocer las piezas",
    ctaSecondary: "Escribirnos para alianzas",

    pillarsTitle: "Lo que hacemos, en una página",
    pillars: [
      {
        title: "Talleres dentro del sistema penitenciario",
        body: "En convenio con el Ministerio de Justicia y Paz formamos a personas privadas de libertad en tallado en madera, resina y acabados artesanales.",
      },
      {
        title: "Comercializamos la obra",
        body: "Cada pieza que vendés aquí financia las horas de trabajo del artesano. No es una donación: es un comercio justo entre quien crea y quien compra.",
      },
      {
        title: "Acompañamiento al salir",
        body: "Cuando termina la pena, los participantes se integran a nuestra red de artesanos como proveedores. El oficio se vuelve fuente de ingresos legítima y estable.",
      },
    ],

    lawTitle: "Qué propone el Proyecto de Ley 24870",
    lawBody:
      "El proyecto crea la figura de Empresa de Inserción Sociolaboral (EISL): organizaciones que producen bienes o servicios con un fin social explícito y un “convenio de inserción” personalizado para cada beneficiario. Handmade Art opera como EISL desde antes de que la figura exista en la ley — apoyamos el proyecto porque legitima el modelo y abre puertas para que más personas puedan empezar de nuevo.",
    populations: {
      title: "Poblaciones beneficiarias",
      items: [
        "Personas dependientes de sustancias psicoactivas",
        "Personas en situación de calle",
        "Personas ex privadas o privadas de libertad en régimen semiinstitucional",
      ],
    },
    benefits: {
      title: "Lo que habilita la ley",
      items: [
        "Financiamiento de Banca para el Desarrollo",
        "Capacitación gratuita a través del INA",
        "Beneficios fiscales para empresas participantes",
        "Reducción del 50% en primas de riesgos del trabajo",
        "Exoneración arancelaria para equipo de taller",
        "Certificado de impacto social para donantes",
      ],
    },

    artisansTitle: "Quienes hacen las piezas",
    artisansLead:
      "Tres de las personas que hoy producen para Handmade Art. No usamos nombres completos ni rostros donde no toca — pero su oficio sí lo firman.",
    artisans: [
      {
        name: "Eduardo",
        role: "Tallista en madera",
        body: "Aprendió a tallar dentro del centro. Hoy hace los marcos de espejos con animales selváticos que más se venden.",
        img: "/reinsercion-sociolaboral/artesano-Eduardo.webp",
      },
      {
        name: "Jonathan",
        role: "Acabado y barniz",
        body: "Responsable del color y el pulido final. Cada pieza pasa por sus manos antes de salir del taller.",
        img: "/reinsercion-sociolaboral/artesano-Jonathan.webp",
      },
      {
        name: "Jorge",
        role: "Chorreadores y piezas pequeñas",
        body: "Especialista en chorreadores de café — el oficio costarricense por excelencia. Lleva tres años con nosotros.",
        img: "/reinsercion-sociolaboral/artesano-Jorge.webp",
      },
    ],

    workshopsTitle: "Talleres en marcha",
    workshops: [
      {
        title: "Chorreadores de café",
        body: "Técnica tradicional costarricense. Madera + tela + estructura. Producto con demanda nacional e internacional.",
        img: "/reinsercion-sociolaboral/Taller-de-creacion-de-chorreadores-de-cafe.webp",
      },
      {
        title: "Tallado en madera",
        body: "Marcos para espejos, animales de la fauna costarricense, escenas talladas. La pieza estrella de la marca.",
        img: "/reinsercion-sociolaboral/Taller-de-detalle-de-madera.webp",
      },
      {
        title: "Marcos y espejos",
        body: "Ensamble final, espejo cortado a medida, montaje. Coordinación con los talleres de tallado y acabado.",
        img: "/reinsercion-sociolaboral/Taller-de-marcos-y-espejos.webp",
      },
    ],

    partnersTitle: "Con quién trabajamos",
    partnersBody:
      "Operamos en alianza con el Ministerio de Justicia y Paz de Costa Rica y con el INA (Instituto Nacional de Aprendizaje), que aporta la certificación técnica de los oficios.",

    closingTitle: "Cómo apoyar",
    closingBody:
      "La forma más directa es comprar una pieza. Cada compra paga horas de oficio reales, no una etiqueta. Si tu empresa quiere explorar una alianza — convenio de inserción, padrinazgo de un taller, donación con certificado de impacto — escríbenos.",
    contactEmail: "info@handmadeart.store",
    contactPhone: "+506 8423 7555",
    ctaShop: "Ver el catálogo",
    ctaContact: "Escribir para alianzas",
    legalFramework: "Marco legal",
    behindBrand: "Detrás de la marca",
    inPartnership: "En alianza con",
    artisanPortrait: (name: string) => `Retrato del artesano ${name}`,
    ministryAlt: "Ministerio de Justicia y Paz de Costa Rica",
    inaAlt: "Instituto Nacional de Aprendizaje (INA)",
  },
  en: {
    eyebrow: "Costa Rica · Law Project 24870",
    h1: "Behind every piece, a craft that rebuilds lives.",
    sub:
      "Handmade Art is a social-and-labor reintegration company. Every mirror, every coffee dripper, every wooden carving is made inside workshops in rehabilitation centers, where people on a path back to society learn a craft and a sense of self.",
    ctaPrimary: "Browse the pieces",
    ctaSecondary: "Talk to us about partnerships",

    pillarsTitle: "What we do, in a page",
    pillars: [
      {
        title: "Workshops inside the prison system",
        body: "Through an agreement with the Costa Rican Ministry of Justice and Peace, we train incarcerated individuals in wood carving, resin and artisanal finishing.",
      },
      {
        title: "We bring the work to market",
        body: "Every piece you buy here pays the artisan's hours. It is not a donation: it is fair trade between someone who makes and someone who takes home.",
      },
      {
        title: "Support after release",
        body: "When their sentence ends, participants join our artisan network as suppliers. The craft becomes a legitimate, stable source of income.",
      },
    ],

    lawTitle: "What Law Project 24870 proposes",
    lawBody:
      "The bill creates the legal figure of Social and Labor Reintegration Company (EISL): organizations that produce goods or services with an explicit social purpose and a personalized 'reintegration agreement' with each beneficiary. Handmade Art has been operating as an EISL before the figure existed in law — we support the bill because it legitimizes the model and opens the door for more people to start over.",
    populations: {
      title: "Beneficiary populations",
      items: [
        "People recovering from psychoactive substance dependence",
        "People in situation of homelessness",
        "Former or current inmates in semi-institutional regimes",
      ],
    },
    benefits: {
      title: "What the law enables",
      items: [
        "Financing through Development Banking",
        "Free vocational training via INA",
        "Tax benefits for participating companies",
        "50% reduction in workplace-risk insurance premiums",
        "Tariff exemption for workshop equipment",
        "Social impact certificate for donors",
      ],
    },

    artisansTitle: "The people who make the pieces",
    artisansLead:
      "Three of the people producing for Handmade Art today. We don't show full names or faces where it isn't ours to show — but their craft, they sign.",
    artisans: [
      {
        name: "Eduardo",
        role: "Wood carver",
        body: "Learned to carve inside the rehabilitation center. He now makes the wildlife-framed mirrors that have become the brand's signature.",
        img: "/reinsercion-sociolaboral/artesano-Eduardo.webp",
      },
      {
        name: "Jonathan",
        role: "Finish and varnish",
        body: "Responsible for color and final polish. Every piece passes through his hands before leaving the workshop.",
        img: "/reinsercion-sociolaboral/artesano-Jonathan.webp",
      },
      {
        name: "Jorge",
        role: "Coffee drippers and small pieces",
        body: "Specialist in chorreadores — the quintessential Costa Rican coffee craft. Three years with us.",
        img: "/reinsercion-sociolaboral/artesano-Jorge.webp",
      },
    ],

    workshopsTitle: "Workshops in operation",
    workshops: [
      {
        title: "Coffee drippers (chorreadores)",
        body: "Traditional Costa Rican technique. Wood, cloth and frame. A product with steady local and international demand.",
        img: "/reinsercion-sociolaboral/Taller-de-creacion-de-chorreadores-de-cafe.webp",
      },
      {
        title: "Wood carving",
        body: "Mirror frames, Costa Rican wildlife, carved scenes. The brand's hero product line.",
        img: "/reinsercion-sociolaboral/Taller-de-detalle-de-madera.webp",
      },
      {
        title: "Frames and mirrors",
        body: "Final assembly, custom-cut mirror, mounting. Coordinated with the carving and finishing workshops.",
        img: "/reinsercion-sociolaboral/Taller-de-marcos-y-espejos.webp",
      },
    ],

    partnersTitle: "Who we work with",
    partnersBody:
      "We operate in partnership with Costa Rica's Ministry of Justice and Peace and with INA (the National Learning Institute), which provides the technical certification of the trades.",

    closingTitle: "How to support",
    closingBody:
      "The most direct way is to buy a piece. Every purchase pays real hours of craft, not a label. If your company wants to explore a partnership — reintegration agreement, workshop sponsorship, donation with an impact certificate — get in touch.",
    contactEmail: "info@handmadeart.store",
    contactPhone: "+506 8423 7555",
    ctaShop: "Browse the catalog",
    ctaContact: "Email us about partnerships",
    legalFramework: "Legal framework",
    behindBrand: "Behind the brand",
    inPartnership: "In partnership with",
    artisanPortrait: (name: string) => `Portrait of the artisan ${name}`,
    ministryAlt: "Costa Rican Ministry of Justice and Peace",
    inaAlt: "National Learning Institute (INA)",
  },
} as const;

export function getReinsertionMetadata(locale: "es" | "en") {
  return {
    title:
      locale === "es"
        ? "Reinserción sociolaboral — el oficio que hay detrás de cada pieza"
        : "Social reintegration — the craft behind every piece",
    description: COPY[locale].sub,
    image: {
      url: "/reinsercion-sociolaboral/banner-lg.webp",
      width: 1200,
      height: 630,
      alt:
        locale === "es"
          ? "Taller de artesanía en centro de rehabilitación de Costa Rica"
          : "Artisan workshop in a Costa Rican rehabilitation center",
    },
  };
}

export default function ReinsertionPageContent({ locale }: { locale: "es" | "en" }) {
  const t = COPY[locale];

  return (
    <main className="bg-[#FAF6EF] text-[#2D2D2D]">
      {/* HERO */}
      <section className="relative isolate overflow-hidden bg-[#1A1A1A]">
        <div className="absolute inset-0 -z-10">
          <Image
            src="/reinsercion-sociolaboral/banner-lg.webp"
            alt=""
            fill
            priority
            sizes="100vw"
            className="object-cover object-[center_40%]"
          />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-r from-[#1A1A1A]/90 via-[#1A1A1A]/65 to-[#1A1A1A]/30" />
          <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#1A1A1A]/80 via-transparent to-transparent" />
        </div>

        <div className="mx-auto max-w-screen-xl px-4 sm:px-8 lg:px-12 pt-24 pb-16 sm:pt-32 sm:pb-20 lg:pt-40 lg:pb-28">
          <div className="max-w-2xl">
            <p className="font-sans text-[11px] uppercase tracking-[0.22em] text-[#C9A962] mb-5">
              {t.eyebrow}
            </p>
            <h1 className="font-display text-[#F5F1EB] text-[34px] leading-[1.06] sm:text-5xl lg:text-[58px] font-medium tracking-[-0.01em]">
              {t.h1}
            </h1>
            <p className="mt-6 sm:mt-7 text-[#E8E4E0] text-[15px] sm:text-base lg:text-lg leading-relaxed max-w-xl">
              {t.sub}
            </p>
            <div className="mt-8 sm:mt-10 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
              <Link
                href="/products"
                className="inline-flex items-center justify-center px-6 py-3 min-h-[48px] text-[14px] font-semibold tracking-wide text-[#1A1A1A] bg-[#C9A962] rounded-sm hover:bg-[#A08848] hover:text-[#F5F1EB] transition-colors duration-200 shadow-[0_2px_8px_-4px_rgba(160,136,72,0.45)]"
              >
                {t.ctaPrimary}
              </Link>
              <a
                href={`mailto:${t.contactEmail}`}
                className="inline-flex items-center justify-center px-6 py-3 min-h-[48px] text-[14px] font-medium text-[#F5F1EB] bg-transparent border border-[#F5F1EB]/30 rounded-sm hover:bg-[#F5F1EB]/10 hover:border-[#F5F1EB]/60 transition-colors duration-200"
              >
                {t.ctaSecondary}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* PILLARS */}
      <section className="py-16 md:py-24 lg:py-28 bg-[#FAF6EF]">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-8 lg:px-12">
          <h2 className="font-display text-2xl md:text-3xl lg:text-4xl font-medium tracking-[-0.005em] text-[#2D2D2D] max-w-2xl mb-12 md:mb-16">
            {t.pillarsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-12">
            {t.pillars.map((p, i) => (
              <article key={i} className="relative">
                <span aria-hidden className="block font-display text-[#C9A962] text-[42px] leading-none mb-4 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-display text-xl md:text-[22px] font-medium tracking-[-0.005em] text-[#2D2D2D] mb-3">
                  {p.title}
                </h3>
                <p className="text-[15px] leading-relaxed text-[#4A4A4A]">{p.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* LAW PROJECT 24870 */}
      <section className="py-16 md:py-24 lg:py-28 bg-white border-y border-[#E8E4E0]">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#A08848] mb-4">
                {t.legalFramework}
              </p>
              <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] leading-[1.15] font-medium tracking-[-0.005em] text-[#2D2D2D] mb-6">
                {t.lawTitle}
              </h2>
              <p className="text-[15px] md:text-base leading-relaxed text-[#4A4A4A]">
                {t.lawBody}
              </p>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-8 lg:gap-10">
              <div>
                <h3 className="font-display text-base font-medium text-[#2D2D2D] mb-4 tracking-[-0.005em]">
                  {t.populations.title}
                </h3>
                <ul className="space-y-3">
                  {t.populations.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14.5px] text-[#4A4A4A] leading-relaxed">
                      <span aria-hidden className="text-[#A08848] mt-1.5 leading-none">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className="font-display text-base font-medium text-[#2D2D2D] mb-4 tracking-[-0.005em]">
                  {t.benefits.title}
                </h3>
                <ul className="space-y-3">
                  {t.benefits.items.map((item, i) => (
                    <li key={i} className="flex items-start gap-3 text-[14.5px] text-[#4A4A4A] leading-relaxed">
                      <span aria-hidden className="text-[#A08848] mt-1.5 leading-none">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ARTISANS */}
      <section className="py-16 md:py-24 lg:py-28 bg-[#FAF6EF]">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-8 lg:px-12">
          <div className="max-w-2xl mb-12 md:mb-16">
            <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#A08848] mb-4">
              {t.behindBrand}
            </p>
            <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] leading-[1.15] font-medium tracking-[-0.005em] text-[#2D2D2D] mb-5">
              {t.artisansTitle}
            </h2>
            <p className="text-[15px] md:text-base leading-relaxed text-[#4A4A4A]">
              {t.artisansLead}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {t.artisans.map((a) => (
              <article key={a.name} className="group">
                <div className="relative aspect-[4/5] mb-5 overflow-hidden bg-[#2D2D2D] rounded-sm">
                  <Image
                    src={a.img}
                    alt={t.artisanPortrait(a.name)}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
                  />
                </div>
                <h3 className="font-display text-xl font-medium text-[#2D2D2D] tracking-[-0.005em]">
                  {a.name}
                </h3>
                <p className="text-[12px] uppercase tracking-[0.12em] text-[#A08848] mt-1 mb-3">
                  {a.role}
                </p>
                <p className="text-[14.5px] leading-relaxed text-[#4A4A4A]">{a.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* WORKSHOPS */}
      <section className="py-16 md:py-24 lg:py-28 bg-white border-y border-[#E8E4E0]">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-8 lg:px-12">
          <h2 className="font-display text-2xl md:text-3xl lg:text-[36px] leading-[1.15] font-medium tracking-[-0.005em] text-[#2D2D2D] max-w-2xl mb-12 md:mb-16">
            {t.workshopsTitle}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {t.workshops.map((w) => (
              <article key={w.title} className="bg-[#FAF6EF] border border-[#E8E4E0]/70 rounded-sm overflow-hidden">
                <div className="relative aspect-[4/3] bg-[#E8E4E0]">
                  <Image
                    src={w.img}
                    alt={w.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-5 md:p-6">
                  <h3 className="font-display text-lg md:text-xl font-medium tracking-[-0.005em] text-[#2D2D2D] mb-2">
                    {w.title}
                  </h3>
                  <p className="text-[14.5px] leading-relaxed text-[#4A4A4A]">{w.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* PARTNERS */}
      <section className="py-16 md:py-20 bg-[#FAF6EF]">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <p className="font-sans text-[11px] uppercase tracking-[0.18em] text-[#A08848] mb-4">
                {t.inPartnership}
              </p>
              <h2 className="font-display text-2xl md:text-3xl font-medium tracking-[-0.005em] text-[#2D2D2D] mb-5">
                {t.partnersTitle}
              </h2>
              <p className="text-[15px] md:text-base leading-relaxed text-[#4A4A4A] max-w-xl">
                {t.partnersBody}
              </p>
            </div>
            <div className="lg:col-span-5 grid grid-cols-2 gap-4">
              <div className="relative aspect-square bg-white border border-[#E8E4E0] rounded-sm overflow-hidden grid place-items-center p-6">
                <Image
                  src="/reinsercion-sociolaboral/Ministerio-de-Justicia y-Paz.webp"
                  alt={t.ministryAlt}
                  width={220}
                  height={220}
                  sizes="(max-width: 1024px) 50vw, 220px"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="relative aspect-square bg-white border border-[#E8E4E0] rounded-sm overflow-hidden grid place-items-center p-6">
                <Image
                  src="/reinsercion-sociolaboral/ina-logo.webp"
                  alt={t.inaAlt}
                  width={220}
                  height={220}
                  sizes="(max-width: 1024px) 50vw, 220px"
                  className="w-full h-full object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLOSING / CTA */}
      <section className="py-20 md:py-28 bg-[#2D2D2D] text-[#F5F1EB]">
        <div className="mx-auto max-w-screen-xl px-4 sm:px-8 lg:px-12">
          <div className="max-w-2xl">
            <h2 className="font-display text-3xl md:text-4xl lg:text-[44px] leading-[1.1] font-medium tracking-[-0.01em] mb-6">
              {t.closingTitle}
            </h2>
            <p className="text-[#E8E4E0] text-base md:text-lg leading-relaxed mb-10">
              {t.closingBody}
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-10">
              <Link
                href="/products"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 min-h-[48px] text-[14px] font-semibold tracking-wide text-[#1A1A1A] bg-[#C9A962] rounded-sm hover:bg-[#D4C4A8] transition-colors duration-200"
              >
                {t.ctaShop}
                <ArrowRight className="h-4 w-4" strokeWidth={1.5} aria-hidden />
              </Link>
              <a
                href={`mailto:${t.contactEmail}`}
                className="inline-flex items-center justify-center px-6 py-3 min-h-[48px] text-[14px] font-medium text-[#F5F1EB] bg-transparent border border-[#F5F1EB]/30 rounded-sm hover:bg-[#F5F1EB]/10 hover:border-[#F5F1EB]/60 transition-colors duration-200"
              >
                {t.ctaContact}
              </a>
            </div>

            <ul className="flex flex-col sm:flex-row gap-x-8 gap-y-3 text-[14px] text-[#B5AC9D]">
              <li>
                <a
                  href={`mailto:${t.contactEmail}`}
                  className="inline-flex items-center gap-2 hover:text-[#C9A962] transition-colors"
                >
                  <Mail className="h-4 w-4 text-[#A08848]" strokeWidth={1.5} aria-hidden />
                  {t.contactEmail}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${t.contactPhone.replace(/\s/g, "")}`}
                  className="inline-flex items-center gap-2 hover:text-[#C9A962] transition-colors tabular-nums"
                >
                  <Phone className="h-4 w-4 text-[#A08848]" strokeWidth={1.5} aria-hidden />
                  {t.contactPhone}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </main>
  );
}
