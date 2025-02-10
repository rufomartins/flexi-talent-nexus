
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHmac } from "https://deno.land/std@0.190.0/crypto/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sample test email data
const testEmailPayload = {
  headers: {
    "content-type": "text/html",
    "date": new Date().toISOString(),
    "from": "test@example.com",
    "to": "test@onboarding.gtmd.studio"
  },
  to: ["test@onboarding.gtmd.studio"],
  from: "test@example.com",
  subject: "Test Email from Forward Email",
  text: "This is a test email body",
  html: "<p>This is a test email body in HTML format</p>",
  attachments: [{
    contentType: "text/plain",
    content: "SGVsbG8gV29ybGQ=", // Base64 encoded "Hello World"
    filename: "test.txt",
    size: 11
  }]
};

async function getForwardEmailSettings() {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { data, error } = await supabaseClient
    .from('api_settings')
    .select('value')
    .eq('name', 'forward_email_settings')
    .single();

  if (error) throw error;
  return data.value;
}

async function handleTestEmail(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const settings = await getForwardEmailSettings();
    
    if (!settings.enabled) {
      throw new Error('Forward Email integration is disabled');
    }

    // Convert payload to string and create signature
    const payloadString = JSON.stringify(testEmailPayload);
    const hmac = createHmac("sha256", settings.webhook_signature_key);
    hmac.update(payloadString);
    const signature = hmac.toString();

    // Forward the test email to our handler
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/handle-inbound-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
          'x-webhook-signature': signature
        },
        body: payloadString
      }
    );

    const result = await response.json();

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test email processed successfully',
        result 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error sending test email:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to send test email',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
}

serve(handleTestEmail);
