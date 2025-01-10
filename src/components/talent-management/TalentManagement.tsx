import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import type { User as SupabaseUser } from '@supabase/supabase-js'
import { supabase } from "@/integrations/supabase/client"
import { DatabaseUser } from "@/types/user"
import { TalentCategory } from "@/types/talent-management"
import { TalentHeader } from "./components/TalentHeader"
import { TalentMetrics } from "./components/TalentMetrics"
import { TalentCategoryTabs } from "./components/TalentCategoryTabs"

interface TalentManagementProps {
  user: SupabaseUser;
}

export function TalentManagement({ user }: TalentManagementProps) {
  const [activeCategory, setActiveCategory] = useState<TalentCategory>(TalentCategory.UGC)

  const { data: userData } = useQuery({
    queryKey: ['user', user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (error) throw error;
      return data as DatabaseUser;
    }
  });

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

  if (!userData) return null;

  return (
    <div className="container py-6">
      <TalentHeader 
        user={userData}
        onAddTalent={() => console.log('Add talent clicked')}
      />
      
      <TalentMetrics 
        stats={stats ?? { total: 0, approved: 0, pending: 0, rejected: 0 }}
        isLoading={isLoadingStats}
      />
      
      <TalentCategoryTabs
        activeCategory={activeCategory}
        onCategoryChange={setActiveCategory}
      />

      {Object.values(TalentCategory).map((category) => (
        <div key={category} className={category === activeCategory ? 'block' : 'hidden'}>
          <div className="rounded-md border">
            <div className="p-4">Talent table for {category} category coming soon...</div>
          </div>
        </div>
      ))}
    </div>
  );
}