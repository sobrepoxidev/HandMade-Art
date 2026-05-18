import { redirect } from 'next/navigation';

type tParams = Promise<{ locale: string }>;

/**
 * Permanent (308) redirect from /impact -> the locale-correct
 * social-impact page.
 *
 * ES locale -> /es/reinsercion-sociolaboral
 * EN locale -> /en/social-reintegration
 *
 * Both destinations resolve to the same React component on disk;
 * the localized path is part of the marketing surface (English
 * audience deserves an English URL).
 */
export default async function ImpactRedirectPage({
  params,
}: {
  params: tParams;
}) {
  const { locale } = await params;
  const target =
    locale === 'en' ? '/en/social-reintegration' : '/es/reinsercion-sociolaboral';
  redirect(target);
}
