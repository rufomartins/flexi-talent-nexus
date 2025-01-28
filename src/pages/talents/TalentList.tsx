import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Search, Plus, Filter, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { TalentSearchDialog } from "@/components/talents/TalentSearchDialog";
import { AddTalentModal } from "@/components/talents/AddTalentModal";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ActionsDropdown } from "@/components/talents/ActionsDropdown";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/auth";
import type { TalentProfile } from "@/types/talent";

const TalentList = () => {
  const [searchOpen, setSearchOpen] = useState(false);
  const [addTalentOpen, setAddTalentOpen] = useState(false);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("name");
  const { toast } = useToast();
  const { user } = useAuth();
  const isSuperAdmin = user?.role === 'super_admin';
  const isAdmin = user?.role === 'admin';

  const { data: talents, isLoading, error } = useQuery({
    queryKey: ["talents", sortBy],
    queryFn: async () => {
      console.log("Fetching talents...");
      const { data, error } = await supabase
        .from("talent_profiles")
        .select(`
          *,
          users (
            id,
            first_name,
            last_name,
            avatar_url
          ),
          casting_talents (
            castings (
              name
            )
          )
        `)
        .order(sortBy === "name" ? "users(first_name)" : sortBy, { ascending: true });

      if (error) {
        console.error("Error fetching talents:", error);
        toast({
          title: "Error loading talents",
          description: error.message,
          variant: "destructive",
        });
        throw error;
      }

      console.log("Fetched talents:", data);
      return data as TalentProfile[];
    },
  });

  const handleSearch = async (searchValues: any) => {
    console.log("Search values:", searchValues);
    // Implement search logic here
  };

  const handleSelectAll = () => {
    if (talents) {
      const allIds = new Set(talents.map(talent => talent.id));
      setSelectedIds(selectedIds.size === talents.length ? new Set() : allIds);
    }
  };

  const handleSelect = (id: string) => {
    const newSelectedIds = new Set(selectedIds);
    if (newSelectedIds.has(id)) {
      newSelectedIds.delete(id);
    } else {
      newSelectedIds.add(id);
    }
    setSelectedIds(newSelectedIds);
  };

  const handleAction = async (action: string) => {
    // Implement action handling (add to casting, email, delete)
    console.log("Action:", action, "Selected IDs:", Array.from(selectedIds));
  };

  if (error) {
    return (
      <div className="container py-6">
        <div className="text-center text-red-600">
          Error loading talents. Please try again later.
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold">Talents</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setSearchOpen(true)}>
            <Search className="h-4 w-4 mr-2" />
            Search
          </Button>
          {isSuperAdmin && (
            <Button onClick={() => setAddTalentOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add New Talent
            </Button>
          )}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center gap-2">
          <Checkbox 
            checked={talents && selectedIds.size === talents.length}
            onCheckedChange={handleSelectAll}
          />
          <span className="text-sm text-muted-foreground">
            {selectedIds.size} selected
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Sort by..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="created_at">Newest</SelectItem>
              <SelectItem value="updated_at">Last Update</SelectItem>
              <SelectItem value="native_language">Language</SelectItem>
            </SelectContent>
          </Select>
          {selectedIds.size > 0 && (
            <ActionsDropdown 
              selectedItems={Array.from(selectedIds)} 
              onAction={handleAction}
            />
          )}
        </div>
      </div>

      {talents && talents.length > 0 ? (
        <div className="grid gap-4">
          {talents.map((talent) => (
            <div
              key={talent.id}
              className="p-4 bg-white rounded-lg shadow flex items-center gap-4"
            >
              <Checkbox
                checked={selectedIds.has(talent.id)}
                onCheckedChange={() => handleSelect(talent.id)}
                className="mt-1"
              />
              <div className="relative">
                <Avatar className="h-12 w-12">
                  {talent.users?.avatar_url ? (
                    <AvatarImage
                      src={talent.users.avatar_url}
                      alt={talent.users.full_name || ''}
                    />
                  ) : (
                    <AvatarFallback>
                      {talent.users?.first_name?.[0]}
                    </AvatarFallback>
                  )}
                </Avatar>
                <Badge 
                  variant={talent.evaluation_status === 'approved' ? 'default' : 'secondary'}
                  className="absolute -top-2 -right-2 text-xs"
                >
                  {talent.evaluation_status}
                </Badge>
              </div>
              <div className="flex-1">
                <h3 className="font-medium">
                  {talent.users?.full_name}
                </h3>
                <div className="text-sm text-muted-foreground">
                  {talent.casting_talents?.slice(0, 3).map(ct => ct.castings.name).join(', ')}
                </div>
                <div className="flex gap-2 mt-1">
                  <Badge variant="outline">{talent.talent_category}</Badge>
                  {talent.native_language && (
                    <Badge variant="outline">{talent.native_language}</Badge>
                  )}
                </div>
              </div>
              {(isSuperAdmin || isAdmin) && talent.fee_range && (
                <div className="text-sm text-muted-foreground">
                  Avg. Rate: ${talent.fee_range.min}-${talent.fee_range.max}
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          Search for talents to get started
        </div>
      )}

      <TalentSearchDialog 
        open={searchOpen}
        onOpenChange={setSearchOpen}
        onSearch={handleSearch}
      />

      <AddTalentModal
        open={addTalentOpen}
        onOpenChange={setAddTalentOpen}
      />
    </div>
  );
};

export default TalentList;