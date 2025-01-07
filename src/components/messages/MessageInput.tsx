import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Paperclip, Send, Mic } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MessageInputProps {
  onSendMessage: (message: string) => Promise<void>;
}

export function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const { toast } = useToast();

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    await onSendMessage(message);
    setMessage("");
  };

  return (
    <div className="border-t p-4 space-y-4">
      <div className="flex items-center space-x-2">
        <Textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSendMessage();
            }
          }}
        />
        <div className="flex flex-col space-y-2">
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              toast({
                title: "Coming soon",
                description: "File upload will be available soon",
              });
            }}
          >
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              toast({
                title: "Coming soon",
                description: "Voice messages will be available soon",
              });
            }}
          >
            <Mic className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleSendMessage}>
          <Send className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}