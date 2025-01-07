import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
}

interface MessagesDisplayProps {
  messages: Message[];
}

export function MessagesDisplay({ messages }: MessagesDisplayProps) {
  return (
    <ScrollArea className="flex-1 px-4 py-2">
      <div className="space-y-4">
        {messages.map((message) => (
          <MessageBubble key={message.id} message={message} />
        ))}
      </div>
    </ScrollArea>
  );
}