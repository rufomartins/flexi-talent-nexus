import { useState } from "react";
import { CandidateFilters } from "./CandidateFilters";
import { CandidateTable } from "./CandidateTable";
import type { Candidate } from "@/types/onboarding";

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
      </div>

      <CandidateTable
        candidates={filteredCandidates}
        selectedCandidates={selectedCandidates}
        onSelectCandidate={onCandidateSelect}
        onSelectAll={onSelectAll}
        stage={stage}
        getStatusColor={getStatusColor}
      />
    </div>
  );
}