import { ChevronRight, MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import type { Project } from "./types";

interface ProjectTreeItemProps {
  name: string;
  level: number;
  isExpanded: boolean;
  onToggle: () => void;
  hasChildren: boolean;
  statuses?: {
    script_status?: string;
    translation_status?: string;
    review_status?: string;
    talent_status?: string;
    delivery_status?: string;
  };
  statusColors: Record<string, Record<string, string>>;
  id?: string;
}

export function ProjectTreeItem({
  name,
  level,
  isExpanded,
  onToggle,
  hasChildren,
  statuses,
  statusColors,
  id
}: ProjectTreeItemProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (level === 3 && id) {
      navigate(`/projects/shot-list/${id}`);
    } else if (hasChildren) {
      onToggle();
    }
  };

  return (
    <div className="p-4 hover:bg-accent cursor-pointer" onClick={handleClick}>
      <div className="grid grid-cols-12 gap-4 items-center">
        <div
          className="col-span-3 flex items-center gap-1"
          style={{ paddingLeft: `${level * 20}px` }}
        >
          {hasChildren && (
            <ChevronRight
              className={cn("h-4 w-4 transition-transform", {
                "transform rotate-90": isExpanded,
              })}
            />
          )}
          <span className="truncate">{name}</span>
        </div>
        
        {statuses ? (
          <>
            <div className="col-span-2">
              {statuses.script_status && (
                <span className={cn("px-2 py-1 rounded-full text-xs", statusColors.script[statuses.script_status])}>
                  {statuses.script_status}
                </span>
              )}
            </div>
            <div className="col-span-2">
              {statuses.translation_status && (
                <span className={cn("px-2 py-1 rounded-full text-xs", statusColors.translation[statuses.translation_status])}>
                  {statuses.translation_status}
                </span>
              )}
            </div>
            <div className="col-span-1">
              {statuses.review_status && (
                <span className={cn("px-2 py-1 rounded-full text-xs", statusColors.review[statuses.review_status])}>
                  {statuses.review_status}
                </span>
              )}
            </div>
            <div className="col-span-2">
              {statuses.talent_status && (
                <span className={cn("px-2 py-1 rounded-full text-xs", statusColors.talent[statuses.talent_status])}>
                  {statuses.talent_status}
                </span>
              )}
            </div>
            <div className="col-span-1">
              {statuses.delivery_status && (
                <span className={cn("px-2 py-1 rounded-full text-xs", statusColors.delivery[statuses.delivery_status])}>
                  {statuses.delivery_status}
                </span>
              )}
            </div>
          </>
        ) : (
          <div className="col-span-8" />
        )}
        
        <div className="col-span-1 flex justify-end">
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <MoreVertical className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

interface ProjectTreeProps {
  projects: Project[];
  statusColors: Record<string, Record<string, string>>;
}

export function ProjectTree({ projects, statusColors }: ProjectTreeProps) {
  const [expandedNodes, setExpandedNodes] = useState<Record<string, boolean>>({});

  const toggleNode = (nodeId: string) => {
    setExpandedNodes(prev => ({
      ...prev,
      [nodeId]: !prev[nodeId]
    }));
  };

  const renderTree = (projects: Project[]) => {
    return projects.map(project => (
      <div key={project.id}>
        <ProjectTreeItem
          name={project.name}
          level={0}
          isExpanded={expandedNodes[`project-${project.id}`]}
          onToggle={() => toggleNode(`project-${project.id}`)}
          hasChildren={project.countries?.length > 0}
          statusColors={statusColors}
        />
        
        {expandedNodes[`project-${project.id}`] && project.countries?.map(country => (
          <div key={country.id}>
            <ProjectTreeItem
              name={country.country_name}
              level={1}
              isExpanded={expandedNodes[`country-${country.id}`]}
              onToggle={() => toggleNode(`country-${country.id}`)}
              hasChildren={country.languages.length > 0}
              statusColors={statusColors}
            />
            
            {expandedNodes[`country-${country.id}`] && country.languages.map(language => (
              <div key={language.id}>
                <ProjectTreeItem
                  name={language.language_name}
                  level={2}
                  isExpanded={expandedNodes[`language-${language.id}`]}
                  onToggle={() => toggleNode(`language-${language.id}`)}
                  hasChildren={language.tasks?.length > 0}
                  statusColors={statusColors}
                />
                
                {expandedNodes[`language-${language.id}`] && language.tasks?.map(task => (
                  <ProjectTreeItem
                    key={task.id}
                    name={task.name}
                    level={3}
                    isExpanded={false}
                    onToggle={() => {}}
                    hasChildren={false}
                    statuses={{
                      script_status: task.script_status,
                      review_status: task.review_status,
                      talent_status: task.talent_status,
                      delivery_status: task.delivery_status,
                    }}
                    statusColors={statusColors}
                    id={task.id}
                  />
                ))}
              </div>
            ))}
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm">
      <div className="grid grid-cols-12 gap-4 p-4 border-b font-medium text-sm">
        <div className="col-span-3">Name</div>
        <div className="col-span-2">Script</div>
        <div className="col-span-2">Review</div>
        <div className="col-span-2">Talent</div>
        <div className="col-span-2">Delivery</div>
        <div className="col-span-1">Actions</div>
      </div>
      <div className="divide-y">
        {renderTree(projects)}
      </div>
    </div>
  );
}