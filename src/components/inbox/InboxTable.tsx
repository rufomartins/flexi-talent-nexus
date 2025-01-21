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

interface Email {
  id: string;
  sender: string;
  subject: string | null;
  received_at: string;
  processed: boolean;
}

interface InboxTableProps {
  emails: Email[];
}

export function InboxTable({ emails }: InboxTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(emails.length / itemsPerPage);

  const paginatedEmails = emails.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Sender</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Received At</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEmails.map((email) => (
              <TableRow key={email.id}>
                <TableCell>{email.sender}</TableCell>
                <TableCell>{email.subject || "No subject"}</TableCell>
                <TableCell>
                  {format(new Date(email.received_at), "MMM d, yyyy HH:mm")}
                </TableCell>
                <TableCell>
                  <span
                    className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      email.processed
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {email.processed ? "Processed" : "Pending"}
                  </span>
                </TableCell>
              </TableRow>
            ))}
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