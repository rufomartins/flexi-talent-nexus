
const express = require('express');
const app = express();
const { createClient } = require('@supabase/supabase-js');

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

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

// Webhook endpoint for email processing
app.post('/webhook', async (req, res) => {
  try {
    console.log('Received webhook payload:', JSON.stringify(req.body, null, 2));
    
    // Basic payload validation
    if (!req.body || !req.body.envelope || !req.body.headers) {
      console.log('Invalid webhook payload - missing required fields');
      return res.status(400).json({ error: 'Invalid webhook payload' });
    }

    const envelope = req.body.envelope;
    const headers = req.body.headers;
    const plain = req.body.plain;
    const html = req.body.html;
    
    console.log('Processing email:', {
      from: envelope.from,
      to: envelope.to,
      subject: headers.subject,
      hasHtml: !!html,
      hasPlain: !!plain
    });

    // Check for existing conversation with exact subject match
    const { data: existingConversation, error: searchError } = await supabase
      .from('email_conversations')
      .select('id')
      .eq('subject', headers.subject)
      .eq('status', 'active')
      .single();

    if (searchError && searchError.code !== 'PGRST116') { // PGRST116 is "not found" error
      console.error('Error searching for existing conversation:', searchError);
      throw searchError;
    }

    let conversationId;

    if (existingConversation) {
      console.log('Found existing conversation:', existingConversation.id);
      conversationId = existingConversation.id;
    } else {
      // Create new conversation
      const { data: newConversation, error: conversationError } = await supabase
        .from('email_conversations')
        .insert({
          subject: headers.subject,
          status: 'active'
        })
        .select()
        .single();

      if (conversationError) {
        console.error('Error creating conversation:', conversationError);
        throw conversationError;
      }

      console.log('Created new conversation:', newConversation.id);
      conversationId = newConversation.id;
    }

    // Prepare attachments if present
    const attachments = (req.body.attachments || []).map(att => ({
      content_type: att.content_type,
      file_name: att.file_name,
      size: att.size,
      url: att.url
    }));

    // Ensure to_email is always an array
    const toEmails = Array.isArray(envelope.to) ? envelope.to : [envelope.to];

    // Create the message
    const { data: message, error: messageError } = await supabase
      .from('email_messages')
      .insert({
        conversation_id: conversationId,
        direction: 'inbound',
        from_email: envelope.from,
        to_email: toEmails,
        subject: headers.subject,
        body: plain,
        html_body: html,
        headers: headers,
        attachments: attachments,
        status: 'unread',
        metadata: {
          received_at: new Date().toISOString(),
          source: 'cloudmailin',
          has_html: !!html,
          has_attachments: attachments.length > 0
        }
      })
      .select()
      .single();

    if (messageError) {
      console.error('Error creating message:', messageError);
      throw messageError;
    }

    console.log('Successfully created message:', {
      messageId: message.id,
      conversationId: conversationId
    });

    // Send success response
    res.status(200).json({ 
      status: 'ok', 
      conversation: conversationId,
      message: message.id
    });

  } catch (error) {
    console.error('Webhook error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
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
