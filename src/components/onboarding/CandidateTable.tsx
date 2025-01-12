import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CandidateActions } from "./CandidateActions";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'emailed' | 'interviewed' | 'approved';
  scout: {
    id: string;
    full_name: string;
  } | null;
}

interface CandidateTableProps {
  candidates: Candidate[];
  getStatusColor: (status: string) => string;
}

export function CandidateTable({ candidates, getStatusColor }: CandidateTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Scout</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell className="font-medium">{candidate.name}</TableCell>
              <TableCell>{candidate.email}</TableCell>
              <TableCell>{candidate.phone}</TableCell>
              <TableCell>{candidate.scout?.full_name || '-'}</TableCell>
              <TableCell>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                    candidate.status
                  )}`}
                >
                  {candidate.status}
                </span>
              </TableCell>
              <TableCell className="text-right">
                <CandidateActions 
                  candidateId={candidate.id}
                  candidateName={candidate.name}
                  email={candidate.email}
                  phone={candidate.phone}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}