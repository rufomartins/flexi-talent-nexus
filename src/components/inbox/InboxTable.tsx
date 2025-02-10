
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ActivityPagination } from "@/components/dashboard/activity/ActivityPagination";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";

interface EmailMessage {
  id: string;
  direction: 'inbound' | 'outbound';
  from_email: string;
  to_email: string[];
  subject: string;
  body: string;
  created_at: string;
  status: 'unread' | 'read' | 'archived' | 'deleted';
}

interface Conversation {
  id: string;
  subject: string;
  last_message_at: string;
  email_messages: EmailMessage[];
}

interface InboxTableProps {
  conversations: Conversation[];
}

export function InboxTable({ conversations }: InboxTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(conversations.length / itemsPerPage);

  const paginatedConversations = conversations.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Status</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>From</TableHead>
              <TableHead>To</TableHead>
              <TableHead>Last Message</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedConversations.map((conversation) => {
              const lastMessage = conversation.email_messages[0];
              if (!lastMessage) return null;

              return (
                <TableRow key={conversation.id} className="cursor-pointer hover:bg-muted/50">
                  <TableCell>
                    {lastMessage.status === 'unread' && (
                      <Badge variant="default">Unread</Badge>
                    )}
                  </TableCell>
                  <TableCell className="font-medium">
                    {conversation.subject}
                  </TableCell>
                  <TableCell>{lastMessage.from_email}</TableCell>
                  <TableCell>{lastMessage.to_email.join(", ")}</TableCell>
                  <TableCell>
                    {format(new Date(lastMessage.created_at), "MMM d, yyyy HH:mm")}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {totalPages > 1 && (
        <div className="mt-4">
          <ActivityPagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
          />
        </div>
      )}
    </div>
  );
}
