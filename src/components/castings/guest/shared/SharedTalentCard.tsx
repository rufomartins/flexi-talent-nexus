import { useState } from "react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import type { GuestSelection } from "@/types/supabase/guest-selection";
import type { TalentProfile } from "@/types/talent";

interface SharedTalentCardProps {
  selection: GuestSelection & {
    talent_profiles: TalentProfile & {
      users: {
        id: string;
        full_name: string;
        avatar_url?: string;
      }
    }
  };
  readonly: boolean;
  allowComments: boolean;
}

export function SharedTalentCard({
  selection,
  readonly,
  allowComments
}: SharedTalentCardProps) {
  const [comment, setComment] = useState(selection.comments || '');
  const [isSaving, setIsSaving] = useState(false);

  const handleCommentSave = async () => {
    if (readonly || !allowComments) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('guest_selections')
        .update({ comments: comment })
        .eq('id', selection.id);

      if (error) throw error;
      toast.success('Comment saved');
    } catch (error) {
      console.error('Error saving comment:', error);
      toast.error('Failed to save comment');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center gap-4">
        <Avatar>
          <AvatarFallback>
            {selection.talent_profiles.users.full_name[0]}
          </AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-medium">
              {selection.talent_profiles.users.full_name}
            </h3>
            <Badge>#{selection.preference_order}</Badge>
          </div>
          <p className="text-sm text-gray-600">
            {selection.talent_profiles.country} • 
            {selection.talent_profiles.native_language}
          </p>
        </div>
      </div>

      {allowComments && (
        <div className="mt-4">
          <Label htmlFor={`comment-${selection.id}`}>Comments</Label>
          <div className="flex gap-2 mt-1">
            <Textarea
              id={`comment-${selection.id}`}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              disabled={readonly || isSaving}
              placeholder={readonly ? 'Comments disabled' : 'Add a comment...'}
              className="flex-1"
            />
            {!readonly && (
              <Button 
                size="sm"
                onClick={handleCommentSave}
                disabled={isSaving}
              >
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save'}
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}