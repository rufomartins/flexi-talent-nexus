import { useState, useEffect, useRef } from 'react';
import type { DeepPartial } from '@/types/shared';

export function useAutoSave<T extends object>(
  initialData: T,
  onSave: (data: DeepPartial<T>) => Promise<void>,
  delay = 1000
) {
  const [data, setData] = useState<T>(initialData);
  const [isSaving, setIsSaving] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout>();

  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(async () => {
      try {
        setIsSaving(true);
        await onSave(data);
      } finally {
        setIsSaving(false);
      }
    }, delay);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [data, delay, onSave]);

  return {
    data,
    setData,
    isSaving
  };
}