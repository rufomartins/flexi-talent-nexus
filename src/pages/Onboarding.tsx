import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";
import { CandidateList } from "@/components/onboarding/CandidateList";
import { UserPlus } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const Onboarding = () => {
  const { user, userDetails } = useAuth();
  const { toast } = useToast();

  const { data: candidates, isLoading } = useQuery({
    queryKey: ["onboarding-candidates"],
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
        .order("created_at", { ascending: false });

      if (error) {
        toast({
          title: "Error fetching candidates",
          description: error.message,
          variant: "destructive",
        });
        return [];
      }

      return data;
    },
  });

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">Onboarding</h1>
          <p className="text-sm text-muted-foreground">
            Manage and track candidate onboarding process
          </p>
        </div>
      </div>

      <CandidateList 
        candidates={candidates || []} 
        isLoading={isLoading}
      />
    </div>
  );
};

export default Onboarding;