import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface EmailRequest {
  templateId: string;
  recipients: {
    id: string;
    email: string;
    name: string;
  }[];
  customVariables?: Record<string, string>;
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

    const { emailData } = await req.json() as { emailData: EmailRequest }
    
    // Get email template
    const { data: template, error: templateError } = await supabaseClient
      .from('onboarding_email_templates')
      .select('*')
      .eq('id', emailData.templateId)
      .single()

    if (templateError) throw templateError

    // Process each recipient
    const emailPromises = emailData.recipients.map(async (recipient) => {
      // Replace variables in template
      let emailBody = template.body
      let emailSubject = template.subject
      
      // Replace standard variables
      const standardReplacements = {
        '{name}': recipient.name,
        '{email}': recipient.email,
        ...emailData.customVariables
      }

      Object.entries(standardReplacements).forEach(([key, value]) => {
        emailBody = emailBody.replace(new RegExp(key, 'g'), value || '')
        emailSubject = emailSubject.replace(new RegExp(key, 'g'), value || '')
      })

      // Send email using Resend
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`
        },
        body: JSON.stringify({
          from: 'Onboarding <onboarding@yourdomain.com>',
          to: [recipient.email],
          subject: emailSubject,
          html: emailBody
        })
      })

      if (!res.ok) {
        const error = await res.text()
        throw new Error(error)
      }

      // Log email
      await supabaseClient
        .from('email_logs')
        .insert({
          template_id: template.id,
          recipient: recipient.email,
          subject: emailSubject,
          body: emailBody,
          status: 'sent',
          metadata: {
            candidate_id: recipient.id,
            template_type: template.type
          }
        })

      return res.json()
    })

    // Wait for all emails to be sent
    await Promise.all(emailPromises)

    return new Response(
      JSON.stringify({ success: true }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error sending onboarding email:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})