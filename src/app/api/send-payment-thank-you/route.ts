import { NextRequest, NextResponse } from 'next/server';
import { sendMail } from '@/lib/email';
import { generatePaymentThankYouEmailTemplate } from '@/lib/emailTemplates/paymentThankYouTemplate';

interface PaymentThankYouRequest {
  customerName: string;
  customerEmail: string;
  amount: number;
  paymentId: string;
  locale: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: PaymentThankYouRequest = await request.json();
    
    const { customerName, customerEmail, amount, paymentId, locale } = body;

    // Validar campos requeridos
    if (!customerName || !customerEmail || !amount || !paymentId || !locale) {
      return NextResponse.json(
        { error: 'Missing required fields: customerName, customerEmail, amount, paymentId, locale' },
        { status: 400 }
      );
    }

    // Validar email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(customerEmail)) {
      return NextResponse.json(
        { error: 'Invalid email format' },
        { status: 400 }
      );
    }

    // Validar monto
    if (typeof amount !== 'number' || amount <= 0) {
      return NextResponse.json(
        { error: 'Amount must be a positive number' },
        { status: 400 }
      );
    }

    // Validar locale
    if (!['es', 'en'].includes(locale)) {
      return NextResponse.json(
        { error: 'Locale must be either "es" or "en"' },
        { status: 400 }
      );
    }

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://handmadeart.store';
    const newPaymentLink = `${baseUrl}/${locale}/pay/new`;
    
    // Generar fecha formateada
    const paymentDate = new Date().toLocaleDateString(locale === 'es' ? 'es-CR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    // Generar el HTML del correo
    const emailHtml = generatePaymentThankYouEmailTemplate({
      customerName,
      customerEmail,
      amount,
      paymentId,
      paymentDate,
      locale,
      newPaymentLink
    });

    // Definir el asunto según el idioma
    const subject = locale === 'es' 
      ? '¡Gracias por tu pago! - Handmade Art' 
      : 'Thank you for your payment! - Handmade Art';

    // Enviar correo al cliente
    await sendMail(subject, emailHtml, customerEmail);

    // Enviar notificación al administrador
    const adminNotificationHtml = `
      <h2>Nuevo pago recibido</h2>
      <p><strong>Cliente:</strong> ${customerName}</p>
      <p><strong>Email:</strong> ${customerEmail}</p>
      <p><strong>Monto:</strong> $${amount.toFixed(2)}</p>
      <p><strong>ID de Pago:</strong> ${paymentId}</p>
      <p><strong>Fecha:</strong> ${paymentDate}</p>
      <p><strong>Idioma:</strong> ${locale}</p>
    `;

    await sendMail(
      `Nuevo pago recibido - $${amount.toFixed(2)} - ${customerName}`,
      adminNotificationHtml,
      'sobrepoxidev@gmail.com'
    );

    return NextResponse.json({ 
      success: true, 
      message: 'Thank you email sent successfully' 
    });

  } catch (error) {
    console.error('Error sending payment thank you email:', error);
    return NextResponse.json(
      { error: 'Failed to send thank you email' },
      { status: 500 }
    );
  }
}