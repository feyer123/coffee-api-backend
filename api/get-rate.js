const { DateTime } = require('luxon');

module.exports = async function handler(req, res) {
  console.log('🌐 Origin:', req.headers.origin);

  const allowedOrigins = [
    'https://essentialservices.coffee',
    'https://prod-h40ws1sao-tom-feyereisens-projects.vercel.app',
    'https://dev-gonl0leci-tom-feyereisens-projects.vercel.app',
    'https://dev.essentialservices.coffee'
  ];

  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
    res.setHeader('Vary', 'Origin');
  }

  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { zipCode } = req.body;

  if (!zipCode) {
    return res.status(400).json({ error: 'Missing zipCode' });
  }

  try {
    const response = await fetch('https://api.goshippo.com/shipments/', {
      method: 'POST',
      headers: {
        Authorization: `ShippoToken ${process.env.SHIPPO_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        address_from: {
          name: "Essential Services Coffee",
          street1: "70 Perimeter Dr",
          city: "Alta",
          state: "WY",
          zip: "83414",
          country: "US"
        },
        address_to: {
          name: "Customer",
          street1: "123 Main St", // Placeholder; only zip is used
          city: "City",
          state: "XX",
          zip: zipCode,
          country: "US"
        },
        parcels: [{
          length: "13",
          width: "16",
          height: "1", // thin poly mailer
          distance_unit: "in",
          weight: "14",
          mass_unit: "oz"
        }],
        async: false
      })
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Shippo error response:', data);
      return res.status(response.status).json({ error: data });
    }

    // Filter rates to include only USPS
    const uspsRates = data.rates.filter(rate => rate.provider === 'USPS');

    const simplifiedRates = uspsRates.map(rate => ({
      amount: rate.amount,
      servicelevel: rate.servicelevel?.name,
      estimated_days: rate.estimated_days
    }));

    return res.status(200).json(simplifiedRates);
  } catch (error) {
    console.error('Error getting rate from Shippo:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
