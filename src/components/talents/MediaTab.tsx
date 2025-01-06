import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Download, Plus, Trash2, Filter, Search } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { MediaCard } from "./MediaCard";
import { MediaUploadDialog } from "./MediaUploadDialog";
import { TalentProfileData } from "@/types/talent-profile";
import { formatFileSize, formatDate } from "@/lib/utils";

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button 
            onClick={() => setIsUploadOpen(true)} 
            disabled={!canUploadMedia}
          >
            <Plus className="mr-2 h-4 w-4" />
            Add media
          </Button>
          <Button
            variant="outline"
            onClick={handleDownloadSelection}
            disabled={selectedItems.length === 0}
          >
            <Download className="mr-2 h-4 w-4" />
            Download selection
          </Button>
          <Button
            variant="outline"
            onClick={handleDeleteSelection}
            disabled={selectedItems.length === 0}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete selection
          </Button>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline">
            <Filter className="mr-2 h-4 w-4" />
            Filter
          </Button>
          <div className="relative">
            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-8"
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