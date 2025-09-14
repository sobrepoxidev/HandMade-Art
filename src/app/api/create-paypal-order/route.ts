import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

// Configuración de PayPal
const PAYPAL_CLIENT_ID = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID!;
const PAYPAL_CLIENT_SECRET = process.env.PAYPAL_CLIENT_SECRET!;
const PAYPAL_API_URL = process.env.NEXT_PUBLIC_PAYPAL_API_URL!;

export async function POST(request: NextRequest) {
  try {
    const { quoteId, amount } = await request.json();

    if (!quoteId || !amount) {
      return NextResponse.json(
        { error: 'Se requiere ID de cotización y monto' },
        { status: 400 }
      );
    }

    // Inicializar cliente de Supabase con la clave de servicio para acceso completo
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verificar que la cotización existe y no está pagada
    const { data: quote, error: quoteError } = await supabase
      .from('interest_requests')
      .select('*')
      .eq('id', quoteId)
      .single();

    if (quoteError || !quote) {
      return NextResponse.json(
        { error: 'Cotización no encontrada' },
        { status: 404 }
      );
    }

    if (quote.status === 'paid') {
      return NextResponse.json(
        { error: 'Esta cotización ya ha sido pagada' },
        { status: 400 }
      );
    }

    // Obtener token de acceso de PayPal
    const tokenResponse = await fetch(`${PAYPAL_API_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Basic ${Buffer.from(
          `${PAYPAL_CLIENT_ID}:${PAYPAL_CLIENT_SECRET}`
        ).toString('base64')}`,
      },
      body: 'grant_type=client_credentials',
    });

    const { access_token } = await tokenResponse.json();

    if (!access_token) {
      return NextResponse.json(
        { error: 'Error al obtener token de PayPal' },
        { status: 500 }
      );
    }

    // Verificar que amount sea un número válido
    if (amount === undefined || amount === null || isNaN(amount)) {
      return NextResponse.json(
        { error: 'El monto debe ser un número válido' },
        { status: 400 }
      );
    }

    // Crear orden en PayPal
    const orderResponse = await fetch(`${PAYPAL_API_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${access_token}`,
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            reference_id: quoteId,
            description: `Pago de cotización #${quoteId}`,
            amount: {
              currency_code: 'USD',
              value: amount.toFixed(2),
            },
          },
        ],
        application_context: {
          brand_name: 'Hands Made Art',
          landing_page: 'NO_PREFERENCE',
          user_action: 'PAY_NOW',
        },
      }),
    });

    const orderData = await orderResponse.json();

    if (orderData.error) {
      return NextResponse.json(
        { error: 'Error al crear orden en PayPal' },
        { status: 500 }
      );
    }

    return NextResponse.json(orderData);
  } catch (error) {
    console.error('Error creating PayPal order:', error);
    return NextResponse.json(
      { error: 'Error al procesar la solicitud' },
      { status: 500 }
    );
  }
}