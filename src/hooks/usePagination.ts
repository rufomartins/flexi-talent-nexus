import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface PaginationConfig {
  pageSize: number;
  initialPage: number;
}

export const usePagination = <T>(
  fetchFn: (page: number, pageSize: number) => Promise<T[]>,
  config: PaginationConfig
) => {
  const [page, setPage] = useState(config.initialPage);
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const loadPage = async () => {
      setLoading(true);
      setError(null);
      try {
        const results = await fetchFn(page, config.pageSize);
        setData(results);
      } catch (err) {
        const error = err as Error;
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

  return { 
    data, 
    loading, 
    error,
    page, 
    setPage,
    hasMore: data.length === config.pageSize 
  };
};