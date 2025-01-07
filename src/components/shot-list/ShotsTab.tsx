import { useState, useEffect } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody } from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/utils/notifications";
import { AddShotForm } from "./AddShotForm";
import { EditShotForm } from "./EditShotForm";
import { useLoadingState } from "@/hooks/useLoadingState";
import { Shot } from "@/types/shot-list";
import { ShotTableHeader } from "./components/ShotTableHeader";
import { ShotTableRow } from "./components/ShotTableRow";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export function ShotsTab({ shotListId }: { shotListId: string }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingShot, setEditingShot] = useState<Shot | null>(null);
  const queryClient = useQueryClient();
  const { loadingStates, startLoading, stopLoading } = useLoadingState();

  const { data: shots, isLoading: isFetchingShots } = useQuery({
    queryKey: ["shots", shotListId],
    queryFn: async () => {
      const { data: shots, error } = await supabase
        .from("shots")
        .select(`
          *,
          location:locations (
            id,
            name
          )
        `)
        .eq("shot_list_id", shotListId)
        .order("sequence_order", { ascending: true });

      if (error) {
        notify.error("Failed to load shots");
        throw error;
      }

      return shots as Shot[];
    },
  });

  const handleDelete = async (shotId: string) => {
    if (!confirm("Are you sure you want to delete this shot?")) return;

    startLoading("delete");
    try {
      const { error } = await supabase
        .from("shots")
        .delete()
        .match({ id: shotId });

      if (error) {
        notify.error("Failed to delete shot");
        console.error("Error deleting shot:", error);
      } else {
        notify.success("Shot deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["shots"] });
      }
    } catch (error) {
      notify.error("An unexpected error occurred");
      console.error("Error in handleDelete:", error);
    } finally {
      stopLoading("delete");
    }
  };

  const handleEdit = (shotId: string) => {
    const shot = shots?.find(s => s.id === shotId);
    if (shot) {
      setEditingShot(shot);
    }
  };

  const handleDragEnd = async (result: any) => {
    if (!result.destination || !shots) return;

    const items = Array.from(shots);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    // Update sequence_order for affected shots
    const updates = items.map((shot, index) => ({
      id: shot.id,
      sequence_order: index + 1,
    }));

    try {
      const { error } = await supabase
        .from("shots")
        .upsert(updates, { onConflict: "id" });

      if (error) {
        notify.error("Failed to update shot order");
        return;
      }

      queryClient.invalidateQueries({ queryKey: ["shots"] });
    } catch (error) {
      console.error("Error updating shot order:", error);
      notify.error("An error occurred while updating shot order");
    }
  };

  // Set up real-time subscription
  useEffect(() => {
    const channel = supabase
      .channel("shots-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "shots",
          filter: `shot_list_id=eq.${shotListId}`,
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["shots"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [shotListId, queryClient]);

  if (isFetchingShots) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Shots</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Add Shot
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Shot</DialogTitle>
            </DialogHeader>
            <AddShotForm
              shotListId={shotListId}
              onSuccess={() => setIsAddDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      <Dialog open={!!editingShot} onOpenChange={(open) => !open && setEditingShot(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Shot</DialogTitle>
          </DialogHeader>
          {editingShot && (
            <EditShotForm
              shot={editingShot}
              onSuccess={() => setEditingShot(null)}
            />
          )}
        </DialogContent>
      </Dialog>

      <div className="border rounded-md">
        <Table>
          <ShotTableHeader />
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="shots">
              {(provided) => (
                <TableBody
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {shots?.map((shot, index) => (
                    <Draggable
                      key={shot.id}
                      draggableId={shot.id}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <ShotTableRow
                            shot={shot}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            isDeleting={loadingStates["delete"] || false}
                          />
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                  {!shots?.length && (
                    <tr>
                      <td colSpan={7} className="text-center text-muted-foreground p-4">
                        No shots added yet
                      </td>
                    </tr>
                  )}
                </TableBody>
              )}
            </Droppable>
          </DragDropContext>
        </Table>
      </div>
    </div>
  );
}