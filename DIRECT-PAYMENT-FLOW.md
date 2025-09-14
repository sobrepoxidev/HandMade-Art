# Flujo de Pago Directo - Hands Made Art

Este documento describe el flujo de pago directo implementado para Hands Made Art, que permite generar links de pago para cotizaciones y enviarlos directamente a los clientes.

## Componentes Principales

### 1. Gestión de Pagos Directos

- **DirectPaymentManagement.tsx**: Componente principal para la selección de productos y generación de links de pago.
- **DirectPaymentDiscountModal.tsx**: Modal para aplicar descuentos y generar links de pago.

### 2. Procesamiento de Pagos

- **DirectQuotePaymentPage.tsx**: Página que muestra la cotización y el botón de pago de PayPal.
- **DirectPayPalButton.tsx**: Componente que integra los botones de PayPal para el pago directo.
- **PaymentSuccessMessage.tsx**: Componente que muestra el mensaje de éxito después del pago.

### 3. APIs

- **/api/create-paypal-order**: Crea una orden de PayPal para el pago directo.
- **/api/capture-order**: Captura el pago de PayPal y actualiza el estado de la cotización.
- **/api/generate-direct-payment-link**: Genera un link de pago directo para una cotización.
- **/api/send-direct-payment-email**: Envía un correo electrónico con el link de pago al cliente.

## Flujo de Trabajo

1. El administrador selecciona productos y agrega información del cliente en DirectPaymentManagement.
2. Se abre el modal de descuentos (DirectPaymentDiscountModal) para aplicar descuentos si es necesario.
3. Se genera un link de pago directo y opcionalmente se envía por correo electrónico al cliente.
4. El cliente accede al link de pago y ve la página DirectQuotePaymentPage con los detalles de la cotización.
5. El cliente realiza el pago a través de PayPal.
6. Después del pago exitoso, se muestra el mensaje de éxito y se actualiza el estado de la cotización a "paid".

## Cómo Probar

### Generar un Link de Pago de Prueba

1. Accede a la ruta `/api/test-direct-payment` para generar un link de pago de prueba usando una cotización pendiente existente.
2. La API devolverá un JSON con el link de pago que puedes usar para probar el flujo.

### Probar el Flujo Completo

1. Accede a la sección de administración y selecciona "Pagos Directos".
2. Selecciona productos, agrega información del cliente y genera un link de pago.
3. Usa el link generado para acceder a la página de pago.
4. Completa el pago usando las credenciales de sandbox de PayPal:
   - Email: sb-43zfyt25243413@personal.example.com
   - Contraseña: 12345678

## Notas Importantes

- El sistema está configurado para usar el entorno de sandbox de PayPal en desarrollo.
- Para producción, asegúrate de que las variables de entorno estén correctamente configuradas.
- Los links de pago son únicos para cada cotización y no caducan automáticamente.