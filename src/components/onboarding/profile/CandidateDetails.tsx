import { Card } from "@/components/ui/card";
import type { Candidate } from "@/types/onboarding";

interface CandidateDetailsProps {
  candidate: Candidate;
}

export function CandidateDetails({ candidate }: CandidateDetailsProps) {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Name</label>
          <p className="text-sm">{candidate.name}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Email</label>
          <p className="text-sm">{candidate.email}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Phone</label>
          <p className="text-sm">{candidate.phone || 'Not provided'}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Language</label>
          <p className="text-sm">{candidate.language || 'Not specified'}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Native Language</label>
          <p className="text-sm">{candidate.native_language || 'Not specified'}</p>
        </div>
        <div>
          <label className="text-sm font-medium">Source</label>
          <p className="text-sm">{candidate.source || 'Direct'}</p>
        </div>
      </div>

      {candidate.remarks && (
        <div>
          <label className="text-sm font-medium">Remarks</label>
          <p className="text-sm whitespace-pre-wrap">{candidate.remarks}</p>
        </div>
      )}
    </div>
  );
}