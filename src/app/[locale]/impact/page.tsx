import { redirect } from '@/i18n/navigation';

type tParams = Promise<{ locale: string }>;

/**
 * Permanent (308) redirect from /impact -> /reinsercion-sociolaboral.
 *
 * CLAUDE.md memory references /impact as the social-impact URL but the
 * page actually lives at the (localized) reintegration route. Using
 * next-intl's redirect lets the destination follow each locale's
 * pathname mapping (/es/reinsercion-sociolaboral vs /en/social-reintegration).
 *
 * Next.js triggers a 308 redirect automatically when `redirect()` is
 * called from a server component during render.
 */
export default async function ImpactRedirectPage({
  params,
}: {
  params: tParams;
}) {
  const { locale } = await params;
  redirect({ href: '/reinsercion-sociolaboral', locale: locale as 'es' | 'en' });
}
