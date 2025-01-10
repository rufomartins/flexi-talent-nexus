import { ScrollArea } from "@/components/ui/scroll-area";
import { formatDistanceToNow } from "date-fns";
import { Bell, CheckCircle, Clock } from "lucide-react";
import { useTalentNotifications } from "@/hooks/useTalentNotifications";
import { useNotificationSubscription } from "@/hooks/useNotificationSubscription";
import { Button } from "@/components/ui/button";
import { NotificationType } from "@/types/notifications";
import { Loader2 } from "lucide-react";

interface TalentNotificationListProps {
  talentId: string;
}

export function TalentNotificationList({ talentId }: TalentNotificationListProps) {
  const { notifications, isLoading, markAsRead } = useTalentNotifications(talentId);
  
  // Set up real-time subscription
  useNotificationSubscription(talentId);

  const getIcon = (type: keyof typeof NotificationType) => {
    switch (type) {
      case "STATUS_CHANGE":
        return <CheckCircle className="h-4 w-4" />;
      case "ASSIGNMENT_UPDATE":
        return <Bell className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-4">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!notifications?.length) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        No notifications
      </div>
    );
  }

  return (
    <ScrollArea className="h-[400px]">
      <div className="space-y-2 p-4">
        {notifications.map((notification) => (
          <div
            key={notification.id}
            className={`flex items-start space-x-4 rounded-lg border p-4 transition-colors ${
              !notification.read ? 'bg-muted' : ''
            }`}
          >
            <div className="mt-1">
              {getIcon(notification.type)}
            </div>
            <div className="flex-1 space-y-1">
              <p className="font-medium">{notification.title}</p>
              <p className="text-sm text-muted-foreground">
                {notification.message}
              </p>
              {notification.action_url && (
                <a
                  href={notification.action_url}
                  className="text-sm text-blue-600 hover:underline"
                >
                  View details
                </a>
              )}
              <p className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(notification.created_at), { addSuffix: true })}
              </p>
            </div>
            {!notification.read && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => markAsRead(notification.id)}
              >
                Mark as read
              </Button>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}