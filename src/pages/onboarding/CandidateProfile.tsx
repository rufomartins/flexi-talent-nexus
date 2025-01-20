import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Mail, Calendar, RefreshCcw } from "lucide-react";
import { InterviewSchedulerDialog } from "@/components/onboarding/interview/InterviewSchedulerDialog";
import { EmailAndSmsComposer } from "@/components/onboarding/communication/EmailAndSmsComposer";
import { StatusSection } from "@/components/onboarding/profile/StatusSection";

export default function CandidateProfile() {
  const { id } = useParams();
  const { toast } = useToast();
  const [showScheduler, setShowScheduler] = useState(false);
  const [showCommunication, setShowCommunication] = useState(false);

  const { data: candidate, isLoading, error } = useQuery({
    queryKey: ["candidate", id],
    queryFn: async () => {
      console.log("[CandidateProfile] Fetching candidate data:", id);
      
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
        console.error("[CandidateProfile] Error:", error);
        toast({
          title: "Error fetching candidate",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log("[CandidateProfile] Fetched data:", data);
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto py-6 space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-10 w-[120px]" />
        </div>
        <Card className="p-6 space-y-4">
          <Skeleton className="h-6 w-[150px]" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
        </Card>
      </div>
    );
  }

  if (error || !candidate) {
    return (
      <div className="container mx-auto py-6">
        <Card className="p-6 text-center space-y-4">
          <p className="text-muted-foreground">
            {error ? "Error loading candidate" : "Candidate not found"}
          </p>
          <Button 
            variant="outline" 
            onClick={() => window.location.reload()}
            className="mx-auto"
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Retry
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{candidate.name}</h1>
          <p className="text-sm text-muted-foreground">
            Added {new Date(candidate.created_at).toLocaleDateString()}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => setShowScheduler(true)}
          >
            <Calendar className="mr-2 h-4 w-4" />
            Schedule Interview
          </Button>
          <Button
            variant="outline"
            onClick={() => setShowCommunication(true)}
          >
            <Mail className="mr-2 h-4 w-4" />
            Send Message
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Basic Information */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Email:</span>
              <span className="text-sm text-muted-foreground">{candidate.email}</span>
            </div>
            {candidate.phone && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Phone:</span>
                <span className="text-sm text-muted-foreground">{candidate.phone}</span>
              </div>
            )}
            {candidate.scout && (
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium">Scout:</span>
                <span className="text-sm text-muted-foreground">{candidate.scout.full_name}</span>
              </div>
            )}
          </div>
        </Card>

        {/* Status Section */}
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Status</h2>
          <StatusSection 
            id={candidate.id}
            status={candidate.status}
            onStatusChange={(newStatus) => {
              toast({
                title: "Status updated",
                description: `Candidate status has been updated to ${newStatus}`,
              });
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

        {/* Notes Section */}
        <Card className="p-6 space-y-4 md:col-span-2">
          <h2 className="text-lg font-semibold">Notes</h2>
          <div className="min-h-[100px] whitespace-pre-wrap">
            {candidate.notes || "No notes added yet."}
          </div>
        </Card>
      </div>

      {/* Dialogs */}
      <InterviewSchedulerDialog
        open={showScheduler}
        onOpenChange={setShowScheduler}
        candidateId={candidate.id}
        candidateName={candidate.name}
      />

      <EmailAndSmsComposer
        open={showCommunication}
        onOpenChange={setShowCommunication}
        candidateId={candidate.id}
        candidateName={candidate.name}
        email={candidate.email}
        phone={candidate.phone}
      />
    </div>
  );
}