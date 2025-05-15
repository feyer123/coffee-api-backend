export default async function handler(req, res) {
  // Allow your frontend domain
  res.setHeader('Access-Control-Allow-Origin', 'https://essentialservices.coffee');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');

  // Handle preflight
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
    // Simulate a rate response (replace with real API call later)
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
}
