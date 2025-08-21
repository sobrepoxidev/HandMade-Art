import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { sendMail } from '@/lib/email';

interface InterestRequestItem {
  product_id: number;
  quantity: number;
  snapshot: {
    name: string;
    sku?: string;
    image_url?: string;
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

    // Insertar la solicitud principal
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

    // Enviar correo de notificación
    try {
      await sendQuoteRequestEmail({
        requestId,
        requesterName: body.requester_name.trim(),
        organization: body.organization?.trim(),
        email: body.email?.trim(),
        phone: body.phone?.trim(),
        notes: body.notes?.trim(),
        items: body.items
      });
    } catch (emailError) {
      console.error('Error sending email notification:', emailError);
      // No fallar la request si el correo falla, pero loggear el error
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

// Función para enviar correo de notificación de cotización
async function sendQuoteRequestEmail(data: {
  requestId: number;
  requesterName: string;
  organization?: string;
  email?: string;
  phone?: string;
  notes?: string;
  items: InterestRequestItem[];
}) {
  const html = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #B55327;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
          background-color: #b3d5c3;
        }
        .container {
          background-color: white;
          border-radius: 12px;
          padding: 24px;
          box-shadow: 0 4px 6px rgba(0,0,0,0.05);
        }
        .header {
          background-color: #b3d5c3;
          color: #B55327;
          text-align: center;
          padding: 16px;
          border-radius: 8px;
          margin-bottom: 24px;
        }
        .header h1 {
          margin: 0;
          font-size: 1.5rem;
          font-weight: 600;
        }
        .section {
          margin-bottom: 24px;
          padding: 16px;
          border-radius: 8px;
          background-color: #b3d5c3;
        }
        .section h2 {
          color: #B55327;
          margin-top: 0;
          font-size: 1.25rem;
          font-weight: 600;
        }
        .detail {
          display: flex;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 8px;
          background-color: white;
          border-radius: 6px;
        }
        .label {
          font-weight: 500;
          color: #4b5563;
        }
        .value {
          color: #1f2937;
        }
        .product-item {
          background-color: white;
          padding: 12px;
          border-radius: 6px;
          margin-bottom: 8px;
          border-left: 4px solid #B55327;
        }
        .timestamp {
          text-align: center;
          color: #6b7280;
          font-size: 0.875rem;
          margin-top: 24px;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>HANDMADE ART | Nueva Solicitud de Cotización</h1>
          <p>Solicitud #${data.requestId}</p>
        </div>

        <div class="section">
          <h2>Datos del Solicitante:</h2>
          <div class="detail">
            <span class="label">Nombre:</span>
            <span class="value">${data.requesterName}</span>
          </div>
          ${data.organization ? `
          <div class="detail">
            <span class="label">Organización:</span>
            <span class="value">${data.organization}</span>
          </div>` : ''}
          ${data.email ? `
          <div class="detail">
            <span class="label">Email:</span>
            <span class="value">${data.email}</span>
          </div>` : ''}
          ${data.phone ? `
          <div class="detail">
            <span class="label">Teléfono:</span>
            <span class="value">${data.phone}</span>
          </div>` : ''}
        </div>

        <div class="section">
          <h2>Productos Solicitados (${data.items.length}):</h2>
          ${data.items.map(item => `
          <div class="product-item">
            <strong>${item.snapshot.name}</strong><br>
            ${item.snapshot.sku ? `SKU: ${item.snapshot.sku}<br>` : ''}
            Cantidad: ${item.quantity} unidades
          </div>`).join('')}
        </div>

        ${data.notes ? `
        <div class="section">
          <h2>Notas Adicionales:</h2>
          <div style="background-color: white; padding: 16px; border-radius: 8px;">
            ${data.notes}
          </div>
        </div>` : ''}

        <div class="timestamp">
          <p>Recibido el: ${new Date().toLocaleString('es-ES', { 
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</p>
        </div>
      </div>
    </body>
    </html>
  `;

  await sendMail(
    `Nueva Solicitud de Cotización #${data.requestId} - ${data.requesterName}`,
    html,
    'bryamlopez4@gmail.com'
  );
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