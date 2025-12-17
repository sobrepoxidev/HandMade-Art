// src/app/[locale]/layout.tsx
import type { Metadata, Viewport } from "next";
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

// Viewport optimization for mobile
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAF8F5" },
    { media: "(prefers-color-scheme: dark)", color: "#2D2D2D" },
  ],
};

// Domain configuration for bi-domain SEO
const DOMAINS = {
  es: "artehechoamano.com",
  en: "handmadeart.store",
} as const;

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

  const currentDomain = isEs ? DOMAINS.es : DOMAINS.en;
  const currentUrl = `https://${currentDomain}`;

  return (
    <html lang={locale} className="bg-[#FAF8F5]">
      <head>
        {/* Preconnect to critical third-party origins */}
        <link rel="preconnect" href="https://mzeixepwwyowiqgwkopw.supabase.co" />
        <link rel="preconnect" href="https://r5457gldorgj6mug.public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://mzeixepwwyowiqgwkopw.supabase.co" />
        <link rel="dns-prefetch" href="https://r5457gldorgj6mug.public.blob.vercel-storage.com" />

        {/* Preload critical assets */}
        <link
          rel="preload"
          href="https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/logo-LjcayV8P6SUxpAv0Hv61zn3t1XNhLw.svg"
          as="image"
          type="image/svg+xml"
        />
      </head>
      <body className="antialiased bg-[#FAF8F5]">
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
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Handmade Art",
              alternateName: isEs ? "Arte Hecho a Mano" : "Handmade Art Costa Rica",
              description: isEs
                ? "Arte costarricense hecho a mano: espejos, chorreadores y piezas únicas. Envíos a todo el país. Cada compra apoya la reinserción social."
                : "Costa Rican handmade art: mirrors, coffee drippers and unique pieces. Fast shipping. Every purchase supports social reintegration.",
              url: currentUrl,
              logo: {
                "@type": "ImageObject",
                url: `${currentUrl}/og-image-optimized.svg`,
                width: 512,
                height: 512,
              },
              image: [
                `${currentUrl}/web-image.jpg`,
                `${currentUrl}/home/artesano.webp`,
                `${currentUrl}/home/artisan-working.webp`,
              ],
              areaServed: {
                "@type": "Country",
                name: "Costa Rica",
              },
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

        {/* WebSite JSON-LD for Search Box */}
        <Script
          id="structured-data-website"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebSite",
              name: "Handmade Art",
              url: currentUrl,
              potentialAction: {
                "@type": "SearchAction",
                target: {
                  "@type": "EntryPoint",
                  urlTemplate: `${currentUrl}/${locale}/search?q={search_term_string}`,
                },
                "query-input": "required name=search_term_string",
              },
              inLanguage: isEs ? "es-CR" : "en-US",
            }),
          }}
        />

        {/* LocalBusiness JSON-LD for local SEO */}
        <Script
          id="structured-data-localbusiness"
          type="application/ld+json"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Store",
              name: "Handmade Art",
              image: `${currentUrl}/web-image.jpg`,
              "@id": `${currentUrl}/#store`,
              url: currentUrl,
              telephone: "+506 8585 0000",
              priceRange: "$$",
              address: {
                "@type": "PostalAddress",
                streetAddress: "San Ramón",
                addressLocality: "San Ramón",
                addressRegion: "Alajuela",
                postalCode: "20201",
                addressCountry: "CR",
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 10.0866,
                longitude: -84.4694,
              },
              openingHoursSpecification: {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
                opens: "08:00",
                closes: "18:00",
              },
            }),
          }}
        />
      </body>
    </html>
  );
}
