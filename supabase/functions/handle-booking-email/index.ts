import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface BookingEmailData {
  template_id: string;
  recipient: {
    email: string;
    name: string;
  };
  booking: {
    projectName: string;
    startDate: string;
    endDate: string;
    details: string;
    fee?: number;
  };
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

    const { emailData } = await req.json() as { emailData: BookingEmailData }

    // Get email template
    const { data: template, error: templateError } = await supabaseClient
      .from('email_templates')
      .select('*')
      .eq('id', emailData.template_id)
      .single()

    if (templateError) throw templateError

    // Replace variables in template
    let emailBody = template.body
    emailBody = emailBody.replace('{{name}}', emailData.recipient.name)
    emailBody = emailBody.replace('{{projectName}}', emailData.booking.projectName)
    emailBody = emailBody.replace('{{startDate}}', emailData.booking.startDate)
    emailBody = emailBody.replace('{{endDate}}', emailData.booking.endDate)
    emailBody = emailBody.replace('{{details}}', emailData.booking.details)
    if (emailData.booking.fee) {
      emailBody = emailBody.replace('{{fee}}', emailData.booking.fee.toString())
    }

    // Log email attempt
    const { data: logData, error: logError } = await supabaseClient
      .from('email_logs')
      .insert({
        template_id: emailData.template_id,
        recipient: emailData.recipient.email,
        subject: template.subject,
        body: emailBody,
        status: 'pending',
        metadata: emailData.booking
      })
      .select()
      .single()

    if (logError) throw logError

    // Send email using Resend
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`
      },
      body: JSON.stringify({
        from: 'Booking Confirmation <no-reply@yourdomain.com>',
        to: [emailData.recipient.email],
        subject: template.subject,
        html: emailBody
      })
    })

    if (!res.ok) {
      const error = await res.text()
      throw new Error(error)
    }

    // Update email log status
    await supabaseClient
      .from('email_logs')
      .update({ status: 'sent', sent_at: new Date().toISOString() })
      .eq('id', logData.id)

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error sending booking email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})