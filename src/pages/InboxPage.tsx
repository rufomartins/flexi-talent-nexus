
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { InboxTable } from "@/components/inbox/InboxTable";
import { ErrorBoundary } from "@/components/error-boundary/ErrorBoundary";
import { Skeleton } from "@/components/ui/skeleton";

export default function InboxPage() {
  const { data: conversations, isLoading, error } = useQuery({
    queryKey: ['email-conversations'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('email_conversations')
        .select(`
          *,
          email_messages: email_messages (
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
        .order('last_message_at', { ascending: false });
      
      if (error) throw error;
      
      // Ensure correct typing of direction field
      return data?.map(conversation => ({
        ...conversation,
        email_messages: conversation.email_messages.map(message => ({
          ...message,
          direction: message.direction as 'inbound' | 'outbound'
        }))
      })) || [];
    }
  });

  if (error) {
    console.error('Error loading inbox:', error);
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
