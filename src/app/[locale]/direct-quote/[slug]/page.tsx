import { redirect } from "next/navigation";
import { supabaseServer } from "@/lib/supabaseServer";

type Params = Promise<{ locale: string; slug: string }>;

export default async function DirectQuotePage({ params }: { params: Params }) {
  const { locale, slug } = await params;

  const numericId = Number(slug);
  if (Number.isInteger(numericId)) {
    const { data: quote } = await supabaseServer
      .from("interest_requests")
      .select("quote_slug")
      .eq("id", numericId)
      .single();

    if (quote?.quote_slug) {
      redirect(`/${locale}/quote/${quote.quote_slug}`);
    }
  }

  redirect(`/${locale}/quote/${slug}`);
}
