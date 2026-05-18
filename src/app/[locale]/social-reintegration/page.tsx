import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { buildMetadata } from "@/lib/metadata";
import ReinsertionPageContent, {
  getReinsertionMetadata,
} from "@/components/pages/ReinsertionPageContent";

type tParams = Promise<{ locale: string }>;

/**
 * Canonical for the English-locale social-impact page.
 *
 * - /en/social-reintegration -> renders content (canonical for EN)
 * - /es/social-reintegration -> 308 redirect to /es/reinsercion-sociolaboral
 *
 * The matching Spanish canonical lives at
 * app/[locale]/reinsercion-sociolaboral/.
 */

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale } = await params;
  const currentLocale: "es" | "en" = locale === "es" ? "es" : "en";
  const m = getReinsertionMetadata(currentLocale);

  return await buildMetadata({
    locale: currentLocale,
    pathname:
      currentLocale === "es"
        ? `/${locale}/reinsercion-sociolaboral`
        : `/${locale}/social-reintegration`,
    title: m.title,
    description: m.description,
    image: m.image,
  });
}

export default async function SocialReintegrationPage({
  params,
}: {
  params: tParams;
}) {
  const { locale } = await params;
  if (locale === "es") {
    redirect("/es/reinsercion-sociolaboral");
  }
  return <ReinsertionPageContent locale="en" />;
}
