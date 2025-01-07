import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Loader2, Filter } from "lucide-react";
import { useState } from "react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const RecentActivity = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [activityType, setActivityType] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState<Date | undefined>();
  const itemsPerPage = 10;

  const { data, isLoading } = useQuery({
    queryKey: ['recent-activities', currentPage, activityType, dateRange],
    queryFn: async () => {
      const from = (currentPage - 1) * itemsPerPage;
      const to = from + itemsPerPage - 1;

      let query = supabase
        .from('user_activity_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(from, to);

      if (activityType) {
        query = query.eq('action_type', activityType);
      }

      if (dateRange) {
        const startOfDay = new Date(dateRange);
        startOfDay.setHours(0, 0, 0, 0);
        const endOfDay = new Date(dateRange);
        endOfDay.setHours(23, 59, 59, 999);

        query = query.gte('created_at', startOfDay.toISOString())
          .lte('created_at', endOfDay.toISOString());
      }

      const { data: activities, error, count } = await query;

      if (error) {
        console.error('Error fetching recent activities:', error);
        return { activities: [], totalCount: 0 };
      }

      return { activities: activities || [], totalCount: count || 0 };
    }
  });

  const totalPages = data?.totalCount ? Math.ceil(data.totalCount / itemsPerPage) : 0;

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const activityTypes = [
    "login",
    "profile_update",
    "casting_created",
    "talent_added",
    "booking_confirmed"
  ];

  return (
    <div className="mt-8">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Recent Activity</h2>
        <div className="flex gap-2">
          <Select
            value={activityType || ""}
            onValueChange={(value) => setActivityType(value || null)}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All types</SelectItem>
              {activityTypes.map((type) => (
                <SelectItem key={type} value={type}>
                  {type.replace('_', ' ').charAt(0).toUpperCase() + type.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "justify-start text-left font-normal",
                  !dateRange && "text-muted-foreground"
                )}
              >
                <Filter className="mr-2 h-4 w-4" />
                {dateRange ? format(dateRange, "PPP") : "Pick a date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={dateRange}
                onSelect={setDateRange}
                initialFocus
              />
            </PopoverContent>
          </Popover>

          {(dateRange || activityType) && (
            <Button 
              variant="ghost"
              onClick={() => {
                setDateRange(undefined);
                setActivityType(null);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>

      <div className="bg-card rounded-lg shadow p-6">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin" />
          </div>
        ) : data?.activities && data.activities.length > 0 ? (
          <>
            <ul className="space-y-4">
              {data.activities.map((activity) => (
                <li key={activity.id} className="flex items-center space-x-4">
                  <div className="flex-1">
                    <p className="text-sm text-muted-foreground">
                      {activity.action_type}
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
                            handlePageChange(currentPage - 1);
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
                            handlePageChange(page);
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
                            handlePageChange(currentPage + 1);
                          }} 
                        />
                      </PaginationItem>
                    )}
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        ) : (
          <p className="text-muted-foreground text-center py-8">
            No recent activity to display
          </p>
        )}
      </div>
    </div>
  );
};