import { useState, useMemo } from "react";
import { ViewControls } from "./ViewControls";
import { TalentGrid } from "./TalentGrid";
import { TalentList } from "./TalentList";
import type { TalentDisplayProps } from "./types";
import { useToast } from "@/hooks/use-toast";

export function TalentDisplay({
  talents,
  viewMode,
  sort,
  filters,
  castingId,
  guestId,
  selections = {},
  onSelect,
  isLoading,
  savingStatus = {},
  errorMessages = {}
}: TalentDisplayProps) {
  const { toast } = useToast();

  const handlePreferenceSet = async (talentId: string, order: number) => {
    try {
      if (!onSelect) return;

      // Check for duplicate preference order
      const existingSelection = Object.values(selections).find(
        s => s.preference_order === order && s.talent_id !== talentId
      );
      
      if (existingSelection) {
        toast({
          title: "Duplicate Preference",
          description: `Preference order ${order} is already assigned to another talent`,
          variant: "destructive"
        });
        return;
      }

      await onSelect(talentId, { preference_order: order });
      
      toast({
        title: "Selection Saved",
        description: "Your preference has been updated",
      });
    } catch (error) {
      console.error("Error setting preference:", error);
      toast({
        title: "Error",
        description: "Failed to save your preference",
        variant: "destructive"
      });
    }
  };

  const handleCommentAdd = async (talentId: string, comment: string) => {
    try {
      if (!onSelect) return;
      
      await onSelect(talentId, { comments: comment });
      toast({
        title: "Comment Saved",
        description: "Your comment has been updated",
      });
    } catch (error) {
      console.error("Error adding comment:", error);
      toast({
        title: "Error",
        description: "Failed to save your comment",
        variant: "destructive"
      });
    }
  };

  const filteredAndSortedTalents = useMemo(() => {
    return talents
      .filter(talent => 
        talent.users.full_name.toLowerCase().includes(filters.search.toLowerCase()) ||
        talent.native_language?.toLowerCase().includes(filters.search.toLowerCase())
      )
      .sort((a, b) => {
        if (sort.field === 'name') {
          return sort.direction === 'asc'
            ? a.users.full_name.localeCompare(b.users.full_name)
            : b.users.full_name.localeCompare(a.users.full_name);
        }
        if (sort.field === 'preferenceOrder') {
          const orderA = selections[a.id]?.preference_order || 0;
          const orderB = selections[b.id]?.preference_order || 0;
          return sort.direction === 'asc' ? orderA - orderB : orderB - orderA;
        }
        return 0;
      });
  }, [talents, filters.search, sort, selections]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {viewMode === 'grid' ? (
        <TalentGrid
          talents={filteredAndSortedTalents}
          viewMode={viewMode}
          sort={sort}
          filters={filters}
          castingId={castingId}
          guestId={guestId}
          selections={selections}
          onSelect={onSelect}
          isLoading={isLoading}
          savingStatus={savingStatus}
          errorMessages={errorMessages}
        />
      ) : (
        <TalentList
          talents={filteredAndSortedTalents}
          viewMode={viewMode}
          sort={sort}
          filters={filters}
          castingId={castingId}
          guestId={guestId}
          selections={selections}
          onSelect={onSelect}
          isLoading={isLoading}
          savingStatus={savingStatus}
          errorMessages={errorMessages}
        />
      )}
    </div>
  );
}