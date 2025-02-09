
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { OnboardingSettings } from "@/components/settings/OnboardingSettings";
import { TalentSettings } from "@/components/settings/TalentSettings";
import { CastingSettings } from "@/components/settings/CastingSettings";
import { ProjectSettings } from "@/components/settings/ProjectSettings";
import { MessageSettings } from "@/components/settings/MessageSettings";
import { FinancialSettings } from "@/components/settings/FinancialSettings";
import { CalendarSettings } from "@/components/settings/CalendarSettings";
import { APISettings } from "@/components/settings/APISettings";
import { useAuth } from "@/contexts/auth";
import { Navigate } from "react-router-dom";

export default function Settings() {
  const { user, userDetails } = useAuth();

  // Only super admins can access settings
  if (!user || userDetails?.role !== 'super_admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Settings</h1>
          <p className="text-muted-foreground">
            Manage platform settings and configurations
          </p>
        </div>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <div className="border-b">
          <div className="overflow-x-auto">
            <TabsList className="inline-flex h-10 items-center justify-start w-full px-1 py-1">
              <TabsTrigger value="general" className="px-4">General</TabsTrigger>
              <TabsTrigger value="onboarding" className="px-4">Onboarding</TabsTrigger>
              <TabsTrigger value="talents" className="px-4">Talents</TabsTrigger>
              <TabsTrigger value="castings" className="px-4">Castings</TabsTrigger>
              <TabsTrigger value="projects" className="px-4">Projects</TabsTrigger>
              <TabsTrigger value="messages" className="px-4">Messages</TabsTrigger>
              <TabsTrigger value="financial" className="px-4">Financial</TabsTrigger>
              <TabsTrigger value="calendar" className="px-4">Calendar</TabsTrigger>
              <TabsTrigger value="apis" className="px-4">APIs</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <TabsContent value="general" className="space-y-4">
          <GeneralSettings />
        </TabsContent>
        
        <TabsContent value="onboarding" className="space-y-4">
          <OnboardingSettings />
        </TabsContent>
        
        <TabsContent value="talents" className="space-y-4">
          <TalentSettings />
        </TabsContent>
        
        <TabsContent value="castings" className="space-y-4">
          <CastingSettings />
        </TabsContent>
        
        <TabsContent value="projects" className="space-y-4">
          <ProjectSettings />
        </TabsContent>
        
        <TabsContent value="messages" className="space-y-4">
          <MessageSettings />
        </TabsContent>
        
        <TabsContent value="financial" className="space-y-4">
          <FinancialSettings />
        </TabsContent>
        
        <TabsContent value="calendar" className="space-y-4">
          <CalendarSettings />
        </TabsContent>
        
        <TabsContent value="apis" className="space-y-4">
          <APISettings />
        </TabsContent>
      </Tabs>
    </div>
  );
}
