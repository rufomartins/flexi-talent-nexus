import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFilterContext } from "../context";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function ProjectManagerFilter({ className }: { className?: string }) {
  const { filters, updateFilter } = useFilterContext();

  const { data: projectManagers = [] } = useQuery({
    queryKey: ["project-managers"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("users")
        .select("id, full_name")
        .eq("role", "super_user");

      if (error) throw error;
      return data;
    },
  });

  return (
    <div className={className}>
      <Select
        value={filters.projectManagers[0] || ""}
        onValueChange={(value) => updateFilter("projectManagers", [value])}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select project manager" />
        </SelectTrigger>
        <SelectContent>
          {projectManagers.map((pm) => (
            <SelectItem key={pm.id} value={pm.id}>
              {pm.full_name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}