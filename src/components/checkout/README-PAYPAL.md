# Checkout PayPal Integration

PayPal is created and captured through secure checkout APIs:

- `POST /api/checkout/orders/{orderId}/paypal/create`
- `POST /api/checkout/orders/{orderId}/paypal/capture`

The client only renders PayPal buttons and passes the guest checkout token. Order totals, PayPal references, inventory transitions, and emails are handled by the server.

Use the environment variables documented in `PAYPAL-SETUP.md`.
