import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface HistoryEntry {
  id: string;
  previous_status: string;
  new_status: string;
  created_at: string;
}

interface AssignmentHistoryProps {
  history: HistoryEntry[];
  roleType: string;
}

export function AssignmentHistory({ history, roleType }: AssignmentHistoryProps) {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Previous Status</TableHead>
            <TableHead>New Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {history.map((entry) => (
            <TableRow key={entry.id}>
              <TableCell>
                {format(new Date(entry.created_at), "MMM d, yyyy HH:mm")}
              </TableCell>
              <TableCell>{entry.previous_status || "Initial Assignment"}</TableCell>
              <TableCell>{entry.new_status}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {history.length === 0 && (
        <div className="text-center text-sm text-gray-500 py-4">
          No history available
        </div>
      )}
    </div>
  );
}