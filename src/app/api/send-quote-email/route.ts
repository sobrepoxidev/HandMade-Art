import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendMail } from '@/lib/email';
import { ProductSnapshot } from '@/types-db';
import { generateQuoteEmailTemplate, generateManagerQuoteNotificationTemplate } from '@/lib/emailTemplates/quoteEmailTemplate';

export async function POST(request: NextRequest) {
  try {
    const { quoteId } = await request.json();

    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Obtener la cotización con sus items
    const { data: quote, error: quoteError } = await supabase
      .from('interest_requests')
      .select(`
        *,
        interest_request_items (
          id,
          quantity,
          product_snapshot
        )
      `)
      .eq('id', quoteId)
      .eq('status', 'sent_to_client')
      .single();

    if (quoteError || !quote) {
      console.error('Error al obtener la cotización:', quoteError);
      return NextResponse.json(
        { error: 'Quote not found or not in sent_to_client status' },
        { status: 404 }
      );
    }

    if (!quote.quote_slug) {
      return NextResponse.json(
        { error: 'Quote does not have a slug' },
        { status: 400 }
      );
    }

    const finalAmount = quote.final_amount || quote.total_amount || 0;

    // Preparar datos para las plantillas
    const items = quote.interest_request_items.map((item: { quantity: number, snapshot: ProductSnapshot | null }) => ({
      name: item.snapshot?.name || 'Producto',
      quantity: item.quantity,
      unit_price: item.snapshot?.dolar_price || 0,
      image_url: item.snapshot?.image_url,
      sku: item.snapshot?.sku
    }));

    // Calcular descuento
    const originalTotal = quote.interest_request_items.reduce((total: number, item: { quantity: number, snapshot: ProductSnapshot | null }) => {
      const price = item.snapshot?.dolar_price ?? 0;
      return total + (price * item.quantity);
    }, 0);

    const discountAmount = originalTotal - finalAmount;

    // Enviar correo al cliente usando la plantilla existente
    const clientEmailHtml = generateQuoteEmailTemplate({
      customerName: quote.requester_name,
      quoteSlug: quote.quote_slug,
      items,
      originalTotal,
      discountAmount,
      finalTotal: finalAmount,
      discountDescription: quote.discount_type ? `Descuento aplicado (${quote.discount_type})` : undefined,
      managerNotes: quote.manager_notes,
      locale: 'es',
      shippingCost: quote.shipping_cost || 0
    });

    await sendMail(
      '✨ Tu cotización personalizada está lista',
      clientEmailHtml,
      quote.email
    );

    // Enviar notificación al gestor
    const managerEmailHtml = generateManagerQuoteNotificationTemplate({
      customerName: quote.requester_name,
      customerEmail: quote.email,
      quoteSlug: quote.quote_slug,
      finalTotal: finalAmount,
      locale: 'es'
    });

    await sendMail(
      `Nueva cotización enviada - ${quote.requester_name}`,
      managerEmailHtml,
      'sobrepoxidev@gmail.com'
    );

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error sending quote email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}