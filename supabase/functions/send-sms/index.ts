import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"
import { Twilio } from 'https://esm.sh/twilio@4.19.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface SMSPayload {
  to: string;
  message: string;
  module: 'onboarding' | 'casting' | 'booking';
  metadata?: Record<string, unknown>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload = await req.json() as SMSPayload
    const { to, message: smsMessage, module, metadata } = payload

    // Fetch module-specific Twilio credentials
    const { data: settings, error: settingsError } = await supabaseClient
      .from('api_settings')
      .select('value')
      .eq('name', `${module}_twilio_credentials`)
      .single()

    if (settingsError) {
      throw new Error(`Failed to fetch ${module} Twilio credentials`)
    }

    const credentials = settings.value as {
      accountSid: string;
      authToken: string;
      phoneNumber: string;
    }

    const client = new Twilio(credentials.accountSid, credentials.authToken)

    // Create notification log entry
    const logEntry = {
      phone_number: to,
      message: smsMessage,
      status: 'pending',
      module,
      metadata
    }

    const { error: logError } = await supabaseClient
      .from('sms_logs')
      .insert(logEntry)

    if (logError) {
      console.error('Error creating SMS log:', logError)
      throw logError
    }

    // Send SMS via Twilio
    const twilioMessage = await client.messages.create({
      body: smsMessage,
      to,
      from: credentials.phoneNumber,
    })

    // Update log with success status
    const { error: updateError } = await supabaseClient
      .from('sms_logs')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('phone_number', to)
      .eq('status', 'pending')
      .eq('module', module)

    if (updateError) {
      console.error('Error updating SMS log:', updateError)
    }

    return new Response(
      JSON.stringify({ success: true, messageId: twilioMessage.sid }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error sending SMS:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})