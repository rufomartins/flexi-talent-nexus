
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-webhook-signature',
};

interface ForwardEmailPayload {
  headers: Record<string, string>;
  to: string[];
  from: string;
  subject: string;
  text: string;
  html?: string;
  attachments: Array<{
    contentType: string;
    content: string;
    filename: string;
    size: number;
  }>;
}

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function getForwardEmailSettings() {
  const { data, error } = await supabaseClient
    .from('api_settings')
    .select('value')
    .eq('name', 'forward_email_settings')
    .single();

  if (error) throw error;
  return data.value;
}

function verifyWebhookSignature(payload: string, signature: string, key: string): boolean {
  const hmac = createHmac("sha256", key);
  hmac.update(payload);
  const computedSignature = hmac.toString();
  return signature === computedSignature;
}

async function findOrCreateConversation(subject: string): Promise<string> {
  // Try to find an existing conversation with this subject
  const { data: existing, error: searchError } = await supabaseClient
    .from('email_conversations')
    .select('id')
    .eq('subject', subject)
    .eq('status', 'active')
    .single();

  if (searchError && searchError.code !== 'PGRST116') { // PGRST116 is "no rows returned"
    throw searchError;
  }

  if (existing?.id) {
    return existing.id;
  }

  // Create new conversation if none exists
  const { data: newConversation, error: insertError } = await supabaseClient
    .from('email_conversations')
    .insert([{
      subject,
      status: 'active'
    }])
    .select('id')
    .single();

  if (insertError) throw insertError;
  if (!newConversation) throw new Error('Failed to create conversation');

  return newConversation.id;
}

async function handleInboundEmail(req: Request): Promise<Response> {
  console.log('Received inbound email request');

  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Forward Email settings
    const settings = await getForwardEmailSettings();
    console.log('Retrieved Forward Email settings');
    
    if (!settings.enabled) {
      console.error('Forward Email integration is disabled');
      return new Response(
        JSON.stringify({ error: 'Forward Email integration is disabled' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Get the raw request body for signature verification
    const rawBody = await req.text();
    const signature = req.headers.get('x-webhook-signature');

    if (!signature) {
      console.error('No webhook signature provided');
      return new Response(
        JSON.stringify({ error: 'No webhook signature provided' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Verify webhook signature
    const isValid = verifyWebhookSignature(
      rawBody,
      signature,
      settings.webhook_signature_key
    );

    if (!isValid) {
      console.error('Invalid webhook signature');
      return new Response(
        JSON.stringify({ error: 'Invalid webhook signature' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Parse the email payload
    const email: ForwardEmailPayload = JSON.parse(rawBody);
    console.log('Processing email:', { subject: email.subject, from: email.from });

    // Find or create conversation
    const conversationId = await findOrCreateConversation(email.subject);
    console.log('Found/created conversation:', conversationId);

    // Insert into email_messages
    const { data: message, error: messageError } = await supabaseClient
      .from('email_messages')
      .insert([
        {
          conversation_id: conversationId,
          direction: 'inbound',
          from_email: email.from,
          to_email: email.to,
          subject: email.subject,
          body: email.text,
          html_body: email.html,
          headers: email.headers,
          attachments: email.attachments,
          status: 'unread',
          metadata: {
            has_html: !!email.html,
            has_attachments: email.attachments?.length > 0,
          }
        }
      ])
      .select()
      .single();

    if (messageError) {
      console.error('Error saving email message:', messageError);
      throw messageError;
    }

    // For backward compatibility, also save to onboarding_inbox
    const { error: legacyError } = await supabaseClient
      .from('onboarding_inbox')
      .insert([
        {
          sender: email.from,
          recipient: email.to[0],
          subject: email.subject,
          body: email.html || email.text,
          attachments: email.attachments,
          headers: email.headers,
          metadata: {
            has_html: !!email.html,
            has_text: !!email.text,
            attachment_count: email.attachments?.length || 0,
          }
        }
      ]);

    if (legacyError) {
      console.warn('Error saving to legacy inbox:', legacyError);
      // Don't throw error for legacy storage
    }

    console.log('Email processed successfully:', message.id);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email processed successfully', 
        id: message.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error processing email:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process email',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
}

serve(handleInboundEmail);
