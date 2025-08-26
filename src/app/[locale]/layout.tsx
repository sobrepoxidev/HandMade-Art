// src/app/[locale]/layout.tsx
import type { Metadata } from "next";
import { headers } from "next/headers";
import { hasLocale } from "next-intl";
import { routing } from "@/i18n/routing";
import {
  buildMetadata,
} from "@/lib/metadata";

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
    'artehechoamano.com';
  const pathname = headersList.get("x-invoke-pathname")?.trim() || "/";
  const { locale } = await params;
  
  return {
    metadataBase: new URL(`https://${host}`),
    ...buildMetadata({ 
      locale: locale === "es" ? "es" : "en", 
      pathname: pathname 
    }),
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
          </SessionLayout>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
