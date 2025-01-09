import { useQuery } from "@tanstack/react-query"
import { Badge } from "@/components/ui/badge"
import { supabase } from "@/integrations/supabase/client"

export function NotificationBadge() {
  const { data: unreadCount } = useQuery({
    queryKey: ['notifications', 'unread'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('notification_queue')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending')

      if (error) throw error
      return count || 0
    },
    refetchInterval: 30000 // Refetch every 30 seconds
  })

  if (!unreadCount) return null

  return (
    <Badge 
      variant="destructive" 
      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
    >
      {unreadCount > 99 ? '99+' : unreadCount}
    </Badge>
  )
}