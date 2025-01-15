import { useState } from "react";
import { MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import type { TalentProfile } from "@/types/talent";
import type { GuestSelection } from "@/types/supabase/guest-selection";

interface TalentCardProps {
  talent: TalentProfile;
  selection?: GuestSelection;
  onPreferenceSet: (talentId: string, order: number) => Promise<void>;
  onCommentAdd: (talentId: string, comment: string) => Promise<void>;
  view: 'grid' | 'list';
}

export function TalentCard({ 
  talent, 
  selection, 
  onPreferenceSet, 
  onCommentAdd,
  view 
}: TalentCardProps) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState(selection?.comments || "");
  const [preferenceOrder, setPreferenceOrder] = useState<number | undefined>(
    selection?.preference_order
  );

  const handlePreferenceChange = async (value: string) => {
    const order = parseInt(value);
    if (!isNaN(order) && order >= 1 && order <= 20) {
      setPreferenceOrder(order);
      await onPreferenceSet(talent.id, order);
    }
  };

  const handleCommentSave = async () => {
    await onCommentAdd(talent.id, comment);
    setIsCommenting(false);
  };

  if (view === 'grid') {
    return (
      <Card>
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
              <h3 className="font-medium">{talent.users.full_name}</h3>
              <p className="text-sm text-muted-foreground">{talent.native_language}</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCommenting(true)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
          </div>

          <Input
            type="number"
            min="1"
            max="20"
            value={preferenceOrder || ''}
            onChange={(e) => handlePreferenceChange(e.target.value)}
            placeholder="Set preference (1-20)"
            className="w-full"
          />
        </CardContent>

        <Dialog open={isCommenting} onOpenChange={setIsCommenting}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Comment</DialogTitle>
            </DialogHeader>
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add your comments..."
              className="min-h-[100px]"
            />
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsCommenting(false)}>
                Cancel
              </Button>
              <Button onClick={handleCommentSave}>Save Comment</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
                <Input
                  type="number"
                  min="1"
                  max="20"
                  value={preferenceOrder || ''}
                  onChange={(e) => handlePreferenceChange(e.target.value)}
                  placeholder="Preference"
                  className="w-20"
                />
              </div>
            </div>
          </div>
        </div>
      </CardContent>

      <Dialog open={isCommenting} onOpenChange={setIsCommenting}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Comment</DialogTitle>
          </DialogHeader>
          <Textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Add your comments..."
            className="min-h-[100px]"
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCommenting(false)}>
              Cancel
            </Button>
            <Button onClick={handleCommentSave}>Save Comment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Card>
  );
}