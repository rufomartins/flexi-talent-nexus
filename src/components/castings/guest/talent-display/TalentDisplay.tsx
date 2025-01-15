import { useMemo } from "react";
import { TalentGrid } from "./TalentGrid";
import { TalentList } from "./TalentList";
import type { TalentDisplayProps } from "@/types/guest-filters";

export function TalentDisplay({
  talents,
  viewMode,
  selections,
  onSelect,
  isLoading,
  sort,
  filters,
  castingId,
  guestId,
  savingStatus = {},
  errorMessages = {}
}: TalentDisplayProps) {
  const filteredTalents = useMemo(() => {
    return talents
      .filter(talent => {
        if (filters.search_term) {
          const searchLower = filters.search_term.toLowerCase();
          return talent.users.full_name.toLowerCase().includes(searchLower);
        }
        return true;
      })
      .sort((a, b) => {
        const direction = sort.direction === 'asc' ? 1 : -1;
        
        switch (sort.field) {
          case 'name':
            return direction * a.users.full_name.localeCompare(b.users.full_name);
          case 'date_added':
            return direction * (new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
          case 'favorite':
            const aFavorite = selections[a.id]?.is_favorite ? 1 : 0;
            const bFavorite = selections[b.id]?.is_favorite ? 1 : 0;
            return direction * (bFavorite - aFavorite);
          default:
            return 0;
        }
      });
  }, [talents, sort, filters, selections]);

  return (
    <div className="space-y-6">
      {viewMode === 'grid' ? (
        <TalentGrid
          {...{
            talents: filteredTalents,
            viewMode,
            selections,
            onSelect,
            isLoading,
            sort,
            filters,
            castingId,
            guestId,
            savingStatus,
            errorMessages
          }}
        />
      ) : (
        <TalentList
          {...{
            talents: filteredTalents,
            viewMode,
            selections,
            onSelect,
            isLoading,
            sort,
            filters,
            castingId,
            guestId,
            savingStatus,
            errorMessages
          }}
        />
      )}
    </div>
  );
}