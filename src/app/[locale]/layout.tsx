// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import {
  buildMetadata,
} from "@/lib/metadata";
import Script from "next/script";

import Navbar from "@/components/general/Navbar";
import Footer from "@/components/general/Footer";
import SessionLayout from "@/components/SessionLayout";
import ClientLayout from "@/components/ClientLayout";
import { NextIntlClientProvider } from "next-intl";
import { Analytics } from "@vercel/analytics/react";
import { Toaster } from "react-hot-toast";

type tParams = Promise<{ locale: string }>;

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const headersList = await headers();
  const host = 
    headersList.get("x-forwarded-host")?.trim() || 
    headersList.get("host")?.trim() ||
    'artehechoamano.com';
  const pathname = headersList.get("x-invoke-pathname")?.trim() || "/";
  const { locale } = await params;
  
  const path = pathname === "/" ? "" : pathname;
  const otherLocale = locale === "es" ? "en" : "es";
  
  return {
    metadataBase: new URL(`https://${host}`),
    
    ...buildMetadata({ 
      locale: locale === "es" ? "es" : "en", 
      pathname: pathname,
      title: locale === "es"
        ? "Handmade Art | Arte Costarricense Hecho a Mano"
        : "Handmade Art | Costa Rican Handmade Art",
      description: locale === "es"
        ? "Descubre arte 100% hecho a mano en Costa Rica: Espejos, chorreadores y piezas únicas. Envíos a todo el país."
        : "Shop unique handmade art pieces from Costa Rica—mirrors, chorroades and décor—crafted by local artisans and shipped fast to the USA."
    })
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
  console.log("locale:", locale);
  console.log("locales: ", routing.locales);
  if (!hasLocale(routing.locales, locale)) {
    // 404 si locale no existe
    throw new Error("Invalid locale");
  }

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
            {/* ClientLayout para componentes del lado del cliente */}
            <ClientLayout />
          </SessionLayout>
        </NextIntlClientProvider>
        <Script
          id="structured-data"
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              "name": "Handmade Art",
              "description": locale === "es"
                ? "Descubre arte 100% hecho a mano en Costa Rica: pinturas, esculturas y piezas únicas. Envíos a todo el país."
                : "Shop unique handmade art pieces from Costa Rica—paintings, sculptures and décor—crafted by local artisans and shipped fast to the USA.",
              "url": "https://artehechoamano.com",
              "logo": "https://artehechoamano.com/og-image-optimized.svg",
              "image": [
                "https://artehechoamano.com/og-image.jpg",
                "https://artehechoamano.com/home/artesano.webp",
                "https://artehechoamano.com/home/artisan-working.webp"
              ],
              "areaServed": "Costa Rica",
              "telephone": "+506 8585 0000",
              "email": "info@artehechoamano.com",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "San Ramón, Alajuela",
                "addressLocality": "San Ramón",
                "addressRegion": "Alajuela",
                "postalCode": "20201",
                "addressCountry": "CR"
              },
              "sameAs": [
                "https://www.facebook.com/handmadeart",
                "https://www.instagram.com/handmadeart"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
