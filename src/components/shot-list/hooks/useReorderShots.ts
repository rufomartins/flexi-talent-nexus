import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/utils/notifications";
import { Shot } from "@/types/shot-list";

export const useReorderShots = () => {
  const queryClient = useQueryClient();

  const reorderShots = async (shots: Shot[], sourceIndex: number, destinationIndex: number) => {
    const items = Array.from(shots);
    const [reorderedItem] = items.splice(sourceIndex, 1);
    items.splice(destinationIndex, 0, reorderedItem);

    // Update sequence_order for affected shots
    const updates = items.map((shot, index) => ({
      id: shot.id,
      shot_number: shot.shot_number,
      shot_list_id: shot.shot_list_id,
      sequence_order: index + 1,
      location_id: shot.location_id,
      description: shot.description,
      frame_type: shot.frame_type,
      status: shot.status,
      notes: shot.notes
    }));

    try {
      // Optimistically update the cache
      queryClient.setQueryData(["shots", shots[0].shot_list_id], items);

      const { error } = await supabase
        .from("shots")
        .upsert(updates, { 
          onConflict: "id",
          ignoreDuplicates: false 
        });

      if (error) {
        // Revert optimistic update on error
        queryClient.invalidateQueries({ queryKey: ["shots"] });
        notify.error("Failed to update shot order");
        return;
      }

      notify.success("Shot order updated successfully");
    } catch (error) {
      console.error("Error updating shot order:", error);
      queryClient.invalidateQueries({ queryKey: ["shots"] });
      notify.error("An error occurred while updating shot order");
    }
  };

  return { reorderShots };
};