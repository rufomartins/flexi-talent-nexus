import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectStats } from "@/components/projects/ProjectStats";
import { ProjectSearch } from "@/components/projects/ProjectSearch";
import { ProjectTree } from "@/components/projects/ProjectTree";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Project, ProjectFilters } from "@/components/projects/types";

const statsCards = [
  { title: "Active Tasks", value: 12 },
  { title: "Completion Percentage", value: 45 },
  { title: "Upcoming Deadlines", value: 8 },
];

const statusColors = {
  script: {
    Approved: "bg-green-100 text-green-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Pending: "bg-gray-100 text-gray-800",
  },
  translation: {
    Approved: "bg-green-100 text-green-800",
    "In Progress": "bg-blue-100 text-blue-800",
    Pending: "bg-gray-100 text-gray-800",
  },
  review: {
    "Internal Review": "bg-yellow-100 text-yellow-800",
    "Client Review": "bg-purple-100 text-purple-800",
    Approved: "bg-green-100 text-green-800",
  },
  talent: {
    Booked: "bg-blue-100 text-blue-800",
    Shooting: "bg-yellow-100 text-yellow-800",
    Delivered: "bg-green-100 text-green-800",
    Reshoot: "bg-amber-100 text-amber-800",
    Approved: "bg-green-100 text-green-800",
  },
  delivery: {
    Pending: "bg-gray-100 text-gray-800",
    Delivered: "bg-green-100 text-green-800",
    "R Pending": "bg-amber-100 text-amber-800",
  },
};

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<ProjectFilters>({});

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', searchQuery, filters],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('projects')
        .select(`
          id,
          name,
          project_countries (
            id,
            country_name,
            project_languages (
              id,
              language_name,
              project_tasks (
                id,
                name,
                script_status,
                translation_status,
                review_status,
                talent_status,
                delivery_status
              )
            )
          )
        `);

      if (error) {
        console.error('Error fetching projects:', error);
        throw error;
      }

      // Transform the data to match our Project type
      const transformedData: Project[] = data.map(project => ({
        id: project.id,
        name: project.name,
        countries: project.project_countries.map(country => ({
          id: country.id,
          country_name: country.country_name,
          languages: country.project_languages.map(language => ({
            id: language.id,
            language_name: language.language_name,
            tasks: language.project_tasks
          }))
        }))
      }));

      return transformedData;
    },
  });

  if (isLoading) {
    return (
      <div className="h-[calc(100vh-4rem)] w-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-6xl mx-auto p-6">
      <ProjectHeader />
      <ProjectStats stats={statsCards} />
      <ProjectSearch 
        onSearch={setSearchQuery} 
        onFilter={setFilters}
      />
      <ProjectTree projects={projects || []} statusColors={statusColors} />
    </div>
  );
}