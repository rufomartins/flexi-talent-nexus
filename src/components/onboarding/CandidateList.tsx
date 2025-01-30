import { useState } from "react";
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
  stage: 'ingest' | 'process' | 'screening' | 'results';
}

export function CandidateList({ candidates, isLoading, error, stage }: CandidateListProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [isSmsComposerOpen, setIsSmsComposerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // Add real-time subscription for status updates
  useEffect(() => {
    const channel = supabase
      .channel('status-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'onboarding_candidates',
          filter: 'status=neq.null'
        },
        (payload) => {
          console.log('Status updated:', payload);
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

  const getBulkActions = () => {
    switch (stage) {
      case 'ingest':
        return [
          { label: 'Move to Process', action: 'move_to_process' },
          { label: 'Remove', action: 'remove' }
        ];
      case 'process':
        return [
          { label: 'Update', action: 'update' },
          { label: 'Contact', action: 'contact' },
          { label: 'Remove', action: 'remove' }
        ];
      case 'screening':
        return [
          { label: 'Move to Archive', action: 'move_to_archive' },
          { label: 'Remove', action: 'remove' }
        ];
      case 'results':
        return [
          { label: 'Move to Talents', action: 'move_to_talents' },
          { label: 'Move to Archive', action: 'move_to_archive' },
          { label: 'Remove', action: 'remove' }
        ];
      default:
        return [];
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedCandidates.length === 0) return;

    try {
      const ids = selectedCandidates.map(c => c.id);
      
      switch (action) {
        case 'move_to_process':
          await supabase
            .from('onboarding_candidates')
            .update({ stage: 'process' })
            .in('id', ids);
          break;
        case 'move_to_archive':
          await supabase
            .from('onboarding_candidates')
            .update({ archive_status: true })
            .in('id', ids);
          break;
        case 'remove':
          await supabase
            .from('onboarding_candidates')
            .delete()
            .in('id', ids);
          break;
        case 'contact':
          setIsEmailComposerOpen(true);
          return;
        // Add other actions as needed
      }

      toast({
        title: "Success",
        description: "Selected candidates have been updated",
      });

      setSelectedCandidates([]);
      queryClient.invalidateQueries({ queryKey: ['candidates'] });
    } catch (error) {
      console.error('Error performing bulk action:', error);
      toast({
        title: "Error",
        description: "Failed to update candidates",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return <div>Loading candidates...</div>;
  }

  if (error) {
    return <div>Error loading candidates: {error.message}</div>;
  }

  const filteredCandidates = candidates.filter(candidate => {
    if (statusFilter === "all") return true;
    return candidate.status === statusFilter;
  }).filter(candidate => {
    if (!searchQuery) return true;
    return (
      candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between bg-muted p-4 rounded-lg">
        <div className="flex items-center gap-4">
          <span>{selectedCandidates.length} candidate(s) selected</span>
          <CandidateFilters
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        </div>
        <BulkActions
          selectedCount={selectedCandidates.length}
          actions={getBulkActions()}
          onActionSelect={handleBulkAction}
        />
      </div>

      <CandidateTable
        candidates={filteredCandidates}
        selectedCandidates={selectedCandidates}
        onSelectCandidate={handleSelectCandidate}
        onSelectAll={handleSelectAll}
        stage={stage}
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