import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Mail, MessageSquare } from "lucide-react";
import { OnboardingEmailComposer } from "./email/OnboardingEmailComposer";
import { EmailAndSmsComposer } from "./communication/EmailAndSmsComposer";
import { supabase } from "@/integrations/supabase/client";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
}

interface CandidateListProps {
  candidates: Candidate[];
  isLoading: boolean;
  error: Error | null;
}

export function CandidateList({ candidates, isLoading, error }: CandidateListProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [isSmsComposerOpen, setIsSmsComposerOpen] = useState(false);

  const handleSelectCandidate = (candidate: Candidate) => {
    if (selectedCandidates.find(c => c.id === candidate.id)) {
      setSelectedCandidates(selectedCandidates.filter(c => c.id !== candidate.id));
    } else {
      setSelectedCandidates([...selectedCandidates, candidate]);
    }
  };

  if (isLoading) {
    return <div>Loading candidates...</div>;
  }

  if (error) {
    return <div>Error loading candidates: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      {selectedCandidates.length > 0 && (
        <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
          <span>{selectedCandidates.length} candidate(s) selected</span>
          <div className="flex gap-2">
            <Button
              onClick={() => setIsEmailComposerOpen(true)}
              size="sm"
              className="flex items-center gap-2"
            >
              <Mail className="h-4 w-4" />
              Send Email
            </Button>
            <Button
              onClick={() => setIsSmsComposerOpen(true)}
              size="sm"
              variant="secondary"
              className="flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              Send SMS
            </Button>
          </div>
        </div>
      )}

      <div className="rounded-md border">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="w-12 px-4 py-3">
                <Checkbox
                  checked={selectedCandidates.length === candidates.length}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCandidates(candidates);
                    } else {
                      setSelectedCandidates([]);
                    }
                  }}
                />
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Name</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Email</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Phone</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Status</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Created At</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200 bg-white">
            {candidates.map((candidate) => (
              <tr key={candidate.id}>
                <td className="px-4 py-3">
                  <Checkbox
                    checked={selectedCandidates.some(c => c.id === candidate.id)}
                    onCheckedChange={() => handleSelectCandidate(candidate)}
                  />
                </td>
                <td className="px-4 py-3">{candidate.name}</td>
                <td className="px-4 py-3">{candidate.email}</td>
                <td className="px-4 py-3">{candidate.phone}</td>
                <td className="px-4 py-3">{candidate.status}</td>
                <td className="px-4 py-3">
                  {new Date(candidate.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <OnboardingEmailComposer
        open={isEmailComposerOpen}
        onOpenChange={setIsEmailComposerOpen}
        selectedCandidates={selectedCandidates.map(c => ({
          id: c.id,
          name: c.name,
          email: c.email
        }))}
      />

      {isSmsComposerOpen && selectedCandidates.length > 0 && (
        <EmailAndSmsComposer
          candidateId={selectedCandidates[0].id}
          candidateName={selectedCandidates[0].name}
          phone={selectedCandidates[0].phone}
          open={isSmsComposerOpen}
          onOpenChange={setIsSmsComposerOpen}
          mode="sms"
          selectedCandidates={selectedCandidates}
        />
      )}
    </div>
  );
}