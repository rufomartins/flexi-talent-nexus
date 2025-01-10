import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { notify } from "@/utils/notifications";
import type { TalentNotificationType } from "@/types/notifications";

interface NotificationPreferences {
  email_enabled: boolean;
  in_app_enabled: boolean;
  email_frequency: string;
  reminder_days: number[];
  types: TalentNotificationType[];
}

export function NotificationPreferences({ talentId }: { talentId: string }) {
  const queryClient = useQueryClient();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: preferences, isLoading } = useQuery({
    queryKey: ["notification-preferences", talentId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("talent_notification_preferences")
        .select("*")
        .eq("talent_id", talentId)
        .single();

      if (error) throw error;
      return data as NotificationPreferences;
    },
  });

  const updatePreferences = useMutation({
    mutationFn: async (newPreferences: Partial<NotificationPreferences>) => {
      setIsSubmitting(true);
      const { error } = await supabase
        .from("talent_notification_preferences")
        .upsert({ talent_id: talentId, ...newPreferences });

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notification-preferences", talentId] });
      notify.success("Notification preferences updated successfully");
    },
    onError: () => {
      notify.error("Failed to update notification preferences");
    },
    onSettled: () => {
      setIsSubmitting(false);
    },
  });

  if (isLoading) {
    return <div>Loading preferences...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notification Preferences</CardTitle>
        <CardDescription>
          Manage how and when you receive notifications
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <Label htmlFor="email-notifications">Email Notifications</Label>
            <Switch
              id="email-notifications"
              checked={preferences?.email_enabled}
              onCheckedChange={(checked) =>
                updatePreferences.mutate({ email_enabled: checked })
              }
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="in-app-notifications">In-app Notifications</Label>
            <Switch
              id="in-app-notifications"
              checked={preferences?.in_app_enabled}
              onCheckedChange={(checked) =>
                updatePreferences.mutate({ in_app_enabled: checked })
              }
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email-frequency">Email Frequency</Label>
            <Select
              value={preferences?.email_frequency}
              onValueChange={(value) =>
                updatePreferences.mutate({ email_frequency: value })
              }
              disabled={!preferences?.email_enabled || isSubmitting}
            >
              <SelectTrigger id="email-frequency">
                <SelectValue placeholder="Select frequency" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="realtime">Real-time</SelectItem>
                <SelectItem value="daily">Daily Digest</SelectItem>
                <SelectItem value="weekly">Weekly Digest</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Notification Types</Label>
            <div className="grid gap-2">
              {[
                "PROJECT_MILESTONE",
                "PAYMENT_STATUS",
                "CASTING_OPPORTUNITY",
                "BOOKING_CONFIRMATION",
                "REVIEW_FEEDBACK",
                "DOCUMENT_UPDATE"
              ].map((type) => (
                <div key={type} className="flex items-center justify-between">
                  <Label htmlFor={`notification-${type}`} className="text-sm">
                    {type.split("_").map(word => word.charAt(0) + word.slice(1).toLowerCase()).join(" ")}
                  </Label>
                  <Switch
                    id={`notification-${type}`}
                    checked={preferences?.types?.includes(type as TalentNotificationType)}
                    onCheckedChange={(checked) => {
                      const newTypes = checked
                        ? [...(preferences?.types || []), type as TalentNotificationType]
                        : preferences?.types?.filter((t) => t !== type) || [];
                      updatePreferences.mutate({ types: newTypes });
                    }}
                    disabled={isSubmitting}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <Button
            variant="outline"
            onClick={() => queryClient.invalidateQueries({ queryKey: ["notification-preferences", talentId] })}
            disabled={isSubmitting}
          >
            Reset
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}