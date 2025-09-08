// src/app/layout.tsx
import "./globals.css";
import type { Metadata } from "next";
import { CartProvider } from "@/context/CartContext";
import { Suspense } from "react";

export const metadata: Metadata = {
  metadataBase: new URL("https://artehechoamano.com"),
  icons: { icon: "/favicon.ico" },
  openGraph: {
    images: [
      {
        url: '/og-image-optimized.svg',
        width: 1200,
        height: 630,
        alt: 'Handmade Art - Arte costarricense hecho a mano',
        type: 'image/svg+xml',
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
    images: ['/og-image-optimized.svg'],
    title: 'Handmade Art | Costa Rican Handmade Art',
    description: 'Shop unique handmade art pieces from Costa Rica—paintings, sculptures and décor—crafted by local artisans.',
  },
};


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense>
      <CartProvider>{children}</CartProvider>
    </Suspense>
  );
}
