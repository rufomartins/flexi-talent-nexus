import { Button } from "@/components/ui/button";
import { Plus, Download } from "lucide-react";

export function ProjectHeader() {
  return (
    <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-semibold">Projects</h1>
      <div className="flex gap-2">
        <Button variant="outline" size="sm">
          <Plus className="h-4 w-4 mr-2" />
          New Task
        </Button>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Export
        </Button>
      </div>
    </div>
  );
}