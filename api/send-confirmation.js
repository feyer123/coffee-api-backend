// File: api/send-confirmation.js

export default async function handler(req, res) {
  // ✅ CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end(); // preflight
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    name, email, roast, quantity,
    shipping_rate, address, special_instructions
  } = req.body;

  // ✅ Sanity check
  if (!email || !name) {
    return res.status(400).json({ error: 'Missing name or email' });
  }

  const { default: AWS } = await import('aws-sdk');

  AWS.config.update({
    region: 'us-east-1',
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  });

  const ses = new AWS.SES({ apiVersion: '2010-12-01' });

  const emailParams = {
    Source: 'essentialservicescoffee@gmail.com', // must be verified in SES
    Destination: { ToAddresses: [email] },
    Message: {
      Subject: { Data: `Your Order Confirmation – Essential Services Coffee` },
      Body: {
        Html: {
          Data: `
            <p>Hi ${name},</p>
            <p>Thanks for your order! Here's what we received:</p>
            <ul>
              <li><strong>Roast:</strong> ${roast}</li>
              <li><strong>Quantity:</strong> ${quantity} bag(s)</li>
              <li><strong>Shipping Rate:</strong> $${shipping_rate}</li>
              <li><strong>Address:</strong><br />${address}</li>
              <li><strong>Instructions:</strong> ${special_instructions || 'None'}</li>
            </ul>
            <p>We'll roast and ship your order promptly. Thanks again!</p>
            <p>– Essential Services Coffee</p>
          `
        }
      }
    }
  };

  try {
    await ses.sendEmail(emailParams).promise();
    console.log(`✅ Email sent to ${email}`);
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('❌ SES Error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
