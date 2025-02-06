import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/types/projects";

interface ProjectOverviewProps {
  project: Project;
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <h3 className="font-medium">Description</h3>
            <p className="text-sm text-muted-foreground">{project.description || 'No description provided'}</p>
          </div>
          <div>
            <h3 className="font-medium">Status</h3>
            <p className="text-sm text-muted-foreground">{project.status}</p>
          </div>
          <div>
            <h3 className="font-medium">Progress</h3>
            <p className="text-sm text-muted-foreground">{project.progress_percentage}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProjectOverview;