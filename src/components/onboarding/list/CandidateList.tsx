import { useState } from "react";
import { CandidateFilters } from "./CandidateFilters";
import { CandidateTable } from "./CandidateTable";
import { BulkActions } from "./BulkActions";
import type { Candidate } from "@/types/onboarding";

interface CandidateListProps {
  candidates: Candidate[];
  isLoading: boolean;
  error: Error | null;
  stage: 'ingest' | 'process' | 'screening' | 'results';
}

export function CandidateList({ candidates, isLoading, error, stage }: CandidateListProps) {
  const [selectedCandidates, setSelectedCandidates] = useState<string[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");

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

  const handleBulkAction = async (action: string) => {
    // Implementation will be added later
    return Promise.resolve();
  };

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
      candidate.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesSearch;
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
            statusFilter={statusFilter}
            onStatusFilterChange={setStatusFilter}
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
          />
        </div>
        <BulkActions
          selectedCount={selectedCandidates.length}
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
    </div>
  );
}