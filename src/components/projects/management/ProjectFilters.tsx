import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface ProjectFiltersProps {
  filters: {
    status: string;
    type: string;
    clientId: string;
  };
  onChange: (filters: any) => void;
}

export function ProjectFilters({ filters, onChange }: ProjectFiltersProps) {
  const { data: clients } = useQuery({
    queryKey: ["clients"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .order("name");

      if (error) throw error;
      return data;
    },
  });

  const statuses = [
    { value: "draft", label: "Draft" },
    { value: "in_progress", label: "In Progress" },
    { value: "review", label: "Review" },
    { value: "approved", label: "Approved" },
    { value: "completed", label: "Completed" },
  ];

  const types = [
    { value: "ugc", label: "UGC" },
    { value: "translation", label: "Translation" },
    { value: "voiceover", label: "Voice Over" },
  ];

  return (
    <div className="flex flex-wrap gap-4">
      <Select
        value={filters.status}
        onValueChange={(value) => onChange({ ...filters, status: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Statuses</SelectItem>
          {statuses.map((status) => (
            <SelectItem key={status.value} value={status.value}>
              {status.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.type}
        onValueChange={(value) => onChange({ ...filters, type: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Types</SelectItem>
          {types.map((type) => (
            <SelectItem key={type.value} value={type.value}>
              {type.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        value={filters.clientId}
        onValueChange={(value) => onChange({ ...filters, clientId: value })}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Filter by client" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="">All Clients</SelectItem>
          {clients?.map((client) => (
            <SelectItem key={client.id} value={client.id}>
              {client.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}