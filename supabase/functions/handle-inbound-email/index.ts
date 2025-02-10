
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',  // Make CORS more permissive for debugging
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

function findSignatureHeader(headers: Headers): string | null {
  // Check both capitalized and lowercase versions
  const possibleNames = ['X-Webhook-Signature', 'x-webhook-signature'];
  for (const name of possibleNames) {
    const value = headers.get(name);
    if (value) {
      console.log(`Found signature in header: ${name}`);
      return value;
    }
  }
  return null;
}

function verifyWebhookSignature(payload: string, signature: string, key: string): boolean {
  try {
    console.log('Verifying signature with key length:', key.length);
    
    const hmac = createHmac("sha256", key);
    hmac.update(payload);
    const computedSignature = hmac.toString('hex');

    console.log('Computed signature:', computedSignature);
    console.log('Received signature:', signature);

    const sigBuffer = new TextEncoder().encode(signature);
    const computedBuffer = new TextEncoder().encode(computedSignature);

    if (sigBuffer.length !== computedBuffer.length) {
      console.error('Signature length mismatch:', {
        received: sigBuffer.length,
        computed: computedBuffer.length
      });
      return false;
    }

    return crypto.subtle.timingSafeEqual(sigBuffer, computedBuffer);
  } catch (error) {
    console.error('Error verifying signature:', error);
    return false;
  }
}

async function findOrCreateConversation(subject: string): Promise<string> {
  const { data: existing, error: searchError } = await supabaseClient
    .from('email_conversations')
    .select('id')
    .eq('subject', subject)
    .eq('status', 'active')
    .single();

  if (searchError && searchError.code !== 'PGRST116') {
    throw searchError;
  }

  if (existing?.id) {
    return existing.id;
  }

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
  console.log('Request method:', req.method);
  
  // Log all headers for debugging
  console.log('Request headers:');
  for (const [key, value] of req.headers.entries()) {
    console.log(`${key}: ${value}`);
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
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

    const rawBody = await req.text();
    console.log('Request body (first 200 chars):', rawBody.substring(0, 200));
    
    const signature = findSignatureHeader(req.headers);

    if (!signature) {
      console.error('No webhook signature found in headers');
      return new Response(
        JSON.stringify({ 
          error: 'No webhook signature provided',
          availableHeaders: Array.from(req.headers.keys())
        }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    console.log('Verifying signature...', {
      signatureLength: signature.length,
      payloadLength: rawBody.length,
      webhookKeyLength: settings.webhook_signature_key.length
    });

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

    console.log('Signature verified successfully');

    const email: ForwardEmailPayload = JSON.parse(rawBody);
    console.log('Processing email:', { 
      subject: email.subject, 
      from: email.from,
      to: email.to,
      hasHtml: !!email.html,
      textLength: email.text?.length,
      attachmentsCount: email.attachments?.length
    });

    const conversationId = await findOrCreateConversation(email.subject);
    console.log('Found/created conversation:', conversationId);

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
