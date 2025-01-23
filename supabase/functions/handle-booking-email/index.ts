import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailData {
  template_id: string;
  recipient: {
    email: string;
    name: string;
  };
  subject?: string;
  body?: string;
  metadata?: Record<string, any>;
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

    const { emailData } = await req.json() as { emailData: EmailData }

    // Get email template
    const { data: template, error: templateError } = await supabaseClient
      .from('email_templates')
      .select('*')
      .eq('id', emailData.template_id)
      .single()

    if (templateError) throw templateError

    // Replace variables in template
    let emailBody = emailData.body || template.body
    let emailSubject = emailData.subject || template.subject

    // Replace basic variables
    emailBody = emailBody.replace('{{name}}', emailData.recipient.name)
    emailSubject = emailSubject.replace('{{name}}', emailData.recipient.name)

    // Log email attempt
    const { data: logData, error: logError } = await supabaseClient
      .from('email_logs')
      .insert({
        template_id: emailData.template_id,
        recipient: emailData.recipient.email,
        subject: emailSubject,
        body: emailBody,
        status: 'pending',
        metadata: emailData.metadata
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
        subject: emailSubject,
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