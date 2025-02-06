import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/types/projects";

interface ProjectTeamProps {
  project: Project;
}

export function ProjectTeam({ project }: ProjectTeamProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Team</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Team members will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProjectTeam;