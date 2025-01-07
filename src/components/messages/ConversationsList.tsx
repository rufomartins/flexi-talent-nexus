import { useState, useEffect } from "react";
import { ConversationsSearch } from "./ConversationsSearch";
import { ConversationItem } from "./ConversationItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/integrations/supabase/client";
import { useMessages } from "@/contexts/MessagesContext";

interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

interface ConversationParticipant {
  user_id: string;
}

interface ConversationResponse {
  id: string;
  title: string;
  project_id: string;
  conversation_participants: ConversationParticipant[];
  messages: Message[];
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

export function ConversationsList() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { selectedConversation, setSelectedConversation } = useMessages();

  useEffect(() => {
    const fetchConversations = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          title,
          project_id,
          conversation_participants (
            user_id
          ),
          messages (
            id,
            sender_id,
            content,
            created_at
          )
        `)
        .eq('conversation_participants.user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.error('Error fetching conversations:', error);
        return;
      }

      const transformedData = (data as ConversationResponse[]).map(conv => ({
        id: conv.id,
        title: conv.title || 'Untitled Conversation',
        lastMessage: conv.messages[0]?.content || '',
        timestamp: conv.messages[0]?.created_at ? 
          new Date(conv.messages[0].created_at).toLocaleTimeString() : '',
        userInitials: conv.title?.slice(0, 2) || 'UC',
      }));

      setConversations(transformedData);
    };

    fetchConversations();

    const channel = supabase
      .channel('conversations-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'messages'
        },
        () => {
          fetchConversations();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filteredConversations = conversations.filter(conv =>
    conv.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.lastMessage?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <ConversationsSearch onSearch={setSearchQuery} />
      <ScrollArea className="flex-1">
        <div className="py-2">
          {filteredConversations.map((conversation) => (
            <ConversationItem
              key={conversation.id}
              conversation={conversation}
              isSelected={selectedConversation?.id === conversation.id}
              onClick={() => setSelectedConversation(conversation)}
            />
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}