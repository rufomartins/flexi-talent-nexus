import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { CandidateProfileHeader } from "@/components/onboarding/profile/CandidateProfileHeader";
import { BasicInformation } from "@/components/onboarding/profile/BasicInformation";
import { StatusSection } from "@/components/onboarding/profile/StatusSection";
import { NotesSection } from "@/components/onboarding/profile/NotesSection";
import { useState } from "react";

const CandidateProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [localNotes, setLocalNotes] = useState("");

  const { data: candidate, isLoading } = useQuery({
    queryKey: ["candidate", id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("onboarding_candidates")
        .select(`
          *,
          scout:scout_id(
            id,
            full_name
          )
        `)
        .eq("id", id)
        .single();

      if (error) {
        toast({
          title: "Error fetching candidate",
          description: error.message,
          variant: "destructive",
        });
        return null;
      }

      setLocalNotes(data.notes || "");
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <Skeleton className="h-8 w-[200px]" />
        <Card className="p-6 space-y-4">
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </Card>
      </div>
    );
  }

  if (!candidate) {
    return (
      <div className="container mx-auto py-6">
        <Card className="p-6">
          <p className="text-center text-muted-foreground">Candidate not found</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <CandidateProfileHeader name={candidate.name} />

      <div className="grid gap-6 md:grid-cols-2">
        <BasicInformation 
          email={candidate.email}
          phone={candidate.phone}
          scout={candidate.scout}
        />

        <Card className="p-6 space-y-4">
          <StatusSection 
            id={candidate.id}
            status={candidate.status}
            onStatusChange={(newStatus) => {
  const handleStatusChange = async (newStatus: 'new' | 'emailed' | 'interviewed' | 'approved') => {
    const { error } = await supabase
      .from("onboarding_candidates")
      .update({ status: newStatus })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error updating status",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Status updated successfully",
    });
  };
            }}
          />

          {candidate.video_demo_url && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Demo Video</h3>
              <a
                href={candidate.video_demo_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Demo
              </a>
            </div>
          )}
        </Card>

        <NotesSection 
          id={candidate.id}
          notes={localNotes}
          onNotesUpdate={setLocalNotes}
        />
      </div>
    </div>
  );
};

export default CandidateProfile;
