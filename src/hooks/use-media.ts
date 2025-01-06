import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface UpdateMediaParams {
  id: string;
  position?: number;
  is_profile?: boolean;
  is_shared?: boolean;
}

export const useUpdateMediaMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...updates }: UpdateMediaParams) => {
      const { error } = await supabase
        .from("talent_media")
        .update(updates)
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talent-media"] });
    },
  });
};