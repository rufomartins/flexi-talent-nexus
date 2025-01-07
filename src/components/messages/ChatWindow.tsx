import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAgoraClient } from "@/hooks/useAgoraClient";
import { supabase } from "@/integrations/supabase/client";
import { ChatHeader } from "./ChatHeader";
import { MessagesDisplay } from "./MessagesDisplay";
import { MessageInput } from "./MessageInput";
import { useMessages } from "@/contexts/MessagesContext";

interface ChatWindowProps {
  participantName: string;
}

export function ChatWindow({ participantName }: ChatWindowProps) {
  const { selectedConversation, messages } = useMessages();
  const { toast } = useToast();
  const { initializeAgora, toggleVideo, isVideoEnabled } = useAgoraClient(selectedConversation?.id || "");

  useEffect(() => {
    if (!selectedConversation?.id) return;

    const channel = supabase
      .channel(`messages:${selectedConversation.id}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "messages",
          filter: `conversation_id=eq.${selectedConversation.id}`,
        },
        (payload) => {
          // New messages will be handled by the MessagesContext
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [selectedConversation?.id]);

  const handleSendMessage = async (message: string) => {
    if (!message.trim() || !selectedConversation) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("messages").insert({
      conversation_id: selectedConversation.id,
      content: message,
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
  };

  if (!selectedConversation) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">Select a conversation to start messaging</p>
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <ChatHeader
        participantName={participantName}
        onVideoCall={initializeAgora}
        onScreenShare={() => {}}
        isVideoEnabled={isVideoEnabled}
      />
      <MessagesDisplay messages={messages} />
      <MessageInput onSendMessage={handleSendMessage} />
    </div>
  );
}