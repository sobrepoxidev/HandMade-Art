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

interface DiscountCodeApplied {
  code: string;
  discount_type: 'percentage' | 'fixed_amount';
  discount_value: number;
  description?: string | null;
}

interface InterestRequestPayload {
  requester_name: string;
  organization?: string;
  email?: string;
  phone?: string;
  notes?: string;
  discount_code_applied?: DiscountCodeApplied;
  items: InterestRequestItem[];
}

export async function POST(request: NextRequest) {
  try {
    console.log('=== CREATE INTEREST REQUEST START ===');
    const body: InterestRequestPayload = await request.json();
    console.log('Request body:', JSON.stringify(body, null, 2));

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
      // Usar precio con descuento si está disponible, sino usar precio original
      const price = item.product_snapshot.has_discount && item.product_snapshot.discounted_price 
        ? item.product_snapshot.discounted_price 
        : item.product_snapshot.dolar_price || 0;
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
        source: 'souvenirs',
        locale: 'es',
        channel: 'web',
        total_amount: totalAmount,
        discount_code_applied: body.discount_code_applied || null,
        // updated_at: new Date().toISOString() // Comentado temporalmente hasta verificar esquema
      })
      .select('id')
      .single();

    if (requestError) {
      console.error('Error creating interest request:', requestError);
      console.error('Request error details:', {
        message: requestError.message,
        details: requestError.details,
        hint: requestError.hint,
        code: requestError.code
      });
      return NextResponse.json(
        { ok: false, error: `Error al crear la solicitud: ${requestError.message}` },
        { status: 500 }
      );
    }

    const requestId = requestData.id;

    // Insertar items de la solicitud
    const itemsToInsert = body.items.map(item => {
      // Usar precio con descuento si está disponible, sino usar precio original
      const unitPrice = item.product_snapshot.has_discount && item.product_snapshot.discounted_price 
        ? item.product_snapshot.discounted_price 
        : item.product_snapshot.dolar_price || 0;
      
      return {
        request_id: requestId,
        product_id: item.product_id,
        quantity: item.quantity,
        product_snapshot: item.product_snapshot,
        unit_price_usd: unitPrice
      };
    });

    const { error: itemsError } = await supabase
      .from('interest_request_items')
      .insert(itemsToInsert);

    if (itemsError) {
      console.error('Error creating interest request items:', itemsError);
      console.error('Items error details:', {
        message: itemsError.message,
        details: itemsError.details,
        hint: itemsError.hint,
        code: itemsError.code
      });
      console.log('Items to insert:', JSON.stringify(itemsToInsert, null, 2));
      // Intentar limpiar la solicitud principal si falló la inserción de items
      await supabase
        .from('interest_requests')
        .delete()
        .eq('id', requestId);
      
      return NextResponse.json(
        { ok: false, error: `Error al procesar los productos: ${itemsError.message}` },
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

        // Calcular monto original sin descuento si hay código aplicado
        const originalAmount = body.discount_code_applied 
          ? body.items.reduce((total, item) => {
              const originalPrice = item.product_snapshot.dolar_price || 0;
              return total + (originalPrice * item.quantity);
            }, 0)
          : undefined;

        const emailData = {
          customerName: body.requester_name,
          customerEmail: body.email.trim(),
          customerPhone: body.phone || 'No proporcionado',
          items: emailItems,
          totalAmount,
          requestId: requestId.toString(),
          createdAt: new Date().toISOString(),
          discountCodeApplied: body.discount_code_applied,
          originalAmount
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
    console.error('=== UNEXPECTED ERROR IN CREATE-INTEREST-REQUEST ===');
    console.error('Error details:', error);
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    return NextResponse.json(
      { ok: false, error: `Error interno del servidor: ${error instanceof Error ? error.message : 'Unknown error'}` },
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