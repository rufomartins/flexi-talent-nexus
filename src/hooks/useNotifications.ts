import { useMutation, useQueryClient } from "@tanstack/react-query"
import { supabase } from "@/integrations/supabase/client"
import { notify } from "@/utils/notifications"

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

export function useNotifications() {
  const queryClient = useQueryClient()

  const sendNotification = useMutation({
    mutationFn: async (notification: TaskNotification) => {
      const { data, error } = await supabase.functions.invoke('handle-notification', {
        body: { notification }
      })

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    },
    onError: (error) => {
      console.error('Failed to send notification:', error)
      notify.error('Failed to send notification')
    }
  })

  const markAsRead = useMutation({
    mutationFn: async (notificationId: string) => {
      const { error } = await supabase
        .from('notification_queue')
        .update({ status: 'sent' })
        .eq('id', notificationId)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] })
    }
  })

  return {
    sendNotification,
    markAsRead
  }
}