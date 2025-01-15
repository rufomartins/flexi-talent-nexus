import { useQuery } from "@tanstack/react-query";
import { MessageCircle, MoreVertical, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/integrations/supabase/client";

interface SelectionSummaryProps {
  castingId: string;
  guestId: string;
}

interface Selection {
  talent_id: string;
  preference_order: number;
  comments: string | null;
  talent_name: string;
  talent_avatar: string | null;
}

export function SelectionSummary({ castingId, guestId }: SelectionSummaryProps) {
  const { data: selections, isLoading } = useQuery({
    queryKey: ['guest-selections', castingId, guestId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guest_selections')
        .select(`
          talent_id,
          preference_order,
          comments,
          talent_profiles!inner (
            id,
            user:user_id (
              full_name,
              avatar_url
            )
          )
        `)
        .eq('casting_id', castingId)
        .eq('guest_id', guestId)
        .order('preference_order', { ascending: true });

      if (error) throw error;

      return data.map((selection) => ({
        talent_id: selection.talent_id,
        preference_order: selection.preference_order,
        comments: selection.comments,
        talent_name: selection.talent_profiles.user.full_name,
        talent_avatar: selection.talent_profiles.user.avatar_url
      })) as Selection[];
    }
  });

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Your Selections</h2>
        <Badge variant="secondary">
          {selections?.length || 0} Selected
        </Badge>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin" />
        </div>
      ) : selections?.length ? (
        <div className="space-y-3">
          {selections.map((selection) => (
            <div 
              key={selection.talent_id}
              className="flex items-center gap-3 p-2 bg-gray-50 rounded-md"
            >
              <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-700 rounded-full font-medium">
                #{selection.preference_order}
              </div>
              
              <div className="flex items-center gap-2 flex-grow">
                <Avatar>
                  <AvatarImage 
                    src={selection.talent_avatar || undefined} 
                    alt={selection.talent_name} 
                  />
                  <AvatarFallback>
                    {selection.talent_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">
                  {selection.talent_name}
                </span>
              </div>

              {selection.comments && (
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MessageCircle className="w-4 h-4 text-gray-500" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{selection.comments}</p>
                  </TooltipContent>
                </Tooltip>
              )}

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onSelect={() => {/* TODO: Implement edit */}}>
                    Edit Preference
                  </DropdownMenuItem>
                  <DropdownMenuItem onSelect={() => {/* TODO: Implement edit */}}>
                    Add/Edit Comment
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    onSelect={() => {/* TODO: Implement remove */}}
                    className="text-red-600"
                  >
                    Remove Selection
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-500">
          No selections yet. Select talents by assigning preference numbers (1-20).
        </div>
      )}
    </div>
  );
}