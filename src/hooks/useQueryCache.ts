import { useQuery } from "@tanstack/react-query";

interface CacheConfig {
  maxAge: number;
  staleTime: number;
}

const defaultConfig: CacheConfig = {
  maxAge: 5 * 60 * 1000, // 5 minutes
  staleTime: 30 * 1000   // 30 seconds
};

export const useQueryCache = <T>(
  key: string,
  fetchFn: () => Promise<T>,
  config?: Partial<CacheConfig>
) => {
  const { maxAge, staleTime } = { ...defaultConfig, ...config };
  
  return useQuery({
    queryKey: [key],
    queryFn: fetchFn,
    staleTime,
    gcTime: maxAge,
    refetchOnWindowFocus: false
  });
};