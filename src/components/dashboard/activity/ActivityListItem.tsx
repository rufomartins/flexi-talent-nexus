import { useNavigate } from "react-router-dom";
import { Json } from "@/integrations/supabase/types";

interface ActivityListItemProps {
  activity: {
    id: string;
    action_type: string;
    details: Json;
    created_at: string;
  };
}

export const ActivityListItem = ({ activity }: ActivityListItemProps) => {
  const navigate = useNavigate();

  const formatActivityText = (activity: ActivityListItemProps['activity']) => {
    const { action_type, details } = activity;
    
    if (action_type === 'registration') {
      const status = (details as { status?: string })?.status || 'under_evaluation';
      return `New registration - ${status.replace('_', ' ')}`;
    }
    
    if (action_type === 'project') {
      const status = (details as { status?: string })?.status || 'new';
      return `Project - ${status.replace('_', ' ')}`;
    }
    
    return action_type;
  };

  const handleActivityClick = () => {
    const { action_type, details } = activity;
    
    if (action_type === 'registration') {
      const status = (details as { status?: string })?.status || 'under_evaluation';
      navigate(`/talents?filter=${status}`);
    }
    
    if (action_type === 'project') {
      const status = (details as { status?: string })?.status || 'new';
      navigate(`/projects?status=${status}`);
    }
  };

  return (
    <li 
      className="flex items-center space-x-4 p-3 rounded-md hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={handleActivityClick}
    >
      <div className="flex-1">
        <p className="text-sm text-muted-foreground">
          {formatActivityText(activity)}
        </p>
        <p className="text-xs text-muted-foreground">
          {new Date(activity.created_at).toLocaleDateString()}
        </p>
      </div>
    </li>
  );
};