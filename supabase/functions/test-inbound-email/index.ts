import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Sample test email data
const testEmails = {
  basic: {
    headers: {
      "content-type": "text/plain",
      "date": new Date().toISOString(),
      "from": "test@example.com",
      "to": "inbox@yourdomain.com"
    },
    envelope: {
      to: "inbox@yourdomain.com",
      from: "test@example.com",
      helo_domain: "mail.example.com",
      remote_ip: "192.168.1.1",
      recipients: ["inbox@yourdomain.com"]
    },
    plain: "This is a test email body",
    html: "<p>This is a test email body</p>",
    reply_plain: "",
    attachments: [],
    subject: "Test Email"
  },
  withAttachment: {
    headers: {
      "content-type": "multipart/mixed",
      "date": new Date().toISOString(),
      "from": "test@example.com",
      "to": "inbox@yourdomain.com"
    },
    envelope: {
      to: "inbox@yourdomain.com",
      from: "test@example.com",
      helo_domain: "mail.example.com",
      remote_ip: "192.168.1.1",
      recipients: ["inbox@yourdomain.com"]
    },
    plain: "This is a test email with attachment",
    html: "<p>This is a test email with attachment</p>",
    reply_plain: "",
    attachments: [{
      content: "SGVsbG8gV29ybGQ=", // Base64 encoded "Hello World"
      file_name: "test.txt",
      content_type: "text/plain",
      size: 11,
      disposition: "attachment"
    }],
    subject: "Test Email with Attachment"
  }
};

async function handleTestEmail(req: Request): Promise<Response> {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type = 'basic' } = await req.json();
    const testEmail = testEmails[type] || testEmails.basic;

    // Forward the test email to the actual handler
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/handle-inbound-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`
        },
        body: JSON.stringify(testEmail)
      }
    );

    const result = await response.json();

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Test email sent successfully',
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