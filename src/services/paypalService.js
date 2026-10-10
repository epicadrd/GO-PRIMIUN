const PAYPAL_BASE_URL =
  process.env.PAYPAL_BASE_URL ||
  'https://api-m.sandbox.paypal.com';

function getCredentials() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error(
      'Faltan PAYPAL_CLIENT_ID o PAYPAL_CLIENT_SECRET'
    );
  }

  return {
    clientId,
    clientSecret
  };
}

export async function getAccessToken() {
  const {
    clientId,
    clientSecret
  } = getCredentials();

  const basicAuth = Buffer
    .from(`${clientId}:${clientSecret}`)
    .toString('base64');

  const response = await fetch(
    `${PAYPAL_BASE_URL}/v1/oauth2/token`,
    {
      method: 'POST',
      headers: {
        Authorization: `Basic ${basicAuth}`,
        'Content-Type':
          'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok || !data.access_token) {
    console.error(
      'Error autenticando con PayPal:',
      data
    );

    throw new Error(
      'No se pudo autenticar con PayPal'
    );
  }

  return data.access_token;
}

async function paypalRequest(
  path,
  options = {}
) {
  const accessToken =
    await getAccessToken();

  const response = await fetch(
    `${PAYPAL_BASE_URL}${path}`,
    {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          `Bearer ${accessToken}`,
        ...(options.headers || {})
      }
    }
  );

  const data = await response
    .json()
    .catch(() => ({}));

  if (!response.ok) {
    console.error('Error PayPal:', data);

    throw new Error(
      data?.message ||
      data?.details?.[0]?.description ||
      'Error procesando PayPal'
    );
  }

  return data;
}

export function getPublicPayPalConfig() {
  if (!process.env.PAYPAL_CLIENT_ID) {
    throw new Error(
      'Falta PAYPAL_CLIENT_ID'
    );
  }

  return {
    clientId:
      process.env.PAYPAL_CLIENT_ID,

    currency:
      process.env.PAYPAL_CURRENCY ||
      'USD'
  };
}

export async function createPayPalOrder({
  bookingId,
  amount,
  description
}) {
  const currency =
    process.env.PAYPAL_CURRENCY ||
    'USD';

  return paypalRequest(
    '/v2/checkout/orders',
    {
      method: 'POST',

      headers: {
        'PayPal-Request-Id':
          `booking-create-${bookingId}`
      },

      body: JSON.stringify({
        intent: 'CAPTURE',

        purchase_units: [
          {
            reference_id:
              String(bookingId),

            custom_id:
              String(bookingId),

            description:
              description.slice(0, 127),

            amount: {
              currency_code: currency,
              value: Number(amount)
                .toFixed(2)
            }
          }
        ],

        application_context: {
          shipping_preference:
            'NO_SHIPPING',

          user_action:
            'PAY_NOW',

          brand_name:
            'Go Premium Transfer'
        }
      })
    }
  );
}

export async function capturePayPalOrder({
  orderId,
  bookingId
}) {
  return paypalRequest(
    `/v2/checkout/orders/${encodeURIComponent(orderId)}/capture`,
    {
      method: 'POST',

      headers: {
        'PayPal-Request-Id':
          `booking-capture-${bookingId}`
      },

      body: '{}'
    }
  );
}