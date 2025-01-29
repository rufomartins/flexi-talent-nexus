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
        <TabsList className="grid grid-cols-3 lg:grid-cols-5 gap-4">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="onboarding">Onboarding</TabsTrigger>
          <TabsTrigger value="talents">Talents</TabsTrigger>
          <TabsTrigger value="castings">Castings</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="apis">APIs</TabsTrigger>
        </TabsList>

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