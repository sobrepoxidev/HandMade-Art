import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabaseClient';
import { getPayPalAccessToken } from '@/lib/paypalHelpers';
import { Json } from '@/lib/database.types';

// Type guard for product snapshot
function isProductSnapshot(snapshot: Json): snapshot is { name?: string; sku?: string } {
  return typeof snapshot === 'object' && snapshot !== null;
}

export async function POST(request: NextRequest) {
  try {
    const { quoteId } = await request.json();

    if (!quoteId) {
      return NextResponse.json({ error: 'Quote ID is required' }, { status: 400 });
    }

    // Obtener la cotización de la base de datos
    const { data: quote, error: quoteError } = await supabase
      .from('interest_requests')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) {
      return NextResponse.json(
        { error: 'Quote not found' },
        { status: 404 }
      );
    }

    // Obtener los items de la cotización
    const { data: quoteItems, error: itemsError } = await supabase
      .from('interest_request_items')
      .select('*')
      .eq('request_id', quoteId);

    if (itemsError) {
      return NextResponse.json(
        { error: 'Error fetching quote items' },
        { status: 500 }
      );
    }

    // Obtener token de acceso de PayPal
    const accessToken = await getPayPalAccessToken();

    if (!accessToken) {
      return NextResponse.json(
        { error: 'Failed to get PayPal access token' },
        { status: 500 }
      );
    }

    // Preparar los items para la orden de PayPal
    const items = quoteItems?.map((item) => {
      const snapshot = isProductSnapshot(item.product_snapshot) ? item.product_snapshot : null;
      return {
        name: snapshot?.name || 'Product',
        quantity: item.quantity.toString(),
        unit_amount: {
          currency_code: 'USD',
          value: (item.unit_price_usd || 0).toString(),
        },
        sku: snapshot?.sku || '',
      };
    }) || [];

    // Calcular el subtotal (suma de todos los items)
    const itemTotal = quoteItems?.reduce(
      (sum, item) => sum + item.quantity * (item.unit_price_usd || 0),
      0
    ) || 0;

    // Crear la orden en PayPal
    const paypalOrderUrl = process.env.NODE_ENV === 'production'
      ? 'https://api-m.paypal.com/v2/checkout/orders'
      : 'https://api-m.sandbox.paypal.com/v2/checkout/orders';

    const response = await fetch(paypalOrderUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: quoteId.toString(),
            description: `Payment for quote #${quoteId}`,
            amount: {
              currency_code: 'USD',
              value: (quote.final_amount || 0).toString(),
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: itemTotal ? itemTotal.toFixed(2) : '0.00',
                },
                shipping: {
                  currency_code: 'USD',
                  value: quote.shipping_cost ? quote.shipping_cost.toFixed(2) : '0.00',
                },
                discount: {
                  currency_code: 'USD',
                  value: quote.total_amount && quote.final_amount ? ((quote.total_amount - quote.final_amount) + (quote.shipping_cost || 0)).toFixed(2) : '0.00',
                },
              },
            },
            items,
          },
        ],
        application_context: {
          brand_name: 'Hands Made Art',
          shipping_preference: 'NO_SHIPPING',
          user_action: 'PAY_NOW',
          return_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${quote.locale}/payment-success`,
          cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/${quote.locale}/payment-cancel`,
        },
      }),
    });

    const paypalOrder = await response.json();

    if (response.status >= 400) {
      console.error('PayPal API error:', paypalOrder);
      return NextResponse.json(
        { error: 'Error creating PayPal order', details: paypalOrder },
        { status: response.status }
      );
    }

    // Actualizar la cotización con el ID de la orden de PayPal
    await supabase
      .from('interest_requests')
      .update({ 
        admin_notes: paypalOrder.id ? `PayPal Order ID: ${paypalOrder.id}` : null 
      })
      .eq('id', quoteId);

    return NextResponse.json(paypalOrder);
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}