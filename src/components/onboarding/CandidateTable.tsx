import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Checkbox } from "@/components/ui/checkbox";
import { CandidateActions } from "./CandidateActions";
import type { Candidate } from "@/types/onboarding";

export interface CandidateTableProps {
  candidates: Candidate[];
  selectedCandidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onSelectAll: (checked: boolean) => void;
  stage: 'ingest' | 'process' | 'screening' | 'results';
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
            <TableHead className="w-[50px]">
              <Checkbox 
                checked={candidates.length > 0 && selectedCandidates.length === candidates.length}
                onCheckedChange={onSelectAll}
              />
            </TableHead>
            <TableHead>Full Name</TableHead>
            <TableHead>First Name</TableHead>
            <TableHead>Last Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Language</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {candidates.map((candidate) => (
            <TableRow key={candidate.id}>
              <TableCell>
                <Checkbox
                  checked={selectedCandidates.some(c => c.id === candidate.id)}
                  onCheckedChange={() => onSelectCandidate(candidate)}
                />
              </TableCell>
              <TableCell className="font-medium">{candidate.name}</TableCell>
              <TableCell>{candidate.first_name}</TableCell>
              <TableCell>{candidate.last_name}</TableCell>
              <TableCell>{candidate.email}</TableCell>
              <TableCell>{candidate.phone}</TableCell>
              <TableCell>{candidate.language}</TableCell>
              <TableCell>{candidate.source}</TableCell>
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
                  stage={stage}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}