import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabaseServer';
import { sendMail } from '@/lib/email';
import { generateCustomerQuoteEmail, generateManagerNotificationEmail } from '@/lib/emailTemplates';
import { ProductSnapshot } from '@/types-db';

interface InterestRequestItem {
  product_id: number;
  quantity: number;
  product_snapshot: ProductSnapshot;
}

interface InterestRequestPayload {
  requester_name: string;
  organization?: string;
  email?: string;
  phone?: string;
  notes?: string;
  items: InterestRequestItem[];
}

export async function POST(request: NextRequest) {
  try {
    const body: InterestRequestPayload = await request.json();

    // Validaciones
    if (!body.requester_name || body.requester_name.trim().length === 0) {
      return NextResponse.json(
        { ok: false, error: 'El nombre del solicitante es obligatorio' },
        { status: 400 }
      );
    }

    if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
      return NextResponse.json(
        { ok: false, error: 'Debe incluir al menos un producto en la solicitud' },
        { status: 400 }
      );
    }

    if (body.items.length > 200) {
      return NextResponse.json(
        { ok: false, error: 'Máximo 200 productos por solicitud' },
        { status: 400 }
      );
    }

    // Validar cada item
    for (const item of body.items) {
      if (!item.product_id || typeof item.product_id !== 'number') {
        return NextResponse.json(
          { ok: false, error: 'ID de producto inválido' },
          { status: 400 }
        );
      }

      if (!item.quantity || item.quantity < 1) {
        return NextResponse.json(
          { ok: false, error: 'La cantidad debe ser mayor a 0' },
          { status: 400 }
        );
      }

      if (!item.product_snapshot || !item.product_snapshot.name) {
        return NextResponse.json(
          { ok: false, error: 'Información del producto incompleta' },
          { status: 400 }
        );
      }
    }

    // Calcular el total de la cotización
    const totalAmount = body.items.reduce((total, item) => {
      const price = item.product_snapshot.dolar_price || 0;
      return total + (price * item.quantity);
    }, 0);

    // Insertar solicitud principal
    const { data: requestData, error: requestError } = await supabase
      .from('interest_requests')
      .insert({
        requester_name: body.requester_name.trim(),
        organization: body.organization?.trim() || null,
        email: body.email?.trim() || null,
        phone: body.phone?.trim() || null,
        notes: body.notes?.trim() || null,
        source: 'catalog',
        locale: 'es',
        channel: 'web',
        total_amount: totalAmount
      })
      .select('id')
      .single();

    if (requestError) {
      console.error('Error creating interest request:', requestError);
      return NextResponse.json(
        { ok: false, error: 'Error al crear la solicitud' },
        { status: 500 }
      );
    }

    const requestId = requestData.id;

    // Insertar items de la solicitud
    const itemsToInsert = body.items.map(item => ({
      request_id: requestId,
      product_id: item.product_id,
      quantity: item.quantity,
      product_snapshot: item.product_snapshot,
      unit_price_usd: item.product_snapshot.dolar_price || 0
    }));

    const { error: itemsError } = await supabase
      .from('interest_request_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Error creating interest request items:', itemsError);
      // Intentar limpiar la solicitud principal si falló la inserción de items
      await supabase
        .from('interest_requests')
        .delete()
        .eq('id', requestId);
      
      return NextResponse.json(
        { ok: false, error: 'Error al procesar los productos de la solicitud' },
        { status: 500 }
      );
    }

    // Enviar correos electrónicos si se proporciona email
    if (body.email && body.email.trim()) {
      try {
        // Mapear items una sola vez para evitar duplicación
        const emailItems = body.items.map((item, index) => ({
          id: `${item.product_id}-${index}`,
          name: item.product_snapshot.name || 'Producto sin nombre',
          quantity: item.quantity,
          price: item.product_snapshot.dolar_price || 0,
          image_url: item.product_snapshot.image_url || ''
        }));

        const emailData = {
          customerName: body.requester_name,
          customerEmail: body.email.trim(),
          customerPhone: body.phone || 'No proporcionado',
          items: emailItems,
          totalAmount,
          requestId: requestId.toString(),
          createdAt: new Date().toISOString()
        };

        // Correo al cliente
        const customerEmailHtml = generateCustomerQuoteEmail(emailData);

        await sendMail(
          'Cotización de Productos - Handmade Art',
          customerEmailHtml,
          body.email.trim()
        );

        // Correo al gestor
        const managerEmailHtml = generateManagerNotificationEmail(emailData);

        await sendMail(
          `Nueva Solicitud de Cotización #${requestId} - ${body.requester_name}`,
          managerEmailHtml,
          'sobrepoxidev@gmail.com'
        );

      } catch (emailError) {
        console.error('Error sending emails:', emailError);
        // No fallar la solicitud si hay error en el envío de correos
      }
    }

    return NextResponse.json(
      { ok: true, request_id: requestId, total_amount: totalAmount },
      { status: 201 }
    );

  } catch (error) {
    console.error('Unexpected error in create-interest-request:', error);
    return NextResponse.json(
      { ok: false, error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// Método OPTIONS para CORS
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}