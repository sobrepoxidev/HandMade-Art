import { redirect } from 'next/navigation';

type tParams = Promise<{ locale: string }>;

/**
 * Permanent (308) redirect from /impact -> /reinsercion-sociolaboral.
 *
 * The CLAUDE.md memory references /impact as the social-impact URL but
 * the actual page lives at /reinsercion-sociolaboral. This redirect
 * preserves any inbound links (e.g. printed materials, partner sites)
 * and consolidates SEO into a single canonical URL.
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
  redirect(`/${locale}/reinsercion-sociolaboral`);
}
