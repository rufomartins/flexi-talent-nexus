import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { CandidateFilters } from "./CandidateFilters";
import { CandidateTable } from "./CandidateTable";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'emailed' | 'interviewed' | 'approved';
  scout: {
    id: string;
    full_name: string;
  } | null;
  created_at: string;
}

interface CandidateListProps {
  candidates: Candidate[];
  isLoading: boolean;
}

export function CandidateList({ candidates, isLoading }: CandidateListProps) {
  const [statusFilter, setStatusFilter] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCandidates = candidates.filter((candidate) => {
    const matchesStatus = statusFilter ? candidate.status === statusFilter : true;
    const matchesSearch = searchQuery
      ? candidate.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        candidate.email.toLowerCase().includes(searchQuery.toLowerCase())
      : true;
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "interviewed":
        return "bg-blue-100 text-blue-800";
      case "emailed":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <Card>
      <div className="p-4 space-y-4">
        <CandidateFilters
          statusFilter={statusFilter}
          onStatusFilterChange={setStatusFilter}
          searchQuery={searchQuery}
          onSearchQueryChange={setSearchQuery}
        />

        <CandidateTable 
          candidates={filteredCandidates}
          getStatusColor={getStatusColor}
        />
      </div>
    </Card>
  );
}