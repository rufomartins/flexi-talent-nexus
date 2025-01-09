import { useQuery } from "@tanstack/react-query"
import { ScrollArea } from "@/components/ui/scroll-area"
import { supabase } from "@/integrations/supabase/client"
import { formatDistanceToNow } from "date-fns"
import { Bell, CheckCircle, Clock, AlertTriangle } from "lucide-react"

interface Notification {
  id: string
  type: 'assignment' | 'status_change' | 'deadline_reminder' | 'overdue'
  status: 'pending' | 'sent' | 'failed'
  metadata: {
    task_id: string
    role_type: string
    content: {
      title: string
      message: string
      action?: {
        type: string
        url: string
      }
    }
  }
  created_at: string
}

export function NotificationList() {
  const { data: notifications, isLoading } = useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('notification_queue')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(50)

      if (error) throw error
      return data as Notification[]
    }
  })

  const getIcon = (type: Notification['type']) => {
    switch (type) {
      case 'assignment':
        return <Bell className="h-4 w-4" />
      case 'status_change':
        return <CheckCircle className="h-4 w-4" />
      case 'deadline_reminder':
        return <Clock className="h-4 w-4" />
      case 'overdue':
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  if (isLoading) {
    return <div className="p-4 text-center">Loading notifications...</div>
  }

  if (!notifications?.length) {
    return <div className="p-4 text-center">No notifications</div>
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2 p-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className="flex items-start space-x-4 rounded-lg border p-4 hover:bg-accent"
          >
            <div className="mt-1">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium">{notification.metadata.content.title}</p>
              <p className="text-sm text-muted-foreground">
                {notification.metadata.content.message}
              </p>
              {notification.metadata.content.action && (
                <a
                  href={notification.metadata.content.action.url}
                  className="text-sm text-blue-600 hover:underline"
                >
                  {notification.metadata.content.action.type}
                </a>
              )}
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </p>
            </div>
          </div>
        ))}
      </div>
    </ScrollArea>
  )
}