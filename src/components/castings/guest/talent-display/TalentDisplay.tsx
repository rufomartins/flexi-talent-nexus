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

  const handlePreferenceSet = async (talentId: string, order: number) => {
    try {
      if (!onSelect) return;
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

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      {viewMode === 'grid' ? (
        <TalentGrid
          talents={filteredTalents}
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
          talents={filteredTalents}
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