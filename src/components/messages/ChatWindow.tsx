import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgoraClient } from "@/hooks/useAgoraClient";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "./ChatHeader";
import { MessagesDisplay } from "./MessagesDisplay";
import { MessageInput } from "./MessageInput";

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
  const { toast } = useToast();
  const { initializeAgora, toggleVideo, isVideoEnabled } = useAgoraClient(conversationId);

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