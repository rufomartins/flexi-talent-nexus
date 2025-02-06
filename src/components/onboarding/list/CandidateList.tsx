import { useState } from "react";
import { CandidateFilters } from "./CandidateFilters";
import { CandidateTable } from "./CandidateTable";
import { CandidateBulkActions } from "./CandidateBulkActions";
import { Candidate } from "@/types/onboarding";

interface CandidateListProps {
  candidates: Candidate[];
  onCandidateSelect: (candidate: Candidate) => void;
  selectedCandidates: Candidate[];
  onSelectAll: (checked: boolean) => void;
  stage: 'ingest' | 'process' | 'screening' | 'results';
}

export function CandidateList({
  candidates,
  onCandidateSelect,
  selectedCandidates,
  onSelectAll,
  stage
}: CandidateListProps) {
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesStatus = statusFilter === "all" || candidate.status === statusFilter;
    const matchesSearch = searchQuery === "" || 
      candidate.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      candidate.email?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLanguage = languageFilter === "all" || 
      candidate.native_language === languageFilter;

    return matchesStatus && matchesSearch && matchesLanguage;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <CandidateFilters
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
          languageFilter={languageFilter}
          onLanguageFilterChange={setLanguageFilter}
        />
        {selectedCandidates.length > 0 && (
          <CandidateBulkActions
            selectedCandidates={selectedCandidates}
            stage={stage}
          />
        )}
      </div>

      <CandidateTable
        candidates={filteredCandidates}
        selectedCandidates={selectedCandidates}
        onSelectCandidate={onCandidateSelect}
        onSelectAll={onSelectAll}
        stage={stage}
      />
    </div>
  );
}