import { defineRouting } from 'next-intl/routing';

/**
 * i18n routing.
 *
 * We intentionally do NOT use the `pathnames` config here, because
 * enabling it makes <Link>/useRouter()/redirect() type-narrow to the
 * declared route list. That conflicts with the ~24 dynamic hrefs we
 * have around the codebase (e.g. `/product/${name}`) which would each
 * require object-syntax {{ pathname: '/product/[slug]', params: ... }}.
 *
 * Localized URLs (e.g. /en/social-reintegration vs /es/reinsercion-sociolaboral)
 * are implemented as **route aliases** on the filesystem side:
 *   - app/[locale]/reinsercion-sociolaboral/page.tsx  (canonical, both locales)
 *   - app/[locale]/social-reintegration/page.tsx       (alias — redirects ES, serves EN)
 *
 * See those files for the redirect / canonical logic.
 */
export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localeDetection: false,
  localePrefix: 'always',
});
