import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import type { CandidateFiltersProps } from "@/types/onboarding";

interface Language {
  id: string;
  name: string;
}

export function CandidateFilters({
  statusFilter,
  onStatusFilterChange,
  searchQuery,
  onSearchQueryChange,
  languageFilter,
  onLanguageFilterChange,
}: CandidateFiltersProps) {
  const [languages, setLanguages] = useState<Language[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function fetchLanguages() {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("languages")
          .select("id, name")
          .order("name");

        if (error) {
          console.error("Error fetching languages:", error);
          return;
        }

        setLanguages(data || []);
      } catch (err) {
        console.error("Error in fetchLanguages:", err);
      } finally {
        setIsLoading(false);
      }
    }

    fetchLanguages();
  }, []);

  return (
    <div className="flex items-center gap-4">
      <div className="flex-1">
        <Input
          placeholder="Search candidates..."
          value={searchQuery}
          onChange={(e) => onSearchQueryChange(e.target.value)}
          className="max-w-sm"
        />
      </div>
      <Select
        value={statusFilter}
        onValueChange={onStatusFilterChange}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All statuses</SelectItem>
          <SelectItem value="new">New</SelectItem>
          <SelectItem value="emailed">Emailed</SelectItem>
          <SelectItem value="interviewed">Interviewed</SelectItem>
          <SelectItem value="approved">Approved</SelectItem>
          <SelectItem value="not_interested">Not Interested</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={languageFilter}
        onValueChange={onLanguageFilterChange}
        disabled={isLoading}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by language" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All languages</SelectItem>
          {languages.map((lang) => (
            <SelectItem key={lang.id} value={lang.name}>
              {lang.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}