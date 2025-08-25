import { defineRouting } from 'next-intl/routing';

// Configuración por defecto (fallback) - solo se usa cuando no se puede determinar dinámicamente
export const routing = defineRouting({
  locales: ['es', 'en'],
  defaultLocale: 'es',
  localeDetection: false,
  localePrefix: 'always'
});