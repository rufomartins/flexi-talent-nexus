import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { MessageList } from "./MessageList";
import { VideoCallDialog } from "./VideoCallDialog";
import { useMessaging } from "@/hooks/useMessaging";
import { MessageInput } from "./MessageInput";
import { MessageDialogHeader } from "./MessageDialogHeader";

interface CastingMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  talentId: string;
  castingId: string;
  talentName: string;
}

type ConversationData = {
  id: string;
  title: string;
};

export function CastingMessageDialog({
  open,
  onOpenChange,
  talentId,
  castingId,
  talentName
}: CastingMessageDialogProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [videoCallOpen, setVideoCallOpen] = useState(false);
  const { toast } = useToast();
  const { messages, sendMessage, loadMessages, setMessages } = useMessaging(conversationId);

  useEffect(() => {
    if (open) {
      initializeConversation();
    }
  }, [open, talentId, castingId]);

  useEffect(() => {
    if (conversationId) {
      const channel = supabase
        .channel('messages')
        .on(
          'postgres_changes',
          {
            event: 'INSERT',
            schema: 'public',
            table: 'messages',
            filter: `conversation_id=eq.${conversationId}`,
          },
          (payload: any) => {
            setMessages((current) => [...current, payload.new]);
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    }
  }, [conversationId]);

  const initializeConversation = async () => {
    try {
      setIsLoading(true);
      
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('casting_id', castingId)
        .maybeSingle();

      if (existingConversation) {
        setConversationId(existingConversation.id);
        loadMessages(existingConversation.id);
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error("No authenticated user");

        const { data: newConversation, error: conversationError } = await supabase
          .from('conversations')
          .insert({
            title: `Casting conversation with ${talentName}`,
            casting_id: castingId,
          })
          .select()
          .single();

        if (conversationError) throw conversationError;

        const { error: participantsError } = await supabase
          .from('conversation_participants')
          .insert([
            { conversation_id: newConversation.id, user_id: talentId },
            { conversation_id: newConversation.id, user_id: user.id }
          ]);

        if (participantsError) throw participantsError;

        setConversationId(newConversation.id);
      }
    } catch (error) {
      console.error('Error initializing conversation:', error);
      toast({
        title: "Error",
        description: "Failed to initialize conversation",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
          <MessageDialogHeader 
            talentName={talentName} 
            onVideoCall={() => setVideoCallOpen(true)} 
          />

          {isLoading ? (
            <div className="flex-1 flex items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              <MessageList messages={messages} />
              <MessageInput onSendMessage={sendMessage} />
            </>
          )}
        </DialogContent>
      </Dialog>

      <VideoCallDialog
        open={videoCallOpen}
        onOpenChange={setVideoCallOpen}
        channelName={`casting-${castingId}-${talentId}`}
        talentName={talentName}
      />
    </>
  );
}