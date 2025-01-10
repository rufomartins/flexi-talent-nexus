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

// Define the shape of our raw query result
interface UserWithProfile {
  id: string;
  first_name: string | null;
  last_name: string | null;
  email: string | null;
  avatar_url: string | null;
  talent_profiles: {
    id: string;
    user_id: string;
  }[];
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
        .from('users')
        .select<string, UserWithProfile>(`
          id,
          first_name,
          last_name,
          email,
          avatar_url,
          talent_profiles!inner (
            id,
            user_id
          )
        `)
        .or(`first_name.ilike.%${query}%,last_name.ilike.%${query}%,email.ilike.%${query}%`)
        .not('talent_profiles.id', 'eq', currentTalentId)
        .limit(5);

      if (error) {
        console.error('Search error:', error);
        setSearchResults([]);
        return;
      }

      if (!data) {
        setSearchResults([]);
        return;
      }

      // Transform the data to match DuoPartner interface
      const partners: DuoPartner[] = data.map(user => ({
        id: user.talent_profiles[0].id,
        user_id: user.id,
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        email: user.email || '',
        avatar_url: user.avatar_url || undefined
      }));

      setSearchResults(partners);
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