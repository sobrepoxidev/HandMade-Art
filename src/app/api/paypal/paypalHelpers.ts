// app/api/paypal/paypalHelpers.ts

/**
 * Determines if the application is running in production mode
 * This can be customized based on your deployment environment variables
 */
const isProduction = (): boolean => {
  return process.env.NODE_ENV === 'production';
};

/**
 * Gets the appropriate PayPal API URL based on environment
 */
const getPayPalApiUrl = (): string => {
  return isProduction()
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
};

/**
 * For testing purposes - creates a mock PayPal order response
 * Only used when credentials are missing in development
 */
const createMockPayPalOrder = (amount: number) => {
  return {
    id: `MOCK_ORDER_${Date.now()}`,
    status: 'CREATED',
    links: [
      {
        href: 'https://www.sandbox.paypal.com/checkoutnow?token=MOCK_TOKEN',
        rel: 'approve',
        method: 'GET'
      }
    ],
    purchase_units: [
      {
        amount: {
          currency_code: 'USD',
          value: amount.toString()
        }
      }
    ]
  };
};

/**
 * Gets an access token from PayPal API for authentication
 */
export async function getPaypalAccessToken(): Promise<string> {
  // Use different credentials based on environment
  const CLIENT_ID = isProduction()
    ? process.env.NEXT_PUBLIC_PAYPAL_LIVE_CLIENT_ID
    : process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  const CLIENT_SECRET = isProduction()
    ? process.env.PAYPAL_LIVE_SECRET
    : process.env.PAYPAL_SECRET;

  // For development, if credentials are missing, use a mock token
  if (!CLIENT_ID || !CLIENT_SECRET) {
    if (!isProduction()) {
      console.warn('PayPal credentials missing. Using mock token for development.');
      return 'MOCK_ACCESS_TOKEN_FOR_DEVELOPMENT';
    }
    throw new Error(`PayPal credentials not found for ${isProduction() ? 'production' : 'sandbox'} environment`);
  }

  const API_URL = getPayPalApiUrl();
  const auth = `${CLIENT_ID}:${CLIENT_SECRET}`;

  try {
    const res = await fetch(`${API_URL}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        'Authorization': `Basic ${Buffer.from(auth).toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(`Failed to get PayPal access token. Status: ${res.status}, Error: ${JSON.stringify(errorData)}`);
    }

    const data = await res.json();
    console.log(`Successfully got PayPal access token in ${isProduction() ? 'production' : 'sandbox'} mode`);
    return data.access_token;
  } catch (error) {
    console.error('Error getting PayPal access token:', error);
    if (!isProduction()) {
      console.warn('Using mock token for development due to error.');
      return 'MOCK_ACCESS_TOKEN_FOR_DEVELOPMENT';
    }
    throw error;
  }
}

/**
 * Creates a PayPal order with the specified amount and currency
 */
export async function createPaypalOrder({
  accessToken,
  amount,
  currency
}: {
  accessToken: string;
  amount: number;
  currency: string;
}) {
  // For development with mock token
  if (accessToken === 'MOCK_ACCESS_TOKEN_FOR_DEVELOPMENT' && !isProduction()) {
    console.log('Using mock PayPal order for development');
    return createMockPayPalOrder(amount);
  }

  const API_URL = getPayPalApiUrl();
  const data = JSON.stringify({
    'intent': 'CAPTURE',
    'purchase_units': [{
      'amount': {
        'currency_code': currency,
        'value': amount.toString()
      }
    }],
    'application_context': {
      'shipping_preference': 'NO_SHIPPING'
    }
  });

  try {

    const res = await fetch(`${API_URL}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`
      },
      body: data
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`PayPal create order error in ${isProduction() ? 'production' : 'sandbox'} mode:`, errorText);

      // In development, fall back to mock order on error
      if (!isProduction()) {
        console.warn('Falling back to mock order due to API error');
        return createMockPayPalOrder(amount);
      }
      return null;
    }

    return res.json(); // { id: "PAYPAL_ORDER_ID", etc. }
  } catch (error) {
    console.error('Error creating PayPal order:', error);

    // In development, fall back to mock order on error
    if (!isProduction()) {
      console.warn('Falling back to mock order due to exception');
      return createMockPayPalOrder(amount);
    }
    return null;
  }
}

/**
 * Captures a previously created PayPal order
 */
export async function capturePaypalOrder({
  accessToken,
  paypalOrderId
}: {
  accessToken: string;
  paypalOrderId: string;
}) {
  // For development with mock token
  if ((accessToken === 'MOCK_ACCESS_TOKEN_FOR_DEVELOPMENT' || paypalOrderId.startsWith('MOCK_ORDER_')) && !isProduction()) {
    console.log('Using mock PayPal capture for development');
    return {
      id: paypalOrderId,
      status: 'COMPLETED',
      purchase_units: [
        {
          payments: {
            captures: [
              {
                id: `MOCK_CAPTURE_${Date.now()}`,
                status: 'COMPLETED'
              }
            ]
          }
        }
      ]
    };
  }

  const API_URL = getPayPalApiUrl();
  const url = `${API_URL}/v2/checkout/orders/${paypalOrderId}/capture`;

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`PayPal capture order error in ${isProduction() ? 'production' : 'sandbox'} mode:`, errorText);

      // In development, return mock capture on error
      if (!isProduction()) {
        console.warn('Falling back to mock capture due to API error');
        return {
          id: paypalOrderId,
          status: 'COMPLETED',
          purchase_units: [
            {
              payments: {
                captures: [
                  {
                    id: `MOCK_CAPTURE_${Date.now()}`,
                    status: 'COMPLETED'
                  }
                ]
              }
            }
          ]
        };
      }
      throw new Error("Capture request failed");
    }

    return res.json(); // { status: "COMPLETED", etc. }
  } catch (error) {
    console.error('Error capturing PayPal order:', error);

    // In development, return mock capture on error
    if (!isProduction()) {
      console.warn('Falling back to mock capture due to exception');
      return {
        id: paypalOrderId,
        status: 'COMPLETED',
        purchase_units: [
          {
            payments: {
              captures: [
                {
                  id: `MOCK_CAPTURE_${Date.now()}`,
                  status: 'COMPLETED'
                }
              ]
            }
          }
        ]
      };
    }
    throw error;
  }
}