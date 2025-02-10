
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

async function handleInboundEmail(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Get Forward Email settings
    const settings = await getForwardEmailSettings();
    
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
    console.log('Received email:', { subject: email.subject, from: email.from });

    // Insert into onboarding_inbox
    const { data, error } = await supabaseClient
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
      ])
      .select()
      .single();

    if (error) {
      console.error('Error saving email:', error);
      throw error;
    }

    console.log('Email saved successfully:', data.id);
    
    return new Response(
      JSON.stringify({ success: true, message: 'Email processed successfully', id: data.id }),
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
