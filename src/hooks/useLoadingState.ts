import { useState, useCallback } from 'react';

export const useLoadingState = (initialStates: Record<string, boolean> = {}) => {
  const [loadingStates, setLoadingStates] = useState(initialStates);

  const startLoading = useCallback((key: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: true
    }));
  }, []);

  const stopLoading = useCallback((key: string) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: false
    }));
  }, []);

  const isLoading = useCallback((key: string) => loadingStates[key] ?? false, [loadingStates]);

  return {
    loadingStates,
    startLoading,
    stopLoading,
    isLoading
  };
};