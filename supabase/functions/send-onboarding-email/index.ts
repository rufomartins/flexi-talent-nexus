
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

    const requestData = await req.json()
    console.log('Received request data:', requestData)

    // Extract email data from the request body directly
    const {
      templateId,
      recipient
    } = requestData

    console.log('Extracted templateId:', templateId)
    console.log('Extracted recipient:', recipient)

    if (!templateId) {
      throw new Error('Template ID is required')
    }

    if (!recipient?.email || !recipient?.name) {
      throw new Error('Recipient email and name are required')
    }
    
    // Format the email data to match our expected structure
    const emailData: EmailRequest = {
      templateId,
      recipients: [{
        id: recipient.id || 'temp-id',
        email: recipient.email,
        name: recipient.name
      }],
      customVariables: requestData.customVariables
    }
    
    // Get email template
    const { data: template, error: templateError } = await supabaseClient
      .from('onboarding_email_templates')
      .select('*')
      .eq('id', templateId)
      .single()

    if (templateError) {
      console.error('Template fetch error:', templateError)
      throw templateError
    }

    if (!template) {
      throw new Error(`Template not found with ID: ${templateId}`)
    }

    console.log('Found template:', template)

    // Process each recipient
    const emailPromises = emailData.recipients.map(async (recipient) => {
      // Replace variables in template
      let emailContent = template.message
      let emailSubject = template.subject
      
      // Replace standard variables
      const standardReplacements = {
        '{{First Name}}': recipient.name.split(' ')[0],
        '{{Last Name}}': recipient.name.split(' ').slice(1).join(' '),
        '{{Full Name}}': recipient.name,
        '{{Email}}': recipient.email,
        ...emailData.customVariables
      }

      Object.entries(standardReplacements).forEach(([key, value]) => {
        emailContent = emailContent.replace(new RegExp(key, 'g'), value || '')
        emailSubject = emailSubject.replace(new RegExp(key, 'g'), value || '')
      })

      console.log('Sending email to:', recipient.email)

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
          html: emailContent
        })
      })

      if (!res.ok) {
        const error = await res.text()
        console.error('Resend API error:', error)
        throw new Error(error)
      }

      // Log email
      await supabaseClient
        .from('email_logs')
        .insert({
          template_id: template.id,
          recipient: recipient.email,
          subject: emailSubject,
          body: emailContent,
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
