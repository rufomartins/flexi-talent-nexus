
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

// Normalize email subject for better conversation threading
const normalizeSubject = (subject) => {
  if (!subject) return 'No Subject';
  
  // Convert to lowercase and trim
  let normalized = subject.toLowerCase().trim();
  
  // Remove common prefixes
  const prefixes = ['re:', 're :', 'fwd:', 'fwd :', 'fw:', 'fw :'];
  for (const prefix of prefixes) {
    if (normalized.startsWith(prefix)) {
      normalized = normalized.substring(prefix.length).trim();
    }
  }
  
  // Remove multiple spaces
  normalized = normalized.replace(/\s+/g, ' ');
  
  return normalized;
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

// Find or create a conversation based on headers and subject
const findOrCreateConversation = async (headers, subject, originalSubject) => {
  console.log('Finding conversation for:', {
    messageId: headers['message-id'],
    inReplyTo: headers['in-reply-to'],
    references: headers.references,
    normalizedSubject: subject,
    originalSubject
  });

  try {
    // First try to find by In-Reply-To header
    if (headers['in-reply-to']) {
      const { data: byHeader, error: headerError } = await supabase
        .from('email_messages')
        .select('conversation_id')
        .eq('headers->message-id', headers['in-reply-to'])
        .single();

      if (!headerError && byHeader) {
        console.log('Found conversation by In-Reply-To header:', byHeader.conversation_id);
        return byHeader.conversation_id;
      }
    }

    // Then try by normalized subject
    const { data: existing, error: subjectError } = await supabase
      .from('email_conversations')
      .select('id')
      .eq('subject', originalSubject)
      .eq('status', 'active')
      .maybeSingle();

    if (!subjectError && existing) {
      console.log('Found conversation by subject:', existing.id);
      return existing.id;
    }

    // Create new conversation if none found
    const { data: newConversation, error: createError } = await supabase
      .from('email_conversations')
      .insert({
        subject: originalSubject,
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
      hasPlain: !!plain,
      messageId: headers['message-id'],
      inReplyTo: headers['in-reply-to']
    });

    // Normalize subject and find/create conversation
    const normalizedSubject = normalizeSubject(headers.subject);
    const conversationId = await findOrCreateConversation(
      headers,
      normalizedSubject,
      headers.subject
    );

    // Ensure to_email is always an array
    const toEmails = Array.isArray(envelope.to) ? envelope.to : [envelope.to];

    // Process attachments if present
    const attachments = processAttachments(req.body.attachments);

    // Create the message
    const { data: message, error: messageError } = await supabase
      .from('email_messages')
      .insert({
        conversation_id: conversationId,
        direction: 'inbound',
        from_email: envelope.from,
        to_email: toEmails,
        subject: headers.subject,
        body: plain || html?.replace(/<[^>]*>/g, ''), // Strip HTML if no plain text
        html_body: html,
        headers: headers,
        attachments: attachments,
        status: 'unread',
        metadata: {
          received_at: new Date().toISOString(),
          source: 'cloudmailin',
          has_html: !!html,
          has_attachments: attachments.length > 0,
          message_id: headers['message-id'],
          in_reply_to: headers['in-reply-to'],
          references: headers.references
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
      originalSubject: headers.subject,
      normalizedSubject: normalizedSubject,
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
