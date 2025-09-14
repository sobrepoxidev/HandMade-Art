import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendMail } from '@/lib/email';
import { generateDirectPaymentEmailTemplate } from '@/lib/emailTemplates/directPaymentEmailTemplate';

interface QuoteItem {
  quantity: number;
  unit_price_usd?: number;
  product_snapshot?: {
    name?: string;
    image_url?: string;
    sku?: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const { quote, quoteId, locale } = await request.json();
   const supabase = await createClient();
    if (!quote && !quoteId) {
      return NextResponse.json(
        { error: 'Quote data or Quote ID is required' },
        { status: 400 }
      );
    }

    let quoteData = quote;

    // Si no se envió el objeto quote, hacer la consulta (fallback)
    if (!quote && quoteId) {
      const { data: fetchedQuote, error: quoteError } = await supabase
        .from('interest_requests')
        .select(`
          *,
          interest_request_items (*, product_snapshot(*))
        `)
        .eq('id', quoteId)
        .single();

      console.log('Quote data (fallback):', fetchedQuote);
      console.log('ID quote (direct link): ', quoteId);

      if (quoteError || !fetchedQuote) {
        return NextResponse.json(
          { error: 'Quote not found' },
          { status: 404 }
        );
      }
      
      quoteData = fetchedQuote;
    }

    console.log('Using quote data:', quoteData);
    console.log('Quote ID:', quoteData.id);

 

    // Generar el link de pago usando quote_slug
    const paymentLink = `${process.env.NEXT_PUBLIC_SITE_URL}/quote/${quoteData.quote_slug}`;

    // Preparar datos para la plantilla
    const items = quoteData.interest_request_items.map((item: QuoteItem) => ({
      name: item.product_snapshot?.name || 'Producto',
      quantity: item.quantity,
      unit_price: item.unit_price_usd || 0,
      image_url: item.product_snapshot?.image_url,
      sku: item.product_snapshot?.sku
    }));

    // Calcular totales
    const originalTotal = quoteData.total_amount || 0;
    const finalAmount = quoteData.final_amount || originalTotal;
    const shippingCost = quoteData.shipping_cost || 0;
    
    // Para calcular el descuento, necesitamos considerar el shipping
    let discountAmount = 0;
    if (quoteData.discount_type) {
      // Si hay descuento, calculamos la diferencia entre el total original y el final sin shipping
      const finalAmountWithoutShipping = finalAmount - shippingCost;
      discountAmount = originalTotal - finalAmountWithoutShipping;
    }

    // Generar el asunto del correo según el idioma
    const emailSubject = locale === 'es' 
      ? '💳 Tu link de pago está listo' 
      : '💳 Your payment link is ready';

    // Enviar correo al cliente
    const clientEmailHtml = generateDirectPaymentEmailTemplate({
      customerName: quoteData.requester_name,
      paymentLink,
      items,
      originalTotal,
      discountAmount,
      finalTotal: finalAmount,
      discountDescription: quoteData.discount_type 
        ? locale === 'es' 
          ? `Descuento aplicado (${getDiscountTypeText(quoteData.discount_type, locale)})` 
          : `Applied discount (${getDiscountTypeText(quoteData.discount_type, locale)})` 
        : undefined,
      managerNotes: quoteData.manager_notes,
      locale,
      shippingCost
    });

    try {
      await sendMail(
        emailSubject,
        clientEmailHtml,
        quoteData.email
      );
      console.log(`Email sent successfully to: ${quoteData.email}`);
    } catch (emailError) {
      console.error('Error sending email:', emailError);
      throw new Error('Failed to send email');
    }

    // Generar link de WhatsApp si hay número de teléfono
    let whatsappLink = null;
    if (quoteData.phone) {
      const formattedPhone = quoteData.phone.replace(/[\s-\(\)]/g, '');
      const message = encodeURIComponent(
        locale === 'es'
          ? `Hola ${quoteData.requester_name}, aquí está el link para realizar tu pago: ${paymentLink}\n\nGracias por tu compra!`
          : `Hello ${quoteData.requester_name}, here is the link to make your payment: ${paymentLink}\n\nThank you for your purchase!`
      );
      whatsappLink = `https://wa.me/${formattedPhone}?text=${message}`;
    }

    return NextResponse.json({
      success: true,
      paymentLink,
      whatsappLink
    });
  } catch (error) {
    console.error('Error sending direct payment email:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Función para obtener el texto del tipo de descuento según el idioma
function getDiscountTypeText(discountType: string, locale: string): string {
  if (locale === 'es') {
    switch (discountType) {
      case 'percentage':
        return 'Porcentaje';
      case 'fixed_amount':
        return 'Monto fijo';
      case 'total_override':
        return 'Precio especial';
      default:
        return 'Descuento';
    }
  } else {
    switch (discountType) {
      case 'percentage':
        return 'Percentage';
      case 'fixed_amount':
        return 'Fixed amount';
      case 'total_override':
        return 'Special price';
      default:
        return 'Discount';
    }
  }
}