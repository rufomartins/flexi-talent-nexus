import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Project } from "@/types/projects";

interface ProjectSettingsProps {
  project: Project;
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Project Settings</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <p className="text-sm text-muted-foreground">Project settings will be displayed here</p>
        </div>
      </CardContent>
    </Card>
  );
}

export default ProjectSettings;