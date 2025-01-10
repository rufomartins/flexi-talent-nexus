import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { DuoPartner } from "@/types/talent";

interface DuoPartnerSearchProps {
  onSelect: (partner: DuoPartner) => void;
  currentTalentId?: string;
  existingPartnerId?: string;
}

export function DuoPartnerSearch({
  onSelect,
  currentTalentId,
  existingPartnerId
}: DuoPartnerSearchProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<DuoPartner[]>([]);

  const searchTalents = async (query: string) => {
    if (!query) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    try {
      const { data, error } = await supabase
        .from("talent_profiles")
        .select(`
          id,
          user_id,
          users!inner (
            first_name,
            last_name,
            email,
            avatar_url
          )
        `)
        .eq("is_duo", false)
        .neq("id", currentTalentId || '')
        .or(`users!inner(first_name.ilike.%${query}%),users!inner(last_name.ilike.%${query}%),users!inner(email.ilike.%${query}%)`)
        .limit(5);

      if (error) throw error;

      const formattedResults = data.map(result => ({
        id: result.id,
        user_id: result.user_id,
        first_name: result.users.first_name,
        last_name: result.users.last_name,
        email: result.users.email,
        avatar_url: result.users.avatar_url
      }));

      setSearchResults(formattedResults);
    } catch (error) {
      console.error("Error searching talents:", error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="space-y-2">
      <Label>Search Partner</Label>
      <div className="relative">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            className="pl-8"
            onChange={(e) => {
              setSearchQuery(e.target.value);
              searchTalents(e.target.value);
            }}
          />
        </div>
        {searchResults.length > 0 && (
          <div className="absolute top-full left-0 right-0 bg-white border rounded-md mt-1 shadow-lg z-50">
            {searchResults.map((result) => (
              <Button
                key={result.id}
                variant="ghost"
                className="w-full justify-start p-2 hover:bg-gray-100"
                onClick={() => {
                  onSelect(result);
                  setSearchQuery("");
                  setSearchResults([]);
                }}
              >
                <div className="flex items-center gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={result.avatar_url} alt={result.first_name} />
                    <AvatarFallback>{result.first_name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start">
                    <span className="font-medium">
                      {`${result.first_name} ${result.last_name}`}
                    </span>
                    <span className="text-sm text-muted-foreground">
                      {result.email}
                    </span>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}