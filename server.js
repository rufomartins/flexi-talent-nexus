
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

// Find or create a conversation based on subject
const findOrCreateConversation = async (subject) => {
  console.log('Finding conversation for subject:', subject);

  try {
    // First try to find an existing conversation
    const { data: existing, error: findError } = await supabase
      .from('email_conversations')
      .select('id')
      .eq('subject', subject)
      .eq('status', 'active')
      .maybeSingle();

    if (!findError && existing) {
      console.log('Found existing conversation:', existing.id);
      return existing.id;
    }

    // Create new conversation if none found
    const { data: newConversation, error: createError } = await supabase
      .from('email_conversations')
      .insert({
        subject: subject,
        status: 'active'
      })
      .select()
      .single();

    if (createError) throw createError;
    
    console.log('Created new conversation:', newConversation.id);
    return newConversation.id;
  } catch (error) {
    console.error('Error in findOrCreateConversation:', error);
    throw error;
  }
};

// Process attachments into the correct format
const processAttachments = (attachments = []) => {
  return attachments.map(att => ({
    contentType: att.content_type,
    filename: att.file_name,
    size: att.size,
    url: att.url
  }));
};

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

    // Find or create conversation
    const conversationId = await findOrCreateConversation(headers.subject);

    // Ensure to_email is always an array
    const toEmails = Array.isArray(envelope.to) ? envelope.to : [envelope.to];

    // Process attachments if present
    const attachments = processAttachments(req.body.attachments);

    // Insert the email message
    const { data: message, error: messageError } = await supabase
      .from('email_messages')
      .insert({
        conversation_id: conversationId,
        direction: 'inbound',
        from_email: envelope.from,
        to_email: toEmails,
        subject: headers.subject,
        body: plain || (html && html.replace(/<[^>]*>/g, '')),
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
      conversationId: conversationId,
      subject: headers.subject,
      attachmentCount: attachments.length
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
