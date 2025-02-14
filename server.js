
const express = require('express');
const app = express();

// Trust proxy - needed when behind Nginx
app.set('trust proxy', true);

// Parse JSON bodies
app.use(express.json());

// Add detailed logging middleware
app.use((req, res, next) => {
  console.log('Incoming request:', {
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body,
    timestamp: new Date().toISOString()
  });
  next();
});

// Basic auth middleware for CloudMailin
const authenticateCloudMailin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    console.log('Missing or invalid authorization header');
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (
    username !== process.env.CLOUDMAILIN_USERNAME ||
    password !== process.env.CLOUDMAILIN_PASSWORD
  ) {
    console.log('Invalid CloudMailin credentials');
    return res.status(401).json({ error: 'Invalid credentials' });
  }

  next();
};

// Webhook endpoint with authentication
app.post('/webhook', authenticateCloudMailin, async (req, res) => {
  try {
    console.log('Received webhook:', req.body);
    
    // Add basic validation
    if (!req.body || !req.body.envelope || !req.body.headers) {
      console.log('Invalid webhook payload - missing required fields');
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
