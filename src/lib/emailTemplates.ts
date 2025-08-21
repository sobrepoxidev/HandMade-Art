interface QuoteItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image_url?: string;
}

interface QuoteData {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: QuoteItem[];
  totalAmount: number;
  requestId: string;
  createdAt: string;
}

export function generateCustomerQuoteEmail(data: QuoteData): string {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 15px; border-bottom: 1px solid #eee;">
        <div style="display: flex; align-items: center; gap: 15px;">
          ${item.image_url ? `<img src="${item.image_url}" alt="${item.name}" style="width: 60px; height: 60px; object-fit: cover; border-radius: 8px;">` : ''}
          <div>
            <h4 style="margin: 0; color: #333; font-size: 16px;">${item.name}</h4>
            <p style="margin: 5px 0 0 0; color: #666; font-size: 14px;">Cantidad: ${item.quantity}</p>
          </div>
        </div>
      </td>
      <td style="padding: 15px; border-bottom: 1px solid #eee; text-align: right; font-weight: bold; color: #8B4513;">$${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Confirmación de Cotización - Handmade Art</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #8B4513 0%, #A0522D 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">HANDMADE ART</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 16px;">Artesanías Costarricenses</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          <h2 style="color: #8B4513; margin: 0 0 20px 0; font-size: 24px;">¡Gracias por tu interés!</h2>
          
          <p style="color: #333; line-height: 1.6; margin: 0 0 20px 0; font-size: 16px;">
            Hola <strong>${data.customerName}</strong>,
          </p>
          
          <p style="color: #333; line-height: 1.6; margin: 0 0 25px 0; font-size: 16px;">
            Hemos recibido tu solicitud de cotización. A continuación encontrarás el detalle de los productos seleccionados:
          </p>

          <!-- Quote Details -->
          <div style="background-color: #f9f9f9; border-radius: 10px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #8B4513; margin: 0 0 15px 0; font-size: 18px;">Detalles de tu Cotización</h3>
            <p style="margin: 5px 0; color: #666;"><strong>ID de Solicitud:</strong> ${data.requestId}</p>
            <p style="margin: 5px 0; color: #666;"><strong>Fecha:</strong> ${new Date(data.createdAt).toLocaleDateString('es-CR')}</p>
          </div>

          <!-- Items Table -->
          <table style="width: 100%; border-collapse: collapse; margin: 25px 0; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
            <thead>
              <tr style="background-color: #8B4513;">
                <th style="padding: 15px; text-align: left; color: white; font-size: 16px;">Producto</th>
                <th style="padding: 15px; text-align: right; color: white; font-size: 16px;">Precio</th>
              </tr>
            </thead>
            <tbody>
              ${itemsHtml}
              <tr style="background-color: #f0f0f0;">
                <td style="padding: 20px; font-weight: bold; font-size: 18px; color: #8B4513;">Total Estimado:</td>
                <td style="padding: 20px; text-align: right; font-weight: bold; font-size: 20px; color: #8B4513;">$${data.totalAmount.toFixed(2)}</td>
              </tr>
            </tbody>
          </table>

          <!-- Next Steps -->
          <div style="background: linear-gradient(135deg, #f0f8ff 0%, #e6f3ff 100%); border-left: 4px solid #8B4513; padding: 20px; margin: 25px 0; border-radius: 0 10px 10px 0;">
            <h3 style="color: #8B4513; margin: 0 0 15px 0; font-size: 18px;">Próximos Pasos</h3>
            <ul style="color: #333; line-height: 1.6; margin: 0; padding-left: 20px;">
              <li>Nuestro equipo revisará tu solicitud en las próximas 24 horas</li>
              <li>Te contactaremos para confirmar detalles y disponibilidad</li>
              <li>Recibirás una cotización final con opciones de pago y envío</li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div style="text-align: center; margin: 30px 0; padding: 20px; background-color: #f9f9f9; border-radius: 10px;">
            <h3 style="color: #8B4513; margin: 0 0 15px 0;">¿Tienes preguntas?</h3>
            <p style="color: #666; margin: 5px 0;">📧 bryamlopez4@gmail.com</p>
            <p style="color: #666; margin: 5px 0;">📱 WhatsApp: +506 XXXX-XXXX</p>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #8B4513; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px;">© 2024 Handmade Art - Artesanías Costarricenses</p>
          <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 12px;">Apoyando el talento local y la tradición artesanal</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

export function generateManagerNotificationEmail(data: QuoteData): string {
  const itemsHtml = data.items.map(item => `
    <tr>
      <td style="padding: 12px; border-bottom: 1px solid #eee; font-size: 14px;">${item.name}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: center; font-size: 14px;">${item.quantity}</td>
      <td style="padding: 12px; border-bottom: 1px solid #eee; text-align: right; font-size: 14px; font-weight: bold;">$${item.price.toFixed(2)}</td>
    </tr>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="es">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Nueva Solicitud de Cotización - Handmade Art</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #dc3545 0%, #c82333 100%); padding: 25px 20px; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 24px; font-weight: bold;">🚨 NUEVA COTIZACIÓN</h1>
          <p style="color: #f0f0f0; margin: 10px 0 0 0; font-size: 14px;">Sistema de Gestión - Handmade Art</p>
        </div>

        <!-- Content -->
        <div style="padding: 25px 20px;">
          <div style="background-color: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 15px; margin: 0 0 25px 0;">
            <h2 style="color: #856404; margin: 0 0 10px 0; font-size: 18px;">⚡ Acción Requerida</h2>
            <p style="color: #856404; margin: 0; font-size: 14px;">Se ha recibido una nueva solicitud de cotización que requiere tu atención.</p>
          </div>

          <!-- Customer Info -->
          <div style="background-color: #f8f9fa; border-radius: 8px; padding: 20px; margin: 20px 0;">
            <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 16px;">📋 Información del Cliente</h3>
            <div style="display: grid; gap: 8px;">
              <p style="margin: 0; color: #333; font-size: 14px;"><strong>Nombre:</strong> ${data.customerName}</p>
              <p style="margin: 0; color: #333; font-size: 14px;"><strong>Email:</strong> <a href="mailto:${data.customerEmail}" style="color: #007bff;">${data.customerEmail}</a></p>
              <p style="margin: 0; color: #333; font-size: 14px;"><strong>Teléfono:</strong> <a href="tel:${data.customerPhone}" style="color: #007bff;">${data.customerPhone}</a></p>
              <p style="margin: 0; color: #333; font-size: 14px;"><strong>ID Solicitud:</strong> <code style="background: #e9ecef; padding: 2px 6px; border-radius: 4px;">${data.requestId}</code></p>
              <p style="margin: 0; color: #333; font-size: 14px;"><strong>Fecha:</strong> ${new Date(data.createdAt).toLocaleString('es-CR')}</p>
            </div>
          </div>

          <!-- Items Table -->
          <div style="margin: 25px 0;">
            <h3 style="color: #495057; margin: 0 0 15px 0; font-size: 16px;">🛍️ Productos Solicitados</h3>
            <table style="width: 100%; border-collapse: collapse; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
              <thead>
                <tr style="background-color: #6c757d;">
                  <th style="padding: 12px; text-align: left; color: white; font-size: 14px;">Producto</th>
                  <th style="padding: 12px; text-align: center; color: white; font-size: 14px;">Cant.</th>
                  <th style="padding: 12px; text-align: right; color: white; font-size: 14px;">Precio</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
                <tr style="background-color: #e9ecef;">
                  <td colspan="2" style="padding: 15px; font-weight: bold; font-size: 16px; color: #495057;">Total Estimado:</td>
                  <td style="padding: 15px; text-align: right; font-weight: bold; font-size: 18px; color: #dc3545;">$${data.totalAmount.toFixed(2)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Action Items -->
          <div style="background: linear-gradient(135deg, #d1ecf1 0%, #bee5eb 100%); border-left: 4px solid #17a2b8; padding: 20px; margin: 25px 0; border-radius: 0 8px 8px 0;">
            <h3 style="color: #0c5460; margin: 0 0 15px 0; font-size: 16px;">📝 Tareas Pendientes</h3>
            <ul style="color: #0c5460; line-height: 1.6; margin: 0; padding-left: 20px; font-size: 14px;">
              <li>Verificar disponibilidad de productos</li>
              <li>Calcular costos de envío según ubicación</li>
              <li>Contactar al cliente en las próximas 24 horas</li>
              <li>Preparar cotización final con opciones de pago</li>
            </ul>
          </div>

          <!-- Quick Actions -->
          <div style="text-align: center; margin: 25px 0;">
            <a href="mailto:${data.customerEmail}?subject=Cotización ${data.requestId} - Handmade Art&body=Estimado/a ${data.customerName},%0A%0AGracias por tu interés en nuestros productos artesanales..." 
               style="display: inline-block; background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;">📧 Responder Cliente</a>
            <a href="tel:${data.customerPhone}" 
               style="display: inline-block; background-color: #17a2b8; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; margin: 5px;">📱 Llamar Cliente</a>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #6c757d; padding: 15px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 12px;">Sistema de Gestión - Handmade Art © 2024</p>
        </div>
      </div>
    </body>
    </html>
  `;
}