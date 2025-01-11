import { Heart, MessageSquare } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface TalentCardProps {
  talent: any; // Will be properly typed with your TalentProfile type
  selection?: any; // Will be properly typed with your TalentSelection type
  onSelect: (selection: any) => void;
}

export const TalentCard: React.FC<TalentCardProps> = ({
  talent,
  selection,
  onSelect,
}) => {
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState(selection?.comments || "");

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-0">
        <div className="relative aspect-video bg-gray-100">
          {talent.user?.avatar_url ? (
            <img
              src={talent.user.avatar_url}
              alt={`${talent.user.first_name} ${talent.user.last_name}`}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Avatar className="h-20 w-20">
                <AvatarFallback>
                  {talent.user?.first_name?.[0]}
                  {talent.user?.last_name?.[0]}
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
              {talent.user?.first_name} {talent.user?.last_name}
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
              onClick={() => onSelect({ ...selection, liked: !selection?.liked })}
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
              onBlur={() => {
                onSelect({ ...selection, comments: comment });
                setIsCommenting(false);
              }}
            />
          </div>
        )}

        <div className="mt-4">
          <Input
            type="number"
            placeholder="Preference order"
            value={selection?.preference_order || ""}
            onChange={(e) =>
              onSelect({ ...selection, preference_order: parseInt(e.target.value) })
            }
            className="w-32"
          />
        </div>
      </CardContent>
    </Card>
  );
};