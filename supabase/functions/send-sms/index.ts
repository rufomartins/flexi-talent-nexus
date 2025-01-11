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
  notificationType: string;
  recipientId: string;
  metadata?: Record<string, unknown>;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
    const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
    const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER')

    if (!accountSid || !authToken || !fromNumber) {
      throw new Error('Missing Twilio credentials')
    }

    const client = new Twilio(accountSid, authToken)
    const { to, message: smsMessage, notificationType, recipientId, metadata } = await req.json() as SMSPayload

    // Create notification log entry
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const logEntry = {
      notification_type: notificationType,
      recipient_id: recipientId,
      phone_number: to,
      message: smsMessage,
      status: 'pending',
      metadata
    }

    const { error: logError } = await supabaseClient
      .from('notification_logs')
      .insert(logEntry)

    if (logError) {
      console.error('Error creating notification log:', logError)
      throw logError
    }

    // Send SMS via Twilio
    const twilioMessage = await client.messages.create({
      body: smsMessage,
      to,
      from: fromNumber,
    })

    // Update notification log with success
    const { error: updateError } = await supabaseClient
      .from('notification_logs')
      .update({
        status: 'sent',
        sent_at: new Date().toISOString()
      })
      .eq('recipient_id', recipientId)
      .eq('notification_type', notificationType)
      .eq('status', 'pending')

    if (updateError) {
      console.error('Error updating notification log:', updateError)
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