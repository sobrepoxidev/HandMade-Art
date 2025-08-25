import { Database } from '@/types-db'

type InterestRequestItem = Database['interest_request_items'];

interface QuoteEmailData {
  customerName: string;
  quoteSlug: string;
  items: InterestRequestItem[];
  originalTotal: number;
  discountAmount: number;
  finalTotal: number;
  discountDescription?: string;
  managerNotes?: string;
  locale: string;
  shippingCost?: number;
}

export function generateQuoteEmailTemplate(data: QuoteEmailData): string {
  const {
    customerName,
    quoteSlug,
    items,
    originalTotal,
    discountAmount,
    finalTotal,
    discountDescription,
    managerNotes,
    shippingCost = 0,
    locale
  } = data;

  const isSpanish = locale === 'es';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://hands-made-art.vercel.app';
  const quoteUrl = `${baseUrl}/${locale}/quote/${quoteSlug}`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const itemsHtml = items.map(item => `
    <tr style="border-bottom: 1px solid #e5e7eb;" class="product-row">
      <td style="padding: 12px 8px; vertical-align: top;" class="product-info">
        ${item.product_snapshot?.url ? `
          <img src="${item.product_snapshot.url}" alt="${item.product_snapshot.name}" 
               style="width: 60px; height: 60px; object-fit: cover; border-radius: 6px; margin-right: 12px; float: left;" class="product-image" />
        ` : ''}
        <div>
          <h4 style="margin: 0 0 4px 0; color: #374151; font-size: 14px; font-weight: 600;">${item.product_snapshot.name}</h4>
          ${item.product_snapshot.sku ? `<p style="margin: 0; color: #6b7280; font-size: 12px;">SKU: ${item.product_snapshot.sku}</p>` : ''}
        </div>
      </td>
      <td style="padding: 12px 8px; text-align: center; color: #6b7280; font-size: 14px;" class="product-quantity">
        ${item.quantity}
      </td>
      <td style="padding: 12px 8px; text-align: right; color: #374151; font-size: 14px;" class="product-price">
        ${formatCurrency(item.unit_price_usd ? item.unit_price_usd : 0)}
      </td>
      <td style="padding: 12px 8px; text-align: right; color: #374151; font-size: 14px; font-weight: 600;" class="product-total">
        ${formatCurrency(item.unit_price_usd ? item.unit_price_usd * item.quantity : 0 * item.quantity)}
      </td>
    </tr>
  `).join('');

  // Versión móvil de los items como tarjetas
  const itemsMobileHtml = items.map(item => `
    <div style="border: 1px solid #e5e7eb; border-radius: 8px; margin-bottom: 12px; padding: 16px; background-color: #ffffff;" class="mobile-product-card">
      <div style="display: flex; align-items: flex-start; margin-bottom: 12px;">
        ${item.product_snapshot?.url ? `
          <img src="${item.product_snapshot.url}" alt="${item.product_snapshot.name}" 
               style="width: 50px; height: 50px; object-fit: cover; border-radius: 6px; margin-right: 12px; flex-shrink: 0;" />
        ` : ''}
        <div style="flex: 1;">
          <h4 style="margin: 0 0 4px 0; color: #374151; font-size: 16px; font-weight: 600;">${item.product_snapshot.name}</h4>
          ${item.product_snapshot.sku ? `<p style="margin: 0; color: #6b7280; font-size: 12px;">SKU: ${item.product_snapshot.sku}</p>` : ''}
        </div>
      </div>
      <div style="display: flex; justify-content: space-between; align-items: center; padding-top: 12px; border-top: 1px solid #f3f4f6;">
        <div style="text-align: center;">
          <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">${isSpanish ? 'Cantidad' : 'Quantity'}</p>
          <p style="margin: 4px 0 0 0; color: #374151; font-size: 16px; font-weight: 600;">${item.quantity}</p>
        </div>
        <div style="text-align: center;">
          <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">${isSpanish ? 'Precio Unit.' : 'Unit Price'}</p>
          <p style="margin: 4px 0 0 0; color: #374151; font-size: 16px; font-weight: 600;">${formatCurrency(item.unit_price_usd ? item.unit_price_usd : 0)}</p>
        </div>
        <div style="text-align: center;">
          <p style="margin: 0; color: #6b7280; font-size: 12px; text-transform: uppercase; letter-spacing: 0.5px;">${isSpanish ? 'Total' : 'Total'}</p>
          <p style="margin: 4px 0 0 0; color: #10b981; font-size: 18px; font-weight: 700;">${formatCurrency(item.unit_price_usd ? item.unit_price_usd * item.quantity : 0 * item.quantity)}</p>
        </div>
      </div>
    </div>
  `).join('');

  return `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${isSpanish ? 'Su Cotización Personalizada' : 'Your Custom Quote'}</title>
      <style>
        @media only screen and (max-width: 600px) {
          .desktop-table { display: none !important; }
          .mobile-products { display: block !important; }
          .product-image { width: 40px !important; height: 40px !important; }
          .mobile-product-card { margin: 0 8px 12px 8px !important; }
          .contact-buttons { flex-direction: column !important; gap: 8px !important; }
          .contact-button { width: 100% !important; margin: 4px 0 !important; }
          .cta-button { padding: 14px 24px !important; font-size: 15px !important; }
          .price-summary { padding: 16px !important; }
        }
        @media only screen and (min-width: 601px) {
          .desktop-table { display: table !important; }
          .mobile-products { display: none !important; }
        }
        .mobile-products { display: none; }
      </style>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
            🎨 Handmade Art
          </h1>
          <p style="color: #dcfce7; margin: 8px 0 0 0; font-size: 16px;">
            ${isSpanish ? 'Apoyando la inserción social' : 'Supporting social inclusion'}
          </p>
        </div>

        <!-- Main Content -->
        <div style="padding: 30px 20px;">
          
          <!-- Greeting -->
          <div style="margin-bottom: 30px;">
            <h2 style="color: #16a34a; margin: 0 0 16px 0; font-size: 24px; font-weight: 600;">
              ${isSpanish ? '¡Su cotización está lista!' : 'Your quote is ready!'}
            </h2>
            <p style="color: #374151; margin: 0; font-size: 16px; line-height: 1.6;">
              ${isSpanish ? `Hola ${customerName},` : `Hello ${customerName},`}
            </p>
            <p style="color: #6b7280; margin: 8px 0 0 0; font-size: 14px; line-height: 1.6;">
              ${isSpanish 
                ? 'Hemos preparado una cotización personalizada para los productos que seleccionó. Revise los detalles a continuación:' 
                : 'We have prepared a personalized quote for the products you selected. Please review the details below:'}
            </p>
          </div>

          <!-- Products Section -->
          <div style="margin-bottom: 30px;">
            <div style="background-color: #f9fafb; padding: 16px; border: 1px solid #e5e7eb; border-radius: 8px 8px 0 0; border-bottom: none;">
              <h3 style="margin: 0; color: #374151; font-size: 18px; font-weight: 600;">
                ${isSpanish ? 'Productos Incluidos' : 'Included Products'}
              </h3>
            </div>
            
            <!-- Desktop Table -->
            <div class="desktop-table" style="border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; overflow: hidden;">
              <table style="width: 100%; border-collapse: collapse;">
                <thead>
                  <tr style="background-color: #f3f4f6;">
                    <th style="padding: 12px 8px; text-align: left; color: #374151; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      ${isSpanish ? 'Producto' : 'Product'}
                    </th>
                    <th style="padding: 12px 8px; text-align: center; color: #374151; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      ${isSpanish ? 'Cant.' : 'Qty'}
                    </th>
                    <th style="padding: 12px 8px; text-align: right; color: #374151; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      ${isSpanish ? 'Precio Unit.' : 'Unit Price'}
                    </th>
                    <th style="padding: 12px 8px; text-align: right; color: #374151; font-size: 12px; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">
                      ${isSpanish ? 'Total' : 'Total'}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  ${itemsHtml}
                </tbody>
              </table>
            </div>
            
            <!-- Mobile Cards -->
            <div class="mobile-products" style="padding: 16px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 8px 8px; background-color: #f9fafb;">
              ${itemsMobileHtml}
            </div>
          </div>

          <!-- Price Summary -->
          <div class="price-summary" style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 30px; border: 1px solid #e5e7eb;">
            <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 18px; font-weight: 600;">
              ${isSpanish ? 'Resumen de Precios' : 'Price Summary'}
            </h3>
            <div style="space-y: 8px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span style="color: #6b7280; font-size: 14px;">${isSpanish ? 'Subtotal:' : 'Subtotal:'}</span>
                <span style="color: #374151; font-size: 14px; font-weight: 500;">${formatCurrency(originalTotal)}</span>
              </div>
              ${discountAmount > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #16a34a; font-size: 14px;">${isSpanish ? 'Descuento:' : 'Discount:'}</span>
                  <span style="color: #16a34a; font-size: 14px; font-weight: 500;">-${formatCurrency(discountAmount)}</span>
                </div>
              ` : ''}
              ${shippingCost > 0 ? `
                <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                  <span style="color: #6b7280; font-size: 14px;">${isSpanish ? 'Envío:' : 'Shipping:'}</span>
                  <span style="color: #374151; font-size: 14px; font-weight: 500;">${formatCurrency(shippingCost)}</span>
                </div>
              ` : ''}
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 12px 0;" />
              <div style="display: flex; justify-content: space-between;">
                <span style="color: #374151; font-size: 18px; font-weight: 700;">${isSpanish ? 'Total Final:' : 'Final Total:'}</span>
                <span style="color: #16a34a; font-size: 18px; font-weight: 700;">${formatCurrency(finalTotal + shippingCost)}</span>
              </div>
            </div>
            
            ${discountDescription ? `
              <div style="background-color: #dcfce7; padding: 12px; border-radius: 6px; margin-top: 16px;">
                <p style="margin: 0; color: #166534; font-size: 14px; font-weight: 500;">
                  🎉 ${discountDescription}
                </p>
              </div>
            ` : ''}
          </div>

          ${managerNotes ? `
            <!-- Manager Notes -->
            <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 30px;">
              <h3 style="margin: 0 0 12px 0; color: #1e40af; font-size: 16px; font-weight: 600;">
                ${isSpanish ? 'Notas del Gestor:' : 'Manager Notes:'}
              </h3>
              <p style="margin: 0; color: #1e40af; font-size: 14px; line-height: 1.6;">
                ${managerNotes}
              </p>
            </div>
          ` : ''}

          <!-- CTA Button -->
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${quoteUrl}" 
               class="cta-button" style="display: inline-block; background-color: #16a34a; color: #ffffff; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; transition: background-color 0.3s; box-shadow: 0 4px 6px rgba(22, 163, 74, 0.2);">
              ${isSpanish ? '🛒 Ver Cotización y Pagar' : '🛒 View Quote & Pay'}
            </a>
          </div>

          <!-- Instructions -->
          <div style="background-color: #fef3c7; padding: 16px; border-radius: 8px; margin-bottom: 30px;">
            <h4 style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600;">
              ${isSpanish ? '📋 Próximos pasos:' : '📋 Next steps:'}
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.6;">
              <li>${isSpanish ? 'Haga clic en el botón de arriba para ver su cotización completa' : 'Click the button above to view your complete quote'}</li>
              <li>${isSpanish ? 'Complete la información de envío' : 'Complete the shipping information'}</li>
              <li>${isSpanish ? 'Proceda con el pago seguro a través de PayPal' : 'Proceed with secure payment through PayPal'}</li>
              <li>${isSpanish ? 'Recibirá confirmación una vez completado el pago' : 'You will receive confirmation once payment is completed'}</li>
            </ul>
          </div>

          <!-- Contact Info -->
          <div style="text-align: center; padding-top: 20px; border-top: 1px solid #e5e7eb;">
            <p style="margin: 0 0 16px 0; color: #6b7280; font-size: 14px;">
              ${isSpanish ? '¿Tiene preguntas sobre su cotización?' : 'Have questions about your quote?'}
            </p>
            
            <!-- Contact Methods -->
            <div style="margin-bottom: 16px;">
              <p style="margin: 0 0 8px 0; color: #16a34a; font-size: 14px; font-weight: 500;">
                📧 info@handmadeart.store
              </p>
              <p style="margin: 0 0 12px 0; color: #16a34a; font-size: 14px; font-weight: 500;">
                📞 +506 8423 7555
              </p>
            </div>
            
            <div style="margin: 10px 0; text-align: center;">
              <a href="mailto:info@handmadeart.store" style="display: inline-block; background-color: #16a34a; color: white; padding: 8px 16px; text-decoration: none; border-radius: 5px; margin: 5px; font-size: 14px;">📧 ${isSpanish ? 'Enviar Email' : 'Send Email'}</a>
              <a href="https://wa.me/50684237555" style="display: inline-block; background-color: #25d366; color: white; padding: 8px 16px; text-decoration: none; border-radius: 5px; margin: 5px; font-size: 14px;">💬 WhatsApp</a>
              <a href="tel:+50684237555" style="display: inline-block; background-color: #007bff; color: white; padding: 8px 16px; text-decoration: none; border-radius: 5px; margin: 5px; font-size: 14px;">📞 ${isSpanish ? 'Llamar' : 'Call'}</a>
            </div>
            <p style="margin: 5px 0; color: #16a34a; font-size: 14px; font-weight: 500;">
              ${isSpanish ? 'Contáctenos: info@handmadeart.store | +506 8423 7555' : 'Contact us: info@handmadeart.store | +506 8423 7555'}
            </p>
            
            <!-- Action Buttons -->
            <div class="contact-buttons" style="display: flex; justify-content: center; gap: 12px; flex-wrap: wrap;">
              <a href="https://wa.me/50684237555" 
                 class="contact-button" style="display: inline-block; background-color: #25d366; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 14px; margin: 4px; min-width: 120px; text-align: center;">
                📱 ${isSpanish ? 'WhatsApp' : 'WhatsApp'}
              </a>
              <a href="tel:+50684237555" 
                 class="contact-button" style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 14px; margin: 4px; min-width: 120px; text-align: center;">
                📞 ${isSpanish ? 'Llamar' : 'Call'}
              </a>
              <a href="mailto:info@handmadeart.store" 
                 class="contact-button" style="display: inline-block; background-color: #6b7280; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 25px; font-weight: 600; font-size: 14px; margin: 4px; min-width: 120px; text-align: center;">
                📧 ${isSpanish ? 'Email' : 'Email'}
              </a>
            </div>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center;">
          <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 12px;">
            ${isSpanish ? 'Gracias por elegir Handmade Art' : 'Thank you for choosing Handmade Art'}
          </p>
          <p style="margin: 0; color: #9ca3af; font-size: 11px;">
            ${isSpanish ? 'Apoyando la inserción social' : 'Supporting social inclusion'}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Template para el correo al gestor cuando se envía una cotización
