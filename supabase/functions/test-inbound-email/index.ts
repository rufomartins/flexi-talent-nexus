
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
  subject: "Test Email - CloudMailin Webhook Verification",
  plain: "This is a test email to verify CloudMailin webhook integration is working correctly.",
  html: "<p>This is a test email to verify CloudMailin webhook integration is working correctly.</p>",
  attachments: []
};

async function handleTestEmail(req: Request): Promise<Response> {
  console.log('Processing test email request');
  console.log('Request method:', req.method);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Convert payload to string
    const payloadString = JSON.stringify(testEmailPayload);

    console.log('Created test payload:', {
      payloadLength: payloadString.length,
      subject: testEmailPayload.subject
    });

    // Create Basic Auth credentials
    const username = Deno.env.get('CLOUDMAILIN_USERNAME');
    const password = Deno.env.get('CLOUDMAILIN_PASSWORD');
    
    if (!username || !password) {
      throw new Error('CloudMailin credentials not found in environment variables');
    }
    
    const credentials = btoa(`${username}:${password}`);

    console.log('Sending test email to webhook proxy');

    // Forward the test email to our email-webhook-proxy
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/email-webhook-proxy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Basic ${credentials}`,
        },
        body: payloadString
      }
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error response:', response.status, errorText);
      throw new Error(`Failed to process test email: ${response.status} ${errorText}`);
    }

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
