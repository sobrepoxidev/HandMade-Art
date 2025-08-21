import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { sendMail } from '@/lib/email';
import { generateCustomerQuoteEmail, generateManagerNotificationEmail } from '@/lib/emailTemplates';


interface InterestRequestItem {
  product_id: number;
  quantity: number;
  snapshot: {
    name: string;
    sku?: string;
    image_url?: string;
    dolar_price?: number;
  };
}

interface InterestRequestPayload {
  requester_name: string;
  organization?: string;
  email?: string;
  phone?: string;
  notes?: string;
  items: InterestRequestItem[];
}

interface InterestRequestItemDB {
  id: number;
  request_id: number;
  product_id: number;
  quantity: number;
  product_snapshot: {
    name: string;
    sku?: string;
    image_url?: string;
    dolar_price?: number;
  };
  created_at: string;
}

interface InterestRequestDB {
  id: number;
  requester_name: string;
  organization?: string;
  email?: string;
  phone?: string;
  notes?: string;
  source: string;
  locale: string;
  channel: string;
  created_at: string;
  interest_request_items: InterestRequestItemDB[];
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

      if (!item.snapshot || !item.snapshot.name) {
        return NextResponse.json(
          { ok: false, error: 'Información del producto incompleta' },
          { status: 400 }
        );
      }
    }

    // Insertar solicitud principal
    const { data: requestData, error: requestError } = await supabaseServer
      .from('interest_requests')
      .insert({
        requester_name: body.requester_name.trim(),
        organization: body.organization?.trim() || null,
        email: body.email?.trim() || null,
        phone: body.phone?.trim() || null,
        notes: body.notes?.trim() || null,
        source: 'souvenirs',
        locale: 'es',
        channel: 'web'
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
      product_snapshot: item.snapshot
    }));

    const { error: itemsError } = await supabaseServer
      .from('interest_request_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Error creating interest request items:', itemsError);
      // Intentar limpiar la solicitud principal si falló la inserción de items
      await supabaseServer
        .from('interest_requests')
        .delete()
        .eq('id', requestId);
      
      return NextResponse.json(
        { ok: false, error: 'Error al procesar los productos de la solicitud' },
        { status: 500 }
      );
    }

    // Enviar correos de confirmación
    try {
      // Obtener datos completos para los correos
      const { data: fullRequestData, error: fetchError } = await supabaseServer
        .from('interest_requests')
        .select(`
          *,
          interest_request_items (
            *,
            product_snapshot
          )
        `)
        .eq('id', requestId)
        .single() as { data: InterestRequestDB | null, error: Error | null };

      if (fetchError || !fullRequestData) {
        console.error('Error fetching request data for emails:', fetchError);
      } else {
        // Preparar datos para las plantillas de email
        const emailData = {
          customerName: fullRequestData.requester_name,
          customerEmail: fullRequestData.email || '',
          customerPhone: fullRequestData.phone || '',
          items: fullRequestData.interest_request_items.map((item: InterestRequestItemDB) => ({
            id: item.product_id.toString(),
            name: item.product_snapshot.name,
            price: item.product_snapshot.dolar_price || 0, // Precio unitario de referencia
            quantity: item.quantity,
            image_url: item.product_snapshot.image_url
          })),
          totalAmount: 0, // Total será calculado por el gestor
          requestId: requestId.toString(),
          createdAt: fullRequestData.created_at
        };

        // Enviar correo al cliente (solo si tiene email)
        if (fullRequestData.email) {
          const customerEmailHtml = generateCustomerQuoteEmail(emailData);
          await sendMail(
            'Confirmación de Cotización - Handmade Art',
            customerEmailHtml,
            fullRequestData.email
          );
        }

        // Enviar correo al gestor
        const managerEmailHtml = generateManagerNotificationEmail(emailData);
        await sendMail(
          `Nueva Cotización #${requestId} - ${fullRequestData.requester_name}`,
          managerEmailHtml,
          'bryamlopez4@gmail.com'
        );
      }
    } catch (emailError) {
      console.error('Error sending emails:', emailError);
      // No fallar la respuesta por errores de email
    }

    return NextResponse.json(
      { ok: true, request_id: requestId },
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