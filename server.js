const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(express.json()); // For parsing application/json
app.use(cors({ origin: 'https://essentialservices.coffee' })); // Enable CORS for your domain

// Contact Form API Endpoint
app.post('/api/contact', (req, res) => {
  const { name, email, subject, message } = req.body;
  console.log('Received contact form submission:', { name, email, subject, message });

  // Handle form submission logic here (e.g., save to database, send email, etc.)

  // Send response back
  res.status(200).json({ message: 'Your message has been received!' });
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
