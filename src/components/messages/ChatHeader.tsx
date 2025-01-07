import { Button } from "@/components/ui/button";
import { Video, Monitor } from "lucide-react";

interface ChatHeaderProps {
  participantName: string;
  onVideoCall: () => void;
  onScreenShare: () => void;
  isVideoEnabled: boolean;
}

export function ChatHeader({ 
  participantName, 
  onVideoCall, 
  onScreenShare,
  isVideoEnabled 
}: ChatHeaderProps) {
  return (
    <div className="h-16 border-b border-chat-input-border px-4 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="h-8 w-8 rounded-full bg-gray-200" />
        <div>
          <h3 className="font-medium text-text-primary">{participantName}</h3>
          <span className="text-sm text-chat-status-time">Online</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="icon"
          onClick={onVideoCall}
          className={isVideoEnabled ? "bg-primary text-white" : ""}
        >
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="outline" size="icon" onClick={onScreenShare}>
          <Monitor className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}