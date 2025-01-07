import { createContext, useContext, useState, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  content_type: string;
}

interface Conversation {
  id: string;
  title?: string;
  lastMessage?: string;
  timestamp?: string;
  isOnline?: boolean;
  avatarUrl?: string;
  userInitials: string;
  userRole?: string;
}

interface MessagesContextType {
  selectedConversation: Conversation | null;
  setSelectedConversation: (conversation: Conversation | null) => void;
  messages: Message[];
  isLoading: boolean;
  error: string | null;
}

const MessagesContext = createContext<MessagesContextType | undefined>(undefined);

export function MessagesProvider({ children }: { children: ReactNode }) {
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadMessages = async (conversationId: string) => {
    setIsLoading(true);
    setError(null);

    try {
      const { data, error: fetchError } = await supabase
        .from("messages")
        .select("*")
        .eq("conversation_id", conversationId)
        .order("created_at", { ascending: true });

      if (fetchError) throw fetchError;
      setMessages(data || []);
    } catch (err) {
      const errorMessage = "Failed to load messages";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    selectedConversation,
    setSelectedConversation: (conversation: Conversation | null) => {
      setSelectedConversation(conversation);
      if (conversation) {
        loadMessages(conversation.id);
      } else {
        setMessages([]);
      }
    },
    messages,
    isLoading,
    error,
  };

  return (
    <MessagesContext.Provider value={value}>
      {children}
    </MessagesContext.Provider>
  );
}

export function useMessages() {
  const context = useContext(MessagesContext);
  if (context === undefined) {
    throw new Error("useMessages must be used within a MessagesProvider");
  }
  return context;
}