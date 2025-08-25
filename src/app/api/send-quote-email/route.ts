import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { sendMail } from '@/lib/email';
import {  ProductSnapshot } from '@/types-db';
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
          snapshot
        )
      `)
      .eq('id', quoteId)
      .eq('status', 'sent_to_client')
      .single();

    if (quoteError || !quote) {
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

    // const quoteUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/quote/${quote.quote_slug}`;
    const finalAmount = quote.final_amount || quote.total_amount || 0;
    const shippingCost = quote.shipping_cost || 0;
    const totalAmount = finalAmount + shippingCost;

    // // Generar lista de productos
    // const productsList = quote.interest_request_items.map((item: InterestRequestItem) => {
    //   const itemTotal = (item.product_snapshot.dolar_price || 0) * item.quantity;
    //   const imageUrl = item.product_snapshot.image_url || '';
    //   return `
    //     <tr>
    //       <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">
    //         <div style="display: flex; align-items: center;">
    //           ${imageUrl ? `<img src="${imageUrl}" alt="${item.product_snapshot.name}" style="width: 50px; height: 50px; object-fit: cover; border-radius: 4px; margin-right: 10px;">` : ''}
    //           <div>
    //             <strong>${item.product_snapshot.name}</strong>
    //             ${item.product_snapshot.sku ? `<br><small style="color: #6b7280;">SKU: ${item.product_snapshot.sku}</small>` : ''}
    //           </div>
    //         </div>
    //       </td>
    //       <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${item.quantity}</td>
    //       <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${(item.product_snapshot.dolar_price || 0).toFixed(2)}</td>
    //       <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: right;">$${itemTotal.toFixed(2)}</td>
    //     </tr>
    //   `;
    // }).join('');

    // // Calcular información de descuento
    // let discountInfo = '';
    // if (quote.discount_type && quote.discount_value) {
    //   try {
    //     const discountData = JSON.parse(quote.discount_value as string);
    //     const originalTotal = quote.total_amount;
    //     const discountAmount = originalTotal - finalAmount;
        
    //     if (discountAmount > 0) {
    //       let discountText = '';
    //       switch (quote.discount_type) {
    //         case 'percentage_total':
    //           discountText = `${discountData.value}% de descuento en el total`;
    //           break;
    //         case 'fixed_total':
    //           discountText = `$${discountData.value} de descuento en el total`;
    //           break;
    //         case 'total_override':
    //           discountText = 'Precio especial aplicado';
    //           break;
    //         default:
    //           discountText = 'Descuento aplicado';
    //       }
          
    //       discountInfo = `
    //         <tr>
    //           <td colspan="3" style="padding: 10px; text-align: right; color: #16a34a; font-weight: bold;">${discountText}:</td>
    //           <td style="padding: 10px; text-align: right; color: #16a34a; font-weight: bold;">-$${discountAmount.toFixed(2)}</td>
    //         </tr>
    //       `;
    //     }
    //   } catch (error) {
    //     console.error('Error parsing discount data:', error);
    //   }
    // }

    // Preparar datos para las plantillas
    const items = quote.interest_request_items.map((item: { quantity: number, snapshot: ProductSnapshot | null }) => ({
      name: item.snapshot?.name || 'Producto',
      quantity: item.quantity,
      unit_price: item.snapshot?.dolar_price || 0,
      image_url: item.snapshot?.image_url,
      sku: item.snapshot?.sku
    }));

    // Calcular descuento
    const originalTotal = quote.interest_request_items.reduce((acc: number, item: { quantity: number, snapshot: ProductSnapshot | null }) => acc + (item.snapshot?.dolar_price || 0) * item.quantity, 0);
    const discountAmount = originalTotal - finalAmount;
    
    // Enviar correo al cliente usando la plantilla existente
    const clientEmailHtml = generateQuoteEmailTemplate({
      customerName: quote.requester_name,
      quoteSlug: quote.quote_slug,
      items,
      originalTotal,
      discountAmount,
      finalTotal: totalAmount,
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
      finalTotal: totalAmount,
      locale: 'es'
    });

    await sendMail(
      `Nueva cotización enviada - ${quote.requester_name}`,
      managerEmailHtml,
      'bryamlopez4@gmail.com'
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