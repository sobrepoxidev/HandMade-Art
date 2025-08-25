import { supabaseServer as supabase } from '@/lib/supabaseServer';
import { notFound } from 'next/navigation';
import QuotePaymentPage from '@/components/quotes/QuotePaymentPage';
import { Database } from '@/types-db';

type InterestRequestItem = Database['interest_request_items'];
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
      const itemPrice = item.product_snapshot?.dolar_price || 0;
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
    <div className="min-h-screen bg-gray-50">
      <QuotePaymentPage quote={quote} locale={locale} />
    </div>
  );
}

export async function generateMetadata({ params }: { params: tParams }) {
  const { slug } = await params;
  
  const { data: quote } = await supabase
    .from('interest_requests')
    .select('requester_name, final_amount')
    .eq('quote_slug', slug)
    .single();

  if (!quote) {
    return {
      title: 'Cotización no encontrada',
    };
  }

  return {
    title: `Cotización para ${quote.requester_name} - Hands Made Art`,
    description: `Cotización personalizada por $${quote.final_amount?.toFixed(2) || '0.00'}`,
  };
}