export function generateManagerQuoteNotificationTemplate(data: {
  customerName: string;
  customerEmail: string;
  quoteSlug: string;
  finalTotal: number;
  locale: string;
}): string {
  const { customerName, customerEmail, quoteSlug, finalTotal, locale } = data;
  const isSpanish = locale === 'es';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://hands-made-art.vercel.app';
  const quoteUrl = `${baseUrl}/${locale}/quote/${quoteSlug}`;
  const adminUrl = `${baseUrl}/admin/quotes`;

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${isSpanish ? 'Cotización Enviada al Cliente' : 'Quote Sent to Customer'}</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f9fafb;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%); padding: 30px 20px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
            📧 ${isSpanish ? 'Cotización Enviada' : 'Quote Sent'}
          </h1>
          <p style="color: #dbeafe; margin: 8px 0 0 0; font-size: 16px;">
            ${isSpanish ? 'Notificación del Panel de Administración' : 'Admin Panel Notification'}
          </p>
        </div>

        <!-- Main Content -->
        <div style="padding: 30px 20px;">
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6; margin-bottom: 30px;">
            <h2 style="color: #1e40af; margin: 0 0 16px 0; font-size: 20px; font-weight: 600;">
              ${isSpanish ? '✅ Cotización enviada exitosamente' : '✅ Quote sent successfully'}
            </h2>
            <p style="color: #1e40af; margin: 0; font-size: 14px; line-height: 1.6;">
              ${isSpanish 
                ? 'La cotización ha sido enviada al cliente y está disponible para su revisión y pago.' 
                : 'The quote has been sent to the customer and is available for review and payment.'}
            </p>
          </div>

          <!-- Customer Info -->
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <h3 style="margin: 0 0 16px 0; color: #374151; font-size: 18px; font-weight: 600;">
              ${isSpanish ? 'Información del Cliente' : 'Customer Information'}
            </h3>
            <div style="space-y: 8px;">
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                <strong style="color: #374151;">${isSpanish ? 'Nombre:' : 'Name:'}</strong> ${customerName}
              </p>
              <p style="margin: 0 0 8px 0; color: #6b7280; font-size: 14px;">
                <strong style="color: #374151;">Email:</strong> ${customerEmail}
              </p>
              <p style="margin: 0; color: #6b7280; font-size: 14px;">
                <strong style="color: #374151;">${isSpanish ? 'Total de la cotización:' : 'Quote total:'}</strong> 
                <span style="color: #16a34a; font-weight: 600;">${formatCurrency(finalTotal + 7)}</span>
              </p>
            </div>
          </div>

          <!-- Action Buttons -->
          <div style="text-align: center; margin-bottom: 30px;">
            <a href="${quoteUrl}" 
               style="display: inline-block; background-color: #16a34a; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px; margin: 0 8px 8px 0;">
              ${isSpanish ? '👀 Ver Cotización' : '👀 View Quote'}
            </a>
            <a href="${adminUrl}" 
               style="display: inline-block; background-color: #3b82f6; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 500; font-size: 14px; margin: 0 8px 8px 0;">
              ${isSpanish ? '⚙️ Panel de Admin' : '⚙️ Admin Panel'}
            </a>
          </div>

          <!-- Instructions -->
          <div style="background-color: #fef3c7; padding: 16px; border-radius: 8px; margin-bottom: 20px;">
            <h4 style="margin: 0 0 8px 0; color: #92400e; font-size: 14px; font-weight: 600;">
              ${isSpanish ? '📋 Qué sigue:' : '📋 What\'s next:'}
            </h4>
            <ul style="margin: 0; padding-left: 20px; color: #92400e; font-size: 14px; line-height: 1.6;">
              <li>${isSpanish ? 'El cliente recibirá un correo con el enlace de la cotización' : 'The customer will receive an email with the quote link'}</li>
              <li>${isSpanish ? 'Podrá revisar los productos y proceder con el pago' : 'They can review the products and proceed with payment'}</li>
              <li>${isSpanish ? 'Recibirás una notificación cuando se complete el pago' : 'You will receive a notification when payment is completed'}</li>
              <li>${isSpanish ? 'El estado de la cotización se actualizará automáticamente' : 'The quote status will be updated automatically'}</li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 20px; text-align: center;">
          <p style="margin: 0; color: #6b7280; font-size: 12px;">
            ${isSpanish ? 'Panel de Administración - Handmade Art' : 'Admin Panel - Handmade Art'}
          </p>
        </div>
      </div>
    </body>
    </html>
  `;
}