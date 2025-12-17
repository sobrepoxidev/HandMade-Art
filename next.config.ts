// next.config.ts
import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin();

/**
 * Complete Next.js configuration.
 *
 * - images.remotePatterns → allows hot-linking from Supabase & Vercel Blob.
 * - htmlLimitedBots       → disables streaming-metadata for listed crawlers
 *                           (they get the "classic" blocking HTML).
 */
const nextConfig: NextConfig = {
  // 1️⃣  Crawler control – disable streaming for these user-agents
  htmlLimitedBots: /Googlebot|bingbot|Baiduspider|YandexBot|DuckDuckBot|facebookexternalhit|Twitterbot|MyBot|OtherBot|SimpleCrawler/,

  // 2️⃣  Compress responses for better performance
  compress: true,

  // 3️⃣  Power optimizations
  poweredByHeader: false, // Remove X-Powered-By header for security

  // 4️⃣  Existing image-domain whitelist
  images: {
    // Mantén las imágenes en caché 31 días en el edge
    minimumCacheTTL: 26_784_00,      // 60*60*24*31
    // Define los tamaños que realmente usas (px)
    deviceSizes: [375, 640, 768, 1024, 1280],
    imageSizes: [16, 32, 48, 64, 96, 128],
    // Lista blanca de calidades permitidas
    qualities: [40, 60, 75],
    // Formato moderno preferido
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mzeixepwwyowiqgwkopw.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'r5457gldorgj6mug.public.blob.vercel-storage.com',
      },
    ],
  },

  // 5️⃣  Experimental features for performance
  experimental: {
    // Optimize package imports for smaller bundles
    optimizePackageImports: ['lucide-react', 'react-icons', 'framer-motion'],
  },

  async headers() {
    return [
      {
        source: '/_next/image',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=2678400, stale-while-revalidate=86400',
          },
        ],
      },
      {
        // Cache static assets aggressively
        source: '/_next/static/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        // Security headers for all pages
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
