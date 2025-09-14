import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabaseServer';
import { sendMail } from '@/lib/email';
import { getPaypalAccessToken, capturePaypalOrder } from '../paypalHelpers';
import { Database } from '@/types-db'

type InterestRequestItem = Database['interest_request_items'];
// For debugging purposes - remove in production
const DEBUG = process.env.NODE_ENV !== 'production';


export async function POST(request: NextRequest) {
  try {
    const { paypalOrderId, quoteId, shippingInfo } = await request.json();
    
    if (!paypalOrderId || !quoteId || !shippingInfo) {
      return NextResponse.json(
        { error: 'PayPal order ID, quote ID, and shipping info are required' },
        { status: 400 }
      );
    }
    
    if (DEBUG) {
      console.log(`Processing capture for PayPal order: ${paypalOrderId}, quote: ${quoteId}`);
    }

    // Capturar el pago en PayPal usando el helper
    try {
      const accessToken = await getPaypalAccessToken();
      
      const captureResult = await capturePaypalOrder({
        accessToken,
        paypalOrderId
      });
      
      if (!captureResult || captureResult.status !== 'COMPLETED') {
        console.error('PayPal capture failed:', captureResult);
        return NextResponse.json(
          { error: 'Payment capture failed' },
          { status: 400 }
        );
      }

      if (DEBUG) {
        console.log(`PayPal capture successful: ${captureResult.id}`);
      }
    } catch (paypalError: unknown) {
      console.error('PayPal capture error:', paypalError);
      return NextResponse.json({ 
        error: `PayPal capture error: ${paypalError instanceof Error ? paypalError.message : 'Unknown error'}`,
        details: DEBUG ? paypalError : undefined
      }, { status: 500 });
    }

    // Obtener la cotización
    const { data: quote, error: quoteError } = await supabase
      .from('interest_requests')
      .select(`
        *,
        interest_request_items (
          id,
          product_id,
          quantity,
          product_snapshot
        )
      `)
      .eq('id', quoteId)
      .eq('status', 'sent_to_client')
      .single();

    if (quoteError || !quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Crear la orden en la base de datos
    const finalAmount = quote.final_amount || quote.total_amount;
    const shippingCost = quote.shipping_cost || 0;
    const totalAmount = finalAmount + shippingCost;

    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: null, // Para cotizaciones sin usuario registrado
        payment_method: 'paypal',
        shipping_address: {
          name: quote.requester_name,
          address: shippingInfo.address,
          city: shippingInfo.city,
          state: shippingInfo.state,
          country: shippingInfo.country || 'Costa Rica',
          postal_code: shippingInfo.zipCode,
          phone: quote.phone
        },
        total_amount: totalAmount,
        payment_status: 'paid',
        payment_reference: paypalOrderId,
        notes: `Quote ID: ${quoteId}, Email: ${quote.email}`
      })
      .select()
      .single();

    if (orderError) {
      console.error('Error creating order:', orderError);
      return NextResponse.json(
        { error: 'Failed to create order' },
        { status: 500 }
      );
    }

    // Crear los items de la orden
    const orderItems = quote.interest_request_items.map((item: InterestRequestItem) => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product_snapshot?.dolar_price || 0
    }));

    if (DEBUG) {
      console.log('Creating order items:', JSON.stringify(orderItems, null, 2));
    }

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);

    if (itemsError) {
      console.error('Error creating order items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to create order items' },
        { status: 500 }
      );
    }

    // Actualizar el estado de la cotización a 'closed_won'
    const { error: updateQuoteError } = await supabase
      .from('interest_requests')
      .update({ 
        status: 'closed_won',
        responded_at: new Date().toISOString()
      })
      .eq('id', quoteId);

    if (updateQuoteError) {
      console.error('Error updating quote status:', updateQuoteError);
    }

    // Enviar correos de confirmación
    try {
      // Correo al cliente
      await sendMail(
        '¡Pago confirmado! - Tu pedido está en proceso',
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">¡Pago Confirmado!</h2>
            <p>Hola ${quote.requester_name},</p>
            <p>Tu pago ha sido procesado exitosamente. Tu pedido está ahora en proceso.</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Detalles del Pedido:</h3>
              <p><strong>Número de orden:</strong> ${order.id}</p>
              <p><strong>Total pagado:</strong> $${totalAmount ? totalAmount.toFixed(2) : '0.00'} USD</p>
              <p><strong>Referencia de pago:</strong> ${paypalOrderId}</p>
            </div>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Dirección de Envío:</h3>
              <p>${shippingInfo.name}</p>
              <p>${shippingInfo.address}</p>
              <p>${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}</p>
              <p>Costa Rica</p>
            </div>
            
            <p>Nos pondremos en contacto contigo pronto con los detalles de envío.</p>
            <p>¡Gracias por tu compra!</p>
            
            <p style="color: #6b7280; font-size: 14px; margin-top: 30px;">
              Handmade Art<br>
              www.handmadeart.store
            </p>
          </div>
        `,
        quote.email
      );

      // Correo al gestor
      await sendMail(
        '🎉 Nueva venta confirmada - Cotización pagada',
        `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #16a34a;">¡Nueva Venta Confirmada!</h2>
            <p>Se ha completado el pago de una cotización.</p>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Detalles del Cliente:</h3>
              <p><strong>Nombre:</strong> ${quote.requester_name}</p>
              <p><strong>Email:</strong> ${quote.email}</p>
              <p><strong>Teléfono:</strong> ${quote.phone}</p>
            </div>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Detalles de la Venta:</h3>
              <p><strong>Orden ID:</strong> ${order.id}</p>
              <p><strong>Cotización ID:</strong> ${quoteId}</p>
              <p><strong>Total:</strong> $${totalAmount ? totalAmount.toFixed(2) : '0.00'} USD</p>
              <p><strong>PayPal ID:</strong> ${paypalOrderId}</p>
            </div>
            
            <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <h3>Dirección de Envío:</h3>
              <p>${shippingInfo.name}</p>
              <p>${shippingInfo.address}</p>
              <p>${shippingInfo.city}, ${shippingInfo.state} ${shippingInfo.zipCode}</p>
              <p>Costa Rica</p>
            </div>
            
            <p>Procede con el procesamiento y envío del pedido.</p>
          </div>
        `,
        'info@handmadeart.store'
      );
    } catch (emailError) {
      console.error('Error sending confirmation emails:', emailError);
    }

    return NextResponse.json({ 
      status: 'COMPLETED',
      orderId: order.id,
      paypalOrderId
    });
    
  } catch (error) {
    console.error('Error capturing PayPal quote payment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}