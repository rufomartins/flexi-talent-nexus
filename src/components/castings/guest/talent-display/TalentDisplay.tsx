import { TalentGrid } from "./TalentGrid";
import { TalentList } from "./TalentList";
import type { TalentDisplayProps } from "@/types/guest-filters";

export function TalentDisplay({
  talents,
  viewMode,
  selections,
  selectedTalents,
  onSelect,
  onTalentSelect,
  onMultipleSelect,
  onReorder,
  onRemove,
  isLoading,
  sort,
  filters,
  castingId,
  guestId,
  savingStatus = {},
  errorMessages = {}
}: TalentDisplayProps) {
  return viewMode === 'grid' ? (
    <TalentGrid
      talents={talents}
      viewMode="grid"
      selections={selections}
      selectedTalents={selectedTalents}
      onSelect={onSelect}
      onTalentSelect={onTalentSelect}
      onMultipleSelect={onMultipleSelect}
      onReorder={onReorder}
      onRemove={onRemove}
      isLoading={isLoading}
      sort={sort}
      filters={filters}
      castingId={castingId}
      guestId={guestId}
      savingStatus={savingStatus}
      errorMessages={errorMessages}
    />
  ) : (
    <TalentList
      talents={talents}
      viewMode="list"
      selections={selections}
      selectedTalents={selectedTalents}
      onSelect={onSelect}
      onTalentSelect={onTalentSelect}
      onMultipleSelect={onMultipleSelect}
      onReorder={onReorder}
      onRemove={onRemove}
      isLoading={isLoading}
      sort={sort}
      filters={filters}
      castingId={castingId}
      guestId={guestId}
      savingStatus={savingStatus}
      errorMessages={errorMessages}
    />
  );
}