import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer as supabase } from '@/lib/supabaseServer';
import { sendMail } from '@/lib/email';
import { getManagerNotificationEmail } from '@/lib/notifications';
import { generateCustomerQuoteEmail, generateManagerNotificationEmail } from '@/lib/emailTemplates';
import { ProductSnapshot } from '@/lib/database.types';

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
  /** Honeypot: must stay empty. Bots autofill hidden fields. */
  website?: string;
  discount_code_applied?: DiscountCodeApplied;
  items: InterestRequestItem[];
}

// Soft in-memory rate limit per IP. Serverless instances recycle, so this
// is a deterrent rather than a hard guarantee.
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;
const rateBuckets = new Map<string, number[]>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const hits = (rateBuckets.get(ip) || []).filter((t) => now - t < RATE_LIMIT_WINDOW_MS);
  if (hits.length >= RATE_LIMIT_MAX_REQUESTS) return true;
  hits.push(now);
  rateBuckets.set(ip, hits);
  return false;
}

/**
 * Fire-and-forget push of the quote request into the WhatsApp notification
 * bridge (aisolutions-saas intake → Ben's outbox → owner + sub-admin).
 * Never blocks or fails the request itself.
 */
async function notifyQuoteWebhook(payload: Record<string, unknown>): Promise<void> {
  const url = process.env.NOTIFY_WEBHOOK_URL;
  if (!url) return;

  try {
    await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(process.env.NOTIFY_WEBHOOK_TOKEN
          ? { Authorization: `Bearer ${process.env.NOTIFY_WEBHOOK_TOKEN}` }
          : {}),
      },
      body: JSON.stringify(payload),
      signal: AbortSignal.timeout(5000),
    });
  } catch (err) {
    console.error('Quote notify webhook failed:', err);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: InterestRequestPayload = await request.json();
    console.log('CREATE INTEREST REQUEST:', {
      items: body.items?.length,
      hasEmail: Boolean(body.email),
    });

    // Honeypot: pretend success so bots do not retry, but store nothing.
    if (body.website && body.website.trim().length > 0) {
      return NextResponse.json({ ok: true }, { status: 201 });
    }

    // Rate limit
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { ok: false, error: 'Demasiadas solicitudes. Intenta de nuevo más tarde.' },
        { status: 429 }
      );
    }

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
      const price = item.product_snapshot.price || item.product_snapshot.dolar_price || 0;
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
      const unitPrice = item.product_snapshot.price || item.product_snapshot.dolar_price || 0;
      
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

    // Preparar datos compartidos de las notificaciones
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
      customerEmail: body.email?.trim() || 'No proporcionado',
      customerPhone: body.phone || 'No proporcionado',
      items: emailItems,
      totalAmount,
      requestId: requestId.toString(),
      createdAt: new Date().toISOString(),
      discountCodeApplied: body.discount_code_applied,
      originalAmount
    };

    // Acuse de recibo al cliente — solo si dejó un email
    if (body.email && body.email.trim()) {
      try {
        const customerEmailHtml = generateCustomerQuoteEmail(emailData);

        await sendMail(
          'Cotización de Productos - Handmade Art',
          customerEmailHtml,
          body.email.trim()
        );
      } catch (emailError) {
        console.error('Error sending customer email:', emailError);
        // No fallar la solicitud si hay error en el envío de correos
      }
    }

    // Notificación al gestor/dueño — SIEMPRE, con o sin email del cliente
    try {
      const managerEmailHtml = generateManagerNotificationEmail(emailData);

      await sendMail(
        `Nueva Solicitud de Cotización #${requestId} - ${body.requester_name}`,
        managerEmailHtml,
        getManagerNotificationEmail()
      );
    } catch (emailError) {
      console.error('Error sending manager email:', emailError);
    }

    // Puente WhatsApp (aisolutions-saas → outbox de Ben → dueño + sub-admin)
    await notifyQuoteWebhook({
      type: 'handmade_quote_request',
      request_id: requestId,
      requester_name: body.requester_name.trim(),
      organization: body.organization?.trim() || null,
      email: body.email?.trim() || null,
      phone: body.phone?.trim() || null,
      notes: body.notes?.trim() || null,
      total_amount_usd: totalAmount,
      items: body.items.map((item) => ({
        name: item.product_snapshot.name,
        quantity: item.quantity,
        unit_price_usd:
          item.product_snapshot.price ||
          item.product_snapshot.dolar_price ||
          0,
      })),
      created_at: new Date().toISOString(),
    });

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