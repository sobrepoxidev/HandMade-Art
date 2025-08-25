"use server";

import { sendMail } from '@/lib/email';

// Define interfaces for type safety
interface VacationFormData {
  name: string;
  email: string;
  message: string;
  phone?: string;
}

export async function handleVacationForm(_: unknown, formData: FormData) {
  try {
    const data: VacationFormData = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      message: formData.get("message")?.toString() || "",
      phone: formData.get("phone")?.toString() || undefined
    };

    // Validate required fields
    if (!data.name || !data.email || !data.message) {
      return {
        success: false,
        message: "Por favor, completa todos los campos requeridos"
      };
    }

    // Create a more detailed and visually appealing HTML email
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
        .message-box {
          background-color: #b3d5c3;
          padding: 16px;
          border-radius: 8px;
          margin: 12px 0;
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
          <h1>HANDMADE ART | Contacto MEDIANTE EL SITIO WEB</h1>
          <p style="color: #666; margin: 5px 0 0 0; font-size: 14px;">Apoyando la inserción social</p>
        </div>

        <div class="section">
          <h2>Datos del Contacto: </h2>
          <div class="detail">
            <span class="label">Nombre: </span>
            <span class="value">${data.name}</span>
          </div>
          <div class="detail">
            <span class="label">Correo electrónico: </span>
            <span class="value">${data.email}</span>
          </div>
          <div class="detail">
            <span class="label">Teléfono: </span>
            <span class="value">${data.phone || 'No proporcionado'}</span>
          </div>
        </div>

        <div class="section">
          <h2>Mensaje: </h2>
          <div class="message-box">
            ${data.message}
          </div>
        </div>

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

    // Send email
    await sendMail('Nuevo mensaje de contacto - Handmade Art', html, "info@handmadeart.store");

    return {
      success: true,
      message: "Mensaje enviado exitosamente"
    };
  } catch (error) {
    console.error("Error sending email:", error);
    return {
      success: false,
      message: "Error al enviar el mensaje. Por favor, intenta de nuevo"
    };
  }
}