import { useState } from "react";
import { Heart, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CommentDialog } from "../interactions/CommentDialog";
import { PreferenceInput } from "../interactions/PreferenceInput";
import type { TalentProfile } from "@/types/talent";
import type { GuestSelection } from "@/types/supabase/guest-selection";

interface TalentCardProps {
  talent: TalentProfile;
  selection?: GuestSelection;
  onSelect: (selection: Partial<GuestSelection>) => Promise<void>;
  view: 'grid' | 'list';
}

export function TalentCard({ talent, selection, onSelect, view }: TalentCardProps) {
  const [isCommenting, setIsCommenting] = useState(false);

  const handleCommentSave = async (comment: string) => {
    await onSelect({ comments: comment });
  };

  const handlePreferenceChange = async (rank: number) => {
    await onSelect({ preference_order: rank });
  };

  const handleFavoriteToggle = async () => {
    await onSelect({ is_favorite: !selection?.is_favorite });
  };

  if (view === "grid") {
    return (
      <Card className="overflow-hidden">
        <CardHeader className="p-0">
          <div className="relative aspect-video bg-muted">
            {talent.users.avatar_url ? (
              <img
                src={talent.users.avatar_url}
                alt={talent.users.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Avatar className="h-20 w-20">
                  <AvatarFallback>
                    {talent.users.full_name.charAt(0)}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-4">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-medium">
                {talent.users.full_name}
              </h3>
              <p className="text-sm text-muted-foreground">{talent.native_language}</p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsCommenting(true)}
              >
                <MessageSquare className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleFavoriteToggle}
              >
                <Heart
                  className={`h-4 w-4 ${selection?.is_favorite ? "fill-primary text-primary" : ""}`}
                />
              </Button>
            </div>
          </div>

          <div className="mt-4">
            <PreferenceInput
              currentRank={selection?.preference_order}
              onRankChange={handlePreferenceChange}
            />
          </div>
        </CardContent>

        <CommentDialog
          isOpen={isCommenting}
          onClose={() => setIsCommenting(false)}
          selection={selection || {
            id: "",
            casting_id: "",
            talent_id: talent.id,
            guest_id: "",
            is_favorite: false,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          }}
          onSave={handleCommentSave}
        />
      </Card>
    );
  }

  // List view
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-24 h-24 flex-shrink-0">
            {talent.users.avatar_url ? (
              <img
                src={talent.users.avatar_url}
                alt={talent.users.full_name}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <Avatar className="w-full h-full">
                <AvatarFallback>
                  {talent.users.full_name.charAt(0)}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  {talent.users.full_name}
                </h3>
                <p className="text-sm text-muted-foreground">{talent.native_language}</p>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCommenting(true)}
                >
                  <MessageSquare className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleFavoriteToggle}
                >
                  <Heart
                    className={`h-4 w-4 ${selection?.is_favorite ? "fill-primary text-primary" : ""}`}
                  />
                </Button>
                <PreferenceInput
                  currentRank={selection?.preference_order}
                  onRankChange={handlePreferenceChange}
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <CommentDialog
        isOpen={isCommenting}
        onClose={() => setIsCommenting(false)}
        selection={selection || {
          id: "",
          casting_id: "",
          talent_id: talent.id,
          guest_id: "",
          is_favorite: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        }}
        onSave={handleCommentSave}
      />
    </Card>
  );
}