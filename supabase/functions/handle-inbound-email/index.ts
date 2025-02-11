
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CloudMailinPayload {
  headers: Record<string, string>;
  envelope: {
    to: string;
    from: string;
  };
  plain: string;
  html?: string;
  subject?: string;
  attachments?: Array<{
    content_type: string;
    file_name: string;
    size: number;
    url: string;
  }>;
}

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

async function getEmailSettings() {
  const { data, error } = await supabaseClient
    .from('api_settings')
    .select('value')
    .eq('name', 'cloudmailin_settings')
    .single();

  if (error) {
    console.error('Error fetching email settings:', error);
    return { enabled: false };
  }
  return data?.value || { enabled: false };
}

async function findOrCreateConversation(subject: string): Promise<string> {
  const { data: existing, error: searchError } = await supabaseClient
    .from('email_conversations')
    .select('id')
    .eq('subject', subject)
    .eq('status', 'active')
    .single();

  if (searchError && searchError.code !== 'PGRST116') {
    throw searchError;
  }

  if (existing?.id) {
    return existing.id;
  }

  const { data: newConversation, error: insertError } = await supabaseClient
    .from('email_conversations')
    .insert([{
      subject,
      status: 'active'
    }])
    .select('id')
    .single();

  if (insertError) throw insertError;
  if (!newConversation) throw new Error('Failed to create conversation');

  return newConversation.id;
}

async function handleInboundEmail(req: Request): Promise<Response> {
  console.log('Received inbound email request');
  console.log('Request method:', req.method);
  
  // Log headers for debugging
  console.log('Request headers:');
  for (const [key, value] of req.headers.entries()) {
    console.log(`${key}: ${value}`);
  }

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const settings = await getEmailSettings();
    console.log('Retrieved email settings:', settings);
    
    if (!settings.enabled) {
      console.error('Email integration is disabled');
      return new Response(
        JSON.stringify({ error: 'Email integration is disabled' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    const rawBody = await req.text();
    console.log('Request body (first 200 chars):', rawBody.substring(0, 200));
    
    const email: CloudMailinPayload = JSON.parse(rawBody);
    console.log('Processing email:', { 
      subject: email.subject,
      from: email.envelope.from,
      to: email.envelope.to,
      hasHtml: !!email.html,
      textLength: email.plain?.length,
      attachmentsCount: email.attachments?.length
    });

    const conversationId = await findOrCreateConversation(email.subject || 'No Subject');
    console.log('Found/created conversation:', conversationId);

    const { data: message, error: messageError } = await supabaseClient
      .from('email_messages')
      .insert([
        {
          conversation_id: conversationId,
          direction: 'inbound',
          from_email: email.envelope.from,
          to_email: [email.envelope.to],
          subject: email.subject || 'No Subject',
          body: email.plain,
          html_body: email.html,
          headers: email.headers,
          attachments: email.attachments?.map(att => ({
            contentType: att.content_type,
            filename: att.file_name,
            size: att.size,
            url: att.url
          })),
          status: 'unread',
          metadata: {
            has_html: !!email.html,
            has_attachments: email.attachments?.length > 0,
            provider: 'cloudmailin'
          }
        }
      ])
      .select()
      .single();

    if (messageError) {
      console.error('Error saving email message:', messageError);
      throw messageError;
    }

    const { error: legacyError } = await supabaseClient
      .from('onboarding_inbox')
      .insert([
        {
          sender: email.envelope.from,
          recipient: email.envelope.to,
          subject: email.subject || 'No Subject',
          body: email.html || email.plain,
          attachments: email.attachments,
          headers: email.headers,
          metadata: {
            has_html: !!email.html,
            has_text: !!email.plain,
            attachment_count: email.attachments?.length || 0,
            provider: 'cloudmailin'
          }
        }
      ]);

    if (legacyError) {
      console.warn('Error saving to legacy inbox:', legacyError);
    }

    console.log('Email processed successfully:', message.id);
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email processed successfully', 
        id: message.id 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error processing email:', error);
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Failed to process email',
        details: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    );
  }
}

serve(handleInboundEmail);
