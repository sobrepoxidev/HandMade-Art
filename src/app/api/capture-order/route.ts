import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getPayPalAccessToken } from '@/lib/paypalHelpers';

export async function POST(request: NextRequest) {
  try {
    const { orderID } = await request.json();

    if (!orderID) {
      return NextResponse.json({ error: 'Order ID is required' }, { status: 400 });
    }

    // Obtener token de acceso de PayPal
    const accessToken = await getPayPalAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Failed to get PayPal access token' },
        { status: 500 }
      );
    }

    // Capturar la orden en PayPal
    const paypalCaptureUrl = process.env.NODE_ENV === 'production'
      ? `https://api-m.paypal.com/v2/checkout/orders/${orderID}/capture`
      : `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderID}/capture`;

    const response = await fetch(paypalCaptureUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const captureData = await response.json();

    if (response.status >= 400) {
      console.error('PayPal API error:', captureData);
      return NextResponse.json(
        { error: 'Error capturing PayPal order', details: captureData },
        { status: response.status }
      );
    }

    // Actualizar el estado de la cotización en la base de datos
    if (
      captureData.status === 'COMPLETED' ||
      captureData.purchase_units[0]?.payments?.captures?.[0]?.status === 'COMPLETED'
    ) {
      // Obtener el ID de la cotización desde la referencia de la orden
      const quoteId = captureData.purchase_units[0]?.reference_id;

      if (quoteId) {
        await supabase
          .from('interest_requests')
          .update({
            status: 'paid',
            payment_date: new Date().toISOString(),
            payment_id: captureData.id,
            payment_details: captureData,
          })
          .eq('id', quoteId);
      }
    }

    return NextResponse.json(captureData);
  } catch (error) {
    console.error('Error capturing PayPal order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}