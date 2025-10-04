// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import { buildMetadata } from "@/lib/metadata";
import Script from "next/script";

import Navbar from "@/components/general/Navbar";
import Footer from "@/components/general/Footer";
import SessionLayout from "@/components/SessionLayout";
import ClientLayout from "@/components/ClientLayout";
import { NextIntlClientProvider } from "next-intl";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

type tParams = Promise<{ locale: string }>;

export async function generateMetadata({
  params,
}: {
  params: tParams;
}): Promise<Metadata> {
  const headersList = await headers();
  const host =
    headersList.get("x-forwarded-host")?.trim() ||
    headersList.get("host")?.trim() ||
    "artehechoamano.com";

  const invokePath = headersList.get("x-invoke-pathname")?.trim() || "/";
  const pathname = invokePath.startsWith("/") ? invokePath : `/${invokePath}`;

  const { locale } = await params;
  const isEs = locale === "es";

  // Copy más atractivo para CTR (puedes tunearlo luego)
  const title = isEs
    ? "Artesanías con propósito en Costa Rica — espejos, chorreadores y regalos únicos"
    : "Handmade with purpose from Costa Rica — mirrors, coffee drippers & unique gifts";

  const description = isEs
    ? "Compra arte hecho a mano con calidad real. Espejos, chorreadores y piezas únicas. Envíos en todo el país. Cada compra apoya la reinserción social."
    : "Shop handmade mirrors, coffee drippers and one-of-a-kind pieces. Fast shipping. Every purchase supports social reintegration.";

  const metadata = await buildMetadata({
    locale: isEs ? "es" : "en",
    pathname,
    title,
    description,
    // Si quieres forzar otra imagen por layout, pásala aquí; si no, usa la default de /web-image.jpg
    // image: { url: `${process.env.NEXT_PUBLIC_SITE_URL}/og/handmade-hero-1024.jpg`, width: 1024, height: 1024, alt: 'Handmade Art OG' }
  });

  return {
    metadataBase: new URL(`https://${host}`),
    ...metadata,
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: tParams;
}) {
  const { locale } = await params;

  if (!hasLocale(routing.locales, locale)) {
    throw new Error("Invalid locale");
  }

  const isEs = locale === "es";

  return (
    <html lang={locale} className="bg-white">
      <body className="antialiased">
        <NextIntlClientProvider locale={locale}>
          <SessionLayout>
            <Navbar locale={locale} />
            {children}
            <Footer locale={locale} />
            <Toaster position="top-center" />
            <Analytics />
            <ClientLayout />
          </SessionLayout>
        </NextIntlClientProvider>

        {/* Organization JSON-LD */}
        <Script
          id="structured-data-org"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Handmade Art",
              description: isEs
                ? "Arte costarricense hecho a mano: espejos, chorreadores y piezas únicas. Envíos a todo el país. Cada compra apoya la reinserción social."
                : "Costa Rican handmade art: mirrors, coffee drippers and unique pieces. Fast shipping. Every purchase supports social reintegration.",
              url: "https://artehechoamano.com",
              logo: "https://artehechoamano.com/og-image-optimized.svg",
              image: [
                "https://artehechoamano.com/web-image.jpg",
                "https://artehechoamano.com/home/artesano.webp",
                "https://artehechoamano.com/home/artisan-working.webp",
              ],
              areaServed: "CR",
              telephone: "+506 8585 0000",
              email: "info@artehechoamano.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "San Ramón, Alajuela",
                addressLocality: "San Ramón",
                addressRegion: "Alajuela",
                postalCode: "20201",
                addressCountry: "CR",
              },
              sameAs: [
                "https://www.facebook.com/handmadeart",
                "https://www.instagram.com/handmadeart",
              ],
            }),
          }}
        />
      </body>
    </html>
  );
}
