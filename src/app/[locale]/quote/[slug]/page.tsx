import { supabaseServer as supabase } from '@/lib/supabaseServer';
import { notFound } from 'next/navigation';
import QuotePaymentPage from '@/components/quotes/QuotePaymentPage';
import { Database, ProductSnapshot } from '@/lib/database.types';

type InterestRequestItem = Database['public']['Tables']['interest_request_items']['Row'];
type tParams = Promise<{ locale: string, slug: string }>;


export default async function QuotePage({ params }: { params: tParams }) {
  const { slug, locale } = await params;

  // Obtener la cotización por slug
  const { data: quote, error } = await supabase
    .from('interest_requests')
    .select(`
      *,
      interest_request_items (
        *,
        product_snapshot
      )
    `)
    .eq('quote_slug', slug)
    .in('status', ['sent_to_client', 'closed_won'])
    .single();

  // Calcular total_amount si no está disponible
  if (quote && (!quote.total_amount || quote.total_amount === 0)) {
    const calculatedTotal = quote.interest_request_items.reduce((total: number, item: InterestRequestItem) => {
      const snapshot = item.product_snapshot as unknown as ProductSnapshot;
      const itemPrice = item.unit_price_usd || snapshot?.dolar_price || snapshot?.price || 0;
      return total + (itemPrice * item.quantity);
    }, 0);
    quote.total_amount = calculatedTotal;
    
    // Si tampoco hay final_amount, usar el total calculado
    if (!quote.final_amount || quote.final_amount === 0) {
      quote.final_amount = calculatedTotal;
    }
  }

  if (error || !quote) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#161210]">
      <QuotePaymentPage quote={quote} locale={locale} />
    </div>
  );
}

export async function generateMetadata({ params }: { params: tParams }) {
  const { locale } = await params;

  // Private per-client page: never index, and never leak requester
  // names or amounts into metadata.
  return {
    title: locale === 'es' ? 'Cotización — Handmade Art' : 'Quote — Handmade Art',
    robots: {
      index: false,
      follow: false,
    },
  };
}