import { format } from 'date-fns';
import { 
  FileUp, 
  MessageSquare, 
  Mail, 
  RefreshCw, 
  Plus,
  Edit,
  User
} from 'lucide-react';
import { TimelineEvent } from '@/types/supabase/timeline';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface TimelineEventProps {
  event: TimelineEvent;
}

export const TimelineEventItem: React.FC<TimelineEventProps> = ({ event }) => {
  const getEventIcon = () => {
    switch (event.event_type) {
      case 'file_upload':
        return <FileUp className="h-4 w-4" />;
      case 'comment':
        return <MessageSquare className="h-4 w-4" />;
      case 'email_sent':
        return <Mail className="h-4 w-4" />;
      case 'status_change':
        return <RefreshCw className="h-4 w-4" />;
      case 'booking_created':
        return <Plus className="h-4 w-4" />;
      case 'booking_updated':
        return <Edit className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getEventContent = () => {
    switch (event.event_type) {
      case 'status_change':
        return (
          <span>
            Changed status from{' '}
            <span className="font-medium">{event.details.previous_status}</span> to{' '}
            <span className="font-medium">{event.details.new_status}</span>
          </span>
        );
      case 'file_upload':
        return (
          <span>
            Uploaded file: <span className="font-medium">{event.details.file_name}</span>
          </span>
        );
      case 'comment':
        return <span>{event.details.comment_text}</span>;
      case 'email_sent':
        return <span>Sent email using template</span>;
      case 'booking_created':
        return <span>Created booking</span>;
      case 'booking_updated':
        return (
          <span>
            Updated booking details
            {event.details.changes && (
              <span className="text-sm text-muted-foreground block mt-1">
                {Object.entries(event.details.changes)
                  .map(([key, value]) => `${key}: ${value}`)
                  .join(', ')}
              </span>
            )}
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex items-start gap-4 group">
      <div className="flex-shrink-0 mt-1">
        <Avatar className="h-8 w-8">
          <AvatarImage src={event.users?.avatar_url} />
          <AvatarFallback>
            <User className="h-4 w-4" />
          </AvatarFallback>
        </Avatar>
      </div>
      
      <div className="flex-grow">
        <div className="flex items-center gap-2">
          <span className="font-medium">{event.users?.full_name}</span>
          <span className="text-sm text-muted-foreground">
            {format(new Date(event.created_at), 'MMM d, yyyy HH:mm')}
          </span>
        </div>
        
        <div className="mt-1 flex items-center gap-2">
          <div className="p-1.5 rounded-full bg-muted">
            {getEventIcon()}
          </div>
          <div className="text-sm">{getEventContent()}</div>
        </div>
      </div>
    </div>
  );
};