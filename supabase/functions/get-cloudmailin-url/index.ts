
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req: Request) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const username = Deno.env.get('CLOUDMAILIN_USERNAME');
    const password = Deno.env.get('CLOUDMAILIN_PASSWORD');
    
    if (!username || !password) {
      throw new Error('CloudMailin credentials not found in environment variables');
    }

    // URL encode the credentials to handle special characters
    const encodedUsername = encodeURIComponent(username);
    const encodedPassword = encodeURIComponent(password);
    
    const baseUrl = Deno.env.get('SUPABASE_URL');
    const webhookUrl = `${baseUrl}/functions/v1/email-webhook-proxy`;
    
    // Construct the URL with embedded credentials
    const secureUrl = webhookUrl.replace('https://', `https://${encodedUsername}:${encodedPassword}@`);

    return new Response(
      JSON.stringify({ 
        url: secureUrl,
        note: "Use this URL in your CloudMailin dashboard as the target URL"
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error generating URL:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
