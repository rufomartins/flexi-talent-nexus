
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TalentProfile } from "@/types/talent";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Tag, Briefcase, UserX, AlertTriangle } from "lucide-react";
import { formatInitials } from "@/lib/utils";

interface TalentListItemProps {
  talent: TalentProfile;
  isSelected: boolean;
  onSelect: (id: string) => void;
  isSuperAdmin: boolean;
  isAdmin: boolean;
}

export function TalentListItem({ talent, isSelected, onSelect, isSuperAdmin, isAdmin }: TalentListItemProps) {
  const navigate = useNavigate(); // Add useNavigate hook
  const [isHovered, setIsHovered] = useState(false);

  const handleCardClick = (e: React.MouseEvent) => {
    // Only navigate if the click didn't happen on a checkbox or dropdown
    if (!(e.target as HTMLElement).closest('.checkbox-area, .dropdown-area')) {
      navigate(`/talents/${talent.id}`);
    }
  };
  
  return (
    <Card 
      className="p-4 hover:shadow-md transition-shadow cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick} // Add onClick handler for navigation
    >
      <div className="flex items-center gap-4">
        <div className="checkbox-area" onClick={(e) => e.stopPropagation()}>
          <Checkbox
            checked={isSelected}
            onCheckedChange={() => onSelect(talent.id)}
          />
        </div>
        <Avatar className="h-12 w-12">
          <AvatarImage src={talent.users?.avatar_url || ''} alt={talent.users?.full_name} />
          <AvatarFallback>{formatInitials(talent.users?.full_name || '')}</AvatarFallback>
        </Avatar>
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{talent.users?.full_name}</p>
              {talent.talent_category && (
                <Badge variant="outline" className="mt-1">
                  {talent.talent_category}
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-2">
              {talent.is_duo && (
                <Badge variant="secondary" className="text-xs">
                  DUO
                </Badge>
              )}
              <Badge 
                variant={
                  talent.evaluation_status === 'approved' 
                    ? 'default' 
                    : talent.evaluation_status === 'rejected'
                    ? 'destructive'
                    : 'secondary'
                }
                className="text-xs"
              >
                {talent.evaluation_status}
              </Badge>
              <div className="dropdown-area" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger className="h-8 w-8 flex items-center justify-center rounded-full hover:bg-muted">
                    <MoreHorizontal className="h-4 w-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem className="cursor-pointer">
                      <Tag className="mr-2 h-4 w-4" /> Tag Talent
                    </DropdownMenuItem>
                    <DropdownMenuItem className="cursor-pointer">
                      <Briefcase className="mr-2 h-4 w-4" /> Add to Casting
                    </DropdownMenuItem>
                    {isSuperAdmin && (
                      <DropdownMenuItem className="cursor-pointer text-destructive">
                        <UserX className="mr-2 h-4 w-4" /> Delete Talent
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </div>
          <div className="mt-1 text-sm text-muted-foreground">
            <div className="flex items-center gap-4">
              <span>{talent.country || 'Location not set'}</span>
              <span>{talent.native_language || 'Language not set'}</span>
            </div>
            {talent.casting_talents && talent.casting_talents.length > 0 && (
              <div className="mt-1 text-xs">
                <span>Active in {talent.casting_talents.length} casting{talent.casting_talents.length > 1 ? 's' : ''}</span>
              </div>
            )}
            {(isHovered && talent.talent_category === 'UGC' && talent.is_duo) && (
              <div className="mt-1 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3 text-amber-500" />
                <span className="text-xs text-amber-500">Duo partner required</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
