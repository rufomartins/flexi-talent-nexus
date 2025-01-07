import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Video, Monitor, Paperclip, Send, Smile, Type } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAgoraClient } from "@/hooks/useAgoraClient";
import { formatDistanceToNow } from "date-fns";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  content_type: string;
}

interface ChatWindowProps {
  conversationId: string;
  participantName: string;
}

export function ChatWindow({ conversationId, participantName }: ChatWindowProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  const { initializeAgora, toggleVideo, isVideoEnabled } = useAgoraClient(conversationId);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (!conversationId) return;

    const fetchMessages = async () => {
      const { data, error } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (error) {
        toast({
          title: "Error",
          description: "Failed to load messages",
          variant: "destructive",
        });
        return;
      }

      setMessages(data || []);
    };

    fetchMessages();

    // Subscribe to new messages
    const channel = supabase
      .channel(`messages:${conversationId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${conversationId}`,
        },
        (payload) => {
          setMessages((prev) => [...prev, payload.new as Message]);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [conversationId, toast]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: conversationId,
      content: newMessage,
      sender_id: user.id,
      content_type: "text",
    });

    if (error) {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
      return;
    }

    setNewMessage("");
  };

  return (
    <div className="flex h-full flex-col">
      <ChatHeader
        participantName={participantName}
        onVideoCall={initializeAgora}
        onScreenShare={() => {}}
        isVideoEnabled={isVideoEnabled}
      />
      <MessagesDisplay messages={messages} />
      <MessageInput
        value={newMessage}
        onChange={setNewMessage}
        onSend={handleSendMessage}
        isTyping={isTyping}
      />
    </div>
  );
}

function ChatHeader({ 
  participantName, 
  onVideoCall, 
  onScreenShare,
  isVideoEnabled 
}: { 
  participantName: string;
  onVideoCall: () => void;
  onScreenShare: () => void;
  isVideoEnabled: boolean;
}) {
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

function MessagesDisplay({ messages }: { messages: Message[] }) {
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

function MessageBubble({ message }: { message: Message }) {
  const { data: { user } } = await supabase.auth.getUser();
  const isOwnMessage = message.sender_id === user?.id;

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

function MessageInput({ 
  value, 
  onChange, 
  onSend,
  isTyping 
}: { 
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isTyping: boolean;
}) {
  return (
    <div className="border-t border-chat-input-border p-4">
      <div className="flex items-end gap-2">
        <Button variant="ghost" size="icon" className="mb-1">
          <Type className="h-4 w-4" />
        </Button>
        <Textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Type a message..."
          className="min-h-[80px] flex-1"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSend();
            }
          }}
        />
        <div className="flex flex-col gap-2">
          <Button variant="ghost" size="icon">
            <Paperclip className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon">
            <Smile className="h-4 w-4" />
          </Button>
          <Button onClick={onSend}>
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
      {isTyping && (
        <span className="text-xs text-chat-status-time mt-1">
          Someone is typing...
        </span>
      )}
    </div>
  );
}