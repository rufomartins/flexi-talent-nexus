import { Loader2 } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Json } from "@/integrations/supabase/types";

interface Activity {
  id: string;
  action_type: string;
  details: Json;
  created_at: string;
}

interface ActivityListProps {
  activities: Activity[];
  isLoading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const ActivityList = ({
  activities,
  isLoading,
  currentPage,
  totalPages,
  onPageChange,
}: ActivityListProps) => {
  const formatActivityText = (activity: Activity) => {
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

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-6 w-6 animate-spin" />
      </div>
    );
  }

  if (!activities.length) {
    return (
      <p className="text-muted-foreground text-center py-8">
        No recent activity to display
      </p>
    );
  }

  return (
    <>
      <ul className="space-y-4">
        {activities.map((activity) => (
          <li key={activity.id} className="flex items-center space-x-4">
            <div className="flex-1">
              <p className="text-sm text-muted-foreground">
                {formatActivityText(activity)}
              </p>
              <p className="text-xs text-muted-foreground">
                {new Date(activity.created_at).toLocaleDateString()}
              </p>
            </div>
          </li>
        ))}
      </ul>
      
      {totalPages > 1 && (
        <div className="mt-4">
          <Pagination>
            <PaginationContent>
              {currentPage > 1 && (
                <PaginationItem>
                  <PaginationPrevious 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(currentPage - 1);
                    }} 
                  />
                </PaginationItem>
              )}
              
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <PaginationItem key={page}>
                  <PaginationLink
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(page);
                    }}
                    isActive={currentPage === page}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              {currentPage < totalPages && (
                <PaginationItem>
                  <PaginationNext 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      onPageChange(currentPage + 1);
                    }} 
                  />
                </PaginationItem>
              )}
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </>
  );
};