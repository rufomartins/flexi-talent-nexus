import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2, Paperclip, Send, Mic } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  content_type: string;
}

interface CastingMessageDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  talentId: string;
  castingId: string;
  talentName: string;
}

export function CastingMessageDialog({
  open,
  onOpenChange,
  talentId,
  castingId,
  talentName
}: CastingMessageDialogProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const { toast } = useToast();

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
          (payload) => {
            setMessages((current) => [...current, payload.new as Message]);
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
      
      // Check if conversation exists for this casting and talent
      const { data: existingConversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('casting_id', castingId)
        .single();

      if (existingConversation) {
        setConversationId(existingConversation.id);
        loadMessages(existingConversation.id);
      } else {
        // Create new conversation
        const { data: newConversation, error: conversationError } = await supabase
          .from('conversations')
          .insert({
            title: `Casting conversation with ${talentName}`,
            casting_id: castingId,
          })
          .select()
          .single();

        if (conversationError) throw conversationError;

        // Add participants
        const { error: participantsError } = await supabase
          .from('conversation_participants')
          .insert([
            { conversation_id: newConversation.id, user_id: talentId },
            { conversation_id: newConversation.id, user_id: (await supabase.auth.getUser()).data.user?.id }
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

  const loadMessages = async (convId: string) => {
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      setMessages(data || []);
    } catch (error) {
      console.error('Error loading messages:', error);
      toast({
        title: "Error",
        description: "Failed to load messages",
        variant: "destructive",
      });
    }
  };

  const handleSendMessage = async () => {
    if (!message.trim() || !conversationId) return;

    try {
      const { error } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          content: message,
          content_type: 'text',
        });

      if (error) throw error;
      setMessage("");
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] h-[600px] flex flex-col">
        <DialogHeader>
          <DialogTitle>Chat with {talentName}</DialogTitle>
        </DialogHeader>

        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${
                      msg.sender_id === (supabase.auth.getUser())?.data?.user?.id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`rounded-lg px-4 py-2 max-w-[80%] ${
                        msg.sender_id === (supabase.auth.getUser())?.data?.user?.id
                          ? "bg-blue-500 text-white"
                          : "bg-gray-100"
                      }`}
                    >
                      {msg.content}
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>

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
                      // File upload functionality will be implemented later
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
                      // Voice message functionality will be implemented later
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
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}