import { Metadata } from 'next';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import DirectQuotePaymentPage from '@/components/quote/DirectQuotePaymentPage';

type tParams = Promise<{ locale: string; slug: string }>;

export async function generateMetadata({ params }: { params: tParams }): Promise<Metadata> {
  const { locale, slug } = await params;
  
  const supabase = createServerComponentClient({ cookies });
  const { data: quote } = await supabase
    .from('interest_requests')
    .select('*')
    .eq('id', slug)
    .single();

  if (!quote) {
    return {
      title: locale === 'es' ? 'Cotización no encontrada' : 'Quote not found',
      description: locale === 'es' ? 'La cotización solicitada no existe' : 'The requested quote does not exist'
    };
  }

  return {
    title: locale === 'es' ? `Pago de Cotización #${slug}` : `Quote Payment #${slug}`,
    description: locale === 'es' 
      ? `Realiza el pago de tu cotización personalizada #${slug}` 
      : `Make payment for your custom quote #${slug}`
  };
}

export default async function DirectQuotePage({ params }: { params: tParams }) {
  const { locale, slug } = await params;
  
  const supabase = createServerComponentClient({ cookies });
  
  // Obtener la cotización con sus items y snapshots de productos
  const { data: quote } = await supabase
    .from('interest_requests')
    .select(`
      *,
      interest_request_items(*, product_snapshot(*))
    `)
    .eq('id', slug)
    .single();

  if (!quote) {
    notFound();
  }

  // Si la cotización ya está pagada, redirigir a la página de éxito
  if (quote.status === 'paid') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-md w-full text-center">
          <h1 className="text-xl font-bold text-green-600 mb-4">
            {locale === 'es' ? 'Cotización ya pagada' : 'Quote already paid'}
          </h1>
          <p className="text-gray-600 mb-6">
            {locale === 'es'
              ? 'Esta cotización ya ha sido pagada. Gracias por tu compra.'
              : 'This quote has already been paid. Thank you for your purchase.'}
          </p>
          <a
            href={`/${locale}`}
            className="inline-block bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-4 rounded-md transition-colors"
          >
            {locale === 'es' ? 'Volver al inicio' : 'Back to home'}
          </a>
        </div>
      </div>
    );
  }

  // Calcular total_amount y final_amount si no están disponibles
  if (!quote.total_amount || !quote.final_amount) {
    let totalAmount = 0;
    quote.interest_request_items.forEach((item: { unit_price_usd: number; quantity: number }) => {
      totalAmount += item.unit_price_usd * item.quantity;
    });

    if (!quote.total_amount) {
      quote.total_amount = totalAmount;
    }

    if (!quote.final_amount) {
      // Si hay descuento, aplicarlo
      if (quote.discount_type && quote.discount_value) {
        let finalAmount = totalAmount;
        
        switch (quote.discount_type) {
          case 'percentage':
            finalAmount = totalAmount * (1 - quote.discount_value / 100);
            break;
          case 'fixed_amount':
            finalAmount = totalAmount - quote.discount_value;
            break;
          case 'total_override':
            finalAmount = quote.discount_value;
            break;
        }
        
        // Añadir costo de envío si existe
        if (quote.shipping_cost) {
          finalAmount += quote.shipping_cost;
        }
        
        quote.final_amount = finalAmount;
      } else {
        // Sin descuento, el final es igual al total más envío
        quote.final_amount = totalAmount + (quote.shipping_cost || 0);
      }
    }
  }

  return <DirectQuotePaymentPage quote={quote} locale={locale} />;
}