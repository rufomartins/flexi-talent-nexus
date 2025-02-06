import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/types/projects";

interface ProjectDocumentsProps {
  project: Project;
}

export function ProjectDocuments({ project }: ProjectDocumentsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Documents</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Project documents will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProjectDocuments;