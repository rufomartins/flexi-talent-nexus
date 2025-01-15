import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ViewControls } from "./talent-display/ViewControls";
import { SearchFilterBar } from "./talent-display/SearchFilterBar";
import { TalentDisplay } from "./talent-display/TalentDisplay";
import { SelectionSummary } from "./SelectionSummary";
import { supabase } from "@/integrations/supabase/client";
import type { TalentProfile } from "@/types/talent";
import type { FilterState, SortField, SortDirection } from "@/types/guest-filters";
import type { GuestSelection } from "@/types/supabase/guest-selection";

interface GuestViewPageProps {
  castingId: string;
  guestId: string;
}

export function GuestViewPage({ castingId, guestId }: GuestViewPageProps) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [sort, setSort] = useState<{field: SortField; direction: SortDirection}>({
    field: 'name',
    direction: 'asc'
  });
  
  const [filters, setFilters] = useState<FilterState>({
    search_term: '',
    show_only_available: false,
    filter_out_rejected: false,
    show_only_approved_auditions: false,
  });

  const { data: talents, isLoading: talentsLoading } = useQuery({
    queryKey: ['casting-talents', castingId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('casting_talents')
        .select(`
          talent_profiles!inner (
            id,
            user_id,
            talent_category,
            country,
            native_language,
            evaluation_status,
            is_duo,
            created_at,
            updated_at,
            users!user_id!inner (
              id,
              full_name,
              avatar_url
            )
          )
        `)
        .eq('casting_id', castingId);
      
      if (error) throw error;
      
      return data?.map(item => ({
        ...item.talent_profiles,
        users: {
          id: item.talent_profiles.users.id,
          full_name: item.talent_profiles.users.full_name,
          avatar_url: item.talent_profiles.users.avatar_url
        }
      })) as TalentProfile[];
    }
  });

  const { data: selections = {}, isLoading: selectionsLoading } = useQuery({
    queryKey: ['guest-selections', castingId, guestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guest_selections')
        .select('*')
        .eq('casting_id', castingId)
        .eq('guest_id', guestId);

      if (error) throw error;

      return data.reduce((acc, selection) => ({
        ...acc,
        [selection.talent_id]: selection as GuestSelection,
      }), {} as Record<string, GuestSelection>);
    }
  });

  const handleSelect = async (talentId: string, update: Partial<GuestSelection>) => {
    const { error } = await supabase
      .from('guest_selections')
      .upsert({
        casting_id: castingId,
        guest_id: guestId,
        talent_id: talentId,
        ...update
      });

    if (error) {
      console.error("Error updating selection:", error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header Section */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-2">Talent Selection</h1>
        <p className="text-gray-600">
          Select your preferred talents by assigning numbers from 1-20.
        </p>
      </div>

      {/* Selection Summary */}
      <div className="mb-6">
        <SelectionSummary castingId={castingId} guestId={guestId} />
      </div>

      {/* Controls Section */}
      <div className="bg-white rounded-lg shadow p-4 mb-6 space-y-4">
        <ViewControls
          viewMode={viewMode}
          onViewChange={setViewMode}
          sortOption={sort}
          onSortChange={setSort}
        />
        <SearchFilterBar
          filters={filters}
          onFilterChange={setFilters}
        />
      </div>

      {/* Talents Display */}
      {talentsLoading || selectionsLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <TalentDisplay
          talents={talents || []}
          viewMode={viewMode}
          sort={sort}
          filters={filters}
          castingId={castingId}
          guestId={guestId}
          selections={selections}
          onSelect={handleSelect}
          isLoading={talentsLoading || selectionsLoading}
        />
      )}
    </div>
  );
}