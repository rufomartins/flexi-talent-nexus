
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

// Enhanced logging middleware with request timing
app.use((req, res, next) => {
  const requestStart = Date.now();
  const requestId = Math.random().toString(36).substring(7);

  console.log(`[${requestId}] New request:`, {
    timestamp: new Date().toISOString(),
    method: req.method,
    path: req.path,
    headers: req.headers,
    body: req.body
  });

  // Add response logging
  const oldSend = res.send;
  res.send = function(data) {
    console.log(`[${requestId}] Response:`, {
      timestamp: new Date().toISOString(),
      statusCode: res.statusCode,
      duration: `${Date.now() - requestStart}ms`,
      body: data
    });
    return oldSend.apply(res, arguments);
  };

  next();
});

// Enhanced conversation finding with detailed logging
const findOrCreateConversation = async (subject) => {
  const logPrefix = `[Conversation][${subject}]`;
  console.log(`${logPrefix} Looking for existing conversation...`);

  try {
    // First try to find an existing conversation
    const { data: existing, error: findError } = await supabase
      .from('email_conversations')
      .select('id')
      .eq('subject', subject)
      .eq('status', 'active')
      .maybeSingle();

    if (findError) {
      console.error(`${logPrefix} Error finding conversation:`, findError);
      throw findError;
    }

    if (existing) {
      console.log(`${logPrefix} Found existing conversation:`, {
        id: existing.id,
        timestamp: new Date().toISOString()
      });
      return existing.id;
    }

    console.log(`${logPrefix} No existing conversation found, creating new...`);

    // Create new conversation
    const { data: newConversation, error: createError } = await supabase
      .from('email_conversations')
      .insert({
        subject: subject,
        status: 'active'
      })
      .select()
      .single();

    if (createError) {
      console.error(`${logPrefix} Error creating conversation:`, createError);
      throw createError;
    }
    
    console.log(`${logPrefix} Created new conversation:`, {
      id: newConversation.id,
      timestamp: new Date().toISOString()
    });
    return newConversation.id;
  } catch (error) {
    console.error(`${logPrefix} Unexpected error:`, error);
    throw error;
  }
};

// Enhanced attachment processing with validation
const processAttachments = (attachments = []) => {
  console.log('[Attachments] Processing attachments:', {
    count: attachments.length,
    timestamp: new Date().toISOString()
  });

  return attachments.map((att, index) => {
    const processed = {
      contentType: att.content_type,
      filename: att.file_name,
      size: att.size,
      url: att.url
    };

    console.log(`[Attachments] Processed attachment ${index + 1}:`, processed);
    return processed;
  });
};

// Webhook endpoint for email processing
app.post('/webhook', async (req, res) => {
  const processingStart = Date.now();
  const emailId = Math.random().toString(36).substring(7);
  const logPrefix = `[Email][${emailId}]`;

  try {
    console.log(`${logPrefix} Processing new email:`, {
      timestamp: new Date().toISOString(),
      payload: JSON.stringify(req.body, null, 2)
    });
    
    // Payload validation with detailed logging
    if (!req.body || !req.body.envelope || !req.body.headers) {
      const validationError = 'Invalid webhook payload - missing required fields';
      console.error(`${logPrefix} ${validationError}`, {
        hasBody: !!req.body,
        hasEnvelope: !!(req.body && req.body.envelope),
        hasHeaders: !!(req.body && req.body.headers)
      });
      return res.status(400).json({ error: validationError });
    }

    const envelope = req.body.envelope;
    const headers = req.body.headers;
    const plain = req.body.plain;
    const html = req.body.html;
    
    console.log(`${logPrefix} Email details:`, {
      from: envelope.from,
      to: envelope.to,
      subject: headers.subject,
      hasHtml: !!html,
      hasPlain: !!plain,
      timestamp: new Date().toISOString()
    });

    // Find or create conversation
    const conversationId = await findOrCreateConversation(headers.subject);

    // Process email for insertion
    const toEmails = Array.isArray(envelope.to) ? envelope.to : [envelope.to];
    const attachments = processAttachments(req.body.attachments);

    console.log(`${logPrefix} Inserting message into database:`, {
      conversationId,
      attachmentCount: attachments.length,
      timestamp: new Date().toISOString()
    });

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
          has_attachments: attachments.length > 0,
          processing_time: Date.now() - processingStart
        }
      })
      .select()
      .single();

    if (messageError) {
      console.error(`${logPrefix} Error creating message:`, messageError);
      throw messageError;
    }

    console.log(`${logPrefix} Successfully processed email:`, {
      messageId: message.id,
      conversationId: conversationId,
      subject: headers.subject,
      attachmentCount: attachments.length,
      processingTime: `${Date.now() - processingStart}ms`,
      timestamp: new Date().toISOString()
    });

    res.status(200).json({ 
      status: 'ok', 
      conversation: conversationId,
      message: message.id,
      processing_time: Date.now() - processingStart
    });

  } catch (error) {
    console.error(`${logPrefix} Error processing email:`, {
      error: error.message,
      stack: error.stack,
      processingTime: `${Date.now() - processingStart}ms`,
      timestamp: new Date().toISOString()
    });
    
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message,
      processing_time: Date.now() - processingStart
    });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

const port = process.env.PORT || 3100;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
