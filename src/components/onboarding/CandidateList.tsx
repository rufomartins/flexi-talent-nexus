import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CandidateFilters } from "./CandidateFilters";
import { CandidateTable } from "./CandidateTable";

interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'new' | 'emailed' | 'interviewed' | 'approved' | 'not_interested';
  scout: {
    id: string;
    full_name: string;
  } | null;
  created_at: string;
}

interface CandidateListProps {
  candidates: Candidate[];
  isLoading: boolean;
  error?: Error | null;
}

export function CandidateList({ candidates, isLoading, error }: CandidateListProps) {
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
      case "not_interested":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (error) {
    return (
      <Alert variant="destructive" className="mb-4">
        <AlertDescription>
          Error loading candidates: {error.message}
        </AlertDescription>
      </Alert>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!candidates.length) {
    return (
      <Card className="p-6">
        <div className="text-center text-muted-foreground">
          No candidates found
        </div>
      </Card>
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