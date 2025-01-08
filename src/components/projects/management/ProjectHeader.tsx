import { Button } from "@/components/ui/button";
import { Plus, Filter } from "lucide-react";

export function ProjectHeader() {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h1 className="text-2xl font-semibold">Project Management</h1>
        <p className="text-muted-foreground mt-1">Manage your project tasks and assignments</p>
      </div>
      <div className="flex gap-3">
        <Button variant="outline" size="sm">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
        <Button size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
      </div>
    </div>
  );
}