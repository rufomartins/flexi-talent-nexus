import { useState, useEffect } from "react";
import { formatDistanceToNow } from "date-fns";
import { supabase } from "@/integrations/supabase/client";

interface MessageBubbleProps {
  message: {
    id: string;
    content: string;
    sender_id: string;
    created_at: string;
  };
}

export function MessageBubble({ message }: MessageBubbleProps) {
  const [isOwnMessage, setIsOwnMessage] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setIsOwnMessage(message.sender_id === user?.id);
    };
    
    checkUser();
  }, [message.sender_id]);

  return (
    <div className={`flex ${isOwnMessage ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-lg px-4 py-2 max-w-[70%] ${
          isOwnMessage
            ? "bg-primary text-primary-foreground"
            : "bg-muted text-text-primary"
        }`}
      >
        <p className="text-sm">{message.content}</p>
        <span className="text-xs opacity-70">
          {formatDistanceToNow(new Date(message.created_at), { addSuffix: true })}
        </span>
      </div>
    </div>
  );
}