import { Badge } from "@/components/ui/badge";
import { useQuery } from "@tanstack/react-query";
import { notificationService } from "@/services/notificationService";
import { useNotificationSubscription } from "@/hooks/useNotificationSubscription";

interface TalentNotificationBadgeProps {
  talentId: string;
}

export function TalentNotificationBadge({ talentId }: TalentNotificationBadgeProps) {
  const { data: unreadCount } = useQuery({
    queryKey: ['notification-unread-count', talentId],
    queryFn: () => notificationService.getUnreadCount(talentId),
    refetchInterval: 30000 // Refetch every 30 seconds
  });

  // Set up real-time subscription
  useNotificationSubscription(talentId);

  if (!unreadCount) return null;

  return (
    <Badge 
      variant="destructive" 
      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
    >
      {unreadCount > 99 ? '99+' : unreadCount}
    </Badge>
  );
}