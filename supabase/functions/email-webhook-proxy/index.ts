
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function verifyBasicAuth(authHeader: string | null): boolean {
  if (!authHeader?.startsWith('Basic ')) {
    return false;
  }

  const base64Credentials = authHeader.split(' ')[1];
  const credentials = atob(base64Credentials);
  const [username, password] = credentials.split(':');

  const expectedUsername = Deno.env.get('CLOUDMAILIN_USERNAME');
  const expectedPassword = Deno.env.get('CLOUDMAILIN_PASSWORD');

  return username === expectedUsername && password === expectedPassword;
}

serve(async (req: Request) => {
  console.log('Received webhook request');
  console.log('Request method:', req.method);

  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Verify CloudMailin's Basic Auth
    const authHeader = req.headers.get('authorization');
    if (!verifyBasicAuth(authHeader)) {
      console.error('Authentication failed');
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { 
          status: 401,
          headers: { 
            ...corsHeaders,
            'Content-Type': 'application/json',
            'WWW-Authenticate': 'Basic realm="CloudMailin"'
          }
        }
      );
    }

    // Get the raw body
    const rawBody = await req.text();
    console.log('Forwarding payload to Supabase function');

    // Forward to Supabase function with Bearer token
    const response = await fetch(
      `${Deno.env.get('SUPABASE_URL')}/functions/v1/handle-inbound-email`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('SUPABASE_ANON_KEY')}`,
        },
        body: rawBody
      }
    );

    const result = await response.json();
    console.log('Supabase function response:', result);

    // Forward the response back to CloudMailin
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: response.status
      }
    );

  } catch (error) {
    console.error('Error in proxy:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Proxy error',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
});
