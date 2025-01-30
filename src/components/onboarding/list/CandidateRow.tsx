import { Checkbox } from "@/components/ui/checkbox";
import { CandidateStageIndicator } from "./CandidateStageIndicator";
import type { Candidate } from "@/types/onboarding";

interface CandidateRowProps {
  candidate: Candidate;
  isSelected: boolean;
  onSelect: (candidate: Candidate) => void;
}

export function CandidateRow({ candidate, isSelected, onSelect }: CandidateRowProps) {
  return (
    <tr className="border-b">
      <td className="px-4 py-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={() => onSelect(candidate)}
        />
      </td>
      <td className="px-4 py-3 font-medium">{candidate.name}</td>
      <td className="px-4 py-3">{candidate.email}</td>
      <td className="px-4 py-3">{candidate.phone}</td>
      <td className="px-4 py-3">
        <CandidateStageIndicator stage={candidate.stage} />
      </td>
      <td className="px-4 py-3">
        {candidate.scout?.full_name || '-'}
      </td>
    </tr>
  );
}