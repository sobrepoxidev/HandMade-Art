/**
 * Funciones de ayuda para interactuar con la API de PayPal
 */

/**
 * Obtiene un token de acceso de PayPal para realizar operaciones con la API
 * @returns Token de acceso de PayPal
 */
export async function getPayPalAccessToken(): Promise<string> {
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || '';
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET || '';
  
  const auth = Buffer.from(`${clientId}:${clientSecret}`).toString('base64');
  
  try {
    const response = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${auth}`
      },
      body: 'grant_type=client_credentials'
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error obteniendo token de PayPal: ${errorData.error_description || 'Error desconocido'}`);
    }
    
    const data = await response.json();
    return data.access_token;
  } catch (error) {
    console.error('Error al obtener token de PayPal:', error);
    throw error;
  }
}

/**
 * Captura un pago de PayPal usando el ID de la orden
 * @param orderId ID de la orden de PayPal a capturar
 * @returns Detalles de la captura
 */
export async function capturePayPalOrder(orderId: string) {
  const accessToken = await getPayPalAccessToken();
  
  try {
    const response = await fetch(`https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      }
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error capturando pago de PayPal: ${errorData.message || 'Error desconocido'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al capturar pago de PayPal:', error);
    throw error;
  }
}

/**
 * Crea una orden de PayPal
 * @param amount Monto de la orden
 * @param currency Moneda (por defecto USD)
 * @returns Detalles de la orden creada
 */
export async function createPayPalOrder(amount: number, currency: string = 'USD') {
  const accessToken = await getPayPalAccessToken();
  
  // Asegurar que amount sea un número válido
  if (amount === undefined || amount === null || isNaN(amount)) {
    throw new Error('El monto debe ser un número válido');
  }
  
  try {
    const response = await fetch('https://api-m.sandbox.paypal.com/v2/checkout/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: JSON.stringify({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: currency,
              value: amount.toFixed(2)
            }
          }
        ]
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error creando orden de PayPal: ${errorData.message || 'Error desconocido'}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error al crear orden de PayPal:', error);
    throw error;
  }
}