import { Card } from "@/components/ui/card";
import type { Project } from "@/types/projects";

interface ProjectTeamProps {
  project: Project;
}

export function ProjectTeam({ project }: ProjectTeamProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Project Team</h3>
        <div className="space-y-4">
          {/* Team member list will be implemented here */}
          <p className="text-muted-foreground">Team members will be displayed here</p>
        </div>
      </Card>
    </div>
  );
}

export default ProjectTeam;