// File: api/get-rate.js

export default async function handler(req, res) {
  // ✅ Always set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // ✅ Handle preflight (OPTIONS) request before anything else
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // ✅ Only allow POST requests after preflight
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('📦 Incoming request body:', req.body); // Helpful for debugging

  try {
    const { zipCode, weightOz } = req.body;

    if (!zipCode || typeof weightOz !== 'number') {
      return res.status(400).json({ error: 'Missing or invalid zipCode or weightOz' });
    }

    // ✅ Free shipping for 3+ bags
    if (weightOz >= 42) {
      return res.json([{
        amount: "0.00",
        provider: "EssentialService",
        servicelevel: "Free Shipping",
        estimated_days: null
      }]);
    }

    // ✅ Return mock USPS rates
    return res.json([
      {
        amount: "5.95",
        provider: "USPS",
        servicelevel: "Ground Advantage",
        estimated_days: 3
      },
      {
        amount: "8.25",
        provider: "USPS",
        servicelevel: "Priority Mail",
        estimated_days: 2
      }
    ]);
  } catch (err) {
    console.error('💥 Rate handler error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
