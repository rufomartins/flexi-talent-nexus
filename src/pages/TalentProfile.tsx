import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import { Home, ChevronRight, MoreVertical } from "lucide-react";
import { useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { TalentProfileTabs } from "@/components/talents/TalentProfileTabs";
import { ExperienceTab } from "@/components/talents/ExperienceTab";
import { Loader2 } from "lucide-react";

const TalentProfile = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState("experience");

  const { data: talent, isLoading } = useQuery({
    queryKey: ["talent", id],
    queryFn: async () => {
      const { data: user, error: userError } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", id)
        .single();

      if (userError) throw userError;

      const { data: talentProfile, error: profileError } = await supabase
        .from("talent_profiles")
        .select("*")
        .eq("user_id", id)
        .single();

      if (profileError) throw profileError;

      return {
        user,
        talent_profile: talentProfile,
      };
    },
  });

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!talent) {
    return <div>Talent not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container py-4">
          <div className="flex items-center justify-between">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">
                    <Home className="h-4 w-4" />
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/talents">Talents</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
                <BreadcrumbItem>
                  <BreadcrumbPage>
                    {talent.user.first_name} {talent.user.last_name}
                  </BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-4">
              <Button variant="outline">Talent portal</Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline">
                    Actions
                    <MoreVertical className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>View public profile</DropdownMenuItem>
                  <DropdownMenuItem>Send message</DropdownMenuItem>
                  <DropdownMenuItem>Download files</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button>+ Add to casting</Button>
            </div>
          </div>
        </div>
      </div>

      <div className="container py-4">
        <TalentProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
        
        <div className="mt-6">
          {activeTab === "experience" && <ExperienceTab talent={talent} />}
          {/* Other tabs will be implemented similarly */}
        </div>
      </div>
    </div>
  );
};

export default TalentProfile;
