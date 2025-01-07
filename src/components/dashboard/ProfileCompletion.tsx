import { CircleProgress } from "lucide-react";
import { useAuth } from "@/contexts/auth";
import { useProfileCompletion } from "@/hooks/useProfileCompletion";
import { Skeleton } from "@/components/ui/skeleton";

export const ProfileCompletion = () => {
  const { user } = useAuth();
  const { data: completion, isLoading } = useProfileCompletion(user?.id || "");

  if (isLoading) {
    return (
      <div className="flex flex-col items-center gap-2">
        <Skeleton className="h-24 w-24 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </div>
    );
  }

  if (!completion) return null;

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative">
        <CircleProgress className="h-24 w-24 text-muted-foreground" />
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-2xl font-bold">{completion.total}%</span>
        </div>
      </div>
      <div className="text-sm text-muted-foreground">Profile Completion</div>
      
      <div className="w-full space-y-2">
        <div className="flex justify-between text-xs">
          <span>Media</span>
          <span>{completion.breakdown.media}%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Experience</span>
          <span>{completion.breakdown.experience}%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Basic Info</span>
          <span>{completion.breakdown.basicProfile}%</span>
        </div>
        <div className="flex justify-between text-xs">
          <span>Social Media</span>
          <span>{completion.breakdown.socialMedia}%</span>
        </div>
      </div>
    </div>
  );
};