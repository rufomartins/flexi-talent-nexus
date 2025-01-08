import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table } from "@/components/ui/table";
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
import { ShotList } from "./components/ShotList";
import { useShots } from "./hooks/useShots";
import { useReorderShots } from "./hooks/useReorderShots";
import { useRealTimeShots } from "./hooks/useRealTimeShots";

export function ShotsTab({ shotListId }: { shotListId: string }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingShot, setEditingShot] = useState<Shot | null>(null);
  const { loadingStates, startLoading, stopLoading } = useLoadingState();
  
  const { data: shots, isLoading: isFetchingShots } = useShots(shotListId);
  const { reorderShots } = useReorderShots();
  useRealTimeShots(shotListId);

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
    
    await reorderShots(
      shots,
      result.source.index,
      result.destination.index
    );
  };

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
          <ShotList
            shots={shots || []}
            onDragEnd={handleDragEnd}
            onEdit={handleEdit}
            onDelete={handleDelete}
            isDeleting={loadingStates["delete"] || false}
          />
        </Table>
      </div>
    </div>
  );
}