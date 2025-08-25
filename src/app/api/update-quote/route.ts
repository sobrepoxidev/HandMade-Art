import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabaseServer';
import { sendMail } from '@/lib/email';
import { generateQuoteEmailTemplate, generateManagerQuoteNotificationTemplate } from '@/lib/emailTemplates/quoteEmailTemplate';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      quoteId,
      discountType,
      discountValue,
      productDiscounts,
      finalAmount,
      managerNotes,
      shippingCost
    } = body;

    if (!quoteId) {
      return NextResponse.json(
        { error: 'Quote ID is required' },
        { status: 400 }
      );
    }

    // Generar slug único para la cotización
    const slug = `quote-${quoteId}-${Date.now()}`;

    // Actualizar la cotización en la base de datos
    const { error } = await supabase
      .from('interest_requests')
      .update({
        status: 'sent_to_client',
        discount_type: discountType,
        discount_value: discountValue, // Ahora es un número directo
        final_amount: finalAmount,
        quote_slug: slug,
        responded_at: new Date().toISOString(),
        manager_notes: managerNotes,
        shipping_cost: shippingCost || 0
      })
      .eq('id', quoteId);

    if (error) {
      console.error('Error updating quote:', error);
      return NextResponse.json(
        { error: 'Failed to update quote' },
        { status: 500 }
      );
    }

    // Si hay descuentos por producto, actualizarlos en los items
    if (productDiscounts && (discountType === 'product_percentage' || discountType === 'product_fixed')) {
      for (const [itemId, discountValue] of Object.entries(productDiscounts)) {
        await supabase
          .from('interest_request_items')
          .update({
            discount_percentage: discountType === 'product_percentage' ? discountValue : null,
            boss_note: discountType === 'product_fixed' ? `Descuento fijo: $${discountValue}` : null
          })
          .eq('id', parseInt(itemId));
      }
    }

    // Obtener la cotización actualizada para los correos
    const { data: updatedQuote, error: fetchError } = await supabase
      .from('interest_requests')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (fetchError) {
      console.error('Error fetching updated quote:', fetchError);
    }

    // Enviar correos de notificación
    try {
      // Obtener los items de la cotización para el correo
      const { data: quoteItems, error: itemsError } = await supabase
        .from('interest_request_items')
        .select('*')
        .eq('request_id', quoteId);

      if (!itemsError && quoteItems && updatedQuote) {
        const items = quoteItems.map((item: any) => ({
          name: item.product_snapshot?.name || 'Producto',
          quantity: item.quantity,
          unit_price: item.product_snapshot?.dolar_price || 0,
          image_url: item.product_snapshot?.media?.[0]?.url || '',
          sku: item.product_snapshot?.sku
        }));

        const originalTotal = updatedQuote.total_amount;
        const discountAmount = originalTotal - finalAmount;
        
        // Determinar descripción del descuento
        let discountDescription = '';
        if (discountType && discountValue) {
          switch (discountType) {
            case 'percentage':
              discountDescription = `${discountValue}% de descuento en el total`;
              break;
            case 'fixed_amount':
              discountDescription = `$${discountValue} de descuento en el total`;
              break;
            case 'total_override':
              discountDescription = 'Precio especial aplicado';
              break;
            case 'product_percentage':
              discountDescription = 'Descuentos por producto aplicados';
              break;
            case 'product_fixed':
              discountDescription = 'Descuentos fijos por producto aplicados';
              break;
          }
        }

        // Correo al cliente
        const customerEmailHtml = generateQuoteEmailTemplate({
          customerName: updatedQuote.requester_name,
          quoteSlug: slug,
          items,
          originalTotal,
          discountAmount,
          finalTotal: finalAmount,
          discountDescription,
          managerNotes,
          locale: 'es', // Asumiendo español por defecto
          shippingCost: updatedQuote.shipping_cost || 0
        });

        await sendMail(
          '🎨 Su cotización personalizada está lista - Hands Made Art',
          customerEmailHtml,
          updatedQuote.email
        );

        // Correo al gestor
        const managerEmailHtml = generateManagerQuoteNotificationTemplate({
          customerName: updatedQuote.requester_name,
          customerEmail: updatedQuote.email,
          quoteSlug: slug,
          finalTotal: finalAmount,
          locale: 'es'
        });

        await sendMail(
          `📧 Cotización enviada a ${updatedQuote.requester_name}`,
          managerEmailHtml,
          'bryamlopez4@gmail.com'
        );
      }
    } catch (emailError) {
      console.error('Error sending quote emails:', emailError);
      // No fallar la respuesta por errores de email
    }

    return NextResponse.json({
      success: true,
      quoteSlug: slug,
      finalAmount
    });

  } catch (error) {
    console.error('Error in update-quote API:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}