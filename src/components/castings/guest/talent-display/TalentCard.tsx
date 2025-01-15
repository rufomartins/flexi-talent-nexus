import { useState } from "react";
import { MessageSquare, Heart, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import type { TalentCardProps } from "./types";

export function TalentCard({
  talent,
  selection,
  view,
  onPreferenceSet,
  onCommentAdd,
  isSaving,
  errorMessage
}: TalentCardProps) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState(selection?.comments || "");
  const [preferenceOrder, setPreferenceOrder] = useState<string>(
    selection?.preference_order?.toString() || ""
  );

  const handlePreferenceChange = async (value: string) => {
    setPreferenceOrder(value);
    const order = parseInt(value, 10);
    if (!isNaN(order) && order >= 1 && order <= 20) {
      await onPreferenceSet(talent.id, order);
    }
  };

  const handleCommentSave = async () => {
    await onCommentAdd(talent.id, comment);
    setIsCommenting(false);
  };

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-video bg-gray-100">
          {talent.users?.avatar_url ? (
            <img
              src={talent.users.avatar_url}
              alt={`${talent.users.first_name} ${talent.users.last_name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Avatar className="h-20 w-20">
                <AvatarFallback>
                  {talent.users?.first_name?.[0]}
                  {talent.users?.last_name?.[0]}
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
              {talent.users?.first_name} {talent.users?.last_name}
            </h3>
            <p className="text-sm text-gray-600">{talent.native_language}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsCommenting(!isCommenting)}
            >
              <MessageSquare className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => onCommentAdd(talent.id, comment)}
            >
              <Heart
                className={`h-4 w-4 ${selection?.liked ? "fill-red-500 text-red-500" : ""}`}
              />
            </Button>
          </div>
        </div>

        {isCommenting && (
          <div className="mt-2">
            <Input
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              onBlur={handleCommentSave}
            />
          </div>
        )}

        <div className="mt-4 relative">
          <Input
            type="number"
            min="1"
            max="20"
            value={preferenceOrder}
            onChange={(e) => handlePreferenceChange(e.target.value)}
            placeholder="Preference order (1-20)"
            className={`w-32 ${isSaving ? "bg-gray-100" : ""}`}
            disabled={isSaving}
          />
          
          {isSaving && (
            <div className="absolute right-2 top-1/2 -translate-y-1/2">
              <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
            </div>
          )}
          
          {errorMessage && (
            <p className="text-sm text-red-500 mt-1">{errorMessage}</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}