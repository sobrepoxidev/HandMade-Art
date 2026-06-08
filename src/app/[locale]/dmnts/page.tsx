import { buildMetadata } from "@/lib/metadata";
import type { Metadata } from "next";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { ArrowRight, Handshake, ShoppingBag, Tv, Users } from "lucide-react";

type tParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale = locale === "es" ? "es" : "en";

  return await buildMetadata({
    locale: currentLocale,
    pathname: `/${locale}/dmnts`,
    title:
      currentLocale === "es"
        ? "Handmade Art en DMNTS Edición 8"
        : "Handmade Art in DMNTS Edition 8",
    description:
      currentLocale === "es"
        ? "Handmade Art participa en DMNTS Edición 8 para impulsar el Proyecto de Ley 24870 sobre reinserción sociolaboral en Costa Rica."
        : "Handmade Art participates in DMNTS Edition 8 to promote Law Project 24870 on social and labor reintegration in Costa Rica.",
    image: {
      url: "/dmnts/banner.webp",
      width: 1200,
      height: 630,
      alt:
        currentLocale === "es"
          ? "Handmade Art en DMNTS Edición 8"
          : "Handmade Art in DMNTS Edition 8",
    },
  });
}

export default async function DMNTSPage({ params }: { params: tParams }) {
  const { locale } = await params;
  const isEs = locale === "es";

  const pillars = [
    {
      title: isEs ? "Visibilidad nacional" : "National visibility",
      body: isEs
        ? "DMNTS abre una vitrina para explicar por qué la reinserción sociolaboral necesita mercado, alianzas y continuidad."
        : "DMNTS gives us a stage to explain why social reintegration needs market access, alliances and continuity.",
    },
    {
      title: isEs ? "Modelo sostenible" : "Sustainable model",
      body: isEs
        ? "Presentamos una tienda real: piezas comprables, horas de oficio pagadas y talleres que pueden crecer."
        : "We present a real store: pieces people can buy, paid craft hours and workshops that can grow.",
    },
    {
      title: isEs ? "Proyecto de Ley 24870" : "Law Project 24870",
      body: isEs
        ? "La participación ayuda a poner sobre la mesa la figura de Empresa de Inserción Sociolaboral en Costa Rica."
        : "The participation helps bring Costa Rica's Social and Labor Reintegration Company model into the public conversation.",
    },
  ];

  const supportCards = [
    {
      icon: Tv,
      title: isEs ? "Ver el programa" : "Watch the program",
      body: isEs
        ? "Seguí nuestra participación en DMNTS y compartí el caso cuando salga al aire."
        : "Follow our DMNTS participation and share the case when it airs.",
    },
    {
      icon: ShoppingBag,
      title: isEs ? "Comprar una pieza" : "Buy a piece",
      body: isEs
        ? "Cada compra paga trabajo real y demuestra que el modelo puede sostenerse con comercio justo."
        : "Every purchase pays real work and proves the model can stand on fair trade.",
    },
    {
      icon: Handshake,
      title: isEs ? "Abrir una alianza" : "Open a partnership",
      body: isEs
        ? "Empresas e instituciones pueden apoyar talleres, formación o certificaciones de impacto."
        : "Companies and institutions can support workshops, training or impact certifications.",
    },
  ];

  return (
    <main className="bg-[#FAF6EF] text-[#2D2D2D]">
      <section className="relative isolate min-h-[calc(100vh-112px)] overflow-hidden bg-[#1A1A1A]">
        <Image
          src="/dmnts/banner.webp"
          alt={isEs ? "Handmade Art en DMNTS Edición 8" : "Handmade Art in DMNTS Edition 8"}
          fill
          className="object-cover"
          priority
          sizes="100vw"
        />
        <div aria-hidden className="absolute inset-0 bg-[#1A1A1A]/68" />
        <div className="relative z-10 mx-auto flex min-h-[calc(100vh-112px)] max-w-screen-xl items-end px-4 py-14 sm:px-8 md:py-20 lg:px-12">
          <div className="max-w-3xl text-[#F5F1EB]">
            <p className="mb-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A962]">
              {isEs ? "DMNTS Edición 8 · Teletica" : "DMNTS Edition 8 · Teletica"}
            </p>
            <h1 className="font-display text-[clamp(42px,7vw,72px)] font-medium leading-[0.95] tracking-[-0.01em]">
              {isEs
                ? "Una vitrina nacional para una segunda oportunidad."
                : "A national stage for a second chance."}
            </h1>
            <p className="mt-6 max-w-[62ch] text-base leading-relaxed text-[#F5F1EB]/88 md:text-[17px]">
              {isEs
                ? "Handmade Art participa en DMNTS para impulsar el Proyecto de Ley 24870 y mostrar que la reinserción sociolaboral puede sostenerse con piezas artesanales vendidas en serio."
                : "Handmade Art participates in DMNTS to promote Law Project 24870 and show that social reintegration can be sustained through serious commerce in handmade pieces."}
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link
                href="/products"
                locale={locale}
                className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#C9A962] px-5 py-2.5 text-sm font-semibold tracking-wide text-[#1A1A1A] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#A08848] hover:text-[#F5F1EB]"
              >
                {isEs ? "Ver piezas" : "Browse pieces"}
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              <Link
                href={isEs ? "/reinsercion-sociolaboral" : "/social-reintegration"}
                locale={locale}
                className="inline-flex min-h-[44px] items-center justify-center rounded-sm border border-[#F5F1EB]/30 px-5 py-2.5 text-sm font-semibold tracking-wide text-[#F5F1EB] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#F5F1EB]/10"
              >
                {isEs ? "Conocer el proyecto" : "Learn about the project"}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-screen-xl gap-10 px-4 py-16 sm:px-8 md:py-24 lg:grid-cols-[0.42fr_0.58fr] lg:px-12">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
            {isEs ? "Por qué participamos" : "Why we participate"}
          </p>
          <h2 className="mt-3 font-display text-[clamp(30px,4vw,46px)] font-medium leading-tight tracking-[-0.005em] text-[#2D2D2D]">
            {isEs ? "No vamos a contar una idea. Vamos a mostrar una tienda viva." : "We are not pitching an idea. We are showing a working store."}
          </h2>
        </div>
        <div className="space-y-5 text-base leading-relaxed text-[#4A4A4A] md:text-[17px]">
          <p>
            {isEs
              ? "Con más de 120 emprendimientos inscritos, DMNTS pone a Handmade Art frente a audiencias, mentores y aliados que pueden acelerar el trabajo que ya ocurre dentro de los talleres."
              : "With more than 120 ventures registered, DMNTS puts Handmade Art in front of audiences, mentors and partners who can accelerate the work already happening inside the workshops."}
          </p>
          <p>
            {isEs
              ? "La meta no es solo ganar exposición. Es demostrar que la reinserción sociolaboral puede tener una ruta comercial clara: piezas premium, clientes reales y un sistema que paga horas de oficio."
              : "The goal is not exposure alone. It is to prove that social reintegration can have a clear commercial path: premium pieces, real customers and a system that pays craft hours."}
          </p>
        </div>
      </section>

      <section className="border-y border-[#E8E4E0] bg-[#F5F1EB]">
        <div className="mx-auto grid max-w-screen-xl gap-4 px-4 py-16 sm:px-8 md:grid-cols-3 md:py-20 lg:px-12">
          {pillars.map((item, index) => (
            <article
              key={item.title}
              className="border border-[#E8E4E0] bg-[#FAF6EF] p-5 shadow-[0_2px_8px_-4px_rgba(61,46,32,0.12)]"
            >
              <span className="font-display text-3xl font-medium text-[#C9A962]">
                {index + 1}
              </span>
              <h3 className="mt-6 font-display text-xl font-medium tracking-[-0.005em] text-[#2D2D2D]">
                {item.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-[#4A4A4A]">{item.body}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto grid max-w-screen-xl gap-10 px-4 py-16 sm:px-8 md:py-24 lg:grid-cols-[0.52fr_0.48fr] lg:px-12">
        <div className="relative aspect-[4/3] overflow-hidden border border-[#E8E4E0] bg-[#F5F1EB]">
          <Image
            src="/dmnts/proyecto.webp"
            alt={isEs ? "Proyecto Handmade Art presentado en DMNTS" : "Handmade Art project presented in DMNTS"}
            fill
            className="object-cover"
            sizes="(min-width: 1024px) 52vw, 100vw"
          />
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
            {isEs ? "Qué presentamos" : "What we present"}
          </p>
          <h2 className="mt-3 font-display text-[clamp(30px,4vw,46px)] font-medium leading-tight tracking-[-0.005em] text-[#2D2D2D]">
            {isEs ? "Producto, impacto y escalabilidad en una misma mesa." : "Product, impact and scale at the same table."}
          </h2>
          <ul className="mt-6 space-y-4 text-sm leading-relaxed text-[#4A4A4A] md:text-base">
            <li>
              <span className="font-medium text-[#2D2D2D]">
                {isEs ? "Modelo comercial:" : "Commercial model:"}
              </span>{" "}
              {isEs
                ? "venta de artesanías de alta calidad con historia verificable y stock real."
                : "sale of high-quality handmade pieces with verifiable story and real stock."}
            </li>
            <li>
              <span className="font-medium text-[#2D2D2D]">
                {isEs ? "Impacto social:" : "Social impact:"}
              </span>{" "}
              {isEs
                ? "talleres que convierten formación en ingresos legítimos para personas en reinserción."
                : "workshops that turn training into legitimate income for people rebuilding their path."}
            </li>
            <li>
              <span className="font-medium text-[#2D2D2D]">
                {isEs ? "Crecimiento:" : "Growth:"}
              </span>{" "}
              {isEs
                ? "alianzas para abrir más talleres, certificar oficios y llevar las piezas a más compradores."
                : "partnerships to open more workshops, certify trades and bring the pieces to more buyers."}
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-[#1A1A1A] text-[#F5F1EB]">
        <div className="mx-auto grid max-w-screen-xl gap-10 px-4 py-16 sm:px-8 md:py-20 lg:grid-cols-[0.35fr_0.65fr] lg:px-12">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#C9A962]">
              {isEs ? "Cómo apoyar" : "How to support"}
            </p>
            <h2 className="mt-3 font-display text-3xl font-medium tracking-[-0.005em]">
              {isEs ? "Tres acciones concretas." : "Three concrete actions."}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {supportCards.map((item) => {
              const Icon = item.icon;

              return (
                <article key={item.title} className="border border-[#F5F1EB]/12 p-5">
                  <Icon className="h-5 w-5 text-[#C9A962]" strokeWidth={1.5} aria-hidden />
                  <h3 className="mt-5 font-display text-xl font-medium tracking-[-0.005em]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[#B5AC9D]">{item.body}</p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-8 md:py-24 lg:px-12">
        <div className="mx-auto flex max-w-screen-xl flex-col items-start justify-between gap-6 border border-[#E8E4E0] bg-[#F5F1EB] p-6 md:flex-row md:items-center md:p-8">
          <div className="max-w-2xl">
            <div className="mb-4 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#A08848]">
              <Users className="h-4 w-4" aria-hidden />
              {isEs ? "Reinserción sociolaboral" : "Social reintegration"}
            </div>
            <h2 className="font-display text-3xl font-medium tracking-[-0.005em] text-[#2D2D2D]">
              {isEs ? "La mejor forma de apoyar es que la pieza encuentre casa." : "The best support is for the piece to find a home."}
            </h2>
            <p className="mt-4 text-sm leading-relaxed text-[#4A4A4A] md:text-base">
              {isEs
                ? "Comprar, compartir o abrir una alianza empuja el mismo objetivo: más horas de taller, más oficio y más rutas de regreso."
                : "Buying, sharing or opening a partnership pushes the same goal: more workshop hours, more craft and more routes back."}
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Link
              href="/products"
              locale={locale}
              className="inline-flex min-h-[44px] items-center justify-center gap-2 rounded-sm bg-[#2D2D2D] px-5 py-2.5 text-sm font-semibold tracking-wide text-[#F5F1EB] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:bg-[#1A1A1A]"
            >
              {isEs ? "Comprar piezas" : "Shop pieces"}
              <ArrowRight className="h-4 w-4" aria-hidden />
            </Link>
            <a
              href="https://www.instagram.com/handmadeart.store"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[44px] items-center justify-center rounded-sm border border-[#E8E4E0] px-5 py-2.5 text-sm font-semibold tracking-wide text-[#2D2D2D] transition duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#A08848]"
            >
              {isEs ? "Seguir en Instagram" : "Follow on Instagram"}
            </a>
          </div>
        </div>
      </section>
    </main>
  );
}
