import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LayoutGrid, List, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
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
  
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

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
        [selection.talent_id]: {
          id: selection.id,
          casting_id: selection.casting_id,
          talent_id: selection.talent_id,
          guest_id: selection.guest_id,
          preference_order: selection.preference_order,
          comments: selection.comments,
          is_favorite: selection.liked || false,
          status: selection.status || 'shortlisted',
          created_at: selection.created_at,
          updated_at: selection.updated_at
        } as GuestSelection,
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
        liked: update.is_favorite,
        comments: update.comments,
        preference_order: update.preference_order,
        status: update.status || 'shortlisted'
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
      <div className="bg-white rounded-lg shadow p-4 mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          {/* View Toggle */}
          <div className="flex gap-2">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'outline'}
              onClick={() => setViewMode('grid')}
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              onClick={() => setViewMode('list')}
            >
              <List className="w-4 h-4" />
            </Button>
          </div>

          {/* Search Input */}
          <div className="flex-grow max-w-md">
            <Input
              placeholder="Search talents..."
              value={filters.search_term}
              onChange={(e) => setFilters(prev => ({
                ...prev,
                search_term: e.target.value
              }))}
              className="w-full"
            />
          </div>

          {/* Sort Controls */}
          <Select
            value={`${sort.field}-${sort.direction}`}
            onValueChange={(value) => {
              const [field, direction] = value.split('-') as [SortField, SortDirection];
              setSort({ field, direction });
            }}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name (A-Z)</SelectItem>
              <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              <SelectItem value="favorite-asc">Favorites (Low to High)</SelectItem>
              <SelectItem value="favorite-desc">Favorites (High to Low)</SelectItem>
            </SelectContent>
          </Select>

          {/* Filter by Selection Status */}
          <Select
            value={filters.show_only_available ? 'selected' : 'all'}
            onValueChange={(value) => 
              setFilters(prev => ({ 
                ...prev, 
                show_only_available: value === 'selected'
              }))
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Talents</SelectItem>
              <SelectItem value="selected">Selected Only</SelectItem>
              <SelectItem value="unselected">Unselected Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
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