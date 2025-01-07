import { TalentProfileField } from "@/types/talent-fields";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Edit, Trash } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface FieldsListProps {
  fields: TalentProfileField[];
}

export const FieldsList = ({ fields }: FieldsListProps) => {
  const queryClient = useQueryClient();

  const toggleActive = useMutation({
    mutationFn: async ({ id, is_active }: { id: string; is_active: boolean }) => {
      const { error } = await supabase
        .from("talent_profile_fields")
        .update({ is_active })
        .eq("id", id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["talent-profile-fields"] });
      toast.success("Field updated successfully");
    },
    onError: (error) => {
      toast.error("Failed to update field");
      console.error("Error updating field:", error);
    },
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Label</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Tab</TableHead>
          <TableHead>Required</TableHead>
          <TableHead>Active</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {fields.map((field) => (
          <TableRow key={field.id}>
            <TableCell>{field.label}</TableCell>
            <TableCell>
              <Badge variant="secondary">
                {field.field_type}
              </Badge>
            </TableCell>
            <TableCell>{field.tab}</TableCell>
            <TableCell>
              <Badge variant={field.is_required ? "default" : "outline"}>
                {field.is_required ? "Required" : "Optional"}
              </Badge>
            </TableCell>
            <TableCell>
              <Switch
                checked={field.is_active}
                onCheckedChange={(checked) => 
                  toggleActive.mutate({ id: field.id, is_active: checked })
                }
              />
            </TableCell>
            <TableCell>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Edit className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};