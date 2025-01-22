import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { PostgrestError } from "@supabase/supabase-js";

interface PaginationConfig {
  pageSize: number;
  initialPage: number;
}

interface PaginatedData<T> {
  data: T[];
  count: number;
}

export const usePagination = <T>(
  fetchFn: (page: number, pageSize: number) => Promise<PaginatedData<T>>,
  config: PaginationConfig
) => {
  const [page, setPage] = useState(config.initialPage);
  const [data, setData] = useState<T[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<PostgrestError | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      setError(null);
      try {
        const { data: items, count } = await fetchFn(page, config.pageSize);
        setData(items);
        setTotal(count || 0);
      } catch (err) {
        const error = err as PostgrestError;
        setError(error);
        toast({
          title: "Error loading data",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    loadPage();
  }, [page, config.pageSize, toast]);

  const totalPages = Math.ceil(total / config.pageSize);

  return { 
    data, 
    loading, 
    error,
    page, 
    setPage,
    totalPages,
    hasMore: page < totalPages,
    total
  };
};