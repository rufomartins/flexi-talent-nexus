import { useState } from "react";
import { TalentCardProps } from "./types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Heart, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

export function TalentCard({ talent, selection, view, onLike, onComment, onPreferenceOrder }: TalentCardProps) {
  const [isCommenting, setIsCommenting] = useState(false);
  const [comment, setComment] = useState(selection?.comments || "");

  const handleCommentSubmit = () => {
    onComment(comment);
    setIsCommenting(false);
  };

  if (view === "grid") {
    return (
      <Card className={cn(
        "overflow-hidden transition-shadow hover:shadow-md",
        selection?.liked && "ring-2 ring-primary ring-offset-2"
      )}>
        <CardHeader className="p-0">
          <div className="relative aspect-video bg-muted">
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
              <p className="text-sm text-muted-foreground">{talent.native_language}</p>
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
                onClick={() => onLike(!selection?.liked)}
              >
                <Heart
                  className={cn("h-4 w-4", selection?.liked && "fill-primary text-primary")}
                />
              </Button>
            </div>
          </div>

          {isCommenting && (
            <div className="mt-2 space-y-2">
              <Input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
              />
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsCommenting(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleCommentSubmit}
                >
                  Save
                </Button>
              </div>
            </div>
          )}

          <div className="mt-4">
            <Input
              type="number"
              placeholder="Preference order"
              value={selection?.preference_order || ""}
              onChange={(e) => onPreferenceOrder(parseInt(e.target.value))}
              className="w-32"
            />
          </div>
        </CardContent>
      </Card>
    );
  }

  // List view
  return (
    <Card className={cn(
      "transition-shadow hover:shadow-md",
      selection?.liked && "ring-2 ring-primary ring-offset-2"
    )}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-24 h-24 flex-shrink-0">
            {talent.user?.avatar_url ? (
              <img
                src={talent.user.avatar_url}
                alt={`${talent.user.first_name} ${talent.user.last_name}`}
                className="w-full h-full object-cover rounded-md"
              />
            ) : (
              <Avatar className="w-full h-full">
                <AvatarFallback>
                  {talent.user?.first_name?.[0]}
                  {talent.user?.last_name?.[0]}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="font-medium">
                  {talent.user?.first_name} {talent.user?.last_name}
                </h3>
                <p className="text-sm text-muted-foreground">{talent.native_language}</p>
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
                  onClick={() => onLike(!selection?.liked)}
                >
                  <Heart
                    className={cn("h-4 w-4", selection?.liked && "fill-primary text-primary")}
                  />
                </Button>
                <Input
                  type="number"
                  placeholder="Order"
                  value={selection?.preference_order || ""}
                  onChange={(e) => onPreferenceOrder(parseInt(e.target.value))}
                  className="w-20"
                />
              </div>
            </div>

            {isCommenting && (
              <div className="mt-4 space-y-2">
                <Input
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Add a comment..."
                  onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
                />
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCommenting(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={handleCommentSubmit}
                  >
                    Save
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}