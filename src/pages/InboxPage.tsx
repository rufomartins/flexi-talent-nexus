
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InboxTable } from "@/components/inbox/InboxTable";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "@/hooks/use-toast";

export default function InboxPage() {
  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ['email-conversations'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('email_conversations')
          .select(`
            *,
            email_messages!email_messages_conversation_id_fkey (
              id,
              direction,
              from_email,
              to_email,
              subject,
              body,
              created_at,
              status
            )
          `)
          .eq('status', 'active')
          .order('last_message_at', { ascending: false });
        
        if (error) {
          console.error('Supabase query error:', error);
          throw error;
        }

        console.log('Fetched conversations:', data);
        
        // Ensure correct typing of direction field and handle empty messages
        return data?.map(conversation => ({
          ...conversation,
          email_messages: (conversation.email_messages || []).map(message => ({
            ...message,
            direction: message.direction as 'inbound' | 'outbound'
          }))
        })) || [];
      } catch (error) {
        console.error('Error in query function:', error);
        toast({
          variant: "destructive",
          title: "Error loading inbox",
          description: "Failed to load your inbox. Please try again later."
        });
        throw error;
      }
    }
  });

  if (error) {
    return (
      <div className="p-4">
        <div className="bg-red-50 text-red-600 p-4 rounded-md">
          Failed to load inbox. Please try again later.
        </div>
      </div>
    );
  }

  return (
    <div className="py-6 px-4 md:px-8 max-w-[1600px] mx-auto w-full">
      <h1 className="text-2xl font-semibold mb-6">Email Inbox</h1>
      <ErrorBoundary>
        {isLoading ? (
          <div className="space-y-4">
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-12 w-full" />
          </div>
        ) : (
          <InboxTable conversations={conversations || []} />
        )}
      </ErrorBoundary>
    </div>
  );
}
