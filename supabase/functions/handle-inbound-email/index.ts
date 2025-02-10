
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CloudMailinEmail {
  headers: Record<string, string>;
  envelope: {
    to: string;
    from: string;
    helo_domain: string;
    remote_ip: string;
    recipients: string[];
  };
  plain: string;
  html: string;
  reply_plain: string;
  attachments: Array<{
    content: string;
    file_name: string;
    content_type: string;
    size: number;
    disposition: string;
  }>;
  subject: string;
}

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function handleInboundEmail(req: Request): Promise<Response> {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Check authentication from either headers or query parameters
    const url = new URL(req.url);
    const apiKey = req.headers.get('apikey') || url.searchParams.get('apikey');
    
    if (!apiKey) {
      console.error('No API key provided');
      return new Response(
        JSON.stringify({ error: 'Authentication required' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Validate the API key matches our anon key
    const SUPABASE_ANON_KEY = Deno.env.get('SUPABASE_ANON_KEY');
    if (apiKey !== SUPABASE_ANON_KEY) {
      console.error('Invalid API key');
      return new Response(
        JSON.stringify({ error: 'Invalid authentication' }),
        { 
          status: 401,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const email: CloudMailinEmail = await req.json();
    console.log('Received email:', { subject: email.subject, from: email.envelope.from });

    // Insert into onboarding_inbox
    const { data, error } = await supabaseClient
      .from('onboarding_inbox')
      .insert([
        {
          sender: email.envelope.from,
          recipient: email.envelope.to,
          subject: email.subject,
          body: email.html || email.plain,
          attachments: email.attachments,
          headers: email.headers,
          metadata: {
            envelope: email.envelope,
            has_html: !!email.html,
            has_plain: !!email.plain,
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
