import { Mail, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import type { Candidate } from "@/types/onboarding";

export interface CandidateTableProps {
  candidates: Candidate[];
  selectedCandidates: Candidate[];
  onSelectCandidate: (candidate: Candidate) => void;
  onSelectAll: (checked: boolean) => void;
  onEmailClick: (candidate: Candidate) => void;
  onSmsClick: (candidate: Candidate) => void;
}

export function CandidateTable({
  candidates,
  selectedCandidates,
  onSelectCandidate,
  onSelectAll,
  onEmailClick,
  onSmsClick
}: CandidateTableProps) {
  return (
    <div className="rounded-md border">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="w-12 px-4 py-3">
              <Checkbox
                checked={selectedCandidates.length === candidates.length}
                onCheckedChange={(checked) => onSelectAll(!!checked)}
              />
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Communication</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {candidates.map((candidate) => (
            <tr key={candidate.id}>
              <td className="px-4 py-3">
                <Checkbox
                  checked={selectedCandidates.some(c => c.id === candidate.id)}
                  onCheckedChange={() => onSelectCandidate(candidate)}
                />
              </td>
              <td className="px-4 py-3">{candidate.name}</td>
              <td className="px-4 py-3">{candidate.email}</td>
              <td className="px-4 py-3">{candidate.phone}</td>
              <td className="px-4 py-3">{candidate.status}</td>
              <td className="px-4 py-3">
                <Badge variant={
                  candidate.communication_status === 'email_sent' ? 'default' :
                  candidate.communication_status === 'sms_sent' ? 'secondary' :
                  'outline'
                }>
                  {candidate.communication_status || 'No Contact'}
                </Badge>
              </td>
              <td className="px-4 py-3">
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onEmailClick(candidate)}
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => onSmsClick(candidate)}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}