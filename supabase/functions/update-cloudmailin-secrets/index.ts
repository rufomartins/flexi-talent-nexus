
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const updateCloudMailinSecrets = async () => {
  const supabaseAdmin = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    }
  );

  try {
    // Update CloudMailin secrets with the correct password
    await supabaseAdmin.functions.setSecret('CLOUDMAILIN_USERNAME', 'inbound');
    await supabaseAdmin.functions.setSecret('CLOUDMAILIN_PASSWORD', 'Navigator145');

    return { success: true, message: 'CloudMailin secrets updated successfully' };
  } catch (error) {
    console.error('Error updating CloudMailin secrets:', error);
    throw error;
  }
};

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const result = await updateCloudMailinSecrets();
    
    return new Response(
      JSON.stringify(result),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );
  } catch (error) {
    console.error('Error in handler:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to update CloudMailin secrets',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});
