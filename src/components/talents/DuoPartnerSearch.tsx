import { useState } from "react";
import { Label } from "@/components/ui/label";
import type { DuoPartner } from "@/types/talent";
import { SearchInput } from "./duo-partner/SearchInput";
import { SearchResults } from "./duo-partner/SearchResults";
import { useDuoPartnerSearch } from "@/hooks/useDuoPartnerSearch";

interface DuoPartnerSearchProps {
  onSelect: (partner: DuoPartner) => void;
  currentTalentId?: string;
  existingPartnerId?: string;
}

export function DuoPartnerSearch({
  onSelect,
  currentTalentId,
  existingPartnerId
}: DuoPartnerSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const { data: searchResults, isLoading } = useDuoPartnerSearch(searchQuery, currentTalentId);

  return (
    <div className="space-y-2">
      <Label>Search Partner</Label>
      <div className="relative">
        <SearchInput
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value);
          }}
        />
        {searchResults.length > 0 && (
          <SearchResults
            results={searchResults}
            isLoading={isLoading}
            onSelect={(partner) => {
              onSelect(partner);
              setSearchQuery("");
            }}
          />
        )}
      </div>
    </div>
  );
}