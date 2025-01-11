import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TalentSearchFilters, TalentSearchSort } from "@/types/talent-search";
import { FilterPanel } from "./FilterPanel";
import { SearchResults } from "./SearchResults";
import { BulkActionsMenu } from "./BulkActionsMenu";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";
import { TalentProfile } from "@/types/talent";

export const TalentSearch = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<TalentSearchFilters>({
    categories: [],
  });
  const [sort, setSort] = useState<TalentSearchSort>({
    field: 'created_at',
    direction: 'desc'
  });
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

  const debouncedFilters = useDebounce(filters, 300);

  const { data: results, isLoading } = useQuery({
    queryKey: ['talents', debouncedFilters, sort],
    queryFn: async () => {
      let query = supabase
        .from('talent_profiles')
        .select(`
          *,
          users!inner (
            id,
            first_name,
            last_name,
            avatar_url
          )
        `)
        .order(sort.field, { ascending: sort.direction === 'asc' });

      if (filters.categories.length > 0) {
        query = query.in('talent_category', filters.categories);
      }

      if (filters.countries?.length) {
        query = query.in('country', filters.countries);
      }

      if (filters.status) {
        query = query.eq('evaluation_status', filters.status);
      }

      const { data, error } = await query;

      if (error) {
        toast({
          title: "Error fetching talents",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      // Transform and validate the data to match TalentProfile interface
      return data.map(talent => {
        // Validate evaluation_status
        const validStatus = (status: string): "approved" | "under_evaluation" | "rejected" => {
          if (status === "approved" || status === "under_evaluation" || status === "rejected") {
            return status;
          }
          return "under_evaluation";
        };

        return {
          ...talent,
          evaluation_status: validStatus(talent.evaluation_status || 'under_evaluation'),
          is_duo: Boolean(talent.is_duo),
          talent_category: talent.talent_category || 'UGC',
        } as TalentProfile;
      });
    },
  });

  const handleSearch = (newFilters: TalentSearchFilters) => {
    setFilters(newFilters);
  };

  const handleSort = (newSort: TalentSearchSort) => {
    setSort(newSort);
  };

  const handleSelect = (talentId: string) => {
    // Navigate to talent profile
    window.location.href = `/talents/${talentId}`;
  };

  const handleSelectionChange = (id: string) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleSelectAll = () => {
    if (results) {
      const allIds = new Set(results.map(talent => talent.id));
      setSelectedIds(allIds);
    }
  };

  const handleClearSelection = () => {
    setSelectedIds(new Set());
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card className="p-6">
        <FilterPanel 
          filters={filters} 
          onChange={handleSearch} 
        />
      </Card>

      {selectedIds.size > 0 && (
        <BulkActionsMenu
          selectedIds={Array.from(selectedIds)}
          onClearSelection={handleClearSelection}
          onSelectAll={handleSelectAll}
        />
      )}

      <SearchResults 
        results={results || []}
        isLoading={isLoading}
        onSelect={handleSelect}
        selectedIds={selectedIds}
        onSelectionChange={handleSelectionChange}
      />
    </div>
  );
};