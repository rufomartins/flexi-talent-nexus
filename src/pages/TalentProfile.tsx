import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator } from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Home, ChevronRight, Phone, Trash2, Save } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useState } from "react";

const TalentProfile = () => {
  const { id } = useParams();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("summary");

  const { data: talent, isLoading } = useQuery({
    queryKey: ["talent", id],
    queryFn: async () => {
      const { data: user, error } = await supabase
        .from("users")
        .select(`
          *,
          talent_profiles(*)
        `)
        .eq("id", id)
        .single();

      if (error) throw error;
      return user;
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Top Navigation */}
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
                  <BreadcrumbPage>{talent?.full_name}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <div className="flex items-center gap-4">
              <Button variant="outline">Talent portal</Button>
              <Button variant="outline">Actions</Button>
              <Button>+ Add to casting</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="container py-4">
        <TabsList className="grid grid-cols-13 w-full">
          <TabsTrigger value="summary">Summary</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="media">Media</TabsTrigger>
          <TabsTrigger value="appearance">Appearance</TabsTrigger>
          <TabsTrigger value="contact">Contact</TabsTrigger>
          <TabsTrigger value="extra">Extra</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="files">Files</TabsTrigger>
          <TabsTrigger value="gdpr">GDPR</TabsTrigger>
          <TabsTrigger value="agent">Agent</TabsTrigger>
          <TabsTrigger value="castings">Castings</TabsTrigger>
          <TabsTrigger value="social-media">Social Media</TabsTrigger>
          <TabsTrigger value="calendar">Calendar</TabsTrigger>
        </TabsList>

        {/* Summary Tab Content */}
        <TabsContent value="summary" className="mt-6">
          <div className="bg-white rounded-lg p-6">
            <div className="flex items-start gap-8">
              {/* Profile Photo Section */}
              <div className="w-64">
                <Label>Profile</Label>
                <Avatar className="w-64 h-64 mt-2">
                  <AvatarImage src={talent?.avatar_url} />
                  <AvatarFallback>
                    {talent?.first_name?.[0]}
                    {talent?.last_name?.[0]}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Form Fields */}
              <div className="flex-1 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name</Label>
                    <Input id="firstName" defaultValue={talent?.first_name} />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input id="lastName" defaultValue={talent?.last_name} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="gender">Gender</Label>
                    <Input id="gender" defaultValue={talent?.gender} />
                  </div>
                  <div>
                    <Label htmlFor="category">Actor/Talent category</Label>
                    <Input id="category" defaultValue={talent?.talent_profiles?.[0]?.category} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">Mobile Phone</Label>
                    <div className="relative">
                      <Input id="phone" defaultValue={talent?.mobile_phone} />
                      <Phone className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <Input id="status" defaultValue={talent?.talent_profiles?.[0]?.evaluation_status} />
                  </div>
                </div>

                <div>
                  <Label htmlFor="remarks">Internal Remarks</Label>
                  <Input id="remarks" defaultValue={talent?.talent_profiles?.[0]?.internal_remarks} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="nationality">Nationality</Label>
                    <Input id="nationality" defaultValue={talent?.nationality} />
                  </div>
                </div>

                <div className="flex justify-end gap-4">
                  <Button variant="outline" size="icon">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button>
                    <Save className="h-4 w-4 mr-2" />
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>

        {/* Other tab contents will be implemented separately */}
      </Tabs>
    </div>
  );
};

export default TalentProfile;
