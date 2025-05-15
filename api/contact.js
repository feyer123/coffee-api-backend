import nodemailer from 'nodemailer';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  'https://xddbeclwfojyrmwykqwz.supabase.co',
  process.env.SUPABASE_ANON_KEY
);

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'essentialservicescoffee@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD
  }
});

export default async function handler(req, res) {
  // ✅ Always set CORS headers
  res.setHeader('Access-Control-Allow-Origin', 'https://essentialservices.coffee');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  console.log("Request method:", req.method);

  if (req.method === 'OPTIONS') {
    console.log("Handled preflight OPTIONS request");
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const buffers = [];
    for await (const chunk of req) {
      buffers.push(chunk);
    }
    const data = JSON.parse(Buffer.concat(buffers).toString());

    const { name, email, subject, message } = data;

    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const { error } = await supabase
      .from('messages')
      .insert([{ name, email, subject, message }]);

    if (error) {
      console.error("Supabase insert error:", error.message);
      return res.status(500).json({ error: error.message });
    }

    await transporter.sendMail({
      from: '"Essential Services Contact" <essentialservicescoffee@gmail.com>',
      to: 'tom@essentialservices.coffee',
      subject: `New message from ${name}`,
      text: `From: ${name} <${email}>\nSubject: ${subject}\n\n${message}`
    });

    return res.status(200).json({ message: 'Message sent and emailed!' });
  } catch (err) {
    console.error('General error:', err.message);
    return res.status(500).json({ error: err.message });
  }
}
