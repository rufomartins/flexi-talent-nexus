import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";
import { CandidateList } from "@/components/onboarding/CandidateList";
import { supabase } from "@/integrations/supabase/client";

const Onboarding = () => {
  const { user, userDetails } = useAuth();
  const { toast } = useToast();

  console.log("[Onboarding] Initializing with auth state:", {
    userId: user?.id,
    userRole: userDetails?.role || user?.user_metadata?.role,
    hasUserDetails: !!userDetails
  });

  const { data: candidates, isLoading, error } = useQuery({
    queryKey: ["onboarding-candidates"],
    queryFn: async () => {
      console.log("[Onboarding] Fetching candidates...");
      
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
        console.error("[Onboarding] Error fetching candidates:", error);
        toast({
          title: "Error fetching candidates",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log("[Onboarding] Fetched candidates:", data?.length || 0);
      return data || [];
    },
    enabled: !!user && (userDetails?.role === 'super_admin' || userDetails?.role === 'super_user')
  });

  // If not authorized, show message
  if (!user || !(userDetails?.role === 'super_admin' || userDetails?.role === 'super_user')) {
    console.log("[Onboarding] User not authorized:", {
      hasUser: !!user,
      userRole: userDetails?.role
    });
    return (
      <div className="container mx-auto py-6">
        <div className="bg-destructive/15 text-destructive px-4 py-2 rounded-md">
          You don't have permission to access this page.
        </div>
      </div>
    );
  }

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
        error={error as Error}
      />
    </div>
  );
};

export default Onboarding;