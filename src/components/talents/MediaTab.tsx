import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Plus, Trash2, Filter, Search, MoreVertical } from "lucide-react";
import { MediaCard } from "./MediaCard";
import { MediaUploadDialog } from "./MediaUploadDialog";
import { TalentProfileData } from "@/types/talent-profile";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MediaTabProps {
  talent: TalentProfileData;
}

export const MediaTab = ({ talent }: MediaTabProps) => {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const { data: media, isLoading } = useQuery({
    queryKey: ["talent-media", talent.user.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("talent_media")
        .select("*")
        .eq("talent_id", talent.user.id)
        .order("position", { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const canUploadMedia = talent.user.role !== "translator" && 
                        talent.user.role !== "reviewer";

  const handleDownloadSelection = async () => {
    // Implementation for downloading selected media
  };

  const handleDeleteSelection = async () => {
    // Implementation for deleting selected media
  };

  const handleSearch = (value: string) => {
    setSearchQuery(value);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button 
          onClick={() => setIsUploadOpen(true)} 
          disabled={!canUploadMedia}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add media
        </Button>
        <Button
          variant="outline"
          onClick={handleDownloadSelection}
          disabled={selectedItems.length === 0}
          className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none"
        >
          <Download className="mr-2 h-4 w-4" />
          Download selection
        </Button>
        <Select>
          <SelectTrigger className="bg-blue-50 text-blue-600 hover:bg-blue-100 border-none w-[120px]">
            <SelectValue placeholder="Set label" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="profile">Profile</SelectItem>
            <SelectItem value="portfolio">Portfolio</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          onClick={handleDeleteSelection}
          disabled={selectedItems.length === 0}
          className="bg-red-50 text-red-600 hover:bg-red-100 border-none"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete selection
        </Button>
        <div className="ml-auto flex items-center gap-3">
          <Select>
            <SelectTrigger className="bg-white border w-[120px]">
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="images">Images</SelectItem>
              <SelectItem value="videos">Videos</SelectItem>
            </SelectContent>
          </Select>
          <Select>
            <SelectTrigger className="bg-white border w-[120px]">
              <SelectValue placeholder="Sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="oldest">Oldest</SelectItem>
              <SelectItem value="name">Name</SelectItem>
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-[200px]"
            />
          </div>
        </div>
      </div>

      <div className="text-sm text-muted-foreground italic">
        These files are also viewable by the talent via the update form
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {media?.map((item) => (
            <MediaCard
              key={item.id}
              media={item}
              onSelect={(id) => {
                setSelectedItems((prev) => 
                  prev.includes(id) 
                    ? prev.filter((i) => i !== id)
                    : [...prev, id]
                );
              }}
              isSelected={selectedItems.includes(item.id)}
            />
          ))}
        </div>
      )}

      <MediaUploadDialog
        open={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        talentId={talent.user.id}
        talentRole={talent.user.role}
      />
    </div>
  );
};