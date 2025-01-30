import { useAuth } from "@/contexts/auth";
import { OnboardingWorkflow } from "@/components/onboarding/workflow/OnboardingWorkflow";
import { OnboardingNav } from "@/components/onboarding/navigation/OnboardingNav";

const Onboarding = () => {
  const { user, userDetails } = useAuth();

  if (!user || !(userDetails?.role === 'super_admin' || userDetails?.role === 'super_user')) {
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

      <OnboardingNav />
      <OnboardingWorkflow />
    </div>
  );
};

export default Onboarding;