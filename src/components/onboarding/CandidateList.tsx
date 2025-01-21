import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CommunicationMetrics } from "./list/CommunicationMetrics";
import { CandidateFilters } from "./list/CandidateFilters";
import { CandidateTable } from "./list/CandidateTable";
import { BulkActions } from "./list/BulkActions";
import { OnboardingEmailComposer } from "./email/OnboardingEmailComposer";
import { EmailAndSmsComposer } from "./communication/EmailAndSmsComposer";
import type { Candidate } from "@/types/onboarding";

interface CandidateListProps {
  candidates: Candidate[];
  isLoading: boolean;
  error: Error | null;
}

export function CandidateList({ candidates, isLoading, error }: CandidateListProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [isSmsComposerOpen, setIsSmsComposerOpen] = useState(false);
  const [communicationFilter, setCommunicationFilter] = useState<string>("all");
  const queryClient = useQueryClient();

  // Add real-time subscription for communication status updates
  useEffect(() => {
    const channel = supabase
      .channel('communication-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'onboarding_candidates',
          filter: 'communication_status=neq.null'
        },
        (payload) => {
          console.log('Communication status updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['candidates'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleSelectCandidate = (candidate: Candidate) => {
    if (selectedCandidates.find(c => c.id === candidate.id)) {
      setSelectedCandidates(selectedCandidates.filter(c => c.id !== candidate.id));
    } else {
      setSelectedCandidates([...selectedCandidates, candidate]);
    }
  };

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedCandidates(candidates);
    } else {
      setSelectedCandidates([]);
    }
  };

  const filteredCandidates = candidates.filter(candidate => {
    if (communicationFilter === "all") return true;
    return candidate.communication_status === communicationFilter;
  });

  if (isLoading) {
    return <div>Loading candidates...</div>;
  }

  if (error) {
    return <div>Error loading candidates: {error.message}</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <span>{selectedCandidates.length} candidate(s) selected</span>
          <CandidateFilters
            communicationFilter={communicationFilter}
            onFilterChange={setCommunicationFilter}
          />
        </div>
        <BulkActions
          selectedCount={selectedCandidates.length}
          onEmailClick={() => setIsEmailComposerOpen(true)}
          onSmsClick={() => setIsSmsComposerOpen(true)}
        />
      </div>

      <CommunicationMetrics />

      <CandidateTable
        candidates={filteredCandidates}
        selectedCandidates={selectedCandidates}
        onSelectCandidate={handleSelectCandidate}
        onSelectAll={handleSelectAll}
        onEmailClick={(candidate) => {
          setSelectedCandidates([candidate]);
          setIsEmailComposerOpen(true);
        }}
        onSmsClick={(candidate) => {
          setSelectedCandidates([candidate]);
          setIsSmsComposerOpen(true);
        }}
      />

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