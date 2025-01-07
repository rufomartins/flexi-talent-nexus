import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

interface ConversationItemProps {
  conversation: {
    id: string;
    title?: string;
    lastMessage?: string;
    timestamp?: string;
    isOnline?: boolean;
    avatarUrl?: string;
    userInitials: string;
    userRole?: string;
  };
  isSelected?: boolean;
  onClick?: () => void;
}

export function ConversationItem({ conversation, isSelected, onClick }: ConversationItemProps) {
  const { title, lastMessage, timestamp, isOnline, avatarUrl, userInitials, userRole } = conversation;

  return (
    <div
      className={cn(
        "px-4 py-3 cursor-pointer transition-colors",
        isSelected ? "bg-chat-selected" : "hover:bg-chat-hover"
      )}
      onClick={onClick}
    >
      <div className="flex items-start gap-3">
        <div className="relative">
          <Avatar className="h-10 w-10">
            <AvatarImage src={avatarUrl} alt={title} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-chat-status-online ring-2 ring-white" />
          )}
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start">
            <div className="truncate">
              <span className="font-medium text-text-primary">{title}</span>
              {userRole && (
                <span className="ml-1 text-sm text-text-secondary">
                  {userRole}
                </span>
              )}
            </div>
            {timestamp && (
              <span className="text-xs text-chat-status-time whitespace-nowrap ml-2">
                {timestamp}
              </span>
            )}
          </div>
          
          {lastMessage && (
            <p className="text-sm text-text-secondary truncate mt-0.5">
              {lastMessage}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}