import { useNavigate, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Share2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/utils/notifications";

export default function ShotList() {
  const navigate = useNavigate();
  const { taskId } = useParams();

  const { data: taskDetails, isLoading } = useQuery({
    queryKey: ['shot-list', taskId],
    queryFn: async () => {
      const { data: task, error: taskError } = await supabase
        .from('project_tasks')
        .select(`
          id,
          name,
          script_status,
          translation_status,
          review_status,
          talent_status,
          delivery_status,
          project_languages!inner (
            language_name,
            project_countries!inner (
              country_name,
              projects!inner (
                id,
                name
              )
            )
          )
        `)
        .eq('id', taskId)
        .single();

      if (taskError) {
        console.error('Error fetching task details:', taskError);
        notify.error('Failed to load task details');
        throw taskError;
      }

      return task;
    },
    enabled: !!taskId,
  });

  if (isLoading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const handleBack = () => {
    navigate('/projects');
  };

  return (
    <div className="container max-w-7xl mx-auto p-6 space-y-6">
      {/* Header Section */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="h-9 w-9" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-semibold">{taskDetails?.name}</h1>
            <p className="text-sm text-muted-foreground">
              Task ID: #{taskId?.slice(0, 8)}
            </p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
      </div>
      
      {/* Tabs Section */}
      <Tabs defaultValue="shots" className="w-full">
        <TabsList className="w-full justify-start border-b rounded-none h-auto p-0 bg-transparent">
          <TabsTrigger 
            value="shots"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Shots
          </TabsTrigger>
          <TabsTrigger 
            value="locations"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Locations
          </TabsTrigger>
          <TabsTrigger 
            value="talent-notes"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Talent Notes
          </TabsTrigger>
          <TabsTrigger 
            value="equipment"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:bg-transparent"
          >
            Equipment
          </TabsTrigger>
        </TabsList>

        <TabsContent value="shots" className="mt-6">
          <div className="rounded-md border">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Shots</h2>
              <div className="text-sm text-muted-foreground">
                Shot list content will be implemented in the next phase.
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="locations" className="mt-6">
          <div className="rounded-md border">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Locations</h2>
              <div className="text-sm text-muted-foreground">
                Locations content will be implemented in the next phase.
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="talent-notes" className="mt-6">
          <div className="rounded-md border">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Talent Notes</h2>
              <div className="text-sm text-muted-foreground">
                Talent notes content will be implemented in the next phase.
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="equipment" className="mt-6">
          <div className="rounded-md border">
            <div className="p-4">
              <h2 className="text-lg font-semibold mb-4">Equipment</h2>
              <div className="text-sm text-muted-foreground">
                Equipment content will be implemented in the next phase.
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}