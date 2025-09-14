import { NextRequest, NextResponse } from 'next/server';
import { supabaseServer } from '@/lib/supabaseServer';
import { sendMail } from '@/lib/email';
import { Database } from '@/types-db';

export async function POST(request: NextRequest) {
  try {
    const { orderId, quoteId, status, responded_at } = await request.json();

    // Validar datos requeridos
    if ((!orderId && !quoteId) || !status) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = supabaseServer;

    // Si se proporciona quoteId, actualizar directamente la cotización
    if (quoteId) {
      const updateData: InterestRequestUpdate = { 
        status: status,
        updated_at: new Date().toISOString()
      };
      
      if (responded_at) {
        updateData.responded_at = responded_at;
      }

      const { error: updateQuoteError } = await supabase
        .from('interest_requests')
        .update(updateData)
        .eq('id', quoteId);

      if (updateQuoteError) {
        console.error('Error updating quote status:', updateQuoteError);
        return NextResponse.json(
          { error: 'Failed to update quote status' },
          { status: 500 }
        );
      }

      return NextResponse.json({ success: true });
    }

    // Si se proporciona orderId, manejar la orden
    if (orderId) {
      // Obtener la orden con información de la cotización
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .select(`
          *,
          order_items (*)
        `)
        .eq('id', orderId)
        .single();

      if (orderError || !order) {
        return NextResponse.json(
          { error: 'Order not found' },
          { status: 404 }
        );
      }

      // Actualizar el estado de la orden
      const { error: updateOrderError } = await supabase
        .from('orders')
        .update({ 
          status: status === 'vendido' ? 'completed' : status,
          updated_at: new Date().toISOString()
        })
        .eq('id', orderId);

      if (updateOrderError) {
        console.error('Error updating order:', updateOrderError);
        return NextResponse.json(
          { error: 'Failed to update order' },
          { status: 500 }
        );
      }

      // Si hay quote_id, actualizar también el estado de la cotización
      if (order.quote_id) {
        const { error: updateQuoteError } = await supabase
          .from('interest_requests')
          .update({ 
            status: status,
            updated_at: new Date().toISOString()
          })
          .eq('id', order.quote_id);

        if (updateQuoteError) {
          console.error('Error updating quote status:', updateQuoteError);
        }
      }

      // Si el estado es 'vendido', enviar correos de confirmación
      if (status === 'vendido') {
      try {
        // Correo al cliente
        const customerEmailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #16a34a; margin: 0;">¡Pago Confirmado!</h1>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">Hola ${order.customer_name},</h2>
              <p style="color: #666; line-height: 1.6;">¡Excelente noticia! Hemos recibido tu pago exitosamente.</p>
              <p style="color: #666; line-height: 1.6;">Tu orden #${order.id} ha sido confirmada y pronto comenzaremos a preparar tus productos artesanales.</p>
            </div>
            
            <div style="background-color: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-top: 0;">Detalles de tu orden:</h3>
              <p><strong>Total pagado:</strong> $${order.total_amount ? order.total_amount.toFixed(2) : '0.00'} USD</p>
              <p><strong>Método de pago:</strong> PayPal</p>
              <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
            </div>
            
            <div style="background-color: #fef3c7; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #92400e; margin: 0; font-weight: 500;">📦 Próximos pasos:</p>
              <p style="color: #92400e; margin: 5px 0 0 0;">Te contactaremos pronto con los detalles de envío y seguimiento de tu pedido.</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #666; margin: 0;">¡Gracias por confiar en nuestros productos artesanales!</p>
              <p style="color: #666; margin: 5px 0 0 0;">Handmade Art - Apoyando la inserción social</p>
            </div>
          </div>
        `;

        await sendMail(
          '¡Pago confirmado! - Handmade Art',
          customerEmailHtml,
          order.customer_email
        );

        // Correo al gestor
        const managerEmailHtml = `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="text-align: center; margin-bottom: 30px;">
              <h1 style="color: #16a34a; margin: 0;">💰 Nueva Venta Confirmada</h1>
            </div>
            
            <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h2 style="color: #333; margin-top: 0;">¡Excelente noticia!</h2>
              <p style="color: #666; line-height: 1.6;">Se ha completado exitosamente el pago de una cotización.</p>
            </div>
            
            <div style="background-color: #fff; border: 1px solid #e5e7eb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
              <h3 style="color: #333; margin-top: 0;">Detalles de la venta:</h3>
              <p><strong>Cliente:</strong> ${order.customer_name}</p>
              <p><strong>Email:</strong> ${order.customer_email}</p>
              <p><strong>Teléfono:</strong> ${order.customer_phone}</p>
              <p><strong>Total:</strong> $${order.total_amount ? order.total_amount.toFixed(2) : '0.00'} USD</p>
              <p><strong>Orden ID:</strong> #${order.id}</p>
              ${order.quote_id ? `<p><strong>Cotización ID:</strong> #${order.quote_id}</p>` : ''}
              <p><strong>Fecha:</strong> ${new Date().toLocaleDateString('es-ES')}</p>
            </div>
            
            <div style="background-color: #dbeafe; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
              <p style="color: #1e40af; margin: 0; font-weight: 500;">📋 Próximos pasos:</p>
              <p style="color: #1e40af; margin: 5px 0 0 0;">Revisa los detalles en el panel de administración y procede con la preparación del pedido.</p>
            </div>
            
            <div style="text-align: center; margin-top: 30px;">
              <a href="${process.env.NEXT_PUBLIC_BASE_URL}/admin/orders" 
                 style="background-color: #16a34a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500;">
                Ver en Panel de Admin
              </a>
            </div>
          </div>
        `;

        await sendMail(
          `💰 Nueva venta confirmada - Orden #${order.id}`,
          managerEmailHtml,
          'sobrepoxidev@gmail.com'
        );

        } catch (emailError) {
          console.error('Error sending confirmation emails:', emailError);
          // No fallar la respuesta por errores de email
        }
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Status updated successfully'
    });
    

  } catch (error) {
    console.error('Error in update-quote-status:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
type InterestRequestUpdate = Partial<Database['interest_requests']>;