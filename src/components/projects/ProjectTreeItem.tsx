import { ChevronDown, ChevronRight, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ProjectTreeItemProps {
  name: string;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
  hasChildren?: boolean;
  statuses?: {
    script_status?: string;
    translation_status?: string;
    review_status?: string;
    talent_status?: string;
    delivery_status?: string;
  };
  statusColors: Record<string, Record<string, string>>;
}

export function ProjectTreeItem({
  name,
  level,
  isExpanded,
  onToggle,
  hasChildren,
  statuses,
  statusColors,
}: ProjectTreeItemProps) {
  return (
    <div
      className={cn(
        "grid grid-cols-12 gap-4 p-4 hover:bg-gray-50",
        level > 0 && "border-t"
      )}
      style={{ paddingLeft: `${level * 8 + 16}px` }}
    >
      <div className="col-span-3 font-medium flex items-center gap-2">
        {hasChildren && (
          <button onClick={onToggle} className="p-1 hover:bg-gray-100 rounded">
            {isExpanded ? (
              <ChevronDown className="h-4 w-4" />
            ) : (
              <ChevronRight className="h-4 w-4" />
            )}
          </button>
        )}
        <span>{name}</span>
      </div>
      
      {statuses ? (
        <>
          <div className="col-span-2">
            <span className={cn("px-2 py-1 rounded-full text-xs", 
              statusColors.script[statuses.script_status || "Pending"])}>
              {statuses.script_status || "Pending"}
            </span>
          </div>
          <div className="col-span-2">
            <span className={cn("px-2 py-1 rounded-full text-xs",
              statusColors.translation[statuses.translation_status || "Pending"])}>
              {statuses.translation_status || "Pending"}
            </span>
          </div>
          <div className="col-span-1">
            <span className={cn("px-2 py-1 rounded-full text-xs",
              statusColors.review[statuses.review_status || "Internal Review"])}>
              {statuses.review_status || "Internal Review"}
            </span>
          </div>
          <div className="col-span-2">
            <span className={cn("px-2 py-1 rounded-full text-xs",
              statusColors.talent[statuses.talent_status || "Booked"])}>
              {statuses.talent_status || "Booked"}
            </span>
          </div>
          <div className="col-span-1">
            <span className={cn("px-2 py-1 rounded-full text-xs",
              statusColors.delivery[statuses.delivery_status || "Pending"])}>
              {statuses.delivery_status || "Pending"}
            </span>
          </div>
          <div className="col-span-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </div>
        </>
      ) : (
        <div className="col-span-9"></div>
      )}
    </div>
  );
}