import { Card } from "@/components/ui/card";
import type { Project } from "@/types/projects";

interface ProjectOverviewProps {
  project: Project;
}

export function ProjectOverview({ project }: ProjectOverviewProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Project Overview</h3>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">Description</p>
            <p>{project.description || 'No description provided'}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Start Date</p>
              <p>{project.start_date ? new Date(project.start_date).toLocaleDateString() : 'Not set'}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">End Date</p>
              <p>{project.end_date ? new Date(project.end_date).toLocaleDateString() : 'Not set'}</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ProjectOverview;