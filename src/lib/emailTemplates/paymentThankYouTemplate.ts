import { formatUSD } from "@/lib/formatCurrency";

interface PaymentThankYouEmailProps {
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentId: string;
  paymentDate: string;
  locale: string;
  newPaymentLink?: string;
}

export function generatePaymentThankYouEmailTemplate({
  customerName,
  customerEmail,
  amount,
  paymentId,
  paymentDate,
  locale,
  newPaymentLink
}: PaymentThankYouEmailProps): string {
  const isSpanish = locale === 'es';
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://handmadeart.store';
  const homeUrl = `${baseUrl}/${locale}`;
  const defaultNewPaymentLink = newPaymentLink || `${baseUrl}/${locale}/pay/new`;

  const translations = {
    subject: isSpanish ? '¡Gracias por tu pago!' : 'Thank you for your payment!',
    greeting: isSpanish ? 'Hola' : 'Hello',
    thankYouMessage: isSpanish 
      ? '¡Gracias por tu pago! Hemos recibido tu pago exitosamente.' 
      : 'Thank you for your payment! We have successfully received your payment.',
    paymentDetails: isSpanish ? 'Detalles del Pago' : 'Payment Details',
    amount: isSpanish ? 'Monto' : 'Amount',
    paymentId: isSpanish ? 'ID de Pago' : 'Payment ID',
    date: isSpanish ? 'Fecha' : 'Date',
    email: isSpanish ? 'Email' : 'Email',
    appreciation: isSpanish 
      ? 'Tu apoyo es muy importante para nosotros y nos ayuda a continuar con nuestra misión de apoyar a artesanos costarricenses en su proceso de reinserción social.' 
      : 'Your support is very important to us and helps us continue our mission of supporting Costa Rican artisans in their social reintegration process.',
    nextSteps: isSpanish ? 'Próximos Pasos' : 'Next Steps',
    makeAnotherPayment: isSpanish ? 'Realizar Otro Pago' : 'Make Another Payment',
    visitHome: isSpanish ? 'Visitar Página Principal' : 'Visit Home Page',
    questions: isSpanish ? '¿Tienes preguntas?' : 'Have questions?',
    contactUs: isSpanish ? 'Contáctanos' : 'Contact us',
    sendEmail: isSpanish ? 'Enviar Email' : 'Send Email',
    call: isSpanish ? 'Llamar' : 'Call',
    footerText: isSpanish 
      ? 'Gracias por apoyar el arte hecho a mano costarricense' 
      : 'Thank you for supporting Costa Rican handmade art'
  };

  return `
    <!DOCTYPE html>
    <html lang="${locale}">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${translations.subject} - Handmade Art</title>
    </head>
    <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f5f5f5;">
      <div style="max-width: 600px; margin: 0 auto; background-color: white; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
        
        <!-- Header -->
        <div style="background: linear-gradient(135deg, #555555 0%, #444444 100%); padding: 40px 20px; text-align: center;">
          <div style="background-color: white; width: 100px; height: 100px; border-radius: 50%; margin: 0 auto 25px; display: flex; align-items: center; justify-content: center; box-shadow: 0 6px 12px rgba(0,0,0,0.15);">
            <span style="font-size: 50px; line-height: 1; display: block; text-align: center;">✅</span>
          </div>
          <h1 style="color: white; margin: 0; font-size: 28px; font-weight: bold;">${translations.subject}</h1>
          <p style="color: #e5e5e5; margin: 10px 0 0 0; font-size: 16px;">${translations.thankYouMessage}</p>
        </div>

        <!-- Content -->
        <div style="padding: 30px 20px;">
          
          <!-- Greeting -->
          <div style="margin-bottom: 25px;">
            <h2 style="color: #374151; margin: 0 0 10px 0; font-size: 20px;">${translations.greeting} ${customerName},</h2>
            <p style="color: #6b7280; margin: 0; line-height: 1.6; font-size: 16px;">
              ${translations.appreciation}
            </p>
          </div>

          <!-- Payment Details -->
          <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #374151; margin: 0 0 15px 0; font-size: 18px; font-weight: 600;">
              💳 ${translations.paymentDetails}
            </h3>
            <div style="display: grid; gap: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #6b7280; font-size: 14px; font-weight: 500;">${translations.amount}:</span>
                <span style="color: #16a34a; font-size: 18px; font-weight: bold;">${formatUSD(amount)}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #6b7280; font-size: 14px; font-weight: 500;">${translations.paymentId}:</span>
                <span style="color: #374151; font-size: 14px; font-family: monospace;">${paymentId}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0; border-bottom: 1px solid #e5e7eb;">
                <span style="color: #6b7280; font-size: 14px; font-weight: 500;">${translations.date}:</span>
                <span style="color: #374151; font-size: 14px;">${paymentDate}</span>
              </div>
              <div style="display: flex; justify-content: space-between; align-items: center; padding: 8px 0;">
                <span style="color: #6b7280; font-size: 14px; font-weight: 500;">${translations.email}:</span>
                <span style="color: #374151; font-size: 14px;">${customerEmail}</span>
              </div>
            </div>
          </div>

          <!-- Next Steps -->
          <div style="background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 1px solid #dee2e6; padding: 25px; margin: 25px 0; border-radius: 12px;">
            <h3 style="color: #555555; margin: 0 0 20px 0; font-size: 18px; text-align: center;">🎯 ${translations.nextSteps}</h3>
            <div style="display: flex; gap: 15px; flex-wrap: wrap; justify-content: center;">
              <a href="${defaultNewPaymentLink}" 
                 style="display: inline-flex; align-items: center; gap: 10px; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 15px 25px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 8px rgba(22, 163, 74, 0.3); transition: all 0.2s;">
                🔄 ${translations.makeAnotherPayment}
              </a>
              <a href="${homeUrl}" 
                 style="display: inline-flex; align-items: center; gap: 10px; background: linear-gradient(135deg, #8b4513 0%, #654321 100%); color: white; padding: 15px 25px; text-decoration: none; border-radius: 10px; font-weight: 600; font-size: 15px; box-shadow: 0 4px 8px rgba(139, 69, 19, 0.3); transition: all 0.2s;">
                🏠 ${translations.visitHome}
              </a>
            </div>
          </div>

          <!-- Contact Info -->
          <div style="text-align: center; margin: 30px 0; padding: 25px; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%); border: 1px solid #dee2e6; border-radius: 12px;">
            <h3 style="color: #555555; margin: 0 0 15px 0; font-size: 18px;">${translations.questions}</h3>
            <p style="color: #6b7280; margin: 0 0 20px 0; font-size: 14px;">
              ${translations.contactUs}: info@handmadeart.store | +506 8423 7555
            </p>
            <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
              <a href="mailto:info@handmadeart.store" 
                 style="display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #16a34a 0%, #15803d 100%); color: white; padding: 10px 18px; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500; box-shadow: 0 3px 6px rgba(22, 163, 74, 0.2);">
                📧 ${translations.sendEmail}
              </a>
              <a href="https://wa.me/50684237555" 
                 style="display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #25d366 0%, #20b358 100%); color: white; padding: 10px 18px; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500; box-shadow: 0 3px 6px rgba(37, 211, 102, 0.2);">
                💬 WhatsApp
              </a>
              <a href="tel:+50684237555" 
                 style="display: inline-flex; align-items: center; gap: 8px; background: linear-gradient(135deg, #007bff 0%, #0056b3 100%); color: white; padding: 10px 18px; text-decoration: none; border-radius: 8px; font-size: 14px; font-weight: 500; box-shadow: 0 3px 6px rgba(0, 123, 255, 0.2);">
                📞 ${translations.call}
              </a>
            </div>
          </div>

        </div>

        <!-- Footer -->
        <div style="background-color: #8b4513; padding: 20px; text-align: center;">
          <p style="color: white; margin: 0; font-size: 14px; font-weight: 500;">
            © 2024 Handmade Art - Artesanías Costarricenses
          </p>
          <p style="color: #d2b48c; margin: 10px 0 0 0; font-size: 12px;">
            ${translations.footerText}
          </p>
        </div>
        
      </div>
    </body>
    </html>
  `;
}