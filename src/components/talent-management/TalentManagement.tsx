import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Plus, Users, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatCard } from "./StatCard";
import { useAuth } from "@/contexts/auth";
import { canManageTalents } from "@/utils/permissions";
import { TalentCategory } from "@/types/talent-management";
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

type TalentProfile = Database['public']['Tables']['talent_profiles']['Row'] & {
  users: {
    id: string;
    first_name: string | null;
    last_name: string | null;
    email: string | null;
  } | null;
};

export function TalentManagement() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<TalentCategory>(TalentCategory.UGC);

  const { data: stats, isLoading: isLoadingStats } = useQuery({
    queryKey: ['talent-stats', activeCategory],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('talent_profiles')
        .select(`
          *,
          users (
            id,
            first_name,
            last_name,
            email
          )
        `)
        .eq('talent_category', activeCategory);

      if (error) throw error;

      const total = data.length;
      const approved = data.filter(t => t.evaluation_status === 'APPROVED').length;
      const pending = data.filter(t => t.evaluation_status === 'PENDING').length;
      const rejected = data.filter(t => t.evaluation_status === 'REJECTED').length;

      return { total, approved, pending, rejected };
    }
  });

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Talent Management</h1>
        {canManageTalents(user) && (
          <Button>
            <Plus className="h-4 w-4 mr-2" />
            Add New Talent
          </Button>
        )}
      </div>

      <div className="grid gap-4 md:grid-cols-4 mb-6">
        <StatCard
          title="Total Talents"
          value={stats?.total ?? 0}
          icon={<Users className="h-4 w-4 text-muted-foreground" />}
        />
        <StatCard
          title="Approved"
          value={stats?.approved ?? 0}
          icon={<CheckCircle className="h-4 w-4 text-green-500" />}
        />
        <StatCard
          title="Pending"
          value={stats?.pending ?? 0}
          icon={<Clock className="h-4 w-4 text-yellow-500" />}
        />
        <StatCard
          title="Rejected"
          value={stats?.rejected ?? 0}
          icon={<AlertCircle className="h-4 w-4 text-red-500" />}
        />
      </div>

      <Tabs
        defaultValue={TalentCategory.UGC}
        onValueChange={(value) => setActiveCategory(value as TalentCategory)}
        className="space-y-4"
      >
        <TabsList>
          <TabsTrigger value={TalentCategory.UGC}>UGC Talents</TabsTrigger>
          <TabsTrigger value={TalentCategory.TRANSLATOR}>Translators</TabsTrigger>
          <TabsTrigger value={TalentCategory.REVIEWER}>Reviewers</TabsTrigger>
          <TabsTrigger value={TalentCategory.VOICE_OVER}>Voice Over</TabsTrigger>
        </TabsList>

        {Object.values(TalentCategory).map((category) => (
          <TabsContent key={category} value={category}>
            <div className="rounded-md border">
              {/* TalentTable will be implemented next */}
              <div className="p-4">Talent table for {category} category coming soon...</div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}