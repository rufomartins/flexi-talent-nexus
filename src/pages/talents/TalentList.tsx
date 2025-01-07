import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2 } from "lucide-react";

const TalentList = () => {
  const { data: talents, isLoading } = useQuery({
    queryKey: ["talents"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("talent_profiles")
        .select(`
          id,
          user_id,
          category,
          evaluation_status,
          users:user_id (
            first_name,
            last_name,
            avatar_url
          )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-semibold mb-6">Talents</h1>
      <div className="grid gap-4">
        {talents?.map((talent) => (
          <div
            key={talent.id}
            className="p-4 bg-white rounded-lg shadow flex items-center gap-4"
          >
            <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
              {talent.users?.avatar_url ? (
                <img
                  src={talent.users.avatar_url}
                  alt={`${talent.users.first_name} ${talent.users.last_name}`}
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <span className="text-lg font-medium text-muted-foreground">
                  {talent.users?.first_name?.[0]}
                </span>
              )}
            </div>
            <div>
              <h3 className="font-medium">
                {talent.users?.first_name} {talent.users?.last_name}
              </h3>
              <p className="text-sm text-muted-foreground">
                {talent.category || "No category"}
              </p>
            </div>
            <div className="ml-auto">
              <span className="text-sm bg-muted px-2 py-1 rounded">
                {talent.evaluation_status}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TalentList;