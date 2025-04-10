
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GeneralSettings } from "@/components/settings/GeneralSettings";
import { ProjectSettings } from "@/components/settings/ProjectSettings";
import { TalentSettings } from "@/components/settings/TalentSettings";
import { APISettings } from "@/components/settings/APISettings";
import { CalendarSettings } from "@/components/settings/CalendarSettings";
import { CastingSettings } from "@/components/settings/CastingSettings";
import { MessageSettings } from "@/components/settings/MessageSettings";
import { FinancialSettings } from "@/components/settings/FinancialSettings";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { OnboardingSettings } from "@/components/settings/OnboardingSettings";
import { useToast } from "@/hooks/use-toast";
import type { APIConfigs } from "@/types/api-settings";
import { Json } from "@/integrations/supabase/types";

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("general");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings } = useQuery({
    queryKey: ['api-settings'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('api_settings')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const updateSettings = useMutation({
    mutationFn: async ({ name, value }: { name: string, value: any }) => {
      const { error } = await supabase
        .from('api_settings')
        .upsert({ name, value })
        .eq('name', name);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['api-settings'] });
      toast({
        title: "Settings updated",
        description: "Your settings have been saved successfully.",
      });
    },
    onError: (error) => {
      console.error('Error updating settings:', error);
      toast({
        title: "Error",
        description: "Failed to update settings",
        variant: "destructive",
      });
    }
  });

  const getSettingValue = <T extends keyof APIConfigs>(name: T): APIConfigs[T] => {
    const setting = settings?.find(s => s.name === name);
    return setting?.value as unknown as APIConfigs[T] || {} as APIConfigs[T];
  };

  return (
    <div className="space-y-6 p-10">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">Settings</h2>
        <p className="text-muted-foreground">
          Manage your application settings and preferences.
        </p>
      </div>
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4 lg:grid-cols-8">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
          <TabsTrigger value="talents">Talents</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
          <TabsTrigger value="casting">Casting</TabsTrigger>
          <TabsTrigger value="messages">Messages</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
        </TabsList>
        <TabsContent value="general">
          <GeneralSettings />
        </TabsContent>
        <TabsContent value="projects">
          <ProjectSettings />
        </TabsContent>
        <TabsContent value="talents">
          <TalentSettings />
        </TabsContent>
        <TabsContent value="api">
          <APISettings />
        </TabsContent>
        <TabsContent value="calendar">
          <CalendarSettings />
        </TabsContent>
        <TabsContent value="casting">
          <CastingSettings />
        </TabsContent>
        <TabsContent value="messages">
          <MessageSettings />
        </TabsContent>
        <TabsContent value="financial">
          <FinancialSettings />
        </TabsContent>
      </Tabs>
      <OnboardingSettings 
        getSettingValue={getSettingValue}
        updateSettings={(args: { name: keyof APIConfigs; value: any }) => 
          updateSettings.mutate(args)
        }
      />
    </div>
  );
}
