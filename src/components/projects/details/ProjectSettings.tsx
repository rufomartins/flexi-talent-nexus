import { Card } from "@/components/ui/card";
import type { Project } from "@/types/projects";

interface ProjectSettingsProps {
  project: Project;
}

export function ProjectSettings({ project }: ProjectSettingsProps) {
  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h3 className="text-lg font-medium mb-4">Project Settings</h3>
        <div className="space-y-4">
          {/* Settings form will be implemented here */}
          <p className="text-muted-foreground">Project settings will be displayed here</p>
        </div>
      </Card>
    </div>
  );
}

export default ProjectSettings;