import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { CandidateFilters } from "./CandidateFilters";
import { CandidateTable } from "./CandidateTable";
import { BulkActions } from "./list/BulkActions";
import { EmailAndSmsComposer } from "./communication/EmailAndSmsComposer";
import type { Candidate } from "@/types/onboarding";

interface CandidateListProps {
  candidates: Candidate[];
  isLoading: boolean;
  error: Error | null;
  stage: 'ingest' | 'process' | 'screening' | 'results';
}

export function CandidateList({ candidates, isLoading, error, stage }: CandidateListProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [isEmailComposerOpen, setIsEmailComposerOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'new':
        return 'bg-blue-100 text-blue-800';
      case 'emailed':
        return 'bg-yellow-100 text-yellow-800';
      case 'interviewed':
        return 'bg-purple-100 text-purple-800';
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'not_interested':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  useEffect(() => {
    const channel = supabase
      .channel('status-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'onboarding_candidates'
        },
        (payload) => {
          console.log('Candidate updated:', payload);
          queryClient.invalidateQueries({ queryKey: ['onboarding-candidates'] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  const handleSelectCandidate = (candidate: Candidate) => {
    setSelectedCandidates(prev => 
      prev.includes(candidate.id) 
        ? prev.filter(id => id !== candidate.id)
        : [...prev, candidate.id]
    );
  };

  const handleSelectAll = (checked: boolean) => {
    setSelectedCandidates(checked ? candidates.map(c => c.id) : []);
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
      switch (action) {
        case 'move_to_process':
          await supabase
            .from('onboarding_candidates')
            .update({ stage: 'process' })
            .in('id', selectedCandidates);
          break;
        case 'move_to_archive':
          await supabase
            .from('onboarding_candidates')
            .update({ archive_status: true })
            .in('id', selectedCandidates);
          break;
        case 'remove':
          await supabase
            .from('onboarding_candidates')
            .delete()
            .in('id', selectedCandidates);
          break;
        case 'contact':
          setIsEmailComposerOpen(true);
          return;
      }

      toast({
        title: "Success",
        description: "Selected candidates have been updated",
      });

      setSelectedCandidates([]);
      queryClient.invalidateQueries({ queryKey: ['onboarding-candidates'] });
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
    if (statusFilter !== "all" && candidate.status !== statusFilter) return false;
    if (!searchQuery) return true;
    
    return (
      candidate.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
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
        getStatusColor={getStatusColor}
      />

      <EmailAndSmsComposer
        open={isEmailComposerOpen}
        onOpenChange={setIsEmailComposerOpen}
        selectedCandidates={candidates.filter(c => selectedCandidates.includes(c.id)).map(c => ({
          id: c.id,
          name: c.name,
          first_name: c.first_name,
          last_name: c.last_name,
          email: c.email,
          phone: c.phone
        }))}
      />
    </div>
  );
}
