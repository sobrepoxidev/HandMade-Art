import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabaseServer';
import { getPaypalAccessToken, createPaypalOrder } from '../paypalHelpers';

// For debugging purposes - remove in production
const DEBUG = process.env.NODE_ENV !== 'production';

export async function POST(request: NextRequest) {
  try {
    const { quoteId, shippingInfo } = await request.json();
    
    if (!quoteId || !shippingInfo) {
      return NextResponse.json(
        { error: 'Quote ID and shipping info are required' },
        { status: 400 }
      );
    }


    if (DEBUG) {
      console.log(`Processing quote ID: ${quoteId}`);
    }

    // Primero verificar si la cotización existe (sin filtro de estado)
    const { data: quoteCheck, error: quoteCheckError } = await supabase
      .from('interest_requests')
      .select('id, status, requester_name')
      .eq('id', quoteId)
      .single();

    if (DEBUG) {
      console.log('Quote check result:', { quoteCheck, quoteCheckError });
    }

    if (quoteCheckError || !quoteCheck) {
      console.error('Quote not found in database:', quoteCheckError);
      return NextResponse.json(
        { error: `Quote with ID ${quoteId} not found in database` },
        { status: 404 }
      );
    }

    if (quoteCheck.status !== 'sent_to_client') {
      console.error(`Quote status is '${quoteCheck.status}', expected 'sent_to_client'`);
      return NextResponse.json(
        { error: `Quote status is '${quoteCheck.status}', not ready for payment` },
        { status: 400 }
      );
    }

    console.log("Quote ID:", quoteId);

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
      console.error('Supabase error fetching quote with items:', quoteError);
      return NextResponse.json(
        { error: 'Failed to fetch quote details' },
        { status: 500 }
      );
    }

    if (DEBUG) {
      console.log(`Quote found with final amount: ${quote.final_amount || quote.total_amount}`);
    }

    // El final_amount ya incluye el costo de envío
    const totalAmount = quote.final_amount || quote.total_amount;

    if (DEBUG) {
      console.log(`Total amount (already includes shipping): ${totalAmount}`);
    }

    // Obtener token de PayPal
    try {
      const accessToken = await getPaypalAccessToken();
      
      // Crear orden en PayPal usando el helper
      const paypalOrder = await createPaypalOrder({
        accessToken,
        amount: totalAmount,
        currency: "USD"
      });

      if (!paypalOrder) {
        return NextResponse.json({ error: "Failed to create PayPal order" }, { status: 500 });
      }

      if (DEBUG) {
        console.log(`PayPal order created successfully with ID: ${paypalOrder.id}`);
      }

      return NextResponse.json({ paypalOrderId: paypalOrder.id }, { status: 200 });
    } catch (paypalError: unknown) {
      console.error('PayPal API error:', paypalError);
      return NextResponse.json({ 
        error: `PayPal API error: ${paypalError instanceof Error ? paypalError.message : 'Unknown error'}`,
        details: DEBUG ? paypalError : undefined
      }, { status: 500 });
    }
    
  } catch (err: unknown) {
    console.error("Error in create-quote-order route:", err);
    const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}