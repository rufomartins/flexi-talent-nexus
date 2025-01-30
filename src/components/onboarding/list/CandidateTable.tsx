import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { CandidateActions } from "./CandidateActions";
import type { Candidate } from "@/types/onboarding";

interface CandidateTableProps {
  candidates: Candidate[];
  selectedCandidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onSelectAll: (checked: boolean) => void;
  stage: "ingest" | "process" | "screening" | "results";
  getStatusColor: (status: string) => string;
}

export function CandidateTable({ 
  candidates, 
  selectedCandidates,
  onSelectCandidate,
  onSelectAll,
  stage,
  getStatusColor 
}: CandidateTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-12">
              <input
                type="checkbox"
                checked={selectedCandidates.length === candidates.length}
                onChange={(e) => onSelectAll(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300"
              />
            </TableHead>
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
              <TableCell>
                <input
                  type="checkbox"
                  checked={selectedCandidates.some(c => c.id === candidate.id)}
                  onChange={() => onSelectCandidate(candidate)}
                  className="h-4 w-4 rounded border-gray-300"
                />
              </TableCell>
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