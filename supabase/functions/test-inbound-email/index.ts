
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
};

// Sample test email data matching CloudMailin format
const testEmailPayload = {
  headers: {
    "content-type": "text/html",
    "date": new Date().toISOString(),
    "from": "test@example.com",
    "to": "test@onboarding.gtmd.studio"
  },
  envelope: {
    to: "test@onboarding.gtmd.studio",
    from: "test@example.com"
  },
  subject: "Test Email from CloudMailin",
  plain: "This is a test email body",
  html: "<p>This is a test email body in HTML format</p>",
  attachments: [{
    content_type: "text/plain",
    file_name: "test.txt",
    size: 11,
    url: "https://example.com/test.txt"
  }]
};

async function getEmailSettings() {
  const supabaseClient = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
  );

  const { data, error } = await supabaseClient
    .from('api_settings')
    .select('value')
    .eq('name', 'cloudmailin_settings')
    .single();

  if (error) throw error;
  return data?.value || { enabled: true };
}

async function handleTestEmail(req: Request): Promise<Response> {
  console.log('Processing test email request');
  console.log('Request method:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const settings = await getEmailSettings();
    console.log('Retrieved email settings');
    
    if (!settings.enabled) {
      throw new Error('Email integration is disabled');
    }

    // Convert payload to string
    const payloadString = JSON.stringify(testEmailPayload);

    console.log('Created test payload:', {
      payloadLength: payloadString.length
    });

    console.log('Sending test email to handler');

    // Forward the test email to our handler
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/handle-inbound-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: payloadString
      }
    );

    const result = await response.json();
    console.log('Handler response:', result);

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
