import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabaseServer';
import { v4 as uuidv4 } from 'uuid';

// For debugging purposes - remove in production
const DEBUG = process.env.NODE_ENV !== 'production';

interface CartItem {
  id: number;
  name?: string;
  name_es?: string;
  name_en?: string;
  dolar_price?: number;
  quantity: number;
  description?: string;
  media?: { url: string }[];
  sku?: string;
}

export async function POST(request: NextRequest) {
  try {
    const { cartItems, customerInfo, discountInfo, shippingCost, totalAmount, finalAmount, managerNotes } = await request.json();

    if (DEBUG) {
      console.log('Processing direct payment link generation');
    }

    // Verificar que hay items en el carrito
    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: 'No items in cart' },
        { status: 400 }
      );
    }

    // Verificar información del cliente
    if (!customerInfo || !customerInfo.name || !customerInfo.email) {
      return NextResponse.json(
        { error: 'Customer information is incomplete' },
        { status: 400 }
      );
    }

    if (DEBUG) {
      console.log(`Creating quote for customer: ${customerInfo.name}`);
    }

    // Verificar si ya existe una cotización reciente para evitar duplicados
    const { data: recentQuote } = await supabase
      .from('interest_requests')
      .select('id, created_at')
      .eq('email', customerInfo.email)
      .eq('source', 'direct_payment')
      .gte('created_at', new Date(Date.now() - 30000).toISOString()) // Últimos 30 segundos
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (recentQuote) {
      if (DEBUG) {
        console.log('Recent quote found, preventing duplicate:', recentQuote.id);
      }
      return NextResponse.json(
        { error: 'A recent quote already exists for this customer. Please wait before creating another.' },
        { status: 409 }
      );
    }

    // Crear un nuevo registro en interest_requests (cotización)
    const { data: quote, error: quoteError } = await supabase
      .from('interest_requests')
      .insert({
        requester_name: customerInfo.name,
        email: customerInfo.email,
        phone: customerInfo.phone || '',
        status: 'sent_to_client',
        total_amount: totalAmount,
        final_amount: finalAmount,
        discount_type: discountInfo?.type || null,
        discount_value: discountInfo?.value || null,
        shipping_cost: shippingCost || 0,
        manager_notes: managerNotes || '',
        source: 'direct_payment',
        quote_slug: uuidv4()
      })
      .select()
      .single();

    if (quoteError) {
      console.error('Error creating quote:', quoteError);
      return NextResponse.json(
        { error: 'Failed to create quote' },
        { status: 500 }
      );
    }

    // Crear los items de la cotización
    const quoteItems = cartItems.map((item: CartItem) => ({
      request_id: quote.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price_usd: item.dolar_price || 0,
      product_snapshot: {
        id: item.id,
        name: item.name || item.name_es || item.name_en || '',
        description: item.description || '',
        price_usd: item.dolar_price || 0,
        image_url: item.media?.[0]?.url || '',
        sku: item.sku || ''
      }
    }));

    const { error: itemsError } = await supabase
      .from('interest_request_items')
      .insert(quoteItems);

    if (itemsError) {
      console.error('Error creating quote items:', itemsError);
      return NextResponse.json(
        { error: 'Failed to create quote items' },
        { status: 500 }
      );
    }

    // Obtener el quote completo con sus items para evitar problemas de timing
    const { data: fullQuote, error: fullQuoteError } = await supabase
      .from('interest_requests')
      .select(`
        *,
        interest_request_items (*)
      `)
      .eq('id', quote.id)
      .single();

    if (fullQuoteError) {
      console.error('Error fetching full quote:', fullQuoteError);
      return NextResponse.json(
        { error: 'Failed to fetch complete quote' },
        { status: 500 }
      );
    }

    // Generar el link de pago usando quote_slug
    const paymentLink = `${process.env.NEXT_PUBLIC_SITE_URL}/quote/${quote.quote_slug}`;

    if (DEBUG) {
      console.log(`Payment link generated: ${paymentLink}`);
    }

    return NextResponse.json({
      success: true,
      quoteId: quote.id,
      quoteSlug: quote.quote_slug,
      quote: fullQuote, // Incluir el objeto quote completo
      paymentLink,
      whatsappLink: generateWhatsAppLink(customerInfo.phone, paymentLink, customerInfo.name)
    });
  } catch (error) {
    console.error('Error generating payment link:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Función para generar un link de WhatsApp con el mensaje predefinido
function generateWhatsAppLink(phone: string, paymentLink: string, customerName: string) {
  if (!phone) return null;
  
  // Formatear el número de teléfono (eliminar espacios, guiones, etc.)
  const formattedPhone = phone.replace(/[\s-\(\)]/g, '');
  
  // Crear el mensaje
  const message = encodeURIComponent(
    `Hola ${customerName}, aquí está el link para realizar tu pago: ${paymentLink}\n\nGracias por tu compra!`
  );
  
  return `https://wa.me/${formattedPhone}?text=${message}`;
}