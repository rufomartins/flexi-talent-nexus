import { useState, useCallback, useEffect } from "react";
import { debounce } from "lodash";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export interface AutoSaveConfig {
  debounceTime: number;
  tableName: string;
  idField: string;
}

export const useAutoSave = (formData: any, config: AutoSaveConfig) => {
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  const debouncedSave = useCallback(
    debounce(async (data) => {
      if (!data[config.idField]) return;
      
      setSaving(true);
      try {
        const { error } = await supabase
          .from(config.tableName)
          .update(data)
          .eq(config.idField, data[config.idField]);

        if (error) throw error;
        
        setLastSaved(new Date());
      } catch (error) {
        console.error("Auto-save error:", error);
        toast({
          title: "Auto-save failed",
          description: "Your changes couldn't be saved automatically. Please try saving manually.",
          variant: "destructive",
        });
      } finally {
        setSaving(false);
      }
    }, config.debounceTime),
    [config.tableName, config.idField, config.debounceTime]
  );

  useEffect(() => {
    if (formData.isDirty) {
      debouncedSave(formData.values);
    }
  }, [formData.values, debouncedSave, formData.isDirty]);

  return { saving, lastSaved };
};