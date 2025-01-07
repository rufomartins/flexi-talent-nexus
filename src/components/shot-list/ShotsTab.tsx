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
import { useLoadingState } from "@/hooks/useLoadingState";
import { Shot } from "@/types/shot-list";
import { ShotTableHeader } from "./components/ShotTableHeader";
import { ShotTableRow } from "./components/ShotTableRow";

export function ShotsTab({ shotListId }: { shotListId: string }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { isLoading, startLoading, stopLoading } = useLoadingState();

  const { data: shots, isLoading: isFetchingShots } = useQuery({
    queryKey: ["shots", shotListId],
    queryFn: async () => {
      const { data: shots, error } = await supabase
        .from("shots")
        .select(`
          *,
          location:locations(name)
        `)
        .eq("shot_list_id", shotListId)
        .order("sequence_order", { ascending: true });

      if (error) {
        notify.error("Failed to load shots");
        throw error;
      }

      return shots.map(shot => ({
        ...shot,
        location: shot.location as { name: string | null } | null
      })) as Shot[];
    },
  });

  const handleDelete = async (shotId: string) => {
    if (!confirm("Are you sure you want to delete this shot?")) return;

    startLoading("delete");
    const { error } = await supabase
      .from("shots")
      .delete()
      .eq("id", shotId);

    if (error) {
      notify.error("Failed to delete shot");
      console.error("Error deleting shot:", error);
    } else {
      notify.success("Shot deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["shots"] });
    }
    stopLoading("delete");
  };

  const handleEdit = (shotId: string) => {
    // TODO: Implement edit functionality
    console.log("Edit shot:", shotId);
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

      <div className="border rounded-md">
        <Table>
          <ShotTableHeader />
          <TableBody>
            {shots?.map((shot) => (
              <ShotTableRow
                key={shot.id}
                shot={shot}
                onEdit={handleEdit}
                onDelete={handleDelete}
                isDeleting={isLoading.delete}
              />
            ))}
            {!shots?.length && (
              <tr>
                <td colSpan={7} className="text-center text-muted-foreground p-4">
                  No shots added yet
                </td>
              </tr>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
