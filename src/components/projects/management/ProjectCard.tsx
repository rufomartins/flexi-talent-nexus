import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
  project: any; // Will be properly typed once we have the full Project type
  onClick: () => void;
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "draft":
        return "bg-gray-100 text-gray-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "review":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={onClick}>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-medium">{project.name}</CardTitle>
          <Badge className={getStatusColor(project.status)}>
            {project.status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center text-sm text-gray-500 space-x-4">
          <div className="flex items-center">
            <Users className="h-4 w-4 mr-1" />
            <span>{project.client?.name || "No Client"}</span>
          </div>
          <div className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1" />
            <span>
              {project.created_at
                ? `Created ${formatDistanceToNow(new Date(project.created_at))} ago`
                : "Date not set"}
            </span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progress</span>
            <span>{project.completion_percentage || 0}%</span>
          </div>
          <Progress value={project.completion_percentage || 0} />
        </div>

        <div className="flex flex-wrap gap-2">
          {project.project_countries?.map((country: any) => (
            <Badge key={country.id} variant="outline">
              {country.country_name}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}