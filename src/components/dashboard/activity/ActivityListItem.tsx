import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  FileCheck, 
  FileX, 
  Clock, 
  CheckCircle2, 
  XCircle,
  AlertCircle,
  Briefcase
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ActivityListItemProps {
  activity: {
    id: string;
    action_type: string;
    created_at: string;
    details?: {
      status?: string;
      name?: string;
      project?: string;
      [key: string]: any;
    } | null;
  };
}

export const ActivityListItem = ({ activity }: ActivityListItemProps) => {
  const getIcon = () => {
    if (activity.action_type === 'registration') {
      switch (activity.details?.status) {
        case 'approved':
          return <FileCheck className="h-5 w-5 text-green-500" />;
        case 'rejected':
          return <FileX className="h-5 w-5 text-red-500" />;
        case 'under_evaluation':
          return <Clock className="h-5 w-5 text-yellow-500" />;
        default:
          return <UserPlus className="h-5 w-5 text-blue-500" />;
      }
    } else if (activity.action_type === 'project') {
      switch (activity.details?.status) {
        case 'approved':
          return <CheckCircle2 className="h-5 w-5 text-green-500" />;
        case 'rejected':
          return <XCircle className="h-5 w-5 text-red-500" />;
        case 'under_revision':
          return <AlertCircle className="h-5 w-5 text-yellow-500" />;
        default:
          return <Briefcase className="h-5 w-5 text-blue-500" />;
      }
    }
    return <Briefcase className="h-5 w-5 text-gray-500" />;
  };

  const getStatusBadge = () => {
    const status = activity.details?.status;
    if (!status) return null;

    const variants: Record<string, string> = {
      approved: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
      rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
      under_evaluation: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      under_revision: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
      new: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100'
    };

    return (
      <Badge 
        variant="secondary" 
        className={cn("capitalize", variants[status])}
      >
        {status.replace('_', ' ')}
      </Badge>
    );
  };

  const getActivityTitle = () => {
    const type = activity.action_type;
    const status = activity.details?.status;
    const name = activity.details?.name;
    const project = activity.details?.project;

    if (type === 'registration') {
      return (
        <span>
          New registration: <span className="font-medium">{name}</span>
        </span>
      );
    } else if (type === 'project') {
      return (
        <span>
          Project update: <span className="font-medium">{project}</span>
        </span>
      );
    }
    return 'Activity';
  };

  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-muted/50 rounded-lg transition-colors">
      <div className="flex-shrink-0 mt-1">
        {getIcon()}
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-foreground">
            {getActivityTitle()}
          </p>
          <div className="flex items-center space-x-2">
            {getStatusBadge()}
            <time className="text-sm text-muted-foreground">
              {format(new Date(activity.created_at), 'MMM d, yyyy')}
            </time>
          </div>
        </div>
        {activity.details?.description && (
          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {activity.details.description}
          </p>
        )}
      </div>
    </div>
  );
};