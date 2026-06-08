// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import { Suspense } from "react";
import { Frank_Ruhl_Libre, Geist } from "next/font/google";
import { headers } from "next/headers";

const fontDisplay = Frank_Ruhl_Libre({
  subsets: ["latin"],
  variable: "--font-display-family",
  weight: ["400", "500", "700", "900"],
  display: "swap",
});

const fontSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans-family",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://artehechoamano.com"),
  icons: { icon: "/favicon.ico" },
  openGraph: {
    images: [
      {
        url: '/og-image.webp',
        width: 500,
        height: 500,
        alt: 'Handmade Art - Arte costarricense hecho a mano',
        type: 'image/webp',
      },
    ],
    siteName: 'Handmade Art',
    locale: 'es_CR',
    type: 'website',
    title: 'Handmade Art | Arte Costarricense Hecho a Mano',
    description: 'Descubre arte 100% hecho a mano en Costa Rica: pinturas, esculturas y piezas únicas. Envíos a todo el país.',
  },
  twitter: {
    card: 'summary_large_image',
    images: ['/og-image.webp'],
    title: 'Handmade Art | Costa Rican Handmade Art',
    description: 'Shop unique handmade art pieces from Costa Rica—paintings, sculptures and décor—crafted by local artisans.',
  },
};


export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const headersList = await headers();
  const pathname =
    headersList.get("x-invoke-pathname") ||
    headersList.get("x-pathname") ||
    "";
  const host = headersList.get("host") || "";
  const locale = pathname.startsWith("/en") || host.includes("handmadeart.store") ? "en" : "es";

  return (
    <html lang={locale} className={`bg-[#FAF6EF] ${fontDisplay.variable} ${fontSans.variable}`}>
      <head>
        <link rel="preconnect" href="https://mzeixepwwyowiqgwkopw.supabase.co" />
        <link rel="preconnect" href="https://r5457gldorgj6mug.public.blob.vercel-storage.com" />
        <link rel="dns-prefetch" href="https://mzeixepwwyowiqgwkopw.supabase.co" />
        <link rel="dns-prefetch" href="https://r5457gldorgj6mug.public.blob.vercel-storage.com" />
        <link
          rel="preload"
          href="https://r5457gldorgj6mug.public.blob.vercel-storage.com/public/logo-LjcayV8P6SUxpAv0Hv61zn3t1XNhLw.svg"
          as="image"
          type="image/svg+xml"
        />
      </head>
      <body className="antialiased bg-[#FAF6EF]">
        <Suspense>
          <CartProvider>{children}</CartProvider>
        </Suspense>
      </body>
    </html>
  );
}
