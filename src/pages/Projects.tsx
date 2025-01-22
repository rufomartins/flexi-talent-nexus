import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import { ProjectHeader } from "@/components/projects/ProjectHeader";
import { ProjectStats } from "@/components/projects/ProjectStats";
import { ProjectSearch } from "@/components/projects/ProjectSearch";
import { ProjectTree } from "@/components/projects/ProjectTree";
import { useState } from "react";
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

// Dummy data for preview
const dummyProjects: Project[] = [
  {
    id: "1",
    name: "Wolt Campaign 2024",
    countries: [
      {
        id: "c1",
        country_name: "Finland",
        languages: [
          {
            id: "l1",
            language_name: "Finnish",
            tasks: [
              {
                id: "t1",
                name: "Restaurant Promo",
                script_status: "Pending",
                review_status: "Internal Review",
                talent_status: "Booked",
                delivery_status: "Pending",
                language_id: "l1",
                priority: "Medium",
                created_at: new Date().toISOString(),
              },
            ],
          },
        ],
      },
      {
        id: "c2",
        country_name: "Sweden",
        languages: [
          {
            id: "l2",
            language_name: "Swedish",
            tasks: [
              {
                id: "t2",
                name: "Delivery Showcase",
                script_status: "In Progress",
                review_status: "Client Review",
                talent_status: "Shooting",
                delivery_status: "R Pending",
                language_id: "l2",
                priority: "High",
                created_at: new Date().toISOString(),
              },
            ],
          },
        ],
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Royal Match Global",
    countries: [
      {
        id: "c3",
        country_name: "Germany",
        languages: [
          {
            id: "l3",
            language_name: "German",
            tasks: [
              {
                id: "t3",
                name: "Game Tutorial",
                script_status: "Approved",
                review_status: "Approved",
                talent_status: "Delivered",
                delivery_status: "Delivered",
                language_id: "l3",
                priority: "Medium",
                created_at: new Date().toISOString(),
              },
            ],
          },
        ],
      },
    ],
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function Projects() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<Partial<FilterState>>({});

  const { data: projects, isLoading } = useQuery({
    queryKey: ['projects', searchQuery, filters],
    queryFn: async () => {
      // For preview, return dummy data
      return dummyProjects;
    },
  });

  const handleFilter = (newFilters: Partial<FilterState>) => {
    setFilters(newFilters);
  };

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
        onFilter={handleFilter}
      />
      <ProjectTree projects={projects || []} statusColors={statusColors} />
    </div>
  );
}