import { formatUSD } from "@/lib/formatCurrency";

interface DirectPaymentEmailTemplateProps {
  customerName: string;
  paymentLink: string;
  items: {
    name: string;
    quantity: number;
    unit_price: number;
    image_url?: string;
    sku?: string;
  }[];
  originalTotal: number;
  discountAmount?: number;
  finalTotal: number;
  discountDescription?: string;
  managerNotes?: string;
  locale: string;
  shippingCost?: number;
}

export function generateDirectPaymentEmailTemplate({
  customerName,
  paymentLink,
  items,
  originalTotal,
  discountAmount = 0,
  finalTotal,
  discountDescription,
  managerNotes,
  locale,
  shippingCost = 0
}: DirectPaymentEmailTemplateProps): string {
  const translations = {
    greeting: locale === 'es' ? 'Hola' : 'Hello',
    paymentReady: locale === 'es' ? 'Tu link de pago está listo' : 'Your payment link is ready',
    paymentDescription: locale === 'es'
      ? 'Hemos preparado tu pedido y está listo para ser pagado. Haz clic en el botón a continuación para proceder con el pago:'
      : 'We have prepared your order and it is ready to be paid. Click the button below to proceed with payment:',
    payNow: locale === 'es' ? 'Pagar ahora' : 'Pay now',
    orderSummary: locale === 'es' ? 'Resumen del pedido' : 'Order summary',
    product: locale === 'es' ? 'Producto' : 'Product',
    quantity: locale === 'es' ? 'Cantidad' : 'Quantity',
    price: locale === 'es' ? 'Precio' : 'Price',
    subtotal: locale === 'es' ? 'Subtotal' : 'Subtotal',
    discount: locale === 'es' ? 'Descuento' : 'Discount',
    shipping: locale === 'es' ? 'Envío' : 'Shipping',
    total: locale === 'es' ? 'Total' : 'Total',
    notes: locale === 'es' ? 'Notas' : 'Notes',
    thanks: locale === 'es' ? 'Gracias por tu compra' : 'Thank you for your purchase',
    questions: locale === 'es'
      ? 'Si tienes alguna pregunta, no dudes en contactarnos al +506 8585-0000.'
      : 'If you have any questions, please don\'t hesitate to contact us at +506 8585-0000.',
    regards: locale === 'es' ? 'Saludos cordiales' : 'Best regards',
    team: 'Handmade Art'
  };

  const itemsHtml = items
    .map(
      (item) => `
      <tr>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0;">
          <div style="display: flex; align-items: center;">
            ${item.image_url ? `<img src="${item.image_url}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px; border-radius: 4px;">` : ''}
            <div>
              <p style="margin: 0; font-weight: 500;">${item.name}</p>
              ${item.sku ? `<p style="margin: 0; font-size: 12px; color: #718096;">SKU: ${item.sku}</p>` : ''}
            </div>
          </div>
        </td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: center;">${item.quantity}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatUSD(item.unit_price)}</td>
        <td style="padding: 12px; border-bottom: 1px solid #e2e8f0; text-align: right;">${formatUSD(item.unit_price * item.quantity)}</td>
      </tr>
    `
    )
    .join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${translations.paymentReady}</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #4a5568; margin: 0; padding: 0; background-color: #f7fafc;">
      <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); margin-top: 20px; margin-bottom: 20px;">
        <!-- Header -->
        <div style="background-color: #4f46e5; padding: 24px; text-align: center;">
          <h1 style="color: #ffffff; margin: 0; font-size: 24px;">${translations.paymentReady}</h1>
        </div>
        
        <!-- Content -->
        <div style="padding: 24px;">
          <p style="margin-top: 0;">${translations.greeting} ${customerName},</p>
          <p>${translations.paymentDescription}</p>
          
          <!-- Payment Button -->
          <div style="text-align: center; margin: 32px 0;">
            <a href="${paymentLink}" style="display: inline-block; background-color: #4f46e5; color: #ffffff; font-weight: 600; padding: 12px 24px; text-decoration: none; border-radius: 6px; transition: background-color 0.3s;">${translations.payNow}</a>
          </div>
          
          <!-- Order Summary -->
          <div style="margin-top: 32px; border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
            <div style="background-color: #f8fafc; padding: 16px; border-bottom: 1px solid #e2e8f0;">
              <h2 style="margin: 0; font-size: 18px; color: #2d3748;">${translations.orderSummary}</h2>
            </div>
            
            <table style="width: 100%; border-collapse: collapse;">
              <thead>
                <tr style="background-color: #f8fafc;">
                  <th style="padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0;">${translations.product}</th>
                  <th style="padding: 12px; text-align: center; border-bottom: 1px solid #e2e8f0;">${translations.quantity}</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;">${translations.price}</th>
                  <th style="padding: 12px; text-align: right; border-bottom: 1px solid #e2e8f0;">${translations.subtotal}</th>
                </tr>
              </thead>
              <tbody>
                ${itemsHtml}
              </tbody>
            </table>
            
            <div style="padding: 16px;">
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>${translations.subtotal}:</span>
                <span>${formatUSD(originalTotal)}</span>
              </div>
              
              ${discountAmount > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px; color: #e53e3e;">
                <span>${translations.discount}${discountDescription ? ` (${discountDescription})` : ''}:</span>
                <span>-${formatUSD(discountAmount)}</span>
              </div>
              ` : ''}
              
              ${shippingCost > 0 ? `
              <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
                <span>${translations.shipping}:</span>
                <span>${formatUSD(shippingCost)}</span>
              </div>
              ` : ''}
              
              <div style="display: flex; justify-content: space-between; font-weight: 700; font-size: 18px; margin-top: 16px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
                <span>${translations.total}:</span>
                <span>${formatUSD(finalTotal)}</span>
              </div>
            </div>
          </div>
          
          ${managerNotes ? `
          <!-- Notes -->
          <div style="margin-top: 24px; padding: 16px; background-color: #f8fafc; border-radius: 8px;">
            <h3 style="margin-top: 0; font-size: 16px; color: #2d3748;">${translations.notes}:</h3>
            <p style="margin-bottom: 0;">${managerNotes}</p>
          </div>
          ` : ''}
          
          <p style="margin-top: 32px;">${translations.thanks}!</p>
          <p>${translations.questions}</p>
          <p>${translations.regards},<br>${translations.team}</p>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f8fafc; padding: 16px; text-align: center; font-size: 12px; color: #718096;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Handmade Art. ${locale === 'es' ? 'Todos los derechos reservados.' : 'All rights reserved.'}</p>
        </div>
      </div>
    </body>
    </html>
  `;
}