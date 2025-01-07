import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/utils/notifications";
import { AddShotForm } from "./AddShotForm";
import { useLoadingState } from "@/hooks/useLoadingState";

const statusColors = {
  Pending: "bg-yellow-100 text-yellow-800",
  "In Progress": "bg-blue-100 text-blue-800",
  Completed: "bg-green-100 text-green-800",
};

export function ShotsTab({ shotListId }: { shotListId: string }) {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const queryClient = useQueryClient();
  const { isLoading, startLoading, stopLoading } = useLoadingState({
    delete: false,
  });

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

      return shots;
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
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Shot #</TableHead>
              <TableHead>Location</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Frame Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Notes</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {shots?.map((shot) => (
              <TableRow key={shot.id}>
                <TableCell>{shot.shot_number}</TableCell>
                <TableCell>{shot.location?.name || "—"}</TableCell>
                <TableCell>{shot.description || "—"}</TableCell>
                <TableCell>{shot.frame_type || "—"}</TableCell>
                <TableCell>
                  <Badge
                    className={statusColors[shot.status as keyof typeof statusColors]}
                  >
                    {shot.status}
                  </Badge>
                </TableCell>
                <TableCell>{shot.notes || "—"}</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(shot.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(shot.id)}
                      disabled={isLoading.delete}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {!shots?.length && (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-muted-foreground">
                  No shots added yet
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}