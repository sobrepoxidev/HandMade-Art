import { defineRouting } from 'next-intl/routing';

/**
 * i18n routing.
 *
 * `pathnames` maps an internal route name (the folder under app/[locale]/)
 * to the public URL each locale should expose. next-intl's <Link> +
 * useRouter() consume the internal name and render the localized URL
 * automatically per locale.
 *
 * Conventions:
 * - Internal name = whatever the folder is under app/[locale]/.
 * - Localized URLs for ES try to read natural in Spanish; EN uses
 *   the English noun. We add an alias only when the page name actually
 *   warrants it (e.g. /reinsercion-sociolaboral is a Spanish-only term;
 *   the English audience deserves /social-reintegration).
 *
 * Backward-compat note: if a URL existed publicly before this config
 * was added, that exact URL must remain in the mapping under its
 * original locale to avoid breaking inbound links. The route file
 * itself doesn't change.
 */
export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localeDetection: false,
  localePrefix: 'always',
  pathnames: {
    '/': '/',
    '/products': '/products',
    '/product/[slug]': '/product/[slug]',
    '/search': '/search',
    '/cart': '/cart',
    '/checkout': '/checkout',
    '/account': '/account',
    '/login': '/login',
    '/register': '/register',
    '/about': '/about',
    '/contact': '/contact',
    '/shipping': '/shipping',
    '/privacy-policies': '/privacy-policies',
    '/conditions-service': '/conditions-service',
    '/qr': '/qr',
    '/admin': '/admin',
    '/catalog': '/catalog',
    '/feria-artesanias': '/feria-artesanias',
    '/feria-artesanias-terminos': '/feria-artesanias-terminos',
    '/fiestas-patronales-de-san-ramon': '/fiestas-patronales-de-san-ramon',
    '/dmnts': '/dmnts',
    '/impact': '/impact',
    // The hero localized URL — Spanish keeps the technical Spanish-language
    // legal term; English gets a natural noun phrase.
    '/reinsercion-sociolaboral': {
      es: '/reinsercion-sociolaboral',
      en: '/social-reintegration',
    },
  },
});
