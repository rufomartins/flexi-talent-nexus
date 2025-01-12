import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Mail, Phone, Calendar, MessageSquare } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";

const CandidateProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [newNote, setNewNote] = useState("");

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

      return data;
    },
  });

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    const { error } = await supabase
      .from("onboarding_candidates")
      .update({
        notes: candidate?.notes 
          ? `${candidate.notes}\n${new Date().toISOString()}: ${newNote}`
          : `${new Date().toISOString()}: ${newNote}`,
      })
      .eq("id", id);

    if (error) {
      toast({
        title: "Error adding note",
        description: error.message,
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Note added successfully",
    });
    setNewNote("");
  };

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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "interviewed":
        return "bg-blue-100 text-blue-800";
      case "emailed":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">{candidate.name}</h1>
          <p className="text-sm text-muted-foreground">
            Added {new Date(candidate.created_at).toLocaleDateString()}
          </p>
        </div>
        <Button variant="outline" onClick={() => navigate("/onboarding")}>
          Back to List
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Basic Information</h2>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span>{candidate.email}</span>
            </div>
            {candidate.phone && (
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-muted-foreground" />
                <span>{candidate.phone}</span>
              </div>
            )}
            {candidate.scout && (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Scout:</span>
                <span>{candidate.scout.full_name}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Status:</span>
            <Badge className={getStatusColor(candidate.status)}>
              {candidate.status}
            </Badge>
          </div>

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

          <div className="flex flex-wrap gap-2 pt-4">
            <Button onClick={() => handleStatusChange('emailed')} variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </Button>
            <Button onClick={() => handleStatusChange('interviewed')} variant="outline">
              <Calendar className="mr-2 h-4 w-4" />
              Schedule Interview
            </Button>
            <Button 
              onClick={() => handleStatusChange('approved')}
              variant="default"
              className="bg-green-600 hover:bg-green-700"
            >
              Approve Candidate
            </Button>
          </div>
        </Card>

        <Card className="p-6 space-y-4">
          <h2 className="text-lg font-semibold">Notes</h2>
          
          <div className="space-y-4">
            <div className="min-h-[100px] max-h-[300px] overflow-y-auto space-y-2">
              {candidate.notes?.split('\n').map((note, index) => (
                <div key={index} className="text-sm">
                  {note}
                </div>
              ))}
            </div>

            <div className="space-y-2">
              <Textarea
                placeholder="Add a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
              />
              <Button onClick={handleAddNote} className="w-full">
                <MessageSquare className="mr-2 h-4 w-4" />
                Add Note
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CandidateProfile;