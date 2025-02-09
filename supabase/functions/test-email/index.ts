
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Resend } from "npm:resend@2.0.0"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    // Get Resend settings
    const { data: settings, error: settingsError } = await supabaseClient
      .from('api_settings')
      .select('value')
      .eq('name', 'resend_settings')
      .single()

    if (settingsError) throw new Error('Failed to fetch Resend settings')
    if (!settings?.value?.enabled) throw new Error('Resend integration is not enabled')
    if (!settings?.value?.api_key) throw new Error('Resend API key is not configured')

    const resend = new Resend(settings.value.api_key)

    // Send test email
    const emailResponse = await resend.emails.send({
      from: 'Test <onboarding@resend.dev>',
      to: 'delivered@resend.dev',
      subject: 'Test Email',
      html: '<p>This is a test email to verify your Resend configuration.</p>',
    })

    return new Response(
      JSON.stringify(emailResponse),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error sending test email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
