import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { Twilio } from 'https://esm.sh/twilio@4.19.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface CommunicationPayload {
  type: 'email' | 'sms';
  to: string;
  subject?: string;
  message: string;
  candidateId: string;
  metadata?: Record<string, unknown>;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, to, subject, message, candidateId, metadata } = await req.json() as CommunicationPayload

    if (type === 'email') {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`
        },
        body: JSON.stringify({
          from: 'Talent Management <no-reply@yourdomain.com>',
          to: [to],
          subject,
          html: message
        })
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(error)
      }
    } else if (type === 'sms') {
      const accountSid = Deno.env.get('TWILIO_ACCOUNT_SID')
      const authToken = Deno.env.get('TWILIO_AUTH_TOKEN')
      const fromNumber = Deno.env.get('TWILIO_PHONE_NUMBER')

      if (!accountSid || !authToken || !fromNumber) {
        throw new Error('Missing Twilio credentials')
      }

      const client = new Twilio(accountSid, authToken)
      await client.messages.create({
        body: message,
        to,
        from: fromNumber,
      })
    }

    // Log the communication
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { error: logError } = await supabaseClient
      .from('notification_logs')
      .insert({
        notification_type: type === 'email' ? 'EMAIL' : 'SMS',
        recipient_id: candidateId,
        phone_number: type === 'sms' ? to : null,
        message,
        status: 'sent',
        sent_at: new Date().toISOString(),
        metadata
      })

    if (logError) {
      console.error('Error logging communication:', logError)
    }

    return new Response(
      JSON.stringify({ success: true }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (error) {
    console.error('Error sending communication:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})