# PayPal Production Notes

The previous production/sandbox inversion has been removed. The active integration is controlled by:

- `PAYPAL_ENV=sandbox|live` for server API calls.
- `NEXT_PUBLIC_PAYPAL_ENV=sandbox|live` for the PayPal JS SDK.

Production must use:

```env
PAYPAL_ENV=live
NEXT_PUBLIC_PAYPAL_ENV=live
NEXT_PUBLIC_PAYPAL_CLIENT_ID_LIVE=...
PAYPAL_SECRET_LIVE=...
```

Sandbox/staging must use:

```env
PAYPAL_ENV=sandbox
NEXT_PUBLIC_PAYPAL_ENV=sandbox
NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX=...
PAYPAL_SECRET_SANDBOX=...
```

Do not reintroduce `NEXT_PUBLIC_PAYPAL_CLIENT_ID_SB` or route-level PayPal helpers. All checkout payments must go through `src/lib/checkout/paypal.ts`.
