// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import {
  buildMetadata
} from "@/lib/seoConfig";
import Script from "next/script";
import Navbar from "@/components/general/Navbar";
import Footer from "@/components/general/Footer";
import SessionLayout from "@/components/SessionLayout";
import { NextIntlClientProvider } from "next-intl";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

type tParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const headersList = await headers();
  const host =
    headersList.get("x-forwarded-host")?.trim() ||
    headersList.get("host")?.trim() ||
    "sobrepoxi.com";
  const pathname = headersList.get("x-invoke-pathname")?.trim() || "/";
  const { locale } = await params;

  const path = pathname === "/" ? "" : pathname;       
  const otherLocale = locale === "es" ? "en" : "es";

  return {
    metadataBase: new URL(`https://${host}`),

    ...buildMetadata({
      locale: locale === "es" ? "es" : "en",
      pathname,
      title: locale === "es" 
        ? "SobrePoxi - Muebles con Resina Epóxica y Pisos Epóxicos Industriales en Costa Rica"
        : "SobrePoxi - Epoxy Resin Furniture and Industrial Epoxy Floors in Costa Rica",
      description: locale === "es"
        ? "Empresa líder en Costa Rica especializada en muebles únicos con resina epóxica y pisos epóxicos industriales de alta resistencia. Calidad garantizada y diseños personalizados."
        : "Leading company in Costa Rica specialized in unique epoxy resin furniture and high-resistance industrial epoxy floors. Guaranteed quality and custom designs."
    }),

    // ——— Canonical + hreflangs ———
    alternates: {
      canonical: `https://${host}/${locale}${path}`,
      languages: {
        [locale === "es" ? "es-cr" : "en-us"]:
          `https://${host}/${locale}${path}`,
        [otherLocale === "es" ? "es-cr" : "en-us"]:
          `https://${host}/${otherLocale}${path}`,
        "x-default": `https://${host}/${locale}${path}`,
      },
    },
  };
}


export default async function LocaleLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: tParams;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) {
    // 404 si locale no existe
    throw new Error("Invalid locale");
  }

  return (
    <html lang={locale}>
      <body className="antialiased bg-[#121212]">
        <NextIntlClientProvider locale={locale}>
          <SessionLayout>
            <Navbar locale={locale} />
            {children}
            <Footer locale={locale} />
            <Toaster position="top-center" />
            <Analytics />
          </SessionLayout>
        </NextIntlClientProvider>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "HomeAndConstructionBusiness",
              name: "SobrePoxi",
              description: locale === "es"
                ? "Empresa líder en Costa Rica especializada en muebles únicos con resina epóxica y pisos epóxicos industriales de alta resistencia. Calidad garantizada y diseños personalizados."
                : "Leading company in Costa Rica specialized in unique epoxy resin furniture and high-resistance industrial epoxy floors. Guaranteed quality and custom designs.",
              url: "https://sobrepoxi.com",
              logo: "https://sobrepoxi.com/logo.png",
              image: [
                "https://sobrepoxi.com/og-image.jpg",
                "https://sobrepoxi.com/gallery/epoxy-floors-1.jpg",
                "https://sobrepoxi.com/gallery/luxury-furniture-1.jpg"
              ],
              areaServed: "Costa Rica",
              telephone: "+506 8888-8888",
              email: "info@sobrepoxi.com",
              address: {
                "@type": "PostalAddress",
                streetAddress: "Barrio San José, 200 metros sur de la Iglesia Católica",
                addressLocality: "San José",
                addressRegion: "San José",
                postalCode: "10101",
                addressCountry: "CR"
              },
              geo: {
                "@type": "GeoCoordinates",
                latitude: 9.9281,
                longitude: -84.0907
              },
              hasMap: "https://maps.google.com/?q=9.9281,-84.0907",
              priceRange: "$$-$$$",
              openingHours: [
                "Mo-Fr 08:00-17:00",
                "Sa 08:00-12:00"
              ],
              sameAs: [
                "https://www.facebook.com/sobrepoxi",
                "https://www.instagram.com/sobrepoxi",
                "https://www.tiktok.com/@sobrepoxi",
                "https://www.youtube.com/@sobrepoxi"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
