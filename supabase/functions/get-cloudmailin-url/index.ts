
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const username = Deno.env.get('CLOUDMAILIN_USERNAME');
    const password = Deno.env.get('CLOUDMAILIN_PASSWORD');

    if (!username || !password) {
      throw new Error('CloudMailin credentials not found');
    }

    // Create the encoded auth credentials
    const credentials = btoa(`${username}:${password}`);
    
    // Generate the URL with basic auth
    const webhookUrl = `${Deno.env.get('SUPABASE_URL')}/functions/v1/email-webhook-proxy`;
    const urlWithAuth = webhookUrl.replace('https://', `https://${credentials}@`);

    return new Response(
      JSON.stringify({ 
        success: true,
        url: urlWithAuth
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error generating CloudMailin URL:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false,
        error: 'Failed to generate CloudMailin URL',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
