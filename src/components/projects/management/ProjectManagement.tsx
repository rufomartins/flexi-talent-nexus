import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProjectHeader } from "./ProjectHeader";
import { ProjectOverview } from "./ProjectOverview";
import { TaskAssignments } from "./TaskAssignments";

export function ProjectManagement() {
  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      <ProjectHeader />
      <Tabs defaultValue="overview" className="w-full">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="assignments">Assignments</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="mt-6">
          <ProjectOverview />
        </TabsContent>
        <TabsContent value="assignments" className="mt-6">
          <TaskAssignments />
        </TabsContent>
      </Tabs>
    </div>
  );
}