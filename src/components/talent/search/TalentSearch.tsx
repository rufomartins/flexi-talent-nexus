import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { TalentSearchFilters, TalentSearchSort } from "@/types/talent-search";
import { FilterPanel } from "./FilterPanel";
import { SearchResults } from "./SearchResults";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useDebounce } from "@/hooks/useDebounce";

export const TalentSearch = () => {
  const { toast } = useToast();
  const [filters, setFilters] = useState<TalentSearchFilters>({
    categories: [],
  });
  const [sort, setSort] = useState<TalentSearchSort>({
    field: 'created_at',
    direction: 'desc'
  });

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

      return data;
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

  return (
    <div className="container mx-auto py-6 space-y-6">
      <Card className="p-6">
        <FilterPanel 
          filters={filters} 
          onChange={handleSearch} 
        />
      </Card>

      <SearchResults 
        results={results || []}
        isLoading={isLoading}
        onSelect={handleSelect}
      />
    </div>
  );
};