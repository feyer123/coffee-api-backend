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

  const { zipCode, weightOz } = req.body;

  if (!zipCode || !weightOz) {
    return res.status(400).json({ error: 'Missing zipCode or weightOz' });
  }

  try {
    const rates = [
      {
        amount: "5.80",
        servicelevel: "USPS Ground Advantage",
        estimated_days: 3
      },
      {
        amount: "8.95",
        servicelevel: "USPS Priority Mail",
        estimated_days: 2
      }
    ];

    return res.status(200).json(rates);
  } catch (error) {
    console.error('Error getting rate:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
};
