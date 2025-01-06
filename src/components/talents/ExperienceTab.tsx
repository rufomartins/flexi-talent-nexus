import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Plus, Filter, RotateCcw, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TalentProfileData } from "@/types/talent-profile";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ExperienceTabProps {
  talent: TalentProfileData;
}

export const ExperienceTab = ({ talent }: ExperienceTabProps) => {
  const { data: jobs, isLoading } = useQuery({
    queryKey: ["talent-jobs", talent.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("talent_jobs")
        .select("*")
        .eq("talent_id", talent.user.id)
        .order("start_date", { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-start gap-8">
        <div className="w-64 relative">
          <span className="absolute top-2 left-2 bg-primary text-white text-xs px-2 py-1 rounded-md z-10">
            Profile
          </span>
          <Avatar className="w-64 h-64">
            <AvatarImage src={talent.user.avatar_url || undefined} className="object-cover" />
            <AvatarFallback>
              {talent.user.first_name?.[0]}
              {talent.user.last_name?.[0]}
            </AvatarFallback>
          </Avatar>
        </div>

        <div className="flex-1">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                Filter
              </Button>
              <h1 className="text-2xl font-semibold">
                {talent.user.first_name} {talent.user.last_name}
              </h1>
              <Badge className="bg-green-600 hover:bg-green-700 text-white border-0">
                Approved
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" className="gap-2">
                <Trash2 className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <RotateCcw className="h-4 w-4" />
                Save
              </Button>
              <Button variant="outline" size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add experience
              </Button>
            </div>
          </div>

          {jobs && jobs.length > 0 ? (
            <div className="space-y-4">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="p-4 border rounded-lg bg-white hover:shadow-sm transition-shadow"
                >
                  <div className="flex justify-between">
                    <div>
                      <h3 className="font-medium">{job.job_title}</h3>
                      <p className="text-sm text-gray-500">{job.company}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      {job.start_date} - {job.end_date || 'Present'}
                    </div>
                  </div>
                  {job.description && (
                    <p className="mt-2 text-sm text-gray-600">{job.description}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 rounded-lg">
              <p className="text-gray-500">No experience added yet</p>
              <Button variant="outline" className="mt-4 gap-2">
                <Plus className="h-4 w-4" />
                Add first experience
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};