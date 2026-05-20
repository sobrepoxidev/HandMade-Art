interface OrderEmailData {
  orderId: number;
  customerName: string;
  shippingAddress: {
    name: string;
    address: string;
    city: string;
    state: string;
    country: string;
    postal_code: string;
    phone: string;
  };
  items: {
    name: string;
    quantity: number;
    unitPrice: number;
    lineTotal: number;
  }[];
  subtotal: number;
  shipping: number;
  total: number;
  currency?: 'USD';
  paymentMethod: string;
  paymentStatus?: 'paid' | 'pending_manual_review';
  discountInfo?: {
    code: string;
    discountAmount: number;
    description?: string;
  } | null;
}

export function generateOrderConfirmationEmail(data: OrderEmailData): string {
  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      currencyDisplay: 'narrowSymbol',
      minimumFractionDigits: 2,
    }).format(price);
  const isPendingManualReview = data.paymentStatus === 'pending_manual_review';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
          line-height: 1.6;
          color: #333333;
          margin: 0;
          padding: 0;
          background-color: #f5f5f5;
        }
        .wrapper {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        .container {
          background-color: white;
          border-radius: 16px;
          padding: 40px;
          box-shadow: 0 8px 24px rgba(0,0,0,0.08);
        }
        .header {
          text-align: center;
          padding: 32px;
          border-bottom: 2px solid #b3d5c3;
          margin-bottom: 32px;
        }
        .header img {
          max-width: 250px;
          height: auto;
          margin-bottom: 24px;
        }
        .header h1 {
          color: #B55327;
          font-size: 2.2em;
          margin: 0 0 8px 0;
        }
        .header p {
          color: #666;
          font-size: 1.1em;
          margin: 0;
        }
        .section {
          margin-bottom: 32px;
          padding: 24px;
          border-radius: 12px;
          background-color: #fafafa;
          border: 1px solid #eaeaea;
        }
        .section h2 {
          color: #B55327;
          margin: 0 0 16px 0;
          font-size: 1.5rem;
          font-weight: 600;
          border-bottom: 2px solid #b3d5c3;
          padding-bottom: 8px;
        }
        .items-table {
          width: 100%;
          border-collapse: separate;
          border-spacing: 0;
          margin: 16px 0;
          border: 1px solid #eaeaea;
          border-radius: 8px;
          overflow: hidden;
        }
        .items-table th,
        .items-table td {
          padding: 16px;
          text-align: left;
          border-bottom: 1px solid #eaeaea;
        }
        .items-table th {
          background-color: #b3d5c3;
          color: #B55327;
          font-weight: 600;
          text-transform: uppercase;
          font-size: 0.9em;
          letter-spacing: 0.5px;
        }
        .items-table tr:last-child td {
          border-bottom: none;
        }
        .items-table tbody tr:hover {
          background-color: #f8f9fa;
        }
        .discount-box {
          background-color: #fff3e6;
          padding: 20px;
          border-radius: 12px;
          margin: 24px 0;
          border: 2px dashed #B55327;
        }
        .discount-box h3 {
          color: #B55327;
          margin: 0 0 12px 0;
          font-size: 1.2em;
        }
        .thank-you {
          text-align: center;
          margin-top: 40px;
          padding: 32px;
          background-color: #b3d5c3;
          border-radius: 12px;
          color: #B55327;
        }
        .thank-you p {
          font-size: 1.3em;
          margin: 8px 0;
          font-weight: 500;
        }
        .detail-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 16px;
          margin-top: 16px;
        }
        .detail-item {
          margin-bottom: 8px;
        }
        .detail-item strong {
          color: #B55327;
          display: inline-block;
          min-width: 120px;
        }
        @media (max-width: 600px) {
          .container {
            padding: 20px;
          }
          .header {
            padding: 20px;
          }
          .section {
            padding: 16px;
          }
          .items-table th,
          .items-table td {
            padding: 12px 8px;
            font-size: 0.9em;
          }
        }
      </style>
    </head>
    <body>
      <div class="wrapper">
      <div class="container">
        <div class="header">
          <img src="https://handmadeart.vercel.app/logo-handmade-art-black.webp" alt="HANDMADE ART Logo" />
          <h1>${isPendingManualReview ? 'Referencia recibida' : '¡Gracias por tu compra!'}</h1>
          <p>Pedido #${data.orderId}</p>
        </div>

        <div class="section">
          <h2>Detalles del envío</h2>
          <div class="detail-grid">
            <div class="detail-item"><strong>Nombre:</strong> ${data.shippingAddress.name}</div>
            <div class="detail-item"><strong>Dirección:</strong> ${data.shippingAddress.address}</div>
            <div class="detail-item"><strong>Ciudad:</strong> ${data.shippingAddress.city}</div>
            <div class="detail-item"><strong>Estado/Provincia:</strong> ${data.shippingAddress.state}</div>
            <div class="detail-item"><strong>País:</strong> ${data.shippingAddress.country}</div>
            <div class="detail-item"><strong>Código Postal:</strong> ${data.shippingAddress.postal_code}</div>
            <div class="detail-item"><strong>Teléfono:</strong> ${data.shippingAddress.phone}</div>
          </div>
        </div>

        <div class="section">
          <h2>Productos</h2>
          <table class="items-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Precio</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              ${data.items.map(item => `
                <tr>
                  <td>${item.name}</td>
                  <td>${item.quantity}</td>
                  <td>${formatPrice(item.unitPrice)}</td>
                  <td>${formatPrice(item.lineTotal)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
        </div>

        <div class="section">
          <h2>Resumen del pedido</h2>
          <p><strong>Subtotal:</strong> ${formatPrice(data.subtotal)}</p>
          <p><strong>Envío:</strong> ${formatPrice(data.shipping)}</p>
          ${data.discountInfo ? `
            <div class="discount-box">
              <h3>Descuento aplicado</h3>
              <p><strong>Código:</strong> ${data.discountInfo.code}</p>
              <p><strong>Descuento:</strong> ${formatPrice(data.discountInfo.discountAmount)}</p>
              ${data.discountInfo.description ? `<p>${data.discountInfo.description}</p>` : ''}
            </div>
          ` : ''}
          <p><strong>Total:</strong> ${formatPrice(data.total)}</p>
          <p><strong>Método de pago:</strong> ${data.paymentMethod === 'paypal' ? 'PayPal' : 'SINPE Móvil'}</p>
          <p><strong>Estado de pago:</strong> ${isPendingManualReview ? 'Pendiente de revisión manual' : 'Pagado'}</p>
        </div>

        <div class="thank-you">
          <p>${isPendingManualReview ? 'Validaremos tu referencia pronto.' : '¡Gracias por confiar en HANDMADE ART!'}</p>
          <p>Recibirás actualizaciones sobre el estado de tu pedido.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}
