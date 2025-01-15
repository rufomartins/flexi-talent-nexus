import { TalentCard } from "./TalentCard";
import { ViewControls } from "./ViewControls";
import { useState } from "react";
import type { TalentProfile } from "@/types/talent";
import type { GuestSelection } from "@/types/supabase/guest-selection";

interface TalentDisplayProps {
  talents: TalentProfile[];
  viewMode: 'grid' | 'list';
  selections: Record<string, GuestSelection>;
  onSelect: (talentId: string, update: Partial<GuestSelection>) => Promise<void>;
  isLoading: boolean;
}

export function TalentDisplay({
  talents,
  viewMode,
  selections,
  onSelect,
  isLoading
}: TalentDisplayProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOption, setSortOption] = useState<{ field: string; direction: 'asc' | 'desc' }>({ 
    field: 'name', 
    direction: 'asc' 
  });

  const handlePreferenceSet = async (talentId: string, order: number) => {
    await onSelect(talentId, { preference_order: order });
  };

  const handleCommentAdd = async (talentId: string, comment: string) => {
    await onSelect(talentId, { comments: comment });
  };

  const filteredAndSortedTalents = talents
    .filter(talent => 
      talent.users.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      talent.native_language?.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption.field === 'name') {
        return sortOption.direction === 'asc'
          ? a.users.full_name.localeCompare(b.users.full_name)
          : b.users.full_name.localeCompare(a.users.full_name);
      }
      if (sortOption.field === 'preferenceOrder') {
        const orderA = selections[a.id]?.preference_order || 0;
        const orderB = selections[b.id]?.preference_order || 0;
        return sortOption.direction === 'asc' ? orderA - orderB : orderB - orderA;
      }
      return 0;
    });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <ViewControls
        viewMode={viewMode}
        onViewChange={() => {}}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        sortOption={sortOption}
        onSortChange={setSortOption}
      />
      
      <div className={
        viewMode === 'grid' 
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }>
        {filteredAndSortedTalents.map(talent => (
          <TalentCard
            key={talent.id}
            talent={talent}
            selection={selections[talent.id]}
            onPreferenceSet={(order) => handlePreferenceSet(talent.id, order)}
            onCommentAdd={(comment) => handleCommentAdd(talent.id, comment)}
            view={viewMode}
          />
        ))}
      </div>
    </div>
  );
}