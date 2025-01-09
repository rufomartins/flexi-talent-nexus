import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface TaskNotification {
  taskId: string;
  roleType: 'translator' | 'reviewer' | 'ugc_talent';
  userId: string;
  type: 'assignment' | 'status_change' | 'deadline_reminder' | 'overdue';
  content: {
    title: string;
    message: string;
    action?: {
      type: string;
      url: string;
    };
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

    const { notification } = await req.json() as { notification: TaskNotification }

    // Insert into notification queue
    const { data: queueData, error: queueError } = await supabaseClient
      .from('notification_queue')
      .insert({
        user_id: notification.userId,
        type: notification.type,
        status: 'pending',
        metadata: {
          task_id: notification.taskId,
          role_type: notification.roleType,
          content: notification.content
        }
      })
      .select()
      .single()

    if (queueError) {
      console.error('Error queueing notification:', queueError)
      throw queueError
    }

    // Log the notification
    console.log('Notification queued:', {
      id: queueData.id,
      type: notification.type,
      userId: notification.userId
    })

    return new Response(
      JSON.stringify({ success: true, data: queueData }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )
  } catch (error) {
    console.error('Error processing notification:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500
      }
    )
  }
})