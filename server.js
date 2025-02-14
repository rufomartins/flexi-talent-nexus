
const express = require('express');
const app = express();

// Trust proxy - needed when behind Nginx
app.set('trust proxy', true);

// Parse JSON bodies
app.use(express.json());

// Webhook endpoint
app.post('/webhook', async (req, res) => {
  try {
    console.log('Received webhook:', req.body);
    
    // Add basic validation
    if (!req.body || !req.body.envelope || !req.body.headers) {
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    // Process the email
    const envelope = req.body.envelope;
    const headers = req.body.headers;
    const plain = req.body.plain;
  
    console.log('Envelope:', envelope);
    console.log('Headers:', headers);
    console.log('Plain Text Body:', plain);

    // Send a 200 response quickly to acknowledge receipt
    res.status(200).json({ status: 'ok' });
  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

const port = process.env.PORT || 3100;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
