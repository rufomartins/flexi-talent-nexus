
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

    // Log the raw request
    console.log('Raw request:', {
      method: req.method,
      headers: Object.fromEntries(req.headers.entries()),
      url: req.url,
    })

    // Parse request body and log it
    const requestData = await req.json()
    console.log('Parsed request data:', JSON.stringify(requestData, null, 2))

    // Extract email data with detailed logging
    const {
      templateId,
      recipient,
      customVariables = {}
    } = requestData

    console.log('Extracted templateId:', templateId)
    console.log('Extracted recipient:', recipient)
    console.log('Extracted customVariables:', customVariables)
    console.log('RequestData full object:', requestData)

    // Validate inputs with detailed error messages
    if (typeof templateId !== 'string' || !templateId.trim()) {
      const error = new Error('Template ID is required and must be a non-empty string')
      console.error('Validation error:', error.message)
      throw error
    }

    if (!recipient || typeof recipient.email !== 'string' || !recipient.email.trim()) {
      const error = new Error('Recipient email is required and must be a non-empty string')
      console.error('Validation error:', error.message)
      throw error
    }

    if (!recipient.name || typeof recipient.name !== 'string' || !recipient.name.trim()) {
      const error = new Error('Recipient name is required and must be a non-empty string')
      console.error('Validation error:', error.message)
      throw error
    }
    
    // Format email data
    const emailData: EmailRequest = {
      templateId,
      recipients: [{
        id: recipient.id || 'temp-id',
        email: recipient.email,
        name: recipient.name
      }],
      customVariables
    }

    console.log('Formatted email data:', emailData)
    
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
      let emailContent = template.message
      let emailSubject = template.subject

      // Replace standard variables including Candidate ID
      const standardReplacements = {
        '{{First Name}}': recipient.name.split(' ')[0],
        '{{Last Name}}': recipient.name.split(' ').slice(1).join(' '),
        '{{Full Name}}': recipient.name,
        '{{Email}}': recipient.email,
        '{{Candidate ID}}': recipient.id,
        ...customVariables
      }

      console.log('Applying replacements:', standardReplacements)

      Object.entries(standardReplacements).forEach(([key, value]) => {
        if (value) {
          emailContent = emailContent.replace(new RegExp(key, 'g'), value)
          emailSubject = emailSubject.replace(new RegExp(key, 'g'), value)
        }
      })

      // For candidate ID specifically in URLs, ensure proper encoding
      if (recipient.id) {
        const encodedId = encodeURIComponent(recipient.id)
        emailContent = emailContent.replace(/{{Candidate ID}}/g, encodedId)
        emailSubject = emailSubject.replace(/{{Candidate ID}}/g, encodedId)
      }

      console.log('Sending email to:', recipient.email)
      console.log('Email subject:', emailSubject)
      console.log('Email content preview:', emailContent.substring(0, 200) + '...')

      // Send email using Resend with updated sender domain
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Deno.env.get('RESEND_API_KEY')}`
        },
        body: JSON.stringify({
          from: 'GTMD Onboarding <onboarding@onboarding.gtmd.studio>',
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

      const responseData = await res.json()
      console.log('Resend API response:', responseData)
      return responseData
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
    // Return more detailed error information
    return new Response(
      JSON.stringify({ 
        error: error.message,
        stack: error.stack,
        timestamp: new Date().toISOString()
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})
