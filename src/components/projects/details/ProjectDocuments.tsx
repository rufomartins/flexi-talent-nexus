import { Card } from "@/components/ui/card";
import type { Project } from "@/types/projects";

interface ProjectDocumentsProps {
  project: Project;
}

export function ProjectDocuments({ project }: ProjectDocumentsProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Project Documents</h3>
        <div className="space-y-4">
          {/* Document list will be implemented here */}
          <p className="text-muted-foreground">Project documents will be displayed here</p>
        </div>
      </Card>
    </div>
  );
}

export default ProjectDocuments;