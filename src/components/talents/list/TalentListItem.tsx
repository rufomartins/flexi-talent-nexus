import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { TalentProfile } from "@/types/talent";

interface TalentListItemProps {
  talent: TalentProfile;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

export const TalentListItem: React.FC<TalentListItemProps> = ({
  talent,
  isSelected,
  onSelect,
  isSuperAdmin,
  isAdmin
}) => {
  return (
    <div className="p-4 bg-white rounded-lg shadow flex items-center gap-4">
      <Checkbox
        checked={isSelected}
        onCheckedChange={() => onSelect(talent.id)}
        className="mt-1"
      />
      <div className="relative">
        <Avatar className="h-12 w-12">
          {talent.users?.avatar_url ? (
            <AvatarImage
              src={talent.users.avatar_url}
              alt={talent.users.full_name || ''}
            />
          ) : (
            <AvatarFallback>
              {talent.users?.full_name?.[0]}
            </AvatarFallback>
          )}
        </Avatar>
        <Badge 
          variant={talent.evaluation_status === 'approved' ? 'default' : 'secondary'}
          className="absolute -top-2 -right-2 text-xs"
        >
          {talent.evaluation_status}
        </Badge>
      </div>
      <div className="flex-1">
        <h3 className="font-medium">
          {talent.users?.full_name}
        </h3>
        <div className="text-sm text-muted-foreground">
          {talent.casting_talents?.slice(0, 3).map(ct => ct.castings.name).join(', ')}
        </div>
        <div className="flex gap-2 mt-1">
          <Badge variant="outline">{talent.talent_category}</Badge>
          {talent.native_language && (
            <Badge variant="outline">{talent.native_language}</Badge>
          )}
        </div>
      </div>
      {(isSuperAdmin || isAdmin) && talent.fee_range && (
        <div className="text-sm text-muted-foreground">
          Avg. Rate: ${talent.fee_range.min}-${talent.fee_range.max}
        </div>
      )}
    </div>
  );
};