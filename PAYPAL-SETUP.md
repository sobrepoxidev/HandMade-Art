# PayPal Setup

The checkout now uses one server-side PayPal integration for cart and quote payments.

Required variables:

```env
PAYPAL_ENV=sandbox
NEXT_PUBLIC_PAYPAL_ENV=sandbox

NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX=your_sandbox_client_id
PAYPAL_SECRET_SANDBOX=your_sandbox_secret

NEXT_PUBLIC_PAYPAL_CLIENT_ID_LIVE=your_live_client_id
PAYPAL_SECRET_LIVE=your_live_secret
```

Optional local-only mock mode:

```env
PAYPAL_MOCK=true
```

`PAYPAL_MOCK=true` is ignored in production code paths. Do not use generic payment links; payments must be attached to a checkout order or quote order.
