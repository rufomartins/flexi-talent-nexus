import { useState } from "react";
import { ProjectTreeItem } from "./ProjectTreeItem";

interface Task {
  id: number;
  name: string;
  script_status: string;
  translation_status: string;
  review_status: string;
  talent_status: string;
  delivery_status: string;
}

interface Language {
  id: number;
  name: string;
  tasks: Task[];
}

interface Country {
  id: number;
  name: string;
  languages: Language[];
}

interface Project {
  id: number;
  name: string;
  countries: Country[];
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
          hasChildren={project.countries.length > 0}
          statusColors={statusColors}
        />
        
        {expandedNodes[`project-${project.id}`] && project.countries.map(country => (
          <div key={country.id}>
            <ProjectTreeItem
              name={country.name}
              level={1}
              isExpanded={expandedNodes[`country-${country.id}`]}
              onToggle={() => toggleNode(`country-${country.id}`)}
              hasChildren={country.languages.length > 0}
              statusColors={statusColors}
            />
            
            {expandedNodes[`country-${country.id}`] && country.languages.map(language => (
              <div key={language.id}>
                <ProjectTreeItem
                  name={language.name}
                  level={2}
                  isExpanded={expandedNodes[`language-${language.id}`]}
                  onToggle={() => toggleNode(`language-${language.id}`)}
                  hasChildren={language.tasks.length > 0}
                  statusColors={statusColors}
                />
                
                {expandedNodes[`language-${language.id}`] && language.tasks.map(task => (
                  <ProjectTreeItem
                    key={task.id}
                    name={task.name}
                    level={3}
                    isExpanded={false}
                    onToggle={() => {}}
                    hasChildren={false}
                    statuses={{
                      script_status: task.script_status,
                      translation_status: task.translation_status,
                      review_status: task.review_status,
                      talent_status: task.talent_status,
                      delivery_status: task.delivery_status,
                    }}
                    statusColors={statusColors}
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
        <div className="col-span-2">Translation</div>
        <div className="col-span-1">Review</div>
        <div className="col-span-2">Talent</div>
        <div className="col-span-1">Delivery</div>
        <div className="col-span-1">Actions</div>
      </div>
      <div className="divide-y">
        {renderTree(projects)}
      </div>
    </div>
  );
}