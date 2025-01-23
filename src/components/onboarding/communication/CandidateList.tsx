interface CandidateInfo {
  id: string;
  name: string;
  phone?: string;
  email?: string;
}

interface CandidateListProps {
  selectedCandidates: CandidateInfo[];
}

export function CandidateList({ selectedCandidates }: CandidateListProps) {
  if (selectedCandidates.length === 0) return null;

  return (
    <div className="mb-4">
      <h4 className="text-sm font-medium mb-2">Selected Candidates:</h4>
      <ul className="text-sm text-muted-foreground">
        {selectedCandidates.map((candidate) => (
          <li key={candidate.id}>{candidate.name}</li>
        ))}
      </ul>
    </div>
  );
}