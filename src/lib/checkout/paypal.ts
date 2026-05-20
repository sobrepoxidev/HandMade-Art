export interface PaypalOrderRequest {
  amount: number;
  currency: "USD";
  orderId: number;
}

export interface PaypalCaptureAmount {
  value: string;
  currency_code: string;
}

export interface PaypalCaptureResult {
  id: string;
  status: string;
  purchase_units?: Array<{
    reference_id?: string;
    custom_id?: string;
    invoice_id?: string;
    payments?: {
      captures?: Array<{
        id: string;
        status: string;
        amount?: PaypalCaptureAmount;
      }>;
    };
  }>;
}

function isProduction() {
  return process.env.NODE_ENV === "production";
}

export function getPaypalClientId() {
  const env = process.env.PAYPAL_ENV === "live" ? "live" : "sandbox";
  return env === "live"
    ? process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_LIVE
    : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID_SANDBOX;
}

function getPaypalSecret() {
  const env = process.env.PAYPAL_ENV === "live" ? "live" : "sandbox";
  return env === "live" ? process.env.PAYPAL_SECRET_LIVE : process.env.PAYPAL_SECRET_SANDBOX;
}

export function getPaypalSdkEnvironment() {
  return process.env.PAYPAL_ENV === "live" ? "production" : "sandbox";
}

function getPaypalApiUrl() {
  return process.env.PAYPAL_ENV === "live"
    ? "https://api-m.paypal.com"
    : "https://api-m.sandbox.paypal.com";
}

function canUsePaypalMock() {
  return !isProduction() && process.env.PAYPAL_MOCK === "true";
}

function formatAmount(amount: number) {
  return amount.toFixed(2);
}

export async function getPaypalAccessToken() {
  if (canUsePaypalMock()) {
    return "MOCK_PAYPAL_TOKEN";
  }

  const clientId = getPaypalClientId();
  const secret = getPaypalSecret();

  if (!clientId || !secret) {
    throw new Error("PayPal credentials are not configured");
  }

  const response = await fetch(`${getPaypalApiUrl()}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${clientId}:${secret}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`PayPal token request failed: ${details}`);
  }

  const data = (await response.json()) as { access_token?: string };
  if (!data.access_token) {
    throw new Error("PayPal token response did not include access_token");
  }

  return data.access_token;
}

export async function createPaypalOrder({ amount, currency, orderId }: PaypalOrderRequest) {
  if (canUsePaypalMock()) {
    return {
      id: `MOCK_PAYPAL_ORDER_${orderId}`,
      status: "CREATED",
    };
  }

  const accessToken = await getPaypalAccessToken();
  const response = await fetch(`${getPaypalApiUrl()}/v2/checkout/orders`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      intent: "CAPTURE",
      purchase_units: [
        {
          reference_id: String(orderId),
          custom_id: `order:${orderId}`,
          invoice_id: `hm-${orderId}`,
          amount: {
            currency_code: currency,
            value: formatAmount(amount),
          },
        },
      ],
      application_context: {
        shipping_preference: "SET_PROVIDED_ADDRESS",
      },
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`PayPal create order failed: ${details}`);
  }

  return (await response.json()) as { id: string; status: string };
}

export async function capturePaypalOrder(paypalOrderId: string) {
  if (canUsePaypalMock()) {
    const orderId = paypalOrderId.replace("MOCK_PAYPAL_ORDER_", "");
    return {
      id: paypalOrderId,
      status: "COMPLETED",
      purchase_units: [
        {
          reference_id: orderId,
          custom_id: `order:${orderId}`,
          invoice_id: `hm-${orderId}`,
          payments: {
            captures: [
              {
                id: `MOCK_PAYPAL_CAPTURE_${orderId}`,
                status: "COMPLETED",
                amount: { currency_code: "USD", value: "0.00" },
              },
            ],
          },
        },
      ],
    } satisfies PaypalCaptureResult;
  }

  const accessToken = await getPaypalAccessToken();
  const response = await fetch(`${getPaypalApiUrl()}/v2/checkout/orders/${paypalOrderId}/capture`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`PayPal capture failed: ${details}`);
  }

  return (await response.json()) as PaypalCaptureResult;
}

export function getPrimaryCapture(result: PaypalCaptureResult) {
  return result.purchase_units?.[0]?.payments?.captures?.[0] ?? null;
}

export function validatePaypalCapture(result: PaypalCaptureResult, orderId: number, totalAmount: number) {
  if (result.status !== "COMPLETED") {
    return "PayPal capture is not completed";
  }

  const unit = result.purchase_units?.[0];
  const capture = getPrimaryCapture(result);
  if (!unit || !capture || capture.status !== "COMPLETED") {
    return "PayPal capture details are incomplete";
  }

  if (unit.reference_id !== String(orderId) && unit.custom_id !== `order:${orderId}`) {
    return "PayPal order does not match checkout order";
  }

  if (capture.amount && process.env.PAYPAL_MOCK !== "true") {
    const amount = Number(capture.amount.value);
    if (capture.amount.currency_code !== "USD" || Math.abs(amount - totalAmount) > 0.01) {
      return "PayPal capture amount does not match checkout total";
    }
  }

  return null;
}

