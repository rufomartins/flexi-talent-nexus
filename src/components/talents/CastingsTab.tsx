
import { useQuery } from "@tanstack/react-query";
import { TalentProfileData } from "@/types/talent-profile";
import { supabase } from "@/integrations/supabase/client";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Calendar, Users, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";

interface CastingsTabProps {
  talent: TalentProfileData;
}

export const CastingsTab = ({ talent }: CastingsTabProps) => {
  const { data: castings, isLoading } = useQuery({
    queryKey: ["talent-castings", talent.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("casting_talents")
        .select(`
          *,
          castings (
            id,
            name,
            status,
            logo_url,
            created_at
          )
        `)
        .eq("talent_id", talent.user.id);

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!castings?.length) {
    return (
      <div className="text-center py-12 bg-muted/30 rounded-lg">
        <h3 className="text-lg font-medium mb-2">No Castings</h3>
        <p className="text-muted-foreground mb-6">This talent has not been added to any castings yet.</p>
        <Button>Add to Casting</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Castings</h2>
        <Button variant="outline">Add to Casting</Button>
      </div>

      <div className="space-y-4">
        {castings.map((casting) => (
          <Card key={casting.id} className="p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4">
              {casting.castings?.logo_url ? (
                <img 
                  src={casting.castings.logo_url} 
                  alt={casting.castings.name} 
                  className="w-12 h-12 object-contain rounded"
                />
              ) : (
                <div className="w-12 h-12 bg-muted flex items-center justify-center rounded">
                  <Users className="h-6 w-6 text-muted-foreground" />
                </div>
              )}
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="font-medium">{casting.castings?.name}</h3>
                  <Badge variant={casting.castings?.status === 'open' ? 'default' : 'secondary'} className="text-xs">
                    {casting.castings?.status}
                  </Badge>
                </div>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {casting.castings?.created_at ? formatDate(casting.castings.created_at) : 'N/A'}
                  </span>
                  {casting.availability_status && (
                    <Badge variant="outline" className="text-xs">
                      {casting.availability_status}
                    </Badge>
                  )}
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
