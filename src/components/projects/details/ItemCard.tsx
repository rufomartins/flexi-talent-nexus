import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User } from "lucide-react";
import { ProjectItem } from "@/types/supabase/projects";
import { format } from "date-fns";

interface ItemCardProps {
  item: ProjectItem;
  onStatusChange: (status: string) => void;
  onAssignTalent: (talentId: string) => void;
  onAssignReviewer: (reviewerId: string) => void;
}

export function ItemCard({ item, onStatusChange, onAssignTalent, onAssignReviewer }: ItemCardProps) {
  return (
    <Card className="p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="space-y-2">
          <h3 className="font-medium">{item.title}</h3>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Badge variant="outline">{item.language}</Badge>
            <Badge variant="outline">{item.country}</Badge>
          </div>
        </div>
        <Badge>{item.status}</Badge>
      </div>
      
      <div className="mt-4 space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Calendar className="h-4 w-4" />
          <span>Due: {format(new Date(item.deadline), 'MMM d, yyyy')}</span>
        </div>
        
        <div className="flex items-center gap-2">
          {item.talent_id ? (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>Talent assigned</span>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAssignTalent('')}
            >
              Assign Talent
            </Button>
          )}
          
          {item.reviewer_id ? (
            <div className="flex items-center gap-2 text-sm">
              <User className="h-4 w-4" />
              <span>Reviewer assigned</span>
            </div>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => onAssignReviewer('')}
            >
              Assign Reviewer
            </Button>
          )}
        </div>
      </div>
    </Card>
  );
